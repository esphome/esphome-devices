---
title: Globe Electric Wi-Fi Smart Plug 50359
date-published: 2023-05-05
type: plug
standard: us
made-for-esphome: false
difficulty: 2
---

![alt text](globe1.jpg "Globe 50359 Back")
![alt text](globe2.jpg "Globe 50359 Side")
![alt text](globe3.jpg "Globe 50359 Side")

Sold at Costco model (**_50207_**)

## Custom Firmware Needed

This device uses the WB2S module that comes with Tuya firmware which can be flashed to esphome using cloudcutter following instructions [here](https://digiblur.com/2023/04/10/tuya-cloudcutter-with-esphome-how-to-guide/)

This requires a custom fork of esphome to complie the firmware for the WB2S module (<https://github.com/esphome/esphome/pull/3509>) as it is not natively support by esphome yet

## GPIO Pinout

Due to the fact that this uses a custom esphome firmware the pin numbers start with a P instead of the usual GPIO

| Pin | Name   | Function     |
| --- | ------ | ------------ |
| P7  | LED    | Status LED   |
| P26 | Button | Power Button |
| P24 | Outlet | Relay        |

## Basic Configuration

```yaml
# Globe Electric 50329 smart plug
substitutions:
  number: "1"
  device_name: globe-plug-${number}
  device_description: Globe Electric 50329 Smart plug
  friendly_name: Globe Plug ${number}

esphome:
  name: ${device_name}
  comment: ${device_description}

libretiny:
  board: generic-bk7231t-qfn32-tuya
  framework:
    version: dev

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "YOUR KEY HERE"

web_server:
  port: 80
  auth:
    username: admin
    password: !secret web_server_password

ota:
  password: !secret ota_password

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

text_sensor:
  - platform: wifi_info
    ip_address:
      name: ESP IP Address
    ssid:
      name: ESP Connected SSID
    bssid:
      name: ESP Connected BSSID
    mac_address:
      name: ESP Mac Wifi Address

time:
  - platform: homeassistant
    id: homeassistant_time

sensor:
  - platform: uptime
    name: ${friendly_name} Uptime
    unit_of_measurement: minutes
    filters:
      - lambda: return x / 60.0;

  - platform: wifi_signal
    name: ${friendly_name} Signal
    update_interval: 60s

light:
  - platform: status_led
    name: "led"
    internal: true
    id: led
    pin:
      number: P7
      inverted: true

binary_sensor:
  - platform: gpio
    pin:
      number: P26
      inverted: true
    id: button1
    filters:
      - delayed_on: 10ms
      - delayed_off: 10ms
    on_click:
      - switch.toggle: outlet

  - platform: status
    name: ${friendly_name} status

switch:
  - platform: gpio
    name: ${friendly_name} Outlet
    id: outlet
    pin: P24
    icon: mdi:power-socket-us
    on_turn_on:
      - light.turn_on: led
    on_turn_off:
      - light.turn_off: led
```
