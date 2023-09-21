---
title: LC-ESP32-Relay-X1-V1.2
date-published: 2023-09-21
type: relay
standard: global
board: esp32
---

```yaml
esphome:
  name: "Name"
  friendly_name: "Friendly_Name"

esp32:
  board: esp32dev
  framework:
    type: esp-idf

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "xxxxx"

ota:
  password: "xxxx"

wifi:
  ssid: "wifi_ssid"
  password: "wifi_password"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ESP32 Fallback Hotspot"
    password: "xxxx"

captive_portal:

light:
  - platform: status_led
    name: "ESP32 Led"
    restore_mode: ALWAYS_OFF
    pin:
      number: GPIO23
      inverted: False

switch:
  - platform: gpio
    pin: GPIO16
    name: "ESP32 Fan Relay"
    id: esp32_fan_relay
```
