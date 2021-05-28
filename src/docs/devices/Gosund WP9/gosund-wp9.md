![alt text](https://images-na.ssl-images-amazon.com/images/I/61z-XZpjbxL._AC_SL1500_.jpg "Gosund WP9 Power Strip")

---
title: Gosund WP9 Power Strip
date-published: 2021-05-28
type: plug
standard: uk, us
---

substitutions:
  name: power_strip
  upper_name: Power Strip
  platform: ESP8266
  board: esp01_1m


esphome:
  name: $name
  platform: $platform
  board: $board


<<: !include ../secrets.yaml


binary_sensor:
  - platform: gpio
    pin:
      number: GPIO16
      mode: INPUT_PULLUP
      inverted: yes
    name: "${upper_name} Power Button"
    id: "${name}_power_button"
    on_press:
      then:
        - switch.toggle: "${name}_usb"
        - switch.toggle: "${name}_switch1"
        - switch.toggle: "${name}_switch2"
        - switch.toggle: "${name}_switch3"



switch:
  - platform: gpio
    name: "${upper_name} Switch1"
    id: "${name}_switch1"
    pin: GPIO14
    restore_mode: "RESTORE_DEFAULT_ON"    
  - platform: gpio
    name: "${upper_name} Switch2"
    id: "${name}_switch2"
    pin: GPIO12
    restore_mode: "RESTORE_DEFAULT_ON"    
  - platform: gpio
    name: "${upper_name} Switch3"
    id: "${name}_switch3"
    pin: GPIO13
    restore_mode: "RESTORE_DEFAULT_ON"    
  - platform: gpio
    name: "${upper_name} usb"
    id: "${name}_usb"
    pin: GPIO05
    restore_mode: "RESTORE_DEFAULT_ON"    
    on_turn_on:
      - switch.turn_on: led
    on_turn_off:
      - switch.turn_off: led
  - platform: gpio
    id: led
    pin: GPIO0
    inverted: no
