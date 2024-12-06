---
title: TomZN TOB9-VAP
date-published: 2024-12-07
type: misc
standard: global
board: bk72xx
difficulty: 3
---

## Notes

- Uses [BL0942](https://esphome.io/components/sensor/bl0942.html) for energy monitoring, which requires [calibration](https://esphome.io/components/sensor/bl0942.html#calibration)
- Does not use a relay for controlling the output, it uses a bridge whose position can be toggled by pulsing GPIO24 and GPIO26

## Product images

![device](/device.jpg "Device")

![board](/board.jpg "Board")

## Programming

Tuya Cloudcutter was [not able to work for this device](https://github.com/tuya-cloudcutter/tuya-cloudcutter/issues/742) (with firmware v1.0.15). If your device has an older firmware, it may be worth a try.

This device is powered by a [CBU](https://docs.libretiny.eu/boards/cbu) board (BK7231N), you can read [LibreTiny's instructions](https://docs.libretiny.eu/docs/platform/beken-72xx/) on how to flash it.

Disassembling this device is simple, provided you find a way to remove the golden tubes. Here is one way:

![disassembling](/disassembling.jpg "Disassembling")

## GPIO Pinout

| Pin    | Function            | Notes    |
| ------ | ------------------- |----------|
| GPIO09 | Red LED             | inverted |
| GPIO10 | RX for BL0942       | RX1      |
| GPIO11 | TX for BL0942       | TX1      |
| GPIO15 | Blue LED (status)   | inverted |
| GPIO17 | Button              | inverted |
| GPIO24 | Bridge forward      | pulse    |
| GPIO26 | Bridge reverse      | pulse    |

## Basic Configuration

```yaml
esphome:
  name: TomZN.TOB9-VAP

bk72xx:
  board: cbu

logger:

captive_portal:

uart:
  tx_pin: TX1
  rx_pin: RX1
  baud_rate: 4800
  stop_bits: 1

binary_sensor:
  - platform: gpio
    id: power_button
    pin:
      number: 17
      inverted: true
      mode: INPUT_PULLUP
    on_multi_click:
      - timing:
          - ON for at most 1s
          - OFF for at least 0.2s
        then:
          switch.toggle: main_switch
      - timing:
          - ON for at least 4s
        then:
          button.press: reset

output:
  - platform: gpio
    id: red_led_output
    pin: GPIO9
    inverted: true

light:
  - platform: status_led
    id: blue_led
    pin:
      inverted: true
      number: GPIO15
  - platform: binary
    id: red_led
    output: red_led_output
    restore_mode: ALWAYS_OFF

switch:
  - platform: gpio
    id: bridge_forward
    pin: GPIO24
    restore_mode: ALWAYS_OFF
    on_turn_on:
      - switch.template.publish:
          id: main_switch
          state: ON
      - light.turn_on: red_led
      - delay: 200ms
      - switch.turn_off: bridge_forward

  - platform: gpio
    id: bridge_reverse
    pin: GPIO26
    restore_mode: ALWAYS_OFF
    on_turn_on:
      - switch.template.publish:
          id: main_switch
          state: OFF
      - light.turn_off: red_led
      - delay: 200ms
      - switch.turn_off: bridge_reverse

  - platform: template
    name: Switch
    id: main_switch
    device_class: outlet
    restore_mode: ALWAYS_OFF
    turn_on_action:
      switch.turn_on: bridge_forward
    turn_off_action:
      switch.turn_on: bridge_reverse

sensor:
  - platform: bl0942
    line_frequency: 50Hz
    update_interval: 10s
    current:
      name: Current
      filters:
        # The chip reports some current even when there is no load
        - lambda: if (x < 0.02) return 0.0; else return x;
    voltage:
      name: Voltage
    power:
      name: Power
      filters:
        # The chip reports some power even when there is no load
        - lambda: if (x < 0.5) return 0.0; else return x;
    energy:
      name: Energy
      unit_of_measurement: kWh
    frequency:
      name: Frequency
      accuracy_decimals: 2
```
