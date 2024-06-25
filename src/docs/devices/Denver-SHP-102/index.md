---
title: Denver SHP-102 Smart Plug
date-published: 2023-12-16
type: plug
standard: eu
board: bk72xx
---

## Notice

- This smart plug is flashable using tuya-cloudcutter, I picked `1.1.8 - BK7231N / oem_bk7231n_plug`

## Product Images

![plug with box](denver-shp-102-box.jpg)

## GPIO Pinout

| Pin | Function      |
| --- | ------------- |
| P6  | CF1 pin       |
| P7  | CF pin        |
| P8  | Blue LED      |
| P10 | Red LED       |
| P11 | Switch button |
| P24 | SEL pin       |
| P26 | Relay         |

## Basic configuration

```yml
esphome:
  name: denver-shp102

bk72xx:
  board: generic-bk7231n-qfn32-tuya
    
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

text_sensor:
  - platform: libretiny
    version:
      name: LibreTiny Version

output:
  - platform: gpio
    id: output_led_1
    pin:
      number: P10
      inverted: true

light:
  - platform: binary
    id: light_switch_1
    output: output_led_1

binary_sensor:
  - platform: gpio
    id: binary_switch_1
    pin:
      number: P11
      inverted: true
      mode: INPUT_PULLUP
    on_press:
      then:
        - switch.toggle: switch_1

switch:
  - platform: gpio
    id: switch_1
    name: Relay 1
    pin: P26
    on_turn_on:
      - light.turn_on: light_switch_1
    on_turn_off:
      - light.turn_off: light_switch_1

status_led:
  pin:
    number: P8
    inverted: true

sensor:
  - platform: hlw8012
    model: BL0937
    cf_pin:
      number: P7
      inverted: true
    cf1_pin:
      number: P6
      inverted: true
    sel_pin:
      number: P24
      inverted: true
    current:
      name: BL0937 Current
      filters:
        - multiply: 0.5
    voltage:
      name: BL0937 Voltage
    power:
      name: BL0937 Power
    energy:
      name: BL0937 Energy
    voltage_divider: 800
    current_resistor: 0.001 ohm
    update_interval: 1s
    change_mode_every: 1
```
