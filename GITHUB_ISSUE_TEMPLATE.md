# ESPHome 2025.11.0 Beta Compatibility Issues

## Summary

After validating all 682 device configurations against **ESPHome 2025.11.0b3**, we found that **436 out of 580 configurations (75.2%) are failing** validation.

**52 configurations were automatically fixed** and committed in #[PR_NUMBER].

This issue tracks the **remaining 436 failing configurations** that require manual review and fixes.

## Validation Stats

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Passed | 144 | 24.8% |
| ❌ Failed | 436 | 75.2% |
| No Config | 102 | - |
| **Total** | **682** | - |

## Error Categories

### 1. Missing OTA Platform (93 configs - 21.3%)

**Issue**: OTA configuration missing `platform: esphome` field (required in 2025.11.0+)

**Fix Required:**
```yaml
# Change from:
ota:
  password: !secret ota_password

# To:
ota:
  platform: esphome
  password: !secret ota_password
```

<details>
<summary><b>Affected Devices (Click to expand)</b></summary>

- AGL-2-3-Gang-Switch
- AHRise-AHR-083
- AVATTO-S06-IR-Remote-no-temp-no-humidity
- Acenx-SOP04-US
- AirGradient-DIY
- _(and 88 more... see full list in VALIDATION_SUMMARY.md)_

</details>

### 2. Missing Secrets (61 configs - 14.0%)

**Issue**: Configurations reference device-specific secrets that aren't defined

**Common missing secrets:**
- `avatar_1_ota`, `name`, `esphome_wifi_pass`, `wifi_ssid_esp`, etc.

**Fix Required:** Each device needs secrets added to its config or substitutions section

<details>
<summary><b>Affected Devices (Click to expand)</b></summary>

- AWP02L2 (needs `avatar_1_ota`)
- AirGradient-One (needs `name`)
- BlitzHome-BH-AP1 (needs `esphome_wifi_pass`)
- _(and 58 more... see full list in VALIDATION_SUMMARY.md)_

</details>

### 3. YAML Syntax Errors (36 configs - 8.3%)

**Issue**: Invalid YAML syntax, indentation errors, or references to non-existent files

**Common problems:**
- Incorrect indentation
- References to `common/device_base.yaml` that don't exist
- Invalid key-value pairs
- Multiple YAML blocks in single markdown

**Fix Required:** Manual YAML correction required for each device

<details>
<summary><b>Affected Devices (Click to expand)</b></summary>

- Arlec-Grid-Connect-Smart-Ceiling-Fan-DCF4002
- CircuitSetup-Expandable-6-Channel-ESP32-Energy-Meter-ATM90E32
- DETA-Grid-Connect-Outdoor-Smart-Plug-6294HA
- _(and 33 more... see full list in VALIDATION_SUMMARY.md)_

</details>

### 4. Deprecated Components (8 configs - 1.8%)

**Issue**: Using deprecated configuration options

**Fix Required:**
```yaml
# Change from:
sensor:
  - platform: adc
    attenuation: 11db

# To:
sensor:
  - platform: adc
    attenuation: 12db
```

<details>
<summary><b>Affected Devices (Click to expand)</b></summary>

- KinCony-F16
- KinCony-F24
- KinCony-F32
- _(and 5 more...)_

</details>

### 5. Other Errors (238 configs - 54.6%)

**Issue**: Various configuration errors including:
- Component compatibility issues
- Invalid platform references
- Unsupported configuration combinations

**Fix Required:** Individual review needed for each device

## Methodology

1. Installed ESPHome 2025.11.0b3: `pip install esphome --pre`
2. Extracted YAML configs from all markdown files
3. Validated with: `esphome config <filename>`
4. Applied automatic fixes where possible using YAML parsing
5. Documented remaining failures

## Resources

- **Validation Summary**: See `VALIDATION_SUMMARY.md` in the PR
- **Validation Results**: Full JSON results in `validation_results.json`
- **Beta Documentation**: https://beta.esphome.io
- **Validation Scripts**: `validate_configs.py` and `fix_configs_v2.py` in the PR

## Next Steps

### For Maintainers

1. Review automatic fixes in #[PR_NUMBER]
2. Triage failing configs by error category
3. Create sub-issues for different error types if needed
4. Coordinate community fixes

### For Contributors

To help fix these configurations:

1. Choose a device from the affected list
2. Review the error in `validation_results.json`
3. Consult beta docs at https://beta.esphome.io
4. Test fix with `esphome config <filename>`
5. Submit PR with working configuration

## Testing Your Fix

```bash
# Install ESPHome beta
pip install esphome --pre

# Create secrets.yaml with dummy values
cat > secrets.yaml << EOF
wifi_ssid: "DummySSID"
wifi_password: "DummyPassword"
api_encryption_key: "dGVzdGVuY3J5cHRpb25rZXkxMjM0NTY3OA=="
ota_password: "DummyOTAPassword"
ap_password: "DummyAPPassword"
EOF

# Validate your config
esphome config your-device.yaml
```

## Related Issues

- #[RELATED_ISSUE_1]
- #[RELATED_ISSUE_2]

---

**Note**: This is a tracking issue for ESPHome 2025.11.0 beta compatibility. The beta release includes breaking changes that require configuration updates. See the [ESPHome changelog](https://beta.esphome.io/changelog/) for details.
