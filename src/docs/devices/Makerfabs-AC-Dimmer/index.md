---
title: MAKERFABS-AC-Dimmer
date-published: 2025-11-14
type: dimmer
standard: global
board: esp32
---

![Product](./image_1.jpg "Product Image")

## Product description

Makerfabs Home assistant AC Dimmer chopper circuit is based on Triac BT139, and zero-cross checking circuit, it detects the zero-cross points and then the Triac controlled to chop the AC.Besides, to avoid the problem of AC can not be totally shunted off with Triac, a relay is implemented to make the AC totally On/Off.

- On board AC-DC, No external power supply needed;

- On Board Relay to totally shut down current leakage;

- ESP32 for Home assistant/ ESPhone;

- STM32G030F6P6 , for AC choppping;

- Suitable for AC 110V~230V, Any frequency;

- Max Load: 2KW;

It can bought from: [https://www.makerfabs.com/ac-dimmer-for-home-assistant.html](https://www.makerfabs.com/ac-dimmer-for-home-assistant.html).

## Basic Config

```yaml
# based on https://github.com/Makerfabs/Home-Assistant-AC-Dimmer/blob/main/firmware/dimmer.yaml

esphome:
  name: dimmeradruino
  friendly_name:  dimmer
  
external_components:
  - source: 
      type: local
      path: common_components

esp32:
  board: esp32dev
  framework:
    type: arduino

# Enable logging
logger:
  level: INFO

# Enable Home Assistant API
api:
  encryption:
    key: "YOUR_KEY"

ota:
  - platform: esphome
    password: "YOUR_PASSWORD"

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

captive_portal:

web_server:
  port: 80

output:
  - platform: arduino_dimmer
    id: arduino_dimmer_1

fan:
  - platform: speed
    name: "Kitchen Lights"
    output: arduino_dimmer_1
    icon: "mdi:lightbulb"
```
