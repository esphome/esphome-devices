---
title: Aubess WiFi Smart Switch with Power Monitoring
date-published: 2024-05-06
type: switch
standard: global
board: bk72xx
---
![Product Image](/Aubess-WiFi-Smart-Switch-with-Power-Monitoring.jpg "Product Image")

Maker: <https://aubess.net/>

Also on Aliexpress.

## GPIO Pinout

| Pin    | Function            |
| ------ | ------------------- |
| RX1    | BL0942 Rx           |
| TX1    | BL0942 Tx           |
| P23    | Button              |
| P24    | External Switch     |
| P26    | Relay               |
| P8     | Status Led          |

## Basic Configuration

```yaml

esphome:
  name: aubesspm01
  friendly_name: AubessPM01

bk72xx:
  board: generic-bk7231n-qfn32-tuya
    
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

uart:
  id: uart_bus
  tx_pin: TX1
  rx_pin: RX1
  baud_rate: 4800
  stop_bits: 1

binary_sensor:
  - platform: gpio
    pin:
      number: P23
      mode:
        input: true
        pullup: true
    id: "AubessPM01_button"
    on_press:
      - switch.toggle: aubespm01
  - platform: gpio
    pin:
      number: P24
      mode:
        input: true
        pullup: True
    id: "AubessPM01_switch"
    on_press:
      - switch.toggle: aubespm01
    on_release:
      - switch.toggle: aubespm01

  - platform: status
    name: "Status"

sensor:

- platform: bl0942
    uart_id: uart_bus
    current:
      name: AubessPM01 Current
    voltage:
      name: AubessPM01 Voltage
    power:
      name: AubessPM01 Power
      filters:
        multiply: -1
    energy:
      name: AubessPM01 Energy
    frequency:
      name: AubessPM01 Frequency

button:
  - platform: restart
    name: "Restart"

switch:
  - platform: gpio
    name: "Geyser"
    pin: P26
    id: aubespm01
    icon: mdi:water-boiler
    restore_mode: RESTORE_DEFAULT_OFF

status_led:
  pin:
    number: P8
    inverted: yes

time:
  - platform: homeassistant
    id: homeassistant_time

```
