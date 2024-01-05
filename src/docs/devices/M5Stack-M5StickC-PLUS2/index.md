---
title: M5Stack M5StickC PLUS2
date-published: 2024-01-05
type: misc
standard: global
board: esp32
project-url: https://docs.m5stack.com/en/core/M5StickC%20PLUS2
---

## Product Images

![M5Stick C Plus2](m5stickcplus2.png "M5Stick C Plus2")

## GPIO Pinout

| Pin    | Function          |
| ------ | ----------------- |
| GPIO37 | Button A          |
| GPIO39 | Button B          |
| GPIO35 | Button C          |
| GPIO19 | Internal LED/IR   |
| GPIO13 | SPI CLK           |
| GPIO15 | SPI MOSI          |
| GPIO21 | I2C SDA           |
| GPIO22 | I2C SCL           |
| GPIO05 | Display CS        |
| GPIO14 | Display DC        |
| GPIO12 | Display Reset     |
| GPIO00 | I2S CLK           |
| GPIO26 | I2S LRCLK         |
| GPIO34 | Microphone Data   |
| GPIO38 | Battery Level     |
| GPIO02 | Buzzer            |

## External Component

Unlike the M5StickC Plus, the Plus2 has no power management chip. Therefore, AXP192 support is not required; TFT backlight  
and battery level are accessed through GPIO pins -- see below for details.

## Example Configuration

```yml
substitutions:
  devicename: m5stickc-plus2
  upper_devicename: M5StickC PLUS2

esphome:
  name: $devicename
  platform: ESP32
  board: m5stick-c
  platformio_options:
    upload_speed: 115200

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  
  ap:
    ssid: $devicename Fallback Hotspot
    password: !secret wifi_password

captive_portal:

logger:

api:

ota:

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO37
      inverted: true
    name: ${upper_devicename} Button A
    on_press:
      then:
        - light.turn_on: led1
    on_release:
      then:
        - light.turn_off: led1

  - platform: gpio
    pin:
      number: GPIO39
      inverted: true
    name: ${upper_devicename} Button B
    on_press:
      then:
        - light.turn_on: led1
    on_release:
      then:
        - light.turn_off: led1

light:
  - platform: monochromatic
    output:  builtin_led
    name: ${upper_devicename} Led
    id: led1

output:
  - platform: ledc
    pin: 10
    inverted: true
    id: builtin_led

remote_transmitter:
  - pin:
      number: GPIO9
    carrier_duty_percent: 50%
    id: internal

spi:
  clk_pin: GPIO13
  mosi_pin: GPIO15

i2c:
   - id: bus_a
     sda: GPIO21
     scl: GPIO22
     scan: True

font:
  - file: "gfonts://Roboto"
    id: roboto
    size: 12

# 1.14 inch, 135*240 Colorful TFT LCD, ST7789v2
display:
  - platform:  st7789v
    model: TTGO TDisplay 135x240
    cs_pin: GPIO5
    dc_pin: GPIO23
    reset_pin: GPIO18
    rotation: 270
    lambda: |-
      it.print(80, 0, id(roboto), ST77XX_WHITE, TextAlign::TOP_CENTER, "M5Stick Test");

i2s_audio:
  id: bus_i2s
  i2s_lrclk_pin: G26
  i2s_bclk_pin: G0

microphone:
  - platform: i2s_audio
    i2s_din_pin: GPIO34
    i2s_audio_id: bus_i2s
    adc_type: external
    pdm: true
    id: mic
```

