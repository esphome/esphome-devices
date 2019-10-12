---
title: Generic ESP32-CAM
type: misc
standard: global
---
1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO0   | External Clock                     |
| GPIO26  | i2c Pins                           |
| GPIO27  | i2c Pins                           |
| GPIO05  | Data Pins                          |
| GPIO18  | Data Pins                          |
| GPIO19  | Data Pins                          |
| GPIO21  | Data Pins                          |
| GPIO36  | Data Pins                          |
| GPIO39  | Data Pins                          |
| GPIO34  | Data Pins                          |
| GPIO35  | Data Pins                          |
| GPIO25  | Vsync Pin                          |
| GPIO23  | Href Pin                           |
| GPIO22  | Pixel Clock Pin                    |
| GPIO32  | Power Down Pin                     |
| GPIO4   | Camera Light                       |


## Basic Configuration
```yaml
# Basic Config
# https://www.banggood.com/Geekcreit-ESP32-CAM-WiFi-bluetooth-Camera-Module-Development-Board-ESP32-With-Camera-Module-OV2640-p-1394679.html
esphome:
  name: esp_cam02
  platform: ESP32
  board: esp32dev

wifi:
  ssid: 'ssid'
  password: 'ssid_password'


logger:
  #level: INFO
api:
  password: 'api_password'
ota:
  password: 'ota_password'
  


esp32_camera:
  external_clock:
    pin: GPIO0
    frequency: 20MHz
  i2c_pins:
    sda: GPIO26
    scl: GPIO27
  data_pins: [GPIO5, GPIO18, GPIO19, GPIO21, GPIO36, GPIO39, GPIO34, GPIO35]
  vsync_pin: GPIO25
  href_pin: GPIO23
  pixel_clock_pin: GPIO22
  power_down_pin: GPIO32
  resolution: 800x600
  name: esp_cam02
  idle_framerate: 0.1fps

output:
  - platform: gpio
    pin: GPIO4
    id: gpio_4
light:
  - platform: binary
    output: gpio_4
    name: espcam_02 light
```
