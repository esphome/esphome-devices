---
title: 15W A70 Mirabella Genio White Bulb
date-published: 2020-04-23
type: light
standard: au
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO5   | Light                              |


## Basic Configuration
```yaml
# Basic Config
# https://mirabellagenio.net.au/wi-fi-led-a70-1400-lumen
esphome:
  name: mirabella_1
  platform: ESP8266
  board: esp01_1m
  on_boot:
    priority: 100 # Highest priority, ensures light turns on without delay.
    then:
      - light.turn_on: light
wifi:
  ssid: 'sid'
  password: 'wifi_password'
  ap:
    ssid: 'mirabella1'
    password: 'ap_password'
  domain: '.mydomain.com'
  
# Enable logging
logger:

# Enable Home Assistant API
api:
  password: 'api_password'

ota:
  password: 'ota_password'

web_server:
  port: 80
sensor:
  - platform: wifi_signal
    name: "Mirabella 1 WiFi Signal"
    update_interval: 60s
    
switch:
  - platform: restart
    name: "Mirabella 1 Restart"
    
output:
  - platform: esp8266_pwm
    id: output1
    pin: GPIO5

light:
  - platform: monochromatic
    name: "Mirabella_1 Light"
    output: output1
    id: light
```
