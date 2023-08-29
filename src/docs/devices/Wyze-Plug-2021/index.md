---
title: Wyze Plug (2021)
date-published: 2022-12-13
type: plug
standard: us
board: esp32
---

## Initial Install

This device is glued together pretty tightly, but can be opened with the application of hot air and prying. It must be opened for the first upload.

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO15 | Button                             |
| GPIO16 | Relay                              |
| GPIO19 | Relay LED                          |

## Basic Configuration

```yaml
# Basic Config
substitutions:
  display_name: WyzePlug

esphome:
  name: wyzeplug
  platform: ESP32
  board: esp-wrover-kit
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
logger:
api:
ota:

# Device Specific Config
switch:
  - platform: gpio
    name: ${display_name} Relay
    pin:
      number: GPIO16
      inverted: false
    id: relay
    on_turn_on:
      - light.turn_on: relay_led
    on_turn_off:
      - light.turn_off: relay_led
  - platform: restart
    name: ${display_name} Restart

output:
  - platform: gpio
    pin: GPIO19
    inverted: True
    id: relay_led_gpio

light:
  - platform: binary
    name: "Relay LED"
    id: relay_led
    internal: true
    output: relay_led_gpio

binary_sensor:
  - platform: gpio
    internal: true
    pin:
      number: GPIO15
      mode: INPUT_PULLDOWN
      inverted: True
    name: ${display_name} Button
    on_press:
      - switch.toggle: relay
```
