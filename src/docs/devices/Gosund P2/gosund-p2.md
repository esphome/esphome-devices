![alt text](https://images-na.ssl-images-amazon.com/images/I/51lDoX42PVL._AC_SL1500_.jpg "Gosund P2 Power Strip")

---
title: Gosund P2 Power Strip
date-published: 2021-05-28
type: plug
standard: uk, us
---

substitutions:
  name: plug_strip_2
  upper_name: Plug Strip 2
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
    name: "Wall ${upper_name} Switch1"
    id: "${name}_switch1"
    pin: GPIO12
    inverted: no
    restore_mode: "RESTORE_DEFAULT_ON"    
  - platform: gpio
    name: "Wall ${upper_name} Switch2"
    id: "${name}_switch2"
    pin: GPIO13
    inverted: no
    restore_mode: "RESTORE_DEFAULT_ON"    
  - platform: gpio
    name: "Wall ${upper_name} Switch3"
    id: "${name}_switch3"
    pin: GPIO14
    inverted: no
    restore_mode: "RESTORE_DEFAULT_ON"    
  - platform: gpio
    name: "Wall ${upper_name} usb"
    id: "${name}_usb"
    pin: GPIO05
    inverted: no
    on_turn_on:
      - switch.turn_on: ledwhite
      - switch.turn_on: ledblue
    on_turn_off:
      - switch.turn_off: ledwhite
      - switch.turn_off: ledblue
  - platform: gpio
    id: ledwhite
    pin: GPIO0
    inverted: no
  - platform: gpio
    id: ledblue
    pin: GPIO2
    inverted: no
