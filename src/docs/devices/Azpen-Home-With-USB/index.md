---
title: Azpen Home with USB port
date-published: 2019-10-21
type: plug
standard: us
board: esp8266
---

## Product Images

Wall side of relay board
![alt text](/WallSide.jpeg "Wall Side of Board")

Socket side of relay board
![alt text](/SocketSide.jpeg "Socket Side of Board")

ESP8266 board
![alt text](/ESPboard.jpeg "ESP board")

GPIO Descriptions
![alt text](/GPIOs.jpeg "GPIO Descriptions")

## GPIO Pinout

| Pin    | Function                   |
| ------ | -------------------------- |
| GPIO0  | BLue Status LED            |
| GPIO4  | USB Relay                  |
| GPIO12 | Mains Relay (with Red LED) |
| GPIO14 | Switch Input               |

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: azpenhome
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

# Enable WEB server for status and updates.
web_server:
  port: 80

# Button on top of plug.
binary_sensor:
  - platform: gpio
    pin:
      number: GPIO14
      mode: INPUT_PULLUP
      inverted: True
    name: "Relay Button"
    on_press:
      - switch.toggle: relay

# Status LED for blue light.
status_led:
  pin:
    number: GPIO0
    inverted: true

switch:
  # Main relay
  - platform: gpio
    name: "Relay"
    pin: GPIO12
    id: relay

  # USB Relay
  - platform: gpio
    name: "USB Relay"
    pin: GPIO4
    id: usbrelay
```
