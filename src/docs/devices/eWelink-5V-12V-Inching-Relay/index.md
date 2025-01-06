---
title: eWelink 5V/12V Inching Relay
date-published: 2025-01-08
type: relay
standard: global
board: esp8266
difficulty: 4
---

## Product Images

TODO.

## GPIO Pinout

| Pin    | Function |
| ------ | ---------|
| GPIO00 | Button   |
| GPIO12 | Relay    |
| GPIO13 | Red LED  |

## Board Configuration

```yaml
esphome:
  project:
    name: eWelink.5V/12V Inching Relay

esp8266:
  board: esp8285

binary_sensor:
  - platform: gpio
    id: button0
    pin:
      number: GPIO0
      mode:
        input: true
        pullup: true
      inverted: true
    on_multi_click:
      - timing:
          - ON for at most 1s
          - OFF for at least 0.2s
        then:
          - switch.turn_on: relay

light:
  - platform: status_led
    id: wifi_led
    pin:
      number: GPIO13
      inverted: true

switch:
  - platform: gpio
    id: relay
    pin: GPIO12
    on_turn_on:
      - delay: 1s
      - switch.turn_off: relay
```
