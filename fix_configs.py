#!/usr/bin/env python3
"""
Script to automatically fix common ESPHome configuration issues in markdown files.
"""

import re
from pathlib import Path
from typing import List, Tuple

DEVICES_DIR = "src/docs/devices"

def fix_ota_platform(yaml_content: str) -> Tuple[str, bool]:
    """
    Fix OTA configuration to add 'platform: esphome' if missing.
    Returns (fixed_content, was_changed)
    """
    changed = False

    # Pattern to match ota: block without platform
    # Matches: ota: followed by either a newline and indented content, or empty/inline content

    # Check if there's an ota: line without platform:
    if re.search(r'^ota:\s*$', yaml_content, re.MULTILINE):
        # ota: is on its own line - need to add platform
        yaml_content = re.sub(
            r'^(ota:)\s*$',
            r'\1\n  platform: esphome',
            yaml_content,
            flags=re.MULTILINE
        )
        changed = True
    elif re.search(r'^ota:\s*\n(?!.*platform:)', yaml_content, re.MULTILINE):
        # ota: block exists but doesn't have platform:
        # Insert platform as first item in the ota block
        def add_platform(match):
            ota_line = match.group(0)
            # Get the indentation of the first property
            next_line_match = re.search(r'\n(\s+)', ota_line)
            if next_line_match:
                indent = next_line_match.group(1)
                return f"ota:\n{indent}platform: esphome\n{ota_line.split(chr(10), 1)[1]}"
            else:
                return "ota:\n  platform: esphome"

        # Match ota: block
        pattern = r'^ota:\s*\n((?:\s+.+\n)*)'
        if re.search(pattern, yaml_content, re.MULTILINE):
            # Check if platform: is not in the ota block
            ota_match = re.search(pattern, yaml_content, re.MULTILINE)
            if ota_match and 'platform:' not in ota_match.group(0):
                yaml_content = re.sub(
                    r'^(ota:)\s*\n(\s+)',
                    r'\1\n\2platform: esphome\n\2',
                    yaml_content,
                    count=1,
                    flags=re.MULTILINE
                )
                changed = True

    return yaml_content, changed

def fix_captive_portal(yaml_content: str) -> Tuple[str, bool]:
    """
    Remove captive_portal: if it's empty (deprecated).
    Returns (fixed_content, was_changed)
    """
    changed = False

    # Remove standalone captive_portal:
    if re.search(r'^captive_portal:\s*$', yaml_content, re.MULTILINE):
        yaml_content = re.sub(
            r'^captive_portal:\s*$\n',
            '',
            yaml_content,
            flags=re.MULTILINE
        )
        changed = True

    return yaml_content, changed

def fix_markdown_file(md_file: Path) -> Tuple[bool, List[str]]:
    """
    Fix ESPHome configurations in a markdown file.
    Returns (was_changed, list_of_changes)
    """
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    changes = []
    modified = False

    # Find all ```yaml code blocks
    def fix_yaml_block(match):
        nonlocal modified, changes
        yaml_content = match.group(1)
        original_yaml = yaml_content

        # Apply fixes
        yaml_content, ota_changed = fix_ota_platform(yaml_content)
        if ota_changed:
            changes.append("Added 'platform: esphome' to OTA configuration")
            modified = True

        yaml_content, cp_changed = fix_captive_portal(yaml_content)
        if cp_changed:
            changes.append("Removed empty captive_portal configuration")
            modified = True

        return f"```yaml\n{yaml_content}```"

    # Replace all yaml blocks
    new_content = re.sub(
        r'```yaml\n(.*?)```',
        fix_yaml_block,
        content,
        flags=re.DOTALL
    )

    if modified:
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return modified, changes

def main():
    """Main fixing loop."""
    devices_path = Path(DEVICES_DIR)
    all_devices = list(devices_path.glob("*/index.md"))

    print(f"Found {len(all_devices)} device markdown files")
    print("=" * 80)

    total_fixed = 0
    fix_details = {}

    for i, md_file in enumerate(all_devices, 1):
        device_name = md_file.parent.name

        was_changed, changes = fix_markdown_file(md_file)

        if was_changed:
            total_fixed += 1
            fix_details[device_name] = changes
            print(f"[{i}/{len(all_devices)}] ✓ Fixed {device_name}")
            for change in changes:
                print(f"    - {change}")
        else:
            if i % 50 == 0:  # Progress indicator
                print(f"[{i}/{len(all_devices)}] Processed...")

    print("\n" + "=" * 80)
    print(f"FIXED {total_fixed} device configurations")
    print("=" * 80)

    return total_fixed

if __name__ == "__main__":
    fixed_count = main()
    print(f"\nTotal configurations fixed: {fixed_count}")
