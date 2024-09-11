---
title: KinCony-KC868-M16v2
date-published: 2023-07-25
type: sensor
standard: global
board: esp32
---

![Product](KC868-M16v2-1_06.jpg "Product Image")

## Resources

- [ESP32 pin define details](https://www.kincony.com/forum/showthread.php?tid=3087)
- [YouTube video tour](https://youtu.be/JfqzXulZ73A)

## ESPHome Configuration

Here is an example YAML configuration for the KinCony-KC868-M16v2 board with custom sensor integration.

```yaml
esphome:
  name: m16v2
  includes:
    - zmpt101b/ZMPT101B.h
    - zmpt101b/ZMPT101B.cpp
    - zmpt101b/zmpt101b_custom_sensor.h

esp32:
  board: esp32dev
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "D69bY/GXlmjYkovak6WIhgmbOH8vwyqvMxIHBriYoaY="

ethernet:
  type: LAN8720
  mdc_pin: GPIO23
  mdio_pin: GPIO18
  clk_mode: GPIO17_OUT
  phy_addr: 0

i2c:
  sda: 4
  scl: 5
  scan: true
  id: bus_a

cd74hc4067:
  - id: cd74hc4067_1
    pin_s0: 32
    pin_s1: 33
    pin_s2: 13
    pin_s3: 16

web_server:
  port: 80

font:
  - file: "gfonts://Roboto"
    id: roboto
    size: 20

display:
  - platform: ssd1306_i2c
    model: "SSD1306 128x64"
    address: 0x3C
    lambda: |-
      it.printf(0, 0, id(roboto), "T: %.1f°C", id(temperature).state);
      it.printf(0, 20, id(roboto), "H: %.1f%%", id(humidity).state);
      it.printf(0, 40, id(roboto), "AC:%.1fV", id(voltage_1).state);
