---
title: Sonoff POWR2
date-published: 2024-06-18
type: relay
standard: global
board: esp8266
difficulty: 3
---

## Product Images

![A picture of the PCB inside of the Sonoff POWR2](/inside.jpg "inside")

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO0  | Push Button (HIGH = off, LOW = on) |
| GPIO12 | Relay and its status LED           |
| GPIO13 | Blue LED (HIGH = off, LOW = on)    |
| GPIO1  | RX pin (for serial programming)    |
| GPIO3  | TX pin (for serial programming)    |

## Basic Configuration

```yaml
# Basic Config
substitutions:
  update_interval: 60s

esphome:
  name: "Sonoff POW R2"
  platform: ESP8266
  board: esp01_1m
  project:
    name: Sonoff.relay
    version: 'POWR2'

logger:
  baud_rate: 0

# Enable Home Assistant API
api:

ota:

wifi:
  networks:
    - ssid: !secret wifi_ssid
      password: !secret wifi_password

uart:
  rx_pin: RX
  baud_rate: 4800

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    name: Sonoff POW Button
    on_press:
      - switch.toggle: dummybutton

sensor:
  - platform: cse7766
    current:
      name: "Sonoff Pow R2 Current"
      filters:
        - throttle_average: ${update_interval}
    voltage:
      name: "Sonoff Pow R2 Voltage"
      filters:
        - throttle_average: ${update_interval}
    power:
      name: "Sonoff Pow R2 Power"
      filters:
        - throttle_average: ${update_interval}
    energy:
      name: "Sonoff Pow R2 Energy"
      filters:
        - throttle: ${update_interval}
    apparent_power:
      name: "Sonoff Pow R2 Apparent Power"
      filters:
        - throttle_average: ${update_interval}
    power_factor:
      name: "Sonoff Pow R2 Power Factor"
      filters:
        - throttle_average: ${update_interval}

switch:
  - platform: template
    name: Sonoff POW Relay
    optimistic: true
    id: dummybutton
    turn_on_action:
      - switch.turn_on: relay
    turn_off_action:
      - switch.turn_off: relay
  - platform: gpio
    id: relay
    pin: GPIO12

output:
  - platform: esp8266_pwm
    id: pow_blue_led
    pin:
      number: GPIO13
      inverted: True

light:
  - platform: monochromatic
    name: Sonoff POW Blue LED
    output: pow_blue_led
    id: led
```
