---
title: Globe 4 Inch 9W Downlight 50359
date-published: 2022-9-7
type: light
standard: us
---

RGBWW smart light bulb, ultra slim recessed lighting kit, RGB colors + warm/cold white, 120V AC 50/60Hz.

This device uses an incompatible module which needs to be replaced with an ESP module. Bseides the module, this process will require heat gun, soldering tools and moderate soldering skill.

Works with [WT32C3-01N](https://www.alibaba.com/product-detail/WT32C3-01N-4MB-OEM-ESP32-wi_1600348544006.html "Alibaba") module using the following template, but can work with others as well. This ESP32-C3 chip requires DIO flash mode to avoid boot loops. If encountering brown out issues, ensure you are using a dedicated 3V3 power supply with 28 guage or thicker wires (may need to be soldered).

## Flashing

Flash using ESP Web install and select ESP32-C3 option.

To put ESP32-C3 in flash mode EN and GPIO9 need to be pulled low.

| ESP32 Pin | USB Serial Pin | Comments |
| --- | --- | --- |
| 3V3 | 3V3 | Connect to dedicated 3V3 1A power supply if encountering brown out |
| G | GND | |
| IO9 | Ground | Pull low before attaching 3V3 |
| TX | RX | |
| RX | TX | |
| EN | GRD | Pull low when flashing, high for normal operation |

## Running

For normal operation connect EN to VCC (pull high) to enable the C3 chip. GPIO9 has an internal pullup and it needs to be high on power up for the module to boot so try and avoid that pin similar to GPIO0 on ESP8266.

ESP32's are power hungry on boot and the USB to serial adapter might not be able to provide enough power for that. Use a stable 3.3v power supply that can supply more than 1A.

## GPIO Pinout

| Pin    | Name | Function                        |
| ------ | ---- | ------------------------------- |
| GPIO3  | PWM1 | red (pwm, default 1KHz)         |
| GPIO10 | PWM2 | green (pwm, default 1KHz)       |
| GPIO6  | PWM3 | blue (pwm, default 1KHz)        |
| GPIO5  | PWM4 | warm white (pwm, default 1KHz)  |
| GPIO4  | PWM5 | cold white (pwm, default 1KHz)  |
| EN     |      | chip enable (pull high)         |

NOTE: To pull EN high for normal use, solder a wire between the round 3V3 and EN contact pads on the back of the board. Do not do this until you have flashed and confirmed you can access the device over wifi, otherwise EN will need to be desoldered to flash via USB/Serial again.

## Basic Configuration

```yaml
# Variables
substitutions:
  number: "01"
  device_name: globe-light-${number}
  friendly_name: Globe Ceiling Light ${number}
  display_name: Globe Ceiling Light
  # Use recommended frequency - 1220Hz has bit_depth=16 and steps=65536
  ledc_frequency: "1200Hz"
  # Set transition time to 0s to eliminate lag
  transition_time: "0s"

# Basic Config
esphome:
  name: ${device_name}
  platformio_options:
    board_build.flash_mode: dio

esp32:
  board: esp32-c3-devkitm-1
  framework:
    type: esp-idf

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: "ESPHome ${friendly_name}"
    password: !secret wifi_password_backup

logger:
  baud_rate: 115200

# Enable Home Assistant API
ota: {"password": !secret ota_password }
api: {"password": !secret api_password }

# Enable NTP
time:
  - platform: sntp
    id: my_time

# General Config
text_sensor:
  - platform: version
    name: "${display_name} Version"
  - platform: wifi_info
    ip_address:
      name: "${display_name} IP Address"
    ssid:
      name: "${display_name} SSID"
    bssid:
      name: "${display_name} BSSID"

sensor:
  - platform: wifi_signal
    name: "${display_name} WiFi Signal"
    update_interval: 60s
    filters:
      - delta: 0.01
      - throttle: 300s
  - platform: uptime
    name: "${display_name} Uptime"
    filters:
      - throttle: 300s

switch:
  - platform: restart
    name: "${display_name} Restart"

# Light Config
light:
  - platform: rgbww
    name: "${friendly_name}"
    red: output_pwm1_red
    green: output_pwm2_green
    blue: output_pwm3_blue
    cold_white: output_pwm5_white_cold
    warm_white: output_pwm4_white_warm
    cold_white_color_temperature: 5000 K
    warm_white_color_temperature: 2000 K
    constant_brightness: true
    color_interlock: true
    default_transition_length: ${transition_time}
    restore_mode: RESTORE_AND_OFF

output:
  - platform: ledc
    pin: GPIO3
    frequency: ${ledc_frequency}
    id: output_pwm1_red
  - platform: ledc
    pin: GPIO10
    frequency: ${ledc_frequency}
    id: output_pwm2_green
  - platform: ledc
    pin: GPIO6
    frequency: ${ledc_frequency}
    id: output_pwm3_blue
  - platform: ledc
    pin: GPIO5
    frequency: ${ledc_frequency}
    id: output_pwm4_white_warm
  - platform: ledc
    pin: GPIO4
    frequency: ${ledc_frequency}
    id: output_pwm5_white_cold

```
