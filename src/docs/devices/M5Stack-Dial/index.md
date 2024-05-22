---
title: M5Stack Dial
date-published: 2024-05-23
type: misc
standard: global
board: esp32
project-url: https://docs.m5stack.com/en/core/M5Dial
---

## Product Images

![M5Stack Dial](M5Stack-Dial.png "M5Stack Dial")

## Description

M5Stack Dial features an M5StampS3, 8M Flash, 1.28 inch Touchscreen, NFC Reader, Rotary Encoder and a Buzzer.

## Example Configuration

```yaml
---
esphome:
  name: m5stack-dial
  friendly_name: M5Stack Dial
  platformio_options:
    board_build.flash_mode: dio

esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: esp-idf

wifi:
  ap:

captive_portal:

api:

ota:

logger:

i2c:
  - id: internal_i2c
    sda: GPIO11
    scl: GPIO12

rc522_i2c:
  - id: nfc_reader
    i2c_id: internal_i2c
    address: 0x28

output:
  - platform: ledc
    pin: GPIO3
    id: buzzer
  - platform: ledc
    pin: GPIO9
    id: backlight_output

rtttl:
  output: buzzer

sensor:
  - platform: rotary_encoder
    id: encoder
    pin_a: GPIO40
    pin_b: GPIO41

binary_sensor:
  - platform: gpio
    name: Button
    id: front_button
    pin: GPIO42

  - platform: gpio
    name: Hold Button
    pin: GPIO46

spi:
  id: spi_bus
  mosi_pin: GPIO5
  clk_pin: GPIO6

display:
  - platform: ili9xxx
    id: round_display
    model: GC9A01A
    cs_pin: GPIO7
    reset_pin: GPIO8
    dc_pin: GPIO4

touchscreen:
  - platform: ft5x06
    id: touch
    i2c_id: internal_i2c
    address: 0x38
    # interrupt_pin: GPIO14  # not supported by this component

light:
  - platform: monochromatic
    name: "Backlight"
    output: backlight_output
    id: display_backlight
    default_transition_length: 0s
```
