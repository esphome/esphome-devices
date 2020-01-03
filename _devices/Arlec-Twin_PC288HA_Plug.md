---
title: Arlec Twin PC288HA Plug
date-published: 2020-01-04
type: plug
standard: au
---
1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO1   | Button (Inverted: true)            |
| GPIO03  | Relay 2                            |
| GPIO13  | Blue LED (Inverted: true)          |
| GPIO14  | Relay 1                            |

## Basic Configuration

```yaml
# Basic Config
substitutions:
  device_name: "arlec_PC288HA_1"
  name: "ARLEC PC288HA 1"
  
esphome:
  name: ${device_name}
  comment: ${name}
  platform: ESP8266
  board: esp01_1m
  
wifi:
  ssid: 'ssid'
  password: 'password'
  ap:
    ssid: 'arlec_PC288HA_1'
    password: 'ap_password'
  domain: '.xxxxx.com'
  
logger:

web_server:

api:
  password: 'api_password'

ota:
  password: 'ota_password'

sensor:
  - platform: uptime
    name: ${name} Uptime
    
  - platform: wifi_signal
    name: ${name} Signal
    update_interval: 300s

binary_sensor:
  - platform: gpio
    pin: 
      number: GPIO1
      inverted: True
    name: ctrl
    on_press:
      - switch.toggle: switch_a

switch:
  - platform: gpio
    id: led
    pin: GPIO13
    
  - platform: gpio
    pin: GPIO14
    name: "${name} - A"
    id: switch_a
    on_turn_on:
      - switch.turn_off: led
    on_turn_off:
      - switch.turn_on: led
    
  - platform: gpio
    pin: GPIO03
    name: "${name} - B"
    id: switch_b

```
