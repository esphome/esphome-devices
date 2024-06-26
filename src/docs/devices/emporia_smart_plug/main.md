---
title: Emporia Smart Plug
date-published: 2023-08-20
type: plug
standard: us
board: esp8266
difficulty: 4
---

## Initial Install

You must dissasemble the case to access the VDD, GND, RX, and TX pins. They can be accessed on the ESP daughterboard or from under the main board at the board connection. Modifying the rear housing is required to access the daugherboard mounting pins.

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO13 | Push Button (HIGH = off, LOW = on) |
| GPIO4  | Relay                              |
| GPIO15 | RED LED (HIGH = on, LOW = off)     |
| GPIO12 | BL0937 SEL                         |
| GPIO5  | BL0937 CF                          |
| GPIO14 | BL0937 CF1                         |
|        | Blue LED                           |

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: emporia_smart_plug

esp8266:
  board: esp01_1m
    
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

# Device Specific Config
binary_sensor:
  - platform: gpio
    pin:
      number: GPIO13
      mode: INPUT_PULLUP
      inverted: True
    name: "Emporia Smart Plug Button"
    on_press:
      - switch.toggle: relay
  - platform: status
    name: "Emporia Smart Plug Status"

sensor:
 
 - platform: hlw8012
    model: BL0937  
    sel_pin:
      number: 12
      inverted: true
    cf_pin: 5
    cf1_pin: 14
    current:
      name: "Emporia Smart Plug Current"
    voltage:
      name: "Emporia Smart Plug Voltage"
    power:
      name: "Emporia Smart Plug Power"
      id: my_power
    energy:
      name: "Emporia Smart Plug Energy"
    update_interval: 30s
  - platform: total_daily_energy
    name: "Emporia Smart Plug Daily Energy"
    power_id: my_power

switch:
  - platform: gpio
    name: "Emporia Smart Plug Relay"
    pin: GPIO4
    id: relay
    on_turn_on:
      - light.turn_on: status_light
    on_turn_off:
      - light.turn_off: status_light

time:
  - platform: sntp
    id: my_time

light:
  - platform: status_led
    pin: GPIO15
    id: status_light
    internal: true
```
