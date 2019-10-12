---
title: Sonoff iFan02
date-published: 2019-10-11
type: misc
standard: global
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO12  | Light Relay 1                      |
| GPIO5   | Fan Relay 2                        |
| GPIO4   | Fan Relay 3                        |
| GPIO15  | Fan Relay 4                        |

## Basic Configuration
```yaml
# Basic Config
esphome:
  name: sonoff_s20
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
api:
ota:

# Device Specific Config
light:
  - platform: binary
    name: "Fan light"
    output: fanlight
output:
  - platform: gpio
    pin: GPIO12
    id: fanlight
switch:
  - platform: restart
    name: "Fan Restart"
  - platform: gpio
    name: "Fan 3 Relay"
    pin: GPIO4
    id: fan3sw
    restore_mode: ALWAYS_OFF
    internal: true
  - platform: gpio
    name: "Fan 2 Relay"
    pin: GPIO5
    id: fan2sw
    restore_mode: ALWAYS_OFF
    internal: true
  - platform: gpio
    name: "Fan 4 Relay"
    pin: GPIO15
    id: fan4sw
    restore_mode: ALWAYS_OFF
    internal: true
  - platform: template
    name: "Fan Low"
    id: fanlow
    turn_on_action:
      - switch.turn_off: fanmed
      - switch.turn_off: fanhigh
      - switch.turn_on: fan2sw
  - platform: template
    name: "Fan Medium"
    id: fanmed
    turn_on_action:
      - switch.turn_off: fanlow
      - switch.turn_off: fanhigh
      - switch.turn_on: fan2sw
      - switch.turn_on: fan3sw
  - platform: template
    name: "Fan High"
    id: fanhigh
    turn_on_action:
      - switch.turn_off: fanlow
      - switch.turn_off: fanmed
      - switch.turn_on: fan2sw
      - switch.turn_on: fan4sw
  - platform: template
    name: "Fan Off"
    id: fanoff
    turn_on_action:
      - switch.turn_off: fan2sw
      - switch.turn_off: fan4sw
      - switch.turn_off: fan3sw
```
