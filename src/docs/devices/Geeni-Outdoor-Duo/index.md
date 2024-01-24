---
title: Geeni Outdoor Duo
date-published: 2019-12-27
type: plug
standard: us
board: esp8266
---

## GPIO Pinout

| Pin    | Function                        |
| ------ | ------------------------------- |
| GPIO0  | Button (inverted)               |
| GPIO5  | Green LED (inverted)            |
| GPIO13 | Blue LED (inverted)             |
| GPIO14 | Left (when facing device) plug  |
| GPIO16 | Right (when facing device) plug |

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: geeni_outdoor
  friendly_name: geeni
  platform: ESP8266
  board: esp01_1m
    #change board to esp12e if the original Tuya WB3S has been desoldered and replaced with an ESP12

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:

api:
  encryption:
    key: !secret encryption_key

ota:
  password: !secret ota_password

web_server:
  port: 80

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    name: "Button"
    on_multi_click:
      # Support a single or double click to switch on each relay
      - timing:
          - ON for at most 1s
          - OFF for at least 0.5s
        then:
          - switch.toggle: relay_left

      - timing:
          - ON for at most 1s
          - OFF for at most 1s
          - ON for at most 1s
          - OFF for at least 0.2s
        then:
          - switch.toggle: relay_right

switch:
  - platform: gpio
    name: "Left plug"
    pin: GPIO14
    id: relay_left
    on_turn_on:
      - light.turn_on: blue_led
    on_turn_off:
      - light.turn_off: blue_led
  - platform: gpio
    name: "Right plug"
    pin: GPIO16
    id: relay_right
    on_turn_on:
      - light.turn_on: green_led
    on_turn_off:
      - light.turn_off: green_led

output:
  - platform: gpio
    pin: GPIO5
    inverted: True
    id: green_led_gpio
  - platform: gpio
    pin: GPIO13
    inverted: True
    id: blue_led_gpio

light:
  - platform: binary
    name: "Green LED"
    id: green_led
    output: green_led_gpio
  - platform: binary
    name: "Blue LED"
    id: blue_led
    output: blue_led_gpio
```
