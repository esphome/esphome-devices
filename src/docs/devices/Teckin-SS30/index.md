---
title: Teckin SS30
date-published: 2019-10-17
type: plug
standard: us
board: esp8266
---

[Amazon Link](https://amzn.to/3tVURf8)

## GPIO Pinout

| Pin    | Function             |
| ------ | -------------------- |
| GPIO00 | Status LED           |
| GPIO04 | Relay 1 inverted     |
| GPIO05 | Push Button          |
| GPIO12 | Relay 3 inverted     |
| GPIO13 | Relay 2 inverted     |
| GPIO14 | Relay 4 inverted     |
| GPIO16 | Relay 5 not inverted |

## Basic Configuration

```yaml
# Basic Config
---
esphome:
  name: bedroom_ss30
  platform: ESP8266
  board: esp01_1m
    
# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

sensor:
  - platform: wifi_signal
    name: "Bedroom SS30 WiFi signal"
    update_interval: 60s

  - platform: uptime
    name: "Bedroom SS30 uptime"

text_sensor:
  - platform: version
    name: "Bedroom SS30 ESPHome version"

switch:
  - platform: gpio
    name: "Bedroom SS30 relay 1"
    pin: GPIO04
    inverted: yes
    id: relay1
  - platform: gpio
    name: "Bedroom SS30 relay 2"
    pin: GPIO13
    inverted: yes
    id: relay2
  - platform: gpio
    name: "Bedroom SS30 relay 3"
    pin: GPIO12
    inverted: yes
    id: relay3
  - platform: gpio
    name: "Bedroom SS30 relay 4"
    pin: GPIO14
    inverted: yes
    id: relay4
  - platform: gpio
    name: "Bedroom SS30 relay 5"
    pin: GPIO16
    id: relay5

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO5
      mode: INPUT_PULLUP
      inverted: False
    name: "Bedroom SS30 button"
    on_press:
      - switch.turn_off: relay1
      - switch.turn_off: relay2
      - switch.turn_off: relay3
      - switch.turn_off: relay4
      - switch.turn_off: relay5

  - platform: status
    name: "Bedroom SS30 Status"

status_led:
  pin:
    number: GPIO00
```
