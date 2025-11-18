#!/usr/bin/env python3
"""
Script to extract and validate ESPHome device configurations from markdown files.
"""

import os
import re
import subprocess
import json
from pathlib import Path
from typing import Dict, List, Tuple

# Directories
DEVICES_DIR = "src/docs/devices"
TEMP_DIR = "/tmp/esphome_validation"
RESULTS_FILE = "validation_results.json"

def extract_yaml_from_markdown(md_file: Path) -> List[str]:
    """Extract all YAML code blocks from a markdown file."""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all ```yaml code blocks
    yaml_blocks = re.findall(r'```yaml\n(.*?)```', content, re.DOTALL)
    return yaml_blocks

def validate_config(yaml_content: str, device_name: str) -> Tuple[bool, str]:
    """Validate a YAML configuration using esphome config command."""
    # Create temp directory if it doesn't exist
    os.makedirs(TEMP_DIR, exist_ok=True)

    # Write config to temp file
    temp_file = os.path.join(TEMP_DIR, f"{device_name}.yaml")
    with open(temp_file, 'w', encoding='utf-8') as f:
        f.write(yaml_content)

    # Create a secrets.yaml file with dummy values
    secrets_file = os.path.join(TEMP_DIR, "secrets.yaml")
    if not os.path.exists(secrets_file):
        with open(secrets_file, 'w') as f:
            f.write("wifi_ssid: \"DummySSID\"\n")
            f.write("wifi_password: \"DummyPassword\"\n")
            f.write("api_password: \"DummyAPIPassword\"\n")
            f.write("ota_password: \"DummyOTAPassword\"\n")

    # Run esphome config validation
    try:
        result = subprocess.run(
            ['esphome', 'config', temp_file],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=TEMP_DIR
        )

        if result.returncode == 0:
            return True, "Valid"
        else:
            error_msg = result.stderr + result.stdout
            return False, error_msg
    except subprocess.TimeoutExpired:
        return False, "Validation timed out (>60s)"
    except Exception as e:
        return False, f"Exception during validation: {str(e)}"

def main():
    """Main validation loop."""
    devices_path = Path(DEVICES_DIR)
    all_devices = list(devices_path.glob("*/index.md"))

    print(f"Found {len(all_devices)} device configurations to validate")
    print("=" * 80)

    results = {
        "total": len(all_devices),
        "validated": 0,
        "passed": 0,
        "failed": 0,
        "no_config": 0,
        "devices": {}
    }

    for i, md_file in enumerate(all_devices, 1):
        device_name = md_file.parent.name
        print(f"[{i}/{len(all_devices)}] Validating {device_name}...", end=" ")

        # Extract YAML blocks
        yaml_blocks = extract_yaml_from_markdown(md_file)

        if not yaml_blocks:
            print("NO YAML CONFIG")
            results["no_config"] += 1
            results["devices"][device_name] = {
                "status": "no_config",
                "file": str(md_file)
            }
            continue

        # Validate the first YAML block (usually the main config)
        is_valid, error_msg = validate_config(yaml_blocks[0], device_name)
        results["validated"] += 1

        if is_valid:
            print("✓ PASSED")
            results["passed"] += 1
            results["devices"][device_name] = {
                "status": "passed",
                "file": str(md_file)
            }
        else:
            print("✗ FAILED")
            results["failed"] += 1
            results["devices"][device_name] = {
                "status": "failed",
                "file": str(md_file),
                "error": error_msg[:500]  # Truncate long errors
            }

    # Save results
    with open(RESULTS_FILE, 'w') as f:
        json.dump(results, f, indent=2)

    # Print summary
    print("\n" + "=" * 80)
    print("VALIDATION SUMMARY")
    print("=" * 80)
    print(f"Total devices: {results['total']}")
    print(f"No config found: {results['no_config']}")
    print(f"Validated: {results['validated']}")
    print(f"  - Passed: {results['passed']}")
    print(f"  - Failed: {results['failed']}")
    print(f"\nResults saved to {RESULTS_FILE}")

if __name__ == "__main__":
    main()
