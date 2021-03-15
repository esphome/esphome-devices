---
title: Gosund P1
date-published: 2021-03-15
type: plug
standard: eu
---

```yaml
esphome:
  name: power-strip-1
  platform: ESP8266
  board: esp8285

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_pass

ota:

api:
  reboot_timeout: 1min

status_led:
  pin:
    number: GPIO02
    inverted: True

uart:
  rx_pin: GPIO03
  tx_pin: GPIO01
  baud_rate: 4800

switch:
- platform: gpio
  name: PS-1 Socket 1
  id: socket_1
  pin: GPIO14
- platform: gpio
  name: PS-1 Socket 2
  id: socket_2
  pin: GPIO12
- platform: gpio
  name: PS-1 Socket 3
  id: socket_3
  pin: GPIO13
- platform: gpio
  name: PS-1 USBs
  id: socket_usb
  pin:
    number: GPIO05
    inverted: True

sensor:
- platform: cse7766
  current:
    name: "PS1 Current"
  voltage:
    name: "PS1 Voltage"
    filters:
    - calibrate_linear:
      - 0.7 -> 0.0
      - 97.5 -> 231.5
  power:
    name: "PS1 Power"
    filters:
    - calibrate_linear:
      - 0.0 -> 0
      - 290 -> 690
      - 490 -> 1170
    - lambda: "return x < 2 ? 0 : x;"
  update_interval: 3s

- platform: adc
  pin: A0
  id: socket_buttons
  update_interval: 50ms
  on_value_range:
    - below: 0.33
      then:
        - switch.toggle: socket_3
    - above: 0.33
      below: 0.67
      then:
        - switch.toggle: socket_2
    - above: 0.67
      below: 0.88
      then:
        - switch.toggle: socket_1

binary_sensor:
- platform: gpio
  pin: GPIO16
  id: power_button
  on_press:
    then:
      - switch.toggle: socket_usb

output:
  - platform: esp8266_pwm
    id: state_led
    pin:
      number: GPIO0
      inverted: true

light:
  - platform: monochromatic
    output: state_led
    id: state_light

```