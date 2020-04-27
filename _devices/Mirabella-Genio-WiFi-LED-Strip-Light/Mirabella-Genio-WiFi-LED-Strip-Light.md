---
title: Mirabella Genio Wi-Fi Strip Light 
date-published: 2020-01-24
type: light
standard: au
---

1. TOC

## General Notes
This is for [Mirabella Genio Wi-Fi LED Strip Light](https://mirabellagenio.net.au/led-strip-light). 


![Genio Wi-Fi LED Strip Light](/Mirabella-Genio-WiFi-LED-Strip-Light.jpg "Genio Wi-Fi LED Strip Light")


## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|          
| GPIO0   | Push Button                        |
| GPIO4   | Light - Red                        |
| GPIO5   | Light - White                      |
| GPIO12  | Light - Green                      |
| GPIO14  | Light - Blue                       |



## Basic Configuration
```yaml
# Basic Config
# https://mirabellagenio.net.au/led-strip-light
esphome:
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: 'sid'
  password: 'wifi_password'
  ap:
    ssid: 'strip_light'
    password: 'ap_password'
  
# Enable logging
logger:

# Enable Home Assistant API
api:
  password: 'api_password'

ota:
  password: 'ota_password'
    
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
  - platform: esp8266_pwm
    id: output_white
    pin: GPIO5

light:
  - platform: rgbw
    name: "Strip Light"
    id: strip_light
    red: output_red
    green: output_green
    blue: output_blue
    white: output_white

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: true
    name: "strip_light_pushbutton"
    internal: true
    on_press:
      then:
        - light.toggle: strip_light
```
