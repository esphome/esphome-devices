---
title: Brilliant Smart Wi-Fi RGB Garden Light
date-published: 2019-11-10
type: light
standard: au
---

1. TOC
{:toc}

## General Notes

This configuration is for the [Brilliant Smart Wi-Fi RGB Garden Light](https://www.brilliantsmart.com.au/smart-products/garden/smart-garden-kit/) 
which comes as a kit with 4 LED RGB spotlights, a transformer and the controller.

![Brilliant Smart Wi-Fi RGB Garden Light Kit](/assets/images/Brilliant-Smart-Wi-Fi-RGB-Garden-Light/Brilliant-Smart-Wi-Fi-RGB-Garden-Light.jpg "Brilliant Smart Wi-Fi RGB Garden Light Kit")

## GPIO Pinout

| Pin     | Function      |
|---------|---------------|
| GPIO4   | Red Channel   |
| GPIO12  | Green Channel |
| GPIO14  | Blue Channel  |


## Basic Configuration
```yaml
esphome:
  name: garden_light
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: 'ssid'
  password: 'password'

logger:

web_server:

api:
  password: 'api_password'

ota:
  password: 'ota_password'

light:
  - platform: rgb
    name: "Garden Light"
    red: output_red
    green: output_green
    blue: output_blue
    restore_mode: RESTORE_DEFAULT_OFF

output:
  - platform: esp8266_pwm
    id: output_red
    pin: GPIO4
  - platform: esp8266_pwm
    id: output_green
    pin: GPIO12
  - platform: esp8266_pwm
    id: output_blue
    pin: GPIO14
```
