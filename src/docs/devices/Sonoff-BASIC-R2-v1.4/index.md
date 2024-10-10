---
title: Sonoff BASIC R2 v1.4
date-published: 2020-11-22
type: relay
standard: global
board: esp8266
---

v1.4 differs from the previous iterations of the Sonoff BASIC in that the two colour LED
is blue and red (opposed to green and red).

This configuration is setup so that when the relay is manually activated via the button
both the blue and red LED are lit (making the LED colour output purple). If the relay
is activated via other means (such as Home Assistant) then it will simply be lit red.

The red side of the LED cannot be individually controlled without modification to the hardware

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO0  | Push Button (HIGH = off, LOW = on) |
| GPIO12 | Relay and its status LED           |
| GPIO13 | Blue LED (HIGH = off, LOW = on)    |
| GPIO3  | RX pin (for external sensors)      |
| GPIO1  | TX pin (for external sensors)      |

## PCB

![alt text](/Sonoff-BASIC-R2-v1.4_pcb.jpg "Sonoff BASIC R2 v1.4 PCB")

![alt text](/Sonoff-BASIC-R2-v1.4_pcb_rear.jpg "Sonoff BASIC R2 v1.4 PCB rear")

### 2023 Model

![alt text](/SonoffBasicR2-2023-Top.jpg "Sonoff BASIC R2 v1.4 PCB 2023 Model")

![alt text](/SonoffBasicR2-2023-Bottom.jpg "Sonoff BASIC R2 v1.4 PCB Rear 2023 Model")

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: sonoff_basic_r2

esp8266:
  board: esp8285

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
api:
ota:

# Device Specific Config
binary_sensor:
  - platform: gpio
    id: push_button
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    internal: true
    on_press:
      # Prevents unintended LED lit states.
      if:
        condition:
          - switch.is_off: relay
        then:
          - switch.turn_on: blue_led
          - switch.turn_on: relay
        else:
          - switch.turn_off: relay

switch:
  # The relay switches on the red side of the LED when active.
  - platform: gpio
    name: "Sonoff Basic Relay"
    pin: GPIO12
    id: relay
    on_turn_off:
      if:
        condition:
          - switch.is_on: blue_led
        then:
          - switch.turn_off: blue_led
  # With this we can control the blue side of the LED.
  - platform: gpio
    id: blue_led
    pin:
      number: GPIO13
      inverted: True
```
