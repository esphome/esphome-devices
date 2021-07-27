---
title: TreatLife DS02F Ceiling Fan Controller
date-published: 2021-07-26
type: switch
standard: us
---

Treatlife DS02S Switch![image](treatlife_DS02F.jpg)

[Amazon Link](https://www.amazon.com/gp/product/B08P5D3ZKW)

## Notes

This is not for the feint of heart, this device comes with a custom Tuya chip, which is not ESP based. Luckily, the main board has the appropriate footprint for an ESP-12F. Further instructions can be found [here](https://community.home-assistant.io/t/treatlife-dual-outlet-indoor-dimmer-plug-wb3s-to-esp-12-transplant/256798)

The Treatlife DS02F is the same device as the DS03, but lacking the control for the light. 

## GPIO Pinout

| Pin   | Function |
| ----- | -------- |
| GPIO1 | Tuya Tx  |
| GPIO3 | Tuya Rx  |

## Basic Configuration

```yaml
esphome:
  name: ds02f
  platform: ESP8266
  board: esp01_1m

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:

wifi:
  ssid: "ssid"
  password: "PASSWORD"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Gosund Fallback Hotspot"
    password: "ul57sDUAqbcl"

captive_portal:

uart:
  rx_pin: GPIO3
  tx_pin: GPIO1
  baud_rate: 115200

tuya:

fan:
  - platform: "tuya"
    name: Treatlife DS02F Speed
    switch_datapoint: 1
    speed_datapoint: 3
    speed_count: 4
```
