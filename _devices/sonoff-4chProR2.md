---
title: Sonoff 4CH Pro R2
date-published: 2019-10-11
type: relay
standard: global
---
1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                             |
|---------|--------------------------------------|
| GPIO0   | Push Button 1 (HIGH = off, LOW = on) |
| GPIO9   | Push Button 2 (HIGH = off, LOW = on) |
| GPIO10  | Push Button 3 (HIGH = off, LOW = on) |
| GPIO14  | Push Button 4 (HIGH = off, LOW = on) |
| GPIO12  | Relay 1 and its status LED           |
| GPIO5   | Relay 2 and its status LED           |
| GPIO4   | Relay 3 and its status LED           |
| GPIO15  | Relay 4 and its status LED           |
| GPIO13  | Blue LED (HIGH = off, LOW = on)      |


## Basic Configuration
```yaml
# Basic Config
esphome:
  name: sonoff_4chpror2
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
api:
ota:

# Device Specific Config
binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    name: "Sonoff S31 Button"
    on_press:
      - switch.toggle: relay
  - platform: status
    name: "Sonoff S31 Status"

sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    name: "Button 1"
  - platform: gpio
    pin:
      number: GPIO9
      mode: INPUT_PULLUP
      inverted: True
    name: "Button 2"
  - platform: gpio
    pin:
      number: GPIO10
      mode: INPUT_PULLUP
      inverted: True
    name: "Button 3"
  - platform: gpio
    pin:
      number: GPIO14
      mode: INPUT_PULLUP
      inverted: True
    name: "Button 4"
switch:
  - platform: gpio
    name: "Relay 1"
    pin: GPIO12
  - platform: gpio
    name: "Relay 2"
    pin: GPIO5
  - platform: gpio
    name: "Relay 3"
    pin: GPIO4
  - platform: gpio
    name: "Relay 4"
    pin: GPIO15

output:
  - platform: esp8266_pwm
    id: blue_led
    pin: GPIO13
    inverted: True

light:
  - platform: monochromatic
    name: "Blue LED"
    output: blue_led
```
