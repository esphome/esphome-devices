---
title: Lohas LH-ZN124 5000K 10W Dimmable
date-published: 2019-11-21
type: light
standard: us
board: esp8266
---

## GPIO Pinout

| Pin    | Function |
| ------ | -------- |
| GPIO14 | Light    |

## Basic Configuration

```yaml
esphome:
  name: lightname
esp8266:
  board: esp01_1m
  restore_from_flash: true
wifi:
  ssid: ssid
  password: password
  ap:
    ssid: light Fallback Hotspot
    password: '1234567890'
captive_portal: null
logger: null
api: null
ota: null
web_server: null
output:
- platform: esp8266_pwm
  id: pwm_output
  pin: GPIO14
light:
- platform: monochromatic
  name: lightname
  default_transition_length: 1s
  output: pwm_output
```
