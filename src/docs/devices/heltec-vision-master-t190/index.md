---
title: "Heltec Vision Master T190"
date-published: 2026-05-14
type: misc
standard: global
board: esp32
---

# Heltec Vision Master T190

Manufacturer: [Heltec Automation] https://heltec.org/project/vision-master-t190/

## Product Description

Vision Master T190 (HT-VMT190) is a development kit with ESP32-S3 and LoRa Module (optional).
The onboard 1.9-inch TFT-LCD display contains 170X320 RGB dots and can display up to 262k colors.

## Main Features
- ESP32-S3R8 MCU, support Wi-Fi and BLE.
- LoRa module is optional.
- Low power consumption, 18uA in deep sleep.
- Onboard SH1.25-2 battery interface, integrated lithium battery management system (charge and discharge management, overcharge protection, battery power detection, USB / battery power automatic switching).
- Powerful display function, onboard 1.9-inch TFT-LCD display contains 170X320 RGB dots and can display up to 262k colors.
- SH2.0-4P sensor interface is compatible with QuickLink series sensors.
- Compatible with Arduino, development frameworks and libraries provided by Heltec.

## Basic Configuration

```yaml
esphome:
  name: "heltect190"

esp32:
  variant: esp32s3
  framework:
    type: arduino

logger:
  level: DEBUG

api:

ota:
- platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

captive_portal:

web_server:
  port: 80

i2c:
  id: bus_a
  sda: GPIO2
  scl: GPIO1
  frequency: 400kHz
  scan: true

spi:
  clk_pin: GPIO38
  mosi_pin: GPIO48
```

## Display Configuration
```yaml
# Backlight
switch:
  - platform: gpio
    id: vtftctrl
    name: "TFT voltage control"
    pin: GPIO7
    restore_mode: ALWAYS_OFF
  - platform: gpio
    id: tft_backlight
    name: "TFT backlight"
    pin: GPIO17
    restore_mode: ALWAYS_ON

# LCD 170x320
display:
  - platform: ili9xxx
    id: tft170x320
    model: ST7789V
    rotation: 90°  # USB right side
    # rotation: 270°  # USB left side
    cs_pin: GPIO39
    dc_pin: GPIO47
    reset_pin: GPIO40
    invert_colors: true
    dimensions:
      height: 320
      width: 170
      offset_height: 0
      offset_width: 35
```

## Links
- [Product page] (https://heltec.org/project/vision-master-t190/)
- [github example code repository] (https://github.com/HelTecAutomation/Heltec_ESP32)
- [Pin map] (https://heltec.org/wp-content/uploads/2024/06/HT-VMT190-pin-map.png)

