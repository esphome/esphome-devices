#!/usr/bin/env tsx
/**
 * Enforce the device-config rules across every yaml file referenced by a
 * markdown `file=` fence under src/docs/devices/, plus the page-level
 * conventions on each migrated markdown.
 *
 * Rules — applied to every referenced yaml file (any device):
 *   1. The file must parse as valid YAML.
 *   2. No passwords on any `password:`, `*_password:`, or `psk:` key —
 *      neither literal strings nor `!secret` references. Example configs
 *      must not carry credentials of any form; the user supplies them in
 *      their own config.
 *   3. No `!secret` references anywhere (not just on password keys).
 *      Example configs must not depend on entries the user may not have
 *      defined in their secrets file.
 *
 * Additional rules for the page-level form (markdown with `file=` fences):
 *   4. The first yaml fence on a page must reference `config.yaml`.
 *   5. `config.yaml` must be hardware-only:
 *        - No top-level `api:`, `ota:`, `mqtt:`, `web_server:`,
 *          `web_server_idf:`, `improv_serial:`, `captive_portal:`,
 *          `bluetooth_proxy:`, or `dashboard_import:`.
 *        - `wifi:` is allowed for radio tunables (country, power_save_mode,
 *          output_power, …) but must not contain `ssid`, `password`,
 *          `networks`, `manual_ip`, `eap`, or `use_address`. An empty
 *          `ap:` is allowed (and recommended) for first-flash usability.
 *        - No `platform: homeassistant`, `platform: mqtt`, or
 *          `platform: template` anywhere in the tree — those are
 *          network-dependent or user-derived, not hardware.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
// js-yaml is a transitive dep of gray-matter; import directly to parse.
import yaml from "js-yaml";

const HARDWARE_ONLY_FORBIDDEN = new Set([
  "api",
  "ota",
  "mqtt",
  "web_server",
  "web_server_idf",
  "improv_serial",
  "captive_portal",
  "bluetooth_proxy",
  "dashboard_import",
]);

// `wifi:` is permitted in config.yaml because some radio settings (country,
// power_save_mode, output_power, passive_scan, …) are genuinely hardware
// tunables. But user-network details belong in the user's own config.
// `ap:` is allowed: it lets a freshly-flashed device boot into a fallback
// hotspot so users can provision Wi-Fi without further yaml edits.
const WIFI_USER_KEYS = new Set([
  "ssid",
  "password",
  "networks",
  "manual_ip",
  "eap",
  "use_address",
]);

// Platforms that don't belong in a hardware-only config.yaml:
//   - homeassistant / mqtt depend on a network connection at runtime.
//   - template entries are user-defined derivations layered on top of
//     hardware (e.g. a "Battery %" sensor computed from a voltage sensor,
//     or a friendlier select wrapping a GPIO switch). They go in their own
//     companion yaml so config.yaml stays a pure hardware manifest.
const HARDWARE_ONLY_FORBIDDEN_PLATFORMS = new Set([
  "homeassistant",
  "mqtt",
  "template",
]);

// Match `password`, `*_password`, or `psk` at the parsed-tree key level.
const PASSWORD_KEY = /^([\w-]*password[\w-]*|psk)$/i;

function checkSensitiveInTree(
  node: unknown,
  pathStack: (string | number)[],
  rel: string,
  issues: Issue[]
): void {
  if (Array.isArray(node)) {
    node.forEach((item, idx) =>
      checkSensitiveInTree(item, [...pathStack, idx], rel, issues)
    );
    return;
  }
  // Strings are visited as leaves to catch !secret references regardless of
  // the surrounding key.
  if (typeof node === "string") {
    if (/^!secret\b/.test(node.trim())) {
      const where = pathStack.length > 0 ? pathStack.join(".") : "(root)";
      issues.push({
        file: rel,
        message: `\`!secret\` reference at \`${where}\` — example configs must not depend on secrets the user may not have defined`,
      });
    }
    return;
  }
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (PASSWORD_KEY.test(key) && typeof value === "string") {
      // Any non-empty string value on a password key is forbidden — both
      // literals and `!secret` references. The user provides credentials
      // through their own config, never through the example.
      if (value.trim() !== "") {
        const where = [...pathStack, key].join(".");
        issues.push({
          file: rel,
          message: `password at \`${where}\` — example configs must not carry passwords (literal or \`!secret\`); leave the key out and let the user add it`,
        });
      }
    }
    checkSensitiveInTree(value, [...pathStack, key], rel, issues);
  }
}

interface FenceRef {
  fileAttr: string;
  lineNumber: number; // 1-indexed source line of the fence opener
}

function findFenceRefs(md: string): FenceRef[] {
  const lines = md.split(/\r?\n/);
  const refs: FenceRef[] = [];
  let inFence: { char: string; len: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inFence) {
      const closeRe = new RegExp(
        `^\\s*${inFence.char === "`" ? "`" : "~"}{${inFence.len},}\\s*$`
      );
      if (closeRe.test(line)) inFence = null;
      continue;
    }
    const m = line.match(/^(\s*)(`{3,}|~{3,})\s*([A-Za-z0-9_+\-]+)?\s*(.*)$/);
    if (!m || !m[2]) continue;
    const fenceChar = m[2][0];
    const fenceLen = m[2].length;
    const lang = (m[3] ?? "").toLowerCase();
    const meta = m[4] ?? "";
    inFence = { char: fenceChar, len: fenceLen };
    if (lang !== "yaml" && lang !== "yml") continue;
    const fileMatch = meta.match(/(^|\s)file=(?:"([^"]+)"|'([^']+)'|([^\s"']+))/);
    if (!fileMatch) continue;
    const fileAttr = fileMatch[2] ?? fileMatch[3] ?? fileMatch[4] ?? "";
    refs.push({ fileAttr, lineNumber: i + 1 });
  }
  return refs;
}

interface Issue {
  file: string;
  line?: number;
  message: string;
}

function checkYamlFile(absPath: string, isHardwareOnly: boolean): Issue[] {
  const issues: Issue[] = [];
  const rel = path.relative(process.cwd(), absPath);
  let raw: string;
  try {
    raw = fs.readFileSync(absPath, "utf8");
  } catch (err) {
    issues.push({ file: rel, message: `unable to read: ${(err as Error).message}` });
    return issues;
  }

  // Parse — tolerate ESPHome custom tags. Re-stamp the tag onto the
  // resulting string so `password: !secret foo` parses to `"!secret foo"`,
  // which the password check correctly recognises as non-literal.
  const schema = yaml.DEFAULT_SCHEMA.extend(
    ["!secret", "!lambda", "!include", "!env", "!extend", "!remove"].map(
      (tag) =>
        new yaml.Type(tag, {
          kind: "scalar",
          construct: (data) =>
            data === null || data === undefined ? tag : `${tag} ${data}`,
          represent: (data) => data as string,
        })
    )
  );
  let parsed: unknown = undefined;
  try {
    parsed = yaml.load(raw, { schema });
  } catch (err) {
    const e = err as yaml.YAMLException;
    issues.push({
      file: rel,
      line: e.mark?.line !== undefined ? e.mark.line + 1 : undefined,
      message: `invalid yaml: ${e.reason || e.message}`,
    });
    return issues;
  }

  checkSensitiveInTree(parsed, [], rel, issues);

  if (isHardwareOnly && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const root = parsed as Record<string, unknown>;
    for (const key of Object.keys(root)) {
      if (HARDWARE_ONLY_FORBIDDEN.has(key)) {
        issues.push({
          file: rel,
          message: `config.yaml must be hardware-only — top-level \`${key}:\` belongs in a separate yaml file`,
        });
      }
    }
    // wifi: is allowed but must not contain user-network specifics.
    // `ap:` is allowed but only as an empty block — its sole purpose here is
    // to make the config bootable into ESPHome's default fallback hotspot;
    // any subkey under it (ssid, password, …) is user-shaped data.
    const wifi = root.wifi;
    if (wifi && typeof wifi === "object" && !Array.isArray(wifi)) {
      const wifiObj = wifi as Record<string, unknown>;
      for (const k of Object.keys(wifiObj)) {
        if (WIFI_USER_KEYS.has(k)) {
          issues.push({
            file: rel,
            message: `config.yaml \`wifi:\` must not contain user-specific \`${k}:\` — keep only radio/hardware tunables here`,
          });
        }
      }
      const ap = wifiObj.ap;
      if (ap !== undefined && ap !== null) {
        const isEmpty =
          (typeof ap === "object" && !Array.isArray(ap) &&
            Object.keys(ap as Record<string, unknown>).length === 0) ||
          ap === "";
        if (!isEmpty) {
          issues.push({
            file: rel,
            message: `config.yaml \`wifi.ap:\` must be empty — ESPHome's defaults give a usable fallback hotspot without device-baked credentials`,
          });
        }
      }
    }
    // Walk the parsed tree and flag any `platform: homeassistant` / `mqtt`
    // entry — these depend on a network/API connection at runtime.
    const visit = (node: unknown, pathStack: (string | number)[]): void => {
      if (Array.isArray(node)) {
        node.forEach((item, idx) => visit(item, [...pathStack, idx]));
        return;
      }
      if (node && typeof node === "object") {
        const obj = node as Record<string, unknown>;
        if (
          typeof obj.platform === "string" &&
          HARDWARE_ONLY_FORBIDDEN_PLATFORMS.has(obj.platform)
        ) {
          const where = pathStack.length > 0 ? pathStack.join(".") : "(root)";
          const reason =
            obj.platform === "template"
              ? "is a user-derived value, not hardware"
              : "depends on a network connection";
          issues.push({
            file: rel,
            message: `config.yaml must be hardware-only — \`platform: ${obj.platform}\` at \`${where}\` ${reason}`,
          });
        }
        for (const k of Object.keys(obj)) visit(obj[k], [...pathStack, k]);
      }
    };
    visit(parsed, []);
  }

  return issues;
}

function walkMarkdown(dir: string, out: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      walkMarkdown(p, out);
    } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      out.push(p);
    }
  }
}

function main(): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const devicesRoot = process.env.DEVICES_ROOT
    ? path.resolve(process.env.DEVICES_ROOT)
    : path.resolve(__dirname, "..", "src", "docs", "devices");

  if (!fs.existsSync(devicesRoot)) {
    console.error(`Devices root not found: ${devicesRoot}`);
    process.exit(1);
  }

  const issues: Issue[] = [];

  // Walk markdown first to collect every yaml file referenced via a `file=`
  // fence. Pre-existing yaml files that no markdown points at (legacy
  // downloadable examples) are intentionally out of scope: this validator
  // gates the migrated `file=`-based form.
  const mdFiles: string[] = [];
  walkMarkdown(devicesRoot, mdFiles);

  const referencedYaml = new Set<string>();
  for (const md of mdFiles) {
    const refs = findFenceRefs(fs.readFileSync(md, "utf8"));
    if (refs.length === 0) continue;
    const rel = path.relative(process.cwd(), md);
    if (refs[0].fileAttr.toLowerCase() !== "config.yaml") {
      issues.push({
        file: rel,
        line: refs[0].lineNumber,
        message: `first yaml fence must reference \`config.yaml\` (saw \`${refs[0].fileAttr}\`)`,
      });
    }
    const dir = path.dirname(md);
    for (const r of refs) {
      const yamlAbs = path.resolve(dir, r.fileAttr);
      referencedYaml.add(yamlAbs);
    }
  }

  const yamlFiles = [...referencedYaml].sort();
  for (const f of yamlFiles) {
    const isConfig = path.basename(f).toLowerCase() === "config.yaml";
    issues.push(...checkYamlFile(f, isConfig));
  }

  if (issues.length === 0) {
    console.log(`Validated ${yamlFiles.length} yaml file(s) — clean.`);
    return;
  }

  console.error(`Found ${issues.length} issue(s):`);
  for (const i of issues) {
    const loc = i.line !== undefined ? `${i.file}:${i.line}` : i.file;
    console.error(`  ${loc}  ${i.message}`);
  }
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
