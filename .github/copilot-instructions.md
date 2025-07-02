# GitHub Copilot Instructions for ESPHome Devices Repository

## Overview

This repository contains device documentation for ESPHome-compatible devices. When reviewing pull requests, you should pay special attention to devices marked with `made-for-esphome: true` in their frontmatter, as these require additional validation against specific standards.

## Pull Request Review Guidelines

### General Review Points (All PRs)

1. **Security & Privacy**

   - ❌ No passwords or secrets in configuration examples (except `!secret wifi_ssid` and `!secret wifi_password`)
   - ❌ No static/manual IP addresses in wifi or ethernet blocks
   - ❌ No hardcoded credentials or sensitive information

2. **Configuration Structure**

   - ✅ First configuration should be hardware definitions only
   - ✅ More complex examples can be provided in separate configuration blocks
   - ✅ Proper YAML formatting and indentation

3. **Documentation Quality**
   - ✅ Clear device description and features
   - ✅ Proper GPIO pinout tables when applicable
   - ✅ Links to purchase/source and documentation
   - ✅ Installation/setup instructions

### Made for ESPHome Devices (made-for-esphome: true)

When a device has `made-for-esphome: true` in its frontmatter, it must meet ALL of the following requirements:

#### Hardware Requirements

- ✅ **ESP32 or supported variant** (C3, C6, S2, S3, etc.)
- ✅ **ESPHome firmware** is being used
- ✅ **Project name** cannot contain "ESPHome" except when ending with "for ESPHome"

#### Open Source Requirements

- ✅ **ESPHome configuration is open source** and available for users to modify/update
- ✅ **Project URL** should link to public repository with configuration files

#### Wi-Fi Device Requirements (if applicable)

- ✅ **`esp32_improv:` component** must be included in configuration
- ✅ **`improv_serial:` component** must be included if device has USB port

#### User Control & Updates

The device must allow users to "take control" via ESPHome Builder:

- ✅ **`dashboard_import:` component** included to facilitate adoption
- ✅ **`ota.esphome` component** included for OTA updates
  - Example:
    ```yaml
    ota:
      - platform: esphome
    ```
- ✅ **Serial flashing NOT disabled**
- ✅ **No secrets references** in the configuration
- ✅ **No passwords** in the configuration
- ✅ **No static IP addresses** in the configuration
- ✅ **Configuration must compile and run successfully** without any user changes after taking control
- ✅ **Every entity/component** (sensor, switch, etc.) must have an `id` defined
- ✅ **`update.http_request` component** included for OTA updates
  - Example:
    ```yaml
    update:
      - platform: http_request
        source: "https://example.com/manifest.json"
    ```

## Review Process

### For Regular Device PRs

1. Check basic security and formatting requirements
2. Verify documentation completeness
3. Test configuration validity if possible
4. Request changes if requirements not met

### For Made for ESPHome Device PRs

1. **First, verify the device qualifies** for "Made for ESPHome" status
2. **Check ALL items** in the Made for ESPHome checklist above
3. **Request specific changes** for any missing requirements, referencing the exact checklist item
4. **Be thorough** - these devices represent the ESPHome standard and quality

## Example Review Comments

### For Missing Requirements

```
This device is marked as `made-for-esphome: true` but is missing some required components:

- [ ] Missing `esp32_improv:` component - required for Wi-Fi devices ([documentation](https://esphome.io/components/esp32_improv))
- [ ] Missing `dashboard_import:` component - required for user adoption ([documentation](https://esphome.io/components/esphome.html#adding-the-mac-address-as-a-suffix-to-the-device-name))
- [ ] Some entities are missing `id` definitions (e.g., line 45 sensor)

Please update the configuration to meet the Made for ESPHome standards.
```

### For Configuration Issues

```
The configuration contains secrets references which violates Made for ESPHome requirements:
- Line 23: `password: !secret api_password` should be removed
- Line 31: Static IP `192.168.1.100` should be removed

Made for ESPHome devices must work without any user changes after adoption.
```

### For Qualification Issues

```
This device appears to be based on ESP8266, but Made for ESPHome devices must use ESP32 or supported variants (C3, C6, S2, S3, etc.). Please either:
1. Update to ESP32 hardware, or
2. Remove the `made-for-esphome: true` flag if staying with ESP8266
```

## Workflow Integration

The repository has an automated workflow that:

1. Detects when `made-for-esphome: true` is added to device frontmatter
2. Automatically adds `made-for-esphome` and `made-for-esphome-pending` labels
3. Adds the checklist to the PR description
4. Requests changes for manual review

As a reviewer, ensure all checklist items are satisfied before approving Made for ESPHome devices.
