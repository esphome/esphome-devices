---
title: Deta Grid Connect Smart Double Touch Power Point
date-published: 2020-11-19
type: plug
standard: au
---

## Deta Grid Connect Smart Double Touch Power Point

Sold by [Bunnings Wharehouse](https://www.bunnings.com.au/deta-grid-connect-smart-double-touch-power-point_p0098813) this is a AU/NZ standard wall outlet/powerpoint.
It is Tuya based and therefore compatible with ESPhome

## Basic Configuration

```yaml
substitutions:
  device_name: deta_double_powerpoint
  friendly_name: "Deta Double Powerpoint"
  device_ip: 192.168.0.x

#################################

esphome:
  platform: ESP8266
  board: esp01_1m
  name: ${device_name}
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  manual_ip:
    static_ip: ${device_ip}
    gateway: 192.168.0.1
    subnet: 255.255.255.0
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ESPHOME"
    password: "12345678"

api:
  password: !secret api_password

ota:
  password: !secret ota_password

logger:

web_server:
  port: 80

sensor:
  - platform: uptime
    name: ${device_name} Uptime

  - platform: wifi_signal
    name: ${device_name} Wifi Signal
    update_interval: 60s

text_sensor:  
  - platform: version
    name: ${device_name} ESPhome Version
  - platform: wifi_info
    ip_address:
      name: ${device_name} IP

#################################

output:
  - platform: esp8266_pwm
    id: blue_led_output
    pin:
      number: GPIO04
      inverted: True

light:
  - platform: monochromatic
    name: ${device_name} Blue LED
    output: blue_led_output
    id: blue_led
    internal: True

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO16
      inverted: True
    id: button
    name: ${device_name} Button 1
    on_press:
      - switch.toggle: relay_template1
    internal: True
  - platform: gpio
    pin:
      number: GPIO12
      inverted: True
    id: button
    name: ${device_name} Button 2
    on_press:
      - switch.toggle: relay_template2
    internal: True

switch:
  - platform: gpio
    pin: GPIO13
    id: relay1

  - platform: gpio
    pin: GPIO14
    id: relay2

  # tie the led & relay operation together and report status based on relay state
  - platform: template
    name: ${device_name} Relay
    id: relay_template1
    lambda: |-
      if (id(relay1).state) {
        return true;
      } else {
        return false;
      }
    turn_on_action:
      - light.turn_on: blue_led
      - switch.turn_on: relay1
    turn_off_action:
      - light.turn_off: blue_led
      - switch.turn_off: relay1

  - platform: template
    name: ${device_name} Relay
    id: relay_template2
    lambda: |-
      if (id(relay2).state) {
        return true;
      } else {
        return false;
      }
    turn_on_action:
      - light.turn_on: blue_led
      - switch.turn_on: relay2
    turn_off_action:
      - light.turn_off: blue_led
      - switch.turn_off: relay2
```
