### Made for ESPHome Checklist

- [ ] Project is powered by an ESP32 or _supported_ variant such as C3, C6, S2, S3 etc
- [ ] Project is using ESPHome firmware
- [ ] Project name cannot contain **ESPHome** except in the case of _ending with_ **for ESPHome**
- [ ] ESPHome configuration is open source and available for end users to modify/update
- If the device uses Wi-Fi
  - [ ] configuration contains `esp32_improv:`
  - [ ] configuration contains `improv_serial:` if there is a USB port
- Users should be able to apply updates to your device.
  - [ ] Device can be "taken control" of by the user using the ESPHome Builder
    - [ ] Configuration includes `dashboard_import:` to facilitate this
    - [ ] Configuration contains `ota`.`esphome` component.
    - [ ] Serial flashing is not disabled
    - [ ] There are no references to secrets in the configuration
    - [ ] There are no passwords in the configuration
    - [ ] There are no static IP addresses in the configuration
    - [ ] The configuration **must** be valid, compile and run successfully _without any user changes_ after taking control
    - [ ] Every entity/component (sensor, switch, etc) **must** have an `id` defined
  - [ ] OTA Updates are provided via the `update`.`http_request` component.
