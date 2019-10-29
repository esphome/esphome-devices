---
title: Brilliant Smart Plug
date-published: 2019-10-12
type: plug
standard: au
---
1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO5   | Relay                              |
| GPIO14  | Push Button (Inverted: true)       |
| GPIO13  | Red LED (Inverted: true)           |


## Basic Configuration
```yaml
# Basic Config
# https://www.brilliantsmart.com.au/smart-products/electrical/wifi-plug-with-usb-charger/
esphome:
  name: brilliant_1
  platform: ESP8266
  board: esp01_1m
  board_flash_mode: dout
  
wifi:
  ssid: 'ssid'
  password: 'password'
  ap:
    ssid: 'brilliant1'
    password: 'ap_password'
  domain: '.xxxxx.com'
  
logger:

web_server:

api:
  password: 'api_password'

ota:
  password: 'ota_password'

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO14
      mode: INPUT_PULLUP
      inverted: True
    name: "Brilliant_1 Button"
    on_press:
      - switch.toggle: relay
  - platform: status
    name: "Brilliant_1 Status"

sensor:
  - platform: wifi_signal
    name: "Brilliant 1 WiFi Signal"
    update_interval: 60s

switch:
  - platform: gpio
    name: "Brilliant_1 Relay"
    pin: GPIO5
    id: 'relay'
  - platform: restart
    name: "Brilliant_1 Restart"
output:
  - platform: esp8266_pwm
    id: brilliant_1_red_led
    pin:
      number: GPIO13
      inverted: True

light:
  - platform: monochromatic
    name: "Brilliant_1  LED"
    output: brilliant_1_red_led
```
