---
title: Treatlife SL10 E27 9W 800L RGBCCT Bulb
date-published: 2023-11-28
type: light
standard: global
board: bk72xx
---

Treatlife SL10 PCB differs from the previous ESP based SL10 that now has BK7231T chip (W8P) and using sm2135 led driver.

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO8  | SM2135 Data Pin  |
| GPIO7  | SM2135 Clock Pin          |

## Basic Configuration

```yaml
substitutions:
  devicename: treatlife-sl10

esphome:
  name: $devicename
  friendly_name: treatlife-sl10

bk72xx:
  board: generic-bk7231t-qfn32-tuya
  framework:
    version: latest
    
# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

web_server:

light:
  - platform: rgbww
    name: $devicename
    id: "light_treatlife_sl10"
    red: output_red
    green: output_green
    blue: output_blue
    warm_white: output_warmwhite
    cold_white: output_coldwhite
    color_interlock: true
    cold_white_color_temperature: 6500 K
    warm_white_color_temperature: 2700 K
    restore_mode: RESTORE_DEFAULT_ON

sm2135:
  data_pin: GPIO8
  clock_pin: GPIO7
  rgb_current: 25mA
  cw_current: 40mA

output:
  - platform: sm2135
    id: output_red
    channel: 2
  - platform: sm2135
    id: output_green
    channel: 0
  - platform: sm2135
    id: output_blue
    channel: 1
  - platform: sm2135
    id: output_warmwhite
    channel: 4
  - platform: sm2135
    id: output_coldwhite
    channel: 3

```
