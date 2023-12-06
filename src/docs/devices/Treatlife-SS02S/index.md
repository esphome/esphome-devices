---
title: Treatlife SS02S 2-Way Wall Switch
date-published: 2023-12-06
type: switch
standard: global
board: bk72xx
---

## Notes

* Based on [Treatlife esp01_1m 2/3-Way Wall-Switch](../Treatlife-Wall-Switch)
* Bought here: <https://amzn.to/3stsGDw>
* Features the BK7231S board (`WB3S` label on the chip)
* Requires disassembly and soldering to flash, see instructions here: <https://youtu.be/-a5hV1y5aIU?t=85>

The 2 way switch does not have a power sense pin. To solve this issue, and allow the smart switch to be smart, this code turns the White LED on when the light is off and, led off when the light is on. This allows the LEDs pin state to be used as a power sense, to determine whether to turn the relay on or off.

Additional notes on flashing via USB with the `esphome` CLI:
- Connect the UART bridge with the board connected to it, to the computer
- Run `esphome upload <configfile>`
- Press and hold the reset button on the board, then select port
- Release the reset button
- If you see errors like `read failed: [Errno 6] Device not configured`, try releasing the button 1-2 seconds later

![BK7231S](BK7231S.jpg "BK7231S, aka WB3S board")

## GPIO Pinout

| Pin | Function                              |
|-----|---------------------------------------|
| P9  | White LED (Power Sensor)              |
| P8  | Status LED                            |
| P24 | Relay 1                               |
| P6  | Button 1                              |

## Basic Configuration

```yaml
substitutions:
  device_name: light_switch #change
  friendly_name: Light Switch #change
  icon: "mdi:light-switch"

  bk72xx:
    board: generic-bk7231t-qfn32-tuya # Ref: https://docs.libretiny.eu/boards/generic-bk7231t-qfn32-tuya/

  esphome:
    name: $device_name

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: true
  ap:
    ssid: ${device_name}
    password: !secret esphome_ap_password

logger:

api:
  encryption:
    key: !secret api_encryption_key

ota:
  password: !secret esphome_ota_password

output:
  - platform: gpio
    id: switch_output
    pin: P24

  - platform: gpio
    id: white_led_output
    pin:
      number: P9

light:
  - platform: binary
    id: ${device_name}
    name: ${friendly_name}
    output: switch_output
    on_turn_on:
      - light.turn_on: white_led
    on_turn_off:
      - light.turn_off: white_led

  - platform: binary
    id: white_led
    output: white_led_output

binary_sensor:
  - platform: gpio
    id: ${device_name}_button
    name: ${friendly_name} Button
    pin:
      number: P6
    on_press:
      - light.toggle: ${device_name}

status_led:
  # Red LED
  pin:
    number: P8
    inverted: yes
```

## Home Assistant light entity (Converts it from a switch to a Light Entity)

```yaml
light:
  - platform: switch
    name: Light Switch
    entity_id: switch.light_switch
```
