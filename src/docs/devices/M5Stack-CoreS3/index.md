---
title: M5Stack CoreS3
date-published: 2025-12-05
type: misc
standard: global
board: esp32
project-url: https://docs.m5stack.com/en/core/CoreS3
made-for-esphome: false
difficulty: 2
---

ESP32-S3 based Core series device with 2.0" 320x240 IPS display, capacitive touch, AXP2101 PMU, AW9523 I/O
expander, internal BMI270 IMU, ES7210 microphone codec, speaker amp, microSD slot, and multiple Grove/M-Bus ports.

## Product Images

![M5Stack CoreS3](https://static-cdn.m5stack.com/resource/docs/products/core/CoreS3/img-96063e2a-637a-4d11-ac47-1ce4f1cdfd3e.webp "M5Stack CoreS3")

## GPIO Pinout

| Pin    | Function                                  |
| ------ | ----------------------------------------- |
| GPIO3  | Display CS                                |
| GPIO35 | Display MISO / D-C (3-wire)               |
| GPIO36 | Display/SPI SCLK                          |
| GPIO37 | Display/SPI MOSI                          |
| GPIO4  | microSD CS (shares SPI bus)               |
| GPIO21 | Touchscreen IRQ                           |
| GPIO12 | Internal I2C SDA (PMU, touch, IMU, AW9523) |
| GPIO11 | Internal I2C SCL                          |
| GPIO2  | Grove Port A SDA                          |
| GPIO1  | Grove Port A SCL                          |
| GPIO9  | Port B                                    |
| GPIO8  | Port B                                    |
| GPIO18 | Port C                                    |
| GPIO17 | Port C                                    |
| GPIO0  | I2S MCLK (microphone codec)               |
| GPIO14 | I2S DATA IN (microphone codec)            |
| GPIO13 | I2S DATA OUT (speaker)                    |
| GPIO33 | I2S LRCK (mic + speaker)                  |
| GPIO34 | I2S BCLK (mic + speaker)                  |

Notes: LCD reset and backlight are driven by the AW9523 I/O expander, so no direct GPIO is exposed. Power rails and
battery telemetry are handled by the AXP2101 PMU on the internal I2C bus.

## External Components

[ESPHome AXP2101 Component by stefanthoss](https://github.com/stefanthoss/esphome-axp2101)

This component exposes battery voltage/level/charging state and lets you manage the CoreS3 power rails controlled by
the AXP2101 PMU.

## Example Configuration

Hardware-only starter configuration for the CoreS3 display, touch panel, and buses. Backlight and reset are managed by
the AXP2101/AW9523, so the display uses `-1` pins for those signals.

```yaml
substitutions:
  devicename: m5cores3
  upper_devicename: M5Stack CoreS3

esphome:
  name: ${devicename}
  friendly_name: ${upper_devicename}

esp32:
  board: esp32-s3-devkitc-1
  variant: ESP32S3
  framework:
    type: arduino

logger:
  baud_rate: 0

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  ap:
    ssid: ${upper_devicename} Fallback
    password: !secret wifi_password

captive_portal:

api:

ota:
  - platform: esphome

spi:
  id: spi_lcd
  clk_pin: GPIO36
  mosi_pin: GPIO37
  miso_pin: GPIO35

i2c:
  - id: bus_internal
    sda: GPIO12
    scl: GPIO11
    scan: true

  - id: bus_grove
    sda: GPIO2
    scl: GPIO1
    scan: false

display:
  - platform: mipi_spi
    model: ILI9341 # ILI9342-compatible panel
    spi_id: spi_lcd
    cs_pin: GPIO3
    dc_pin: GPIO35
    reset_pin: -1
    backlight_pin: -1
    data_rate: 40MHz
    dimensions:
      width: 320
      height: 240
    show_test_card: true

touchscreen:
  - platform: ft5x06
    i2c_id: bus_internal
    interrupt_pin: GPIO21
    address: 0x38
```

## Notes

- **Power**: Use the AXP2101 external component to read battery status and enable rails like LCD/backlight if they are
  disabled by default.
- **Audio**: The ES7210 microphone and speaker amp share the I2S bus on GPIO0/13/14/33/34 if you want to add
  `i2s_audio` components.
- **Storage**: The microSD slot shares the LCD SPI bus with CS on GPIO4.
- **Expansion**: Grove Port A exposes I2C on GPIO2/1; Ports B (GPIO9/8) and C (GPIO18/17) are free GPIOs on the M-Bus.
