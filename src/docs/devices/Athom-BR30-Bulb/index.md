---
title: Athom BR30 Bulb
date-published: 2021-10-05
type: light
standard: us
board: esp8266
---

Manufacturer: [Athom.tech](https://www.athom.tech/blank-1/tasmota-br30-color-bulb)

## Flashing Procedure

Natively runs Tasmota, upload ESPHome binary to flash wirelessly.

## Bulb Specifications

Color: RGB+Warm+Cold White
Color Temperature: 3000-6000K
Brightness: 1000 lumens
Voltage: 110V~250V
Power: 12W
Base:  E27

## Product Images

![Athom BR30 Bulb](/Athom-BR30-Bulb.png "Athom BR30 Bulb")

## GPIO Pinout

| Pin    | Function             |
| ------ | -------------------- |
| GPIO13 | CT Output            |
| GPIO5  | CT Brightness Output |
| GPIO4  | Red Output           |
| GPIO12 | Green Output         |
| GPIO14 | Blue Output          |

## Basic Configuration

```yaml
substitutions:
  device_name: "athom-rgbct-light"
  friendly_name: "Athom RGBCT Light"
  project_name: "athom.rgbct-light"
  project_version: "1.0"

esphome:
  name: "${device_name}"
  name_add_mac_suffix: true
  platform: ESP8266
  board: esp8285
  project:
    name: "${project_name}"
    version: "${project_version}"

api:

ota:

logger:

web_server:
  port: 80

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:

captive_portal:

binary_sensor:
  - platform: status
    name: "${friendly_name} Status"

sensor:
  - platform: uptime
    name: "${friendly_name} Uptime Sensor"

switch:
  - platform: restart
    id: restart_switch
    name: "${friendly_name} Restart"

output:
  - platform: esp8266_pwm
    id: red_output
    pin: GPIO4
  - platform: esp8266_pwm
    id: green_output
    pin: GPIO12
  - platform: esp8266_pwm
    id: blue_output
    pin: GPIO14
  - platform: esp8266_pwm
    id: white_output
    pin: GPIO5
  - platform: esp8266_pwm
    id: ct_output
    inverted: true
    pin: GPIO13

light:
  - platform: rgbct
    restore_mode: RESTORE_DEFAULT_ON
    name: "${friendly_name}"
    red: red_output
    green: green_output
    blue: blue_output
    white_brightness: white_output
    color_temperature: ct_output
    cold_white_color_temperature: 153 mireds
    warm_white_color_temperature: 500 mireds
    color_interlock: true

text_sensor:
  - platform: wifi_info
    ip_address:
      name: "${friendly_name} IP Address"
      disabled_by_default: true
```
