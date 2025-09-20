---
title: M5Stack Core2 V1.1
date-published: 2025-06-22
type: misc
standard: global
board: esp32
project-url: https://docs.m5stack.com/en/core/Core2%20v1.1
made-for-esphome: False
difficulty: 2
---

## Product Images

![M5Core2V1.1](M5Core2V1.1.png "M5Stack Core2 V1.1")

## GPIO Pinout

| Pin    | Function        |
| ------ | --------------- |
| GPIO21 | I2C SDA         |
| GPIO22 | I2C SCL         |
| GPIO18 | SPI CLK         |
| GPIO23 | SPI MOSI        |
| GPIO38 | SPI MISO        |
| GPIO5  | Display CS      |
| GPIO15 | Display DC      |
| GPIO39 | Touchscreen IRQ |
| GPIO2  | I2S Audio DOUT  |
| GPIO0  | I2S LRCLK       |
| GPIO12 | I2S BCLK        |

## External Components

[ESPHome AXP2101 Component by stefanthoss](https://github.com/stefanthoss/esphome-axp2101)

This component is essential for powering the internal display and enabling power control for other peripherals on the M5Core2 V1.1.

## Example Configuration

```yaml
substitutions:
  devicename: m5core2
  upper_devicename: M5Core2 V1.1

esphome:
  name: $devicename
  platformio_options:
    upload_speed: 460800

esp32:
  board: m5stack-core2

psram:
  mode: quad
  speed: 80MHz

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  ap:
    ssid: $devicename Fallback Hotspot
    password: !secret wifi_password

captive_portal:

web_server:
  port: 80

logger:
  level: INFO

api:

ota:
  - platform: esphome
    password: ota

external_components:
  - source: github://stefanthoss/esphome-axp2101
    components: [ axp2101 ]

sensor:
  - platform: axp2101
    model: M5CORE2
    address: 0x34
    i2c_id: bus_a
    update_interval: 30s
    brightness: 75%
    battery_voltage:
      name: "Battery Voltage"
    battery_level:
      name: "Battery Level"
    battery_charging:
      name: "Battery Charging"

  - platform: mpu6886
    address: 0x68
    update_interval: 1s
    accel_x:
      name: "MPU6886 Accel X"
    accel_y:
      name: "MPU6886 Accel Y"
    accel_z:
      name: "MPU6886 Accel Z"
    gyro_x:
      name: "MPU6886 Gyro X"
    gyro_y:
      name: "MPU6886 Gyro Y"
    gyro_z:
      name: "MPU6886 Gyro Z"
    temperature:
      name: "MPU6886 Temperature"

spi:
  clk_pin: GPIO18
  mosi_pin: GPIO23
  miso_pin: GPIO38

i2c:
  - id: bus_a
    sda: GPIO21
    scl: GPIO22
    scan: True

display:
  - platform: ili9xxx
    model: M5STACK
    dimensions: 320x240
    invert_colors: False
    cs_pin: GPIO5
    dc_pin: GPIO15
    lambda: |-
      it.print(0, 0, id(roboto), "Hello World");

touchscreen:
  - platform: ft63x6
    interrupt_pin: GPIO39

binary_sensor:
  # the virtual buttons--coordinates taken from
  # https://github.com/m5stack/M5Core2/blob/0134dd3a38cfd335a1ec39da2c149f88baf54326/src/M5Core2.h#L54-L56
  # and
  # https://github.com/m5stack/M5Core2/blob/0134dd3a38cfd335a1ec39da2c149f88baf54326/src/utility/M5Button.h#L811-L815
  # for the parameter order `(x, y, width, height)`
  - platform: touchscreen
    name: Button A
    x_min: 10
    x_max: 120
    y_min: 240
    y_max: 280
    use_raw: true

  - platform: touchscreen
    name: Button B
    x_min: 130
    x_max: 200
    y_min: 240
    y_max: 280
    use_raw: true

  - platform: touchscreen
    name: Button C
    x_min: 230
    x_max: 310
    y_min: 240
    y_max: 280
    use_raw: true

font:
  - file: "gfonts://Roboto"
    id: roboto
    size: 24
```

## Notes

- **Display**: works reliably with `ili9342`
- **Touchscreen**: works well with `ft63x6`, including virtual button regions (A/B/C)
- **MPU6886 IMU**: provides data for accelerometer, gyroscope, and temperature. Temperature readings are erratic and inaccurate
- **Speaker**: didn't work, but some config is provided
- **Microphone**: untested
- **BM8563 RTC**: not configured, no ESPHome component exists for it
