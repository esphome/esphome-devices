---
title: Gosund SP112
date-published: 2020-10-27
type: switch
standard: eu
---

## Flashing

The device can be flashed [using tuya-convert](#tuya-convert). Fresh out of the factory it will be in autoconfig mode. When plugged in for the first time tuya-convert will pick it up directly.

If that doesn't work out for you, disassembly and wired flashing is explained [in this (German) video](https://www.youtube.com/watch?v=hfYFB1UENTQ).

## GPIO Pinout

| Pin    | Function                       |
| ------ | ------------------------------ |
| GPIO0  | LED red                        |
| GPIO2  | LED blue (Inverted: true)      |
| GPIO4  | HLWBL CF1 Pin                  |
| GPIO5  | BL0937 CF Pin                  |
| GPIO12 | HLWBL SEL Pin (Inverted: true) |
| GPIO13 | Relay USB                      |
| GPIO14 | Relay mains (Inverted: true)   |
| A0     | Button                         |

## Basic Configuration

```yaml
esphome:
  platform: ESP8266
  arduino_version: 2.5.1
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

# Reduce log level as otherwise logs would be flooded with analog sensor readings
logger:
  logs:
    sensor: INFO
    adc: INFO

status_led:
  pin:
    number: GPIO02
    inverted: true

output:
  - platform: gpio
    id: led1
    pin:
      number: GPIO00
      inverted: true

switch:
  - platform: gpio
    name: "Relay Mains"
    id: switch1
    pin: GPIO14
    on_turn_on:
      - output.turn_on: led1
    on_turn_off:
      - output.turn_off: led1
  - platform: gpio
    name: "Replay USB"
    id: switchusb
    pin:
      number: GPIO13
      inverted: true

binary_sensor:
  - platform: template
    id: button1
    # read analog sensor and convert it's value to binary state
    lambda: return (id(button_adc).state < .5);
    on_click:
      # short button press toggles mains
      - min_length: 10ms
        max_length: 250ms
        then:
          - switch.toggle: switch1
      # long button press toggles USB
      - min_length: 250ms
        max_length: 1000ms
        then:
          - switch.toggle: switchusb

sensor:
  - platform: adc
    id: button_adc
    pin: A0
    update_interval: .1s
  - platform: hlw8012
    sel_pin:
      number: GPIO12
      inverted: True
    cf_pin: GPIO05
    cf1_pin: GPIO04
    current_resistor: 0.00221
    voltage_divider: 871
    change_mode_every: 8
    update_interval: 10s
    current:
      id: amperage
      name: Amperage
      unit_of_measurement: A
      accuracy_decimals: 2      
    voltage:
      id: voltage
      name: Voltage
      unit_of_measurement: V
      accuracy_decimals: 2         
    power:
      id: wattage
      name: Wattage
      unit_of_measurement: W
      accuracy_decimals: 2       
```
