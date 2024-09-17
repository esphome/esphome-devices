---
title: Waveshare ESP32-S3 Matrix
date-published: 2024-09-17
type: misc
standard: global
board: esp32
project-url: https://github.com/dala318/esphome-qmi8658/blob/main/led8x8-qmi8658.yaml
made-for-esphome: false
difficulty: 2
---

A module composed of:

- ESP32 S3 chip
- QMI8658C accelerometer and gyroscope
- 8 x 8 LED matrix

Powered by USB-C

Vendor documentation:

- [Product page](https://www.waveshare.com/esp32-s3-matrix.htm)
- [Wiki](https://www.waveshare.com/wiki/ESP32-S3-Matrix)

## GPIO Pinout

| PIN           | ESP32 | Description                                                             |
|---------------|-------|-------------------------------------------------------------------------|
| VCC           | VCC   | Power input (3.3V)                                                      |
| GND           | GND   | GND                                                                     |
| QMI SDA       | 11    | QMI8658 I2C SDA pin                                                     |
| QMI SCL       | 12    | QMI8658 I2C SCL pin                                                     |
| QMI IRQ1      | 10    | QMI8658 iterrupt 1 (does not work as well as IRQ2)                      |
| QMI IRQ2      | 13    | QMI8658 iterrupt 2                                                      |
| WS2811 LED    | 14    | Controlling the 8x8 LED matrix via neopixel                             |

## Product Images

![Product Image](esp32-s3-matrix-1.jpg "Product front")
![Product Image](esp32-s3-matrix-2.jpg "Product back")
