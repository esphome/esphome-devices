
---
title: Aukey SH-PA1 Wi-Fi Smart Plug
date-published: 2020-04-11
type: plug
standard: us
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO0   | Red LED (inverted)                 |
| GPIO2   | Blue LED (inverted)                |
| GPIO13  | Push Button                        |
| GPIO15  | Relay                              |

## Basic Configuration

```yaml

# Basic Config
esphome:
  name: mini_tree
  platform: ESP8266
  board: esp01_1m
  platformio_options:
    upload_speed: 115200

wifi:
  ssid: 'ssid'
  password: 'password'

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Fallback AP"
    password: 'fallback ap password'

captive_portal:

# Enable logging
logger:

# Enable Home Assistant API
api:
  password: 'api_password'
ota:
  password: 'ota_password'

output:
  - platform: gpio
    pin: GPIO15
    id: plug_outlet
    
  - platform: gpio
    pin:
      number: GPIO2
      inverted: yes
    id: blue_led

light:
  - platform: binary
    name: "Mini Tree"
    id: mini_tree
    output: plug_outlet

binary_sensor:
  - platform: gpio
    pin: 
      number: GPIO13
    id: mini_tree_button
    on_press:
      light.toggle: mini_tree
      
  - platform: gpio
    pin: GPIO15
    id: blue_led_follows_the_relay
    on_state:
      then:
        - if:
            condition:
              light.is_on: mini_tree
            then:
              - output.turn_on: blue_led
            else:
              - output.turn_off: blue_led

status_led:
  # Red LED
  pin:
    number: GPIO0
    inverted: yes

```

![alt text](/assets/images/Aukey-SH-PA1-Smart-Plug/aukey-plug.jpg "Aukey SH-PA1 Smart WiFi Plug")
