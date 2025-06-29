---
title: UltraPro WFD4001 Light Switch
date-published: 2025-06-28
type: switch
standard: us
board: bk72xx
pcb: WB3S
---
![Product Image](./ultrapro-wfd4001-light-switch-v1.1.14.jpg "Device front")

## GPIO Pinout

| Pin | Alternate Pin Name | Function   | Active |
| --- | ------------------ | ---------- | ------ |
| P8  | PWM2               | On Button  | Low    |
| P9  | PWM3               | Off Button | Low    |
| P24 | PWM4               | Status Led | High   |
| P6  | PWM5               | Relay      | High   |

## Basic Configuration

```yaml
# You should only need to modify the substitutions.
substitutions:
  device_name: back-door-lights
  friendly_name: Back Door Lights

# Nothing below should need modification.
esphome:
  name: ${device_name}
  friendly_name: ${friendly_name}

bk72xx:
  board: wb3s

logger:
api:
captive_portal:
ota:

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:

output:
  - platform: libretiny_pwm
    id: output_blue_led
    pin: PWM4
switch:
  - platform: gpio
    pin: PWM5
    id: relay
    name: None
    restore_mode: RESTORE_DEFAULT_OFF
    device_class: switch
binary_sensor:
  - platform: gpio
    pin:
      number: PWM2
      inverted: True # The on button is active low.
    id: input_on_button
    on_press:
      then:
        - light.turn_on: blue_led
        - switch.turn_on: relay
  - platform: gpio
    pin:
      number: PWM3
      inverted: True # The off button is active low.
    id: input_off_button
    on_press:
      then:
        - light.turn_off: blue_led
        - switch.turn_off: relay
light:
  - platform: status_led
    id: blue_led
    name: Blue LED
    output: output_blue_led
    disabled_by_default: True
    restore_mode: RESTORE_DEFAULT_OFF
```
