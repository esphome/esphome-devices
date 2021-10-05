---
title: Athom E27 15W Bulb
date-published: 2021-10-05
type: light
standard: us
---

Manufacturer: [Athom.tech](https://www.athom.tech/blank-1/15w-bulb-2-pack)

## Flashing Procedure

Natively runs Tasmota, upload ESPHome binary to flash wirelessly.

## Bulb Specifications

Color: RGB+Warm+Cold White
Color Temperature: 3000-6000K
Brightness: 1400 lumens
Voltage: 110V~250V
Power: 15W
Base: E27

## Product Images

![Athom E27 15W Bulb](/Athom-E27-15W-Bulb.png "Athom E27 15W Bulb")

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
  devicename: athom-15w
  friendly_name: My Light Bulb

esphome:
  name: $devicename
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: true
  ap:
    ssid: ESP-${devicename}
    password: !secret fallback_password

captive_portal:

web_server:
  port: 80
  auth:
    username: !secret web_username
    password: !secret web_password

logger:
  baud_rate: 0

api:
  password: !secret api_password

ota:
  password: !secret ota_password
  safe_mode: True

sensor:
  - platform: wifi_signal
    name: ${friendly_name} WiFi Signal
    update_interval: 60s
  - platform: uptime
    name: ${friendly_name} Uptime
    filters:
      - lambda: return x / 60.0;
    unit_of_measurement: minutes

switch:
  - platform: restart
    name: ${friendly_name} Restart

output:
  - platform: esp8266_pwm
    pin: GPIO13
    id: ct_output
    inverted: true
  - platform: esp8266_pwm
    pin: GPIO5
    id: ctbrightness_output
  - platform: esp8266_pwm
    pin: GPIO4
    id: red_output
  - platform: esp8266_pwm
    pin: GPIO12
    id: green_output
  - platform: esp8266_pwm
    pin: GPIO14
    id: blue_output

light:
  - platform: rgbct
    name: $friendly_name
    id: main_light
    red: red_output
    green: green_output
    blue: blue_output
    color_temperature: ct_output
    white_brightness: ctbrightness_output
    cold_white_color_temperature: 6000 K
    warm_white_color_temperature: 3000 K
    color_interlock: true
    restore_mode: RESTORE_DEFAULT_OFF
```
