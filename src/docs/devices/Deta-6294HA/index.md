---
title: DETA Outdoor Double Powerpoint (6294HA)
date-published: 2023-10-24
type: socket
standard: au
board: wb2s
---

## General Notes

The [DETA 6294HA Outdoor Double Powerpoint](https://detaelectrical.com.au/product/deta-grid-connect-smart-outdoor-double-powerpoint/) is supplied with a WB2S module that ~~requires replacing with a ESP-02S or equivalent module~~ can be reprogrammed to LibreTiny OTA using [tuya-cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter).
The deta-6920ha-double-touch-outlet-v1.1.4 profile worked to flash kickstart firmware.

Power measuring uses a HLW8032, CSE7766 compatible protocol at 4800 baud. As RX1 pin is used, you must program the device before installing module.

## GPIO Pinout

| Pin    | Function                  |
| ------ | ------------------------- |
| RX1    | RX for CSE7766            |
| P7     | Button 1 INPUT (inverted) |
| P24    | Button 2 INPUT (inverted) |
| P6     | Relay 1                   |
| P26    | Relay 2                   |
| P8     | Status LED                |

## Calibration

Frenck has an excellant [article](https://frenck.dev/calibrating-an-esphome-flashed-power-plug/#7-applying-corrections-to-the-firmware) for calibrating the filters.

## Configuration

Includes examples of calibration data, change as required.

```yaml
# DETA 6294HA Grid Connect Smart Outdoor Double Powerpoint
# https://detaelectrical.com.au/product/deta-grid-connect-smart-outdoor-double-powerpoint/
substitutions:
  devicename: "deta-outdoor-double-outlet-1"
  fr_name: "outdoor_outlet_1"
  project_name: "DETA.6294HA"
  project_version: "2.0"

esphome:
  name: "${devicename}"
  friendly_name: "${fr_name}"
  project:
    name: "${project_name}"
    version: "${project_version}"

bk72xx:
  board: wb2s

api:
  encryption:
    key: !secret api_encryption_key

ota:
  password: !secret ota_password

logger:
#  level: WARN
  baud_rate: 0 # Enable logging (no UART)

wifi:
  ssid: !secret my_wifi_ssid
  password: !secret my_wifi_pwd
#  manual_ip:
#    static_ip: 192.168.XXX.XXX
#    gateway: 192.168.XXX.XXX
#    subnet: 255.255.255.0
#  power_save_mode: light
  ap:
    ssid: $devicename
    password: !secret ap_password

sensor:
  - platform: wifi_signal
    name: $devicename WiFi Signal
    update_interval: 60s
  - platform: cse7766
    update_interval: 3s
    current:
      name: current
      unit_of_measurement: A
      accuracy_decimals: 3
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
          - 0.0 -> 0.00
          - 0.02673 -> 0.056
          - 7.99895 -> 7.679
    voltage:
      name: voltage
      unit_of_measurement: V
      accuracy_decimals: 1
      filters:
      # Map from sensor -> measured value
        - calibrate_linear:
          - 0.0 -> 0.0
          - 121.08233 -> 227.9
    power:
      id: power
      name: power
      unit_of_measurement: W
      accuracy_decimals: 0
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
          - 0.0 -> 0.00
          - 9.32028 -> 15.13
          - 1138.26147 -> 2023

captive_portal:

web_server:

uart:
  rx_pin: RX1
  baud_rate: 4800

light:
  - platform: status_led
    name: status
    internal: True
    pin:
      number: P8
      inverted: False

switch:
  - platform: gpio
    pin: P6
    name: relay1
    id: relay1
  - platform: gpio
    pin: P26
    name: relay2
    id: relay2

binary_sensor:
  - platform: gpio
    pin:
      number: P7
      mode: INPUT
      inverted: True
    id: leftbutton
    name: "${fr_name} Left Button"
    on_click:
      min_length: 200ms
      max_length: 1800ms
      then:
        - switch.toggle: relay1
    internal: True
  - platform: gpio
    pin:
      number: P24
      mode: INPUT
      inverted: True
    id: rightbutton
    name: "${fr_name} Right Button"
    on_click:
      min_length: 200ms
      max_length: 1800ms
      then:
        - switch.toggle: relay2
    internal: True
```
