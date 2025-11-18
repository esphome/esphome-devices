#!/usr/bin/env python3
"""
Script to automatically fix common ESPHome configuration issues in markdown files.
Uses proper YAML parsing to avoid creating duplicate keys.
"""

import re
import yaml
from pathlib import Path
from typing import List, Tuple
from io import StringIO

DEVICES_DIR = "src/docs/devices"

def fix_ota_platform_yaml(yaml_dict: dict) -> Tuple[dict, bool]:
    """
    Fix OTA configuration to add 'platform: esphome' if missing.
    Returns (fixed_dict, was_changed)
    """
    changed = False

    if 'ota' in yaml_dict:
        ota_config = yaml_dict['ota']

        # If ota is None or empty dict, replace with proper config
        if ota_config is None or ota_config == {}:
            yaml_dict['ota'] = {'platform': 'esphome'}
            changed = True
        # If ota is a dict but has no platform key
        elif isinstance(ota_config, dict) and 'platform' not in ota_config:
            # Add platform as first key
            new_ota = {'platform': 'esphome'}
            new_ota.update(ota_config)
            yaml_dict['ota'] = new_ota
            changed = True

    return yaml_dict, changed

def fix_captive_portal_yaml(yaml_dict: dict) -> Tuple[dict, bool]:
    """
    Remove captive_portal if it's empty (deprecated).
    Returns (fixed_dict, was_changed)
    """
    changed = False

    if 'captive_portal' in yaml_dict:
        cp_config = yaml_dict['captive_portal']
        # If captive_portal is empty or None, remove it
        if cp_config is None or cp_config == {}:
            del yaml_dict['captive_portal']
            changed = True

    return yaml_dict, changed

def fix_yaml_block(yaml_content: str) -> Tuple[str, List[str]]:
    """
    Fix a single YAML configuration block.
    Returns (fixed_yaml, list_of_changes)
    """
    changes = []

    try:
        # Parse YAML
        yaml_dict = yaml.safe_load(yaml_content)

        if not isinstance(yaml_dict, dict):
            return yaml_content, changes

        original_dict = yaml_dict.copy()

        # Apply fixes
        yaml_dict, ota_changed = fix_ota_platform_yaml(yaml_dict)
        if ota_changed:
            changes.append("Added 'platform: esphome' to OTA configuration")

        yaml_dict, cp_changed = fix_captive_portal_yaml(yaml_dict)
        if cp_changed:
            changes.append("Removed empty captive_portal configuration")

        if changes:
            # Convert back to YAML
            # Use a custom dumper to maintain readability
            fixed_yaml = yaml.dump(
                yaml_dict,
                default_flow_style=False,
                sort_keys=False,
                allow_unicode=True,
                width=float("inf")
            )
            return fixed_yaml, changes

    except yaml.YAMLError:
        # If YAML parsing fails, skip this block
        pass

    return yaml_content, changes

def fix_markdown_file(md_file: Path) -> Tuple[bool, List[str]]:
    """
    Fix ESPHome configurations in a markdown file.
    Returns (was_changed, list_of_changes)
    """
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    all_changes = []
    modified = False

    # Find all ```yaml code blocks
    def fix_yaml_match(match):
        nonlocal modified, all_changes
        yaml_content = match.group(1)

        fixed_yaml, changes = fix_yaml_block(yaml_content)

        if changes:
            all_changes.extend(changes)
            modified = True
            return f"```yaml\n{fixed_yaml}```"

        return match.group(0)

    # Replace all yaml blocks
    new_content = re.sub(
        r'```yaml\n(.*?)```',
        fix_yaml_match,
        content,
        flags=re.DOTALL
    )

    if modified:
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return modified, list(set(all_changes))  # Deduplicate changes

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
