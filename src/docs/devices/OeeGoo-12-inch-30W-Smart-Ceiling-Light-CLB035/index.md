---
title: OeeGoo 12 Inch 30W Smart Ceiling Light (RGB/CW)
date-published: 2023-08-13
type: light
standard: us
board: esp32
---

Smart ceiling light with a CW center light (2700K-6500K) and a RGB ring light. The part number is clb035-wn-c38-k1-ee-fff and advertised as either 30 or 35 watts, 100-240V AC 50/60Hz.

This device uses a proprietary Tuya module [WB3L] and will need to be replaced with an ESP32-C3F before it can be used with ESPhome. This will require disassembly with a philips screwdriver, desoldering the module, soldering a new module.

A Sparkleiot ESP32-C3F module is used here and was preprogrammed using an ESP test board before installing onto the light module. Compiled using Arduino framework and default qio flash mode without issue. It was observed that the light does not connect the reset line and this sometimes caused the ESP32 to not power up, a 0.1 uF 0805 capacitor is added between reset and ground to hold the reset longer as a solution.

```yaml
substitutions:
  device_name: masterlight
  friendly_name: "Master Bedroom Overhead"

esphome:
  name: ${device_name}
  friendly_name: ${friendly_name}

esp32:
  board: esp32-c3-devkitm-1

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: !secret encryption_key

ota:
  password: !secret ota_password

wifi:
  networks:
  - ssid: !secret guest_ssid
    password: !secret guest_password
  - ssid: !secret wifi_ssid
    password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ESPHome ${friendly_name}"
    password: !secret wifi_password_backup

# Enable NTP
time:
  - platform: sntp
    id: my_time

# General Config
text_sensor:
  - platform: version
    name: "${device_name} Version"
  - platform: wifi_info
    ip_address:
      name: "${device_name} IP Address"
    ssid:
      name: "${device_name} SSID"
    bssid:
      name: "${device_name} BSSID"

sensor:
  - platform: wifi_signal
    name: "${device_name} WiFi Signal"
    update_interval: 60s
    filters:
      - delta: 0.01
      - throttle: 300s
  - platform: uptime
    name: "${device_name} Uptime"
    filters:
      - throttle: 300s

light:
  # RGB Mood Light
  - platform: rgb
    name: "RGB Light"
    red: output_pwm1
    green: output_pwm2
    blue: output_pwm3
    restore_mode: RESTORE_AND_OFF
  # Temperature controlled light
  - platform: cwww
    name: "Room Light"
    cold_white: output_pwm4
    warm_white: output_pwm5
    cold_white_color_temperature: 6500 K
    warm_white_color_temperature: 2700 K
    constant_brightness: True
    restore_mode: RESTORE_DEFAULT_ON

output:
  # Red PWM
  - platform: ledc
    id: output_pwm1
    pin: GPIO10
    min_power: 5%
    zero_means_zero: True
  # Green PWM
  - platform: ledc
    id: output_pwm2
    pin: GPIO3
    min_power: 1.5%
    max_power: 70%
    zero_means_zero: True
  # Blue PWM
  - platform: ledc
    id: output_pwm3
    pin: GPIO4
    min_power: 1.5%
    max_power: 75%
    zero_means_zero: True
  # Cool PWM
  - platform: ledc
    id: output_pwm4
    pin: GPIO18
    #min_power: 10%
    zero_means_zero: True
  # Warm PWM
  - platform: ledc
    id: output_pwm5
    pin: GPIO5
    #min_power: 10%
    zero_means_zero: True
