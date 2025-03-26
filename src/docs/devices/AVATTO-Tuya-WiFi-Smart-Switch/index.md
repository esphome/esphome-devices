---
title: AVATTO Tuya WiFi/ZigBee Smart Switch Modul
date-published: 2025-03-26
type: misc
standard: global
board: e
---
![Product Image](/AVATTO Tuya WiFi Smart Switch.jpg "Product Image")

## GPIO Pinout

| Pin    | Function           |
| ------ | ------------------ |
| GPIO4  | Blue Status LED    |
| GPIO14 | Remote Transmitter |
| GPIO5  | Remote Receiver    |
| GPIO13 | Reset Button       |

## Configuration

```yaml
# Basic Config
---

# https://esphome.io/devices/esp8266.html
esphome:
  name: "relais1"
  friendly_name: Relais1

substitutions:
  tongou_name: "Relais 1"

bk72xx:
  board: generic-bk7231n-qfn32-tuya

logger:

api:
  encryption:
    key: "jU7XiZS4XO5BPQ/Mj4bQaEXnpsWhpCEGBZ6IwjEYHQM="

ota:
  - platform: esphome
    password: "22200a5f3410b42a38db90fc056f95e3"

#-------------------------------------------------------------------
wifi:
  networks:
  - ssid: !secret wifi_ssid
    password: !secret wifi_password
  - ssid: "powergarage"
    password: "wiedarss"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Fallback"
    password: "123456789"

#-------------------------------------------------------------------

captive_portal:

text_sensor:
  - platform: libretiny
    version:
      name: LibreTiny Version

light:
  - platform: status_led
    internal: true
    name: "State"
    pin:
      number: P6
      inverted: true
    id: led
    restore_mode: ALWAYS_OFF

binary_sensor:
  - platform: gpio
    id: button_onoff
    pin:
      number: P8
      inverted: true
      mode: INPUT_PULLUP
    filters:
     - delayed_on_off: 50ms
    on_press:
      then:
        - switch.toggle: relais
  - platform: gpio
    id: signal_onoff
    pin:
      number: P14
      inverted: true
      mode: INPUT_PULLUP
    filters:
     - delayed_on_off: 50ms
    on_press:
      then:
        - switch.turn_on: relais
    on_release: 
      then:
        - switch.turn_off: relais   

switch:
  - platform: output
    id: relais
    name: "${tongou_name}"
    output: relayoutput
    on_turn_on: 
      then:
        - light.turn_on: led
    on_turn_off: 
      then:
        - light.turn_off: led

output:
  - platform: gpio
    id: relayoutput
    pin: P20

sensor:
  - platform: internal_temperature
    name: "${tongou_name} Internal Temperature"   
```
