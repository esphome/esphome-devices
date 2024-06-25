---
title: LC-Technology-4-Channel-Relay
date-published: 2022-02-12
type: Relays
standard: eu
board: esp8266
---

Printable enclosure: https://www.printables.com/model/836453-lc-tech-4-relay-esp-01-enclosure

## Basic Configuration with standard switches

```yaml
esphome:
  name: xxx

esp8266:
  board: esp01_1m
  
# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:
  baud_rate: 0 #need this to free up UART pins

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

uart:
  baud_rate: 115200 # speed to STC15L101EW
  tx_pin: GPIO1
  rx_pin: GPIO3
  
switch:
  - platform: template
    name: 'relay1'
    id: relay1
    turn_on_action:
      - uart.write: [0xA0, 0x01, 0x01, 0xA2]
    turn_off_action:
      - uart.write: [0xA0, 0x01, 0x00, 0xA1]
    optimistic: true
  - platform: template
    name: 'relay2'
    id: relay2
    turn_on_action:
      - uart.write: [0xA0, 0x02, 0x01, 0xA3]
    turn_off_action:
      - uart.write: [0xA0, 0x02, 0x00, 0xA2]
    optimistic: true
  - platform: template
    name: 'relay3'
    id: relay3
    turn_on_action:
      - uart.write: [0xA0, 0x03, 0x01, 0xA4]
    turn_off_action:
      - uart.write: [0xA0, 0x03, 0x00, 0xA3]
    optimistic: true
  - platform: template
    name: 'relay4'
    id: relay4
    turn_on_action:
      - uart.write: [0xA0, 0x04, 0x01, 0xA5]
    turn_off_action:
      - uart.write: [0xA0, 0x04, 0x00, 0xA4]
    optimistic: true
```  

## Configuration with momentary switches (push buttons with 1 sek press time)

```yaml
esphome:
  name: xxx

esp8266:
  board: esp01_1m
  
# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:
  baud_rate: 0 #need this to free up UART pins

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

uart:
  baud_rate: 115200 # speed to STC15L101EW
  tx_pin: GPIO1
  rx_pin: GPIO3
  
switch:
  - platform: template
    name: 'relay1'
    id: relay1
    turn_on_action:
      - uart.write: [0xA0, 0x01, 0x01, 0xA2]
    turn_off_action:
      - uart.write: [0xA0, 0x01, 0x00, 0xA1]
    optimistic: true
    on_turn_on:
    - delay: 1000ms
    - switch.turn_off: relay1
  - platform: template
    name: 'relay2'
    id: relay2
    turn_on_action:
      - uart.write: [0xA0, 0x02, 0x01, 0xA3]
    turn_off_action:
      - uart.write: [0xA0, 0x02, 0x00, 0xA2]
    optimistic: true
    on_turn_on:
    - delay: 1000ms
    - switch.turn_off: relay2
  - platform: template
    name: 'relay3'
    id: relay3
    turn_on_action:
      - uart.write: [0xA0, 0x03, 0x01, 0xA4]
    turn_off_action:
      - uart.write: [0xA0, 0x03, 0x00, 0xA3]
    optimistic: true
    on_turn_on:
    - delay: 1000ms
    - switch.turn_off: relay3
  - platform: template
    name: 'relay4'
    id: relay4
    turn_on_action:
      - uart.write: [0xA0, 0x04, 0x01, 0xA5]
    turn_off_action:
      - uart.write: [0xA0, 0x04, 0x00, 0xA4]
    optimistic: true
    on_turn_on:
    - delay: 1000ms
    - switch.turn_off: relay4
```
