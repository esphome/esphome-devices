---
title: Mirabella Genio Door & Window Sensor 
date-published: 2020-01-26
type: sensor
standard: global
board: esp8266
---


## General Notes

This is for [Mirabella Genio Door & Window Sensor](https://www.mirabellagenio.com.au/product-range/mirabella-genio-wi-fi-door-and-window-sensor/).

The "updated for 2024" [sb1_uart.h](/sb1_uart.h) must be added to your Home Assistant /config/esphome directory for a succesful compile.

Credit to [Brandon D](https://github.com/brandond) for the original (2020-version) [sb1_uart.h](https://github.com/brandond/esphome-tuya_pir/blob/master/sb1_uart.h) file and esphome config.

![Mirabella Genio Door & Window Sensor](/Mirabella-Door-Window-Sensor.jpg "Mirabella Genio Door & Window Sensor")

## Basic Configuration

```yaml
substitutions:
  friendly_name: 'A Special Door'
  name: 'a-special-sensor'

esphome:
  friendly_name: ${friendly_name}
  name: ${name}
  includes:
    - sb1_uart.h

esp8266:
  board: esp01_1m
  board_flash_mode: dout

logger:
  level: INFO
  hardware_uart: UART1

ota:
  platform: esphome # Use the default esphome OTA

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: true

# Enable Home Assistant API
api:
  encryption:
    key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" # PLACEHOLDER

mqtt:
  broker: 'x.x.x.x' # PLACEHOLDER
  username: !secret mqtt_user
  password: !secret mqtt_pass
  birth_message:
  shutdown_message:
  will_message:

uart:
  - tx_pin: 1
    rx_pin: 3
    baud_rate: 9600
    id: uart01 # This needed a unique name
  
sensor:
  - platform: uptime
    name: "${friendly_name} Uptime"
  - platform: wifi_signal
    name: "${friendly_name} WiFi Signal"
    update_interval: never
    expire_after:
    filters: []
  - platform: adc
    name: "${friendly_name} Battery"
    update_interval: 1s
    expire_after:
    pin: VCC
    filters:
      - calibrate_linear:
          # Map volts (from sensor) to % (for HA)
          - 2.8 -> 0.0
          - 3.6 -> 100
    unit_of_measurement: "%"
    accuracy_decimals: 0

binary_sensor:
  - platform: template
    id: door
    name: "${friendly_name} Sensor"
    filters: []
    device_class: door
    lambda: "return {};"

custom_component:
  - id: sb1_uart
    lambda: |-
      auto component = new SB1UARTComponent(id(uart01), id(door));
      return {component};
```
