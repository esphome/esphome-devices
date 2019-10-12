---
title: Sonoff TH10
date-published: 2019-10-11
type: plug
standard: au
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO0   | Push Button (HIGH = off, LOW = on) |
| GPIO12  | Relay and Red LED                  |
| GPIO13  | Blue Status LED                    |


## Basic Configuration
```yaml
# Basic Config
esphome:
  name: sonoffth10_1
  platform: ESP8266
  board: esp01_1m
  board_flash_mode: dout
  on_boot:
    priority: -10
    then:
      - light.turn_on: blue_led
wifi:
  ssid: 'ssid'
  password: 'wifi_password'
  ap:
    ssid: 'ap_ssid'
    password: 'ap_password'
  domain: '.domain.com'
  
# Enable logging
logger:

# Enable Home Assistant API
api:
  password: 'api_password'

ota:
  password: 'ota_password'

web_server:

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    name: "Sonoff TH10_1 Button"
    on_press:
      - light.toggle: th10_1_relay
  - platform: status
    name: "Sonoff TH10_1 Status"

sensor:
  - platform: wifi_signal
    name: "Sonoff TH10_1 WiFi Signal"
    update_interval: 60s
switch:
  - platform: restart
    name: "Sonoffth10_1 Restart"
    
output:
  - platform: esp8266_pwm
    id: TH10_1_blue_led
    pin:
      number: GPIO13
      inverted: True
      
  - platform: gpio
    id: relay
    pin: GPIO12 
    
light:
  - platform: monochromatic
    name: "Sonoff TH10_1 blue LED"
    id: blue_led
    output: TH10_1_blue_led
  - platform: binary
    name: "Sonoff TH10_1 Relay"
    id: th10_1_relay
    output: relay
```
