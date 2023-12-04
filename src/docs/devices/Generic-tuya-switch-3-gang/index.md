---
title: Generic Tuya Switch 3 Gang UK
date-published: 2023-12-04
type: switch
standard: uk
board: bk72xx
---

The sonoff basic r4 now includes ESP32C3 and a new 'magic switch mode' that can be enabled using custom component by @ssieb

Pinout and pics taken from https://digiblur.com/wiki/devices/relays/sonoff-basic-r4/

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO14  | Button 1  |
| GPIO26 | Button 2     |
| GPIO24 | Button 3                              |
| GPIO7  | Relay 1  |
| GPIO8 | Relay 2     |
| GPIO9 | Relay 3                              |
| GPIO6  | Wifi LED indicator    |

## PCB

![alt text](/Sonoff-BASIC-R2-v1.4_pcb.jpg "Sonoff BASIC R2 v1.4 PCB")

![alt text](/Sonoff-BASIC-R2-v1.4_pcb_rear.jpg "Sonoff BASIC R2 v1.4 PCB rear")

## Basic Configuration

```yaml
substitutions:
  devicename: 3gang-switch-test
  friendlyname: 3g-beken-test

esphome:
  name: $devicename
  friendly_name: $friendlyname 

bk72xx:
  board: generic-bk7231n-qfn32-tuya
  framework:
    version: latest

# Enable logging
logger: 
  
# Enable Home Assistant API
api:

ota:

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "3G-Beken Fallback Hotspot"
    password: !secret ap_password

captive_portal:
  
web_server:
  port: 80

sensor:
  - platform: uptime
    name: $friendlyname Uptime
    update_interval: 60s

switch:
  - platform: gpio
    name: $devicename Switch 1
    pin: GPIO7
    id: relay_1

  - platform: gpio
    name: $devicename Switch 2
    pin: GPIO8
    id: relay_2
    restore_mode: ALWAYS_ON

  - platform: gpio
    name: $devicename Switch 3
    pin: GPIO9
    id: relay_3   

binary_sensor:
  - platform: status
    name: $devicename Status

  - platform: gpio
    pin:
      number: GPIO14
      mode: INPUT_PULLUP
      inverted: True
    name: $devicename Button 1
    on_press:
      - switch.toggle: relay_1

  - platform: gpio
    pin:
      number: GPIO26
      mode: INPUT_PULLUP
      inverted: True
    name: $devicename Button 2
    on_press:
      - switch.toggle: relay_2


  - platform: gpio
    pin:
      number: GPIO24
      mode: INPUT_PULLUP
      inverted: True
    name: $devicename Button 3
    on_press:
      - switch.toggle: relay_3

status_led:
  pin:
    number: GPIO6
    inverted: False
```

Decoupled mode & toggle/dimming lights via homeassistant


Decoupled mode & toggle/dimming lights using device group.
