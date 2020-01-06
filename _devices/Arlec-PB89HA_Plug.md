---
title: Arlec PCB89HA Power Board
date-published: 2020-01-04
type: plug
standard: au
---
1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO1   | LED (Inverted: true)               |
| GPIO3   | Button (Inverted: true)            |
| GPIO04  | Relay 2                            |
| GPIO05  | Relay 1                            |
| GPIO12  | Relay 4                            |
| GPIO13  | Relay 3                            |

## Basic Configuration

```yaml
# Basic Config
substitutions:
  device_name: "arlec_PCB89HA_1"
  name: "ARLEC PCB89HA"
  
esphome:
  name: ${device_name}
  comment: ${name}
  platform: ESP8266
  board: esp01_1m
  
wifi:
  ssid: 'ssid'
  password: 'password'
  
logger:
  # Important! The status LED and button are on the Pins used by UART0
  hardware_uart: UART1

api:
  password: 'api_password'

ota:
  password: 'ota_password'
  
status_led:
  pin: 
    number: GPIO1
    inverted: True
  
sensor:
  - platform: uptime
    name: ${name} Uptime
    
  - platform: wifi_signal
    name: ${name} Signal
    update_interval: 300s

binary_sensor:
  - platform: gpio
    pin: 
      number: GPIO3
      inverted: True
    name: ${name} button
    internal: True
    on_multi_click:
      # Support a single or double click to switch on each relay
      - timing:
          # Single click
          - ON for at most 1s
          - OFF for at least 0.5s
        then:
          - switch.toggle: relay_a

      - timing:
          # Double click
          - ON for at most 1s
          - OFF for at most 1s
          - ON for at most 1s
          - OFF for at least 0.2s
        then:
          - switch.toggle: relay_b

switch:
  - platform: gpio
    pin: GPIO05
    name: "${name} - A"
    id: relay_a
    restore_mode: always off
    icon: mdi:power-socket-au
          
  - platform: gpio
    pin: GPIO04
    name: "${name} - B"
    id: relay_b
    restore_mode: always off
    icon: mdi:power-socket-au

  - platform: gpio
    pin: GPIO13
    name: "${name} - C"
    id: relay_c
    restore_mode: always off
    icon: mdi:power-socket-au
          
  - platform: gpio
    pin: GPIO12
    name: "${name} - D"
    id: relay_d
    restore_mode: always off
    icon: mdi:power-socket-au
```
