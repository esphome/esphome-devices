---
title: Ledvance E27 RGBW Light 806lm
date-published: 2024-08-07
type: light
standard: eu
board: bk27xx
---

Product ID: AC33911

Can be flashed with esphome kickstart via tuya-cloudcutter!!

## Product Images

![Ledvance E27 RGBW Light](ledvance-e27-rgbw.jpg "Ledvance E27 RGBW Light")

## GPIO Pinout

| Function   | GPIO-Pin |
| ---------- | -------- |
| PWM_red    | P7       |
| PWM_green  | P8       |
| PWM_blue   | P9       |
| PWM_white  | P24      |

## Basic Configuration

```yaml
substitutions:
  device_name: ledvance-e27-rgbw
  device_name_letters: ledvancee27rgbw
  device_description: Ledvance E27 RGBW Bulb
  friendly_name: Ledvance E27 RGBW Bulb

esphome:
  name: ${device_name}
  comment: ${device_description}
  friendly_name: ${friendly_name}
  on_boot:
    priority: 600
    then:
    - light.turn_on:
        id: light_rgbw
        brightness: 100%
        color_mode: WHITE

bk72xx:
  board: generic-bk7231t-qfn32-tuya

# Make sure logging is not using the serial port
logger:
  baud_rate: 0
  
# Enable Home Assistant API
api:

ota:
  - platform: esphome

# WiFi connection
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: ${device_name}_fallback
    password: !secret ap_password
  use_address: ${device_name}.lan

captive_portal:

# Enable Web server
web_server:
  port: 80

button:
  - platform: restart
    name: Restart

  - platform: template
    name: "White"
    on_press:
      light.turn_on:
        id: light_rgbw
        brightness: 100%
        color_mode: WHITE

debug:
  update_interval: 30s

# Sync time with Home Assistant
time:
  - platform: homeassistant
    id: ha_time

# Text sensors with general information
text_sensor:
  - platform: version
    name: ${friendly_name} Version
  - platform: wifi_info
    ip_address:
      name: ${friendly_name} IP Address
  - platform: debug
    reset_reason:
      name: Reset Reason


sensor:
  - platform: uptime
    name: uptime
  # WiFi Signal sensor
  - platform: wifi_signal
    name: ${friendly_name} Wifi Signal

output:
  - platform: libretiny_pwm
    id: output_green
    pin: P8
  - platform: libretiny_pwm
    id: output_blue
    pin: P9
  - platform: libretiny_pwm
    id: output_red
    pin: P7
  - platform: libretiny_pwm
    id: output_white
    pin: P24

light:
  - platform: rgbw
    id: light_rgbw
    name: Light
    color_interlock: true
    red: output_red
    green: output_green
    blue: output_blue
    white: output_white
    effects:
      - random:
          name: "Random"
      - flicker:
          name: "Flicker"
```
