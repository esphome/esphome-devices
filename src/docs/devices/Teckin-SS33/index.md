---
title: Teckin SS33
date-published: 2020-07-17
type: plug
standard: us
board: esp8266
---

## GPIO Pinout

| Pin    | Function    |
| ------ | ----------- |
| GPIO04 | Status LED  |
| GPIO13 | Push Button |
| GPIO12 | Relay 1     |
| GPIO14 | Relay 2     |
| GPIO03 | Relay 3     |

## Basic Configuration

```yaml
# Basic Config
---
esphome:
  name: outdoor_ss33
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
    name: "Outdoor SS33 WiFi signal"
    update_interval: 60s

  - platform: uptime
    name: "Outdoor SS33 uptime"

text_sensor:
  - platform: version
    name: "Outdoor SS33 ESPHome version"

switch:
  - platform: gpio
    name: "Outdoor SS33 relay 1"
    pin: GPIO12
    id: relay1
  - platform: gpio
    name: "Outdoor SS33 relay 2"
    pin: GPIO14
    id: relay2
  - platform: gpio
    name: "Outdoor SS33 relay 3"
    pin: GPIO03
    id: relay3

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO13
      mode: INPUT_PULLUP
      inverted: False
    name: "Outdoor SS33 button"
    on_press:
      - switch.turn_off: relay1
      - switch.turn_off: relay2
      - switch.turn_off: relay3

  - platform: status
    name: "Outdoor SS33 Status"

status_led:
  pin:
    number: GPIO04
```
