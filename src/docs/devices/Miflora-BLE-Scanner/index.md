---
title: Generic MiFlora BLE Scanner
date-published: 2019-10-11
type: misc
standard: global
---

## GPIO Pinout

| Pin | Function |
| --- | -------- |
| N/A | N/A      |

## Basic Configuration

```yaml
# Basic Config
# https://www.espressif.com/en/products/hardware/esp32/overview
esphome:
  name: esp32_2
  platform: ESP32
  board: esp32dev

wifi:
  ssid: "ssid"
  password: "wifi_password"

logger:
  #level: INFO
api:
  password: "api_password"
ota:
  password: "ota_password"

esp32_ble_tracker:
  scan_interval: 360s

sensor:
  - platform: xiaomi_hhccjcy01
    mac_address: "80:EA:CA:88:B3:6C"
    temperature:
      name: "Peace Lily Temperature"
    moisture:
      name: "Peace Lily Moisture"
    illuminance:
      name: "Peace Lily Illuminance"
    conductivity:
      name: "Peace Lily Soil Conductivity"
    battery_level:
      name: "Peace Lily Battery Level"

  - platform: xiaomi_hhccjcy01
    mac_address: "C4:7C:8D:6B:01:97"
    temperature:
      name: "Palour Palm Temperature"
    moisture:
      name: "Palour Palm Moisture"
    illuminance:
      name: "Palour Palm Illuminance"
    conductivity:
      name: "Palour Palm Soil Conductivity"

  - platform: xiaomi_hhccjcy01
    mac_address: "80:EA:CA:88:B3:B1"
    temperature:
      name: "Lounge Orchid Temperature"
    moisture:
      name: "Lounge Orchid Moisture"
    illuminance:
      name: "Lounge Orchid Illuminance"
    conductivity:
      name: "Lounge Orchid Soil Conductivity"

  - platform: xiaomi_hhccjcy01
    mac_address: "80:EA:CA:88:B0:EF"
    temperature:
      name: "Tomato Plant Temperature"
    moisture:
      name: "Tomato Plant Moisture"
    illuminance:
      name: "Tomato Plant Illuminance"
    conductivity:
      name: "Tomato Plant Soil Conductivity"
```
