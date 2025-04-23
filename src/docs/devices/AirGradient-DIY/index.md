---
title: AirGradient-DIY
date-published: 2021-09-23
type: sensor
standard: us
board: esp8266
---

Air environment sensor from PM2.5, CO2, Temperature and Humidity from [AirGradient](https://www.airgradient.com/diy/).

Variations of the components are possible. Check your components.

If you have multiple sensor boards, you will likely need to make each sensor name unique across the boards
(e.g. "1st AirGradient Temperature"), so there aren't naming conflicts.

## Basic Configuration

```yaml
esphome:
  name: airgradient

esp8266:
  board: d1_mini

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: !secret api_encryption_key

ota:
  password: ""

captive_portal:

i2c:
  sda: D2
  scl: D1

uart:
  - rx_pin: D5
    tx_pin: D6
    baud_rate: 9600
    id: uart1
  - rx_pin: D4
    tx_pin: D3
    baud_rate: 9600
    id: uart2

sensor:
  - platform: sht3xd
    temperature:
      id: temp
      name: "Temperature"
    humidity:
      id: humidity
      name: "Humidity"
    address: 0x44
    update_interval: 5s
  - platform: pmsx003
    type: PMSX003
    uart_id: uart1
    pm_2_5:
      id: pm25
      name: "Particulate Matter <2.5µm Concentration"
  - platform: senseair
    uart_id: uart2
    co2:
      id: co2
      name: "SenseAir CO2 Value"
    update_interval: 60s
```

### OLED Support

If you are using the 64x48 OLED shield that's included in the kit, you can use this config. Note that you will need to place `fonts/helvetica.ttf` (or another font of your choosing) in the ESPHome config directory.

This config will print all four sensor states to the display.

```yaml
font:
  - file: "fonts/helvetica.ttf"
    id: helvetica
    size: 12
    glyphs: |
      !"%()+=,-_.:°0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyzµ³/

display:
  - platform: ssd1306_i2c
    model: "SSD1306 64x48"
    address: 0x3C
    lambda: |-
      // For Celsius, uncomment the below line
      // it.printf(0, 0, id(helvetica), "%.1f°C", id(temp).state);
      // For Fahrenheit, uncomment the below line
      // it.printf(0, 0, id(helvetica), "%.1f°F", (id(temp).state * 1.8) + 32);
      it.printf(0, 12, id(helvetica), "%.1f%% RH", id(humidity).state);
      it.printf(0, 24, id(helvetica), "%.0fppm", id(co2).state);
      it.printf(0, 36, id(helvetica), "%.0f µg/m³", id(pm25).state);
```
