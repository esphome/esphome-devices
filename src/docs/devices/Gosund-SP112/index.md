---
title: Gosund SP112
date-published: 2020-10-27
type: switch
standard: eu
board: esp8266
---

## Flashing

The device can be flashed [using tuya-convert](/guides/tuya-convert). Fresh out of the factory it will be in autoconfig mode. When plugged in for the first time tuya-convert will pick it up directly.

If that doesn't work out for you, disassembly and wired flashing is explained [in this (German) video](https://www.youtube.com/watch?v=hfYFB1UENTQ).

**Attention**: As it turns out Tuya no longer builds them with esp chips. This means as of late 2021 you cannot flash esphome on new units.

**Alternative for newer devices:** [see below](#alternative-for-newer-devices)

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
    voltage_divider: 775
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

## Alternative for newer devices

WARNING: Soldering involved, warranty broken, electric hazard, make sure you know what you are doing at your own responsibility

- Replace Cuco-chip with ESP-M2: https://github.com/c-klinger/Gosund-ESPMod/tree/main (courtesy: Chris Klinger)

- ESPHome basic configuration:

```yaml
esphome:
  name: device

esp8266:
  board: esp8285

# Enable logging
logger:
  logs:
    sensor: INFO
    adc: INFO

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

status_led:
  pin:
    number: GPIO03
    inverted: true

binary_sensor:
  - platform: status
    name: "Status"
  - platform: gpio
    name: "On/Off"
    id: button1
    pin:
      number: GPIO16
      inverted: true
    on_click:
      # short button press toggles mains
      - min_length: 10ms
        max_length: 250ms
        then:
          - switch.toggle: switch1
      # long button press toggles USB
      - min_length: 250ms
        max_length: 5000ms
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
    voltage_divider: 775
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
```
