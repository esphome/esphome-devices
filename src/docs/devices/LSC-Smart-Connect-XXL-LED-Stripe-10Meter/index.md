---
title: LSC Smart Connect 10 meter XXL-LED-Stripe 3202086
date-published: 2024-08-07
type: light
board: bk72xx
standard: eu
---

## General Notes

This configuration is for the [LSC Smart Connect XXL-LED-Stripe 3202086](https://www.action.com/de-at/p/3202086/lsc-smart-connect-xxl-led-streifen/)
which comes as a colour changing LED strip with controller and transformer.

![LSC Smart Connect 10 meter XXL-LED-Stripe 3202086](LSC-Smart-Connect-XXL-LED-Stripe-3202086.png "LSC Smart Connect 10 meter XXL-LED-Stripe 3202086")

## GPIO Pinout

| Pin | Function       |
| --- | -------------- |
| P9  | Cold White     |
| P24 | Warm White     |
| P16 | WS2812         |
| P6  | Power for LEDs |
| P7  | Button         |
| P26 | IR-Receiver    |

```yaml
esphome:
  name: terasse-led-stripe
  comment: LSC Smart Connect XXL-LED-Stripe 3202086
  friendly_name: LSC Smart Connect XXL-LED-Stripe
bk72xx:
  board: generic-bk7231n-qfn32-tuya
logger:
  baud_rate: 0
api: null
ota:
- platform: esphome
web_server: null
wifi:
  ap: null
light:
- platform: cwww
  id: white_light
  name: White Light
  cold_white: output_cw
  warm_white: output_ww
  cold_white_color_temperature: 6500 K
  warm_white_color_temperature: 2700 K
  on_turn_on:
  - light.turn_off: color_light
- platform: beken_spi_led_strip
  id: color_light
  name: Color Light
  pin: P16
  chipset: WS2812
  num_leds: 40
  rgb_order: RBG
  power_supply: led_power
  effects:
  - random: null
  - pulse: null
  - strobe: null
  - flicker: null
  - addressable_rainbow: null
  - addressable_color_wipe: null
  - addressable_scan: null
  - addressable_twinkle: null
  - addressable_random_twinkle: null
  - addressable_fireworks: null
  - addressable_flicker: null
  on_turn_on:
  - light.turn_off: white_light
output:
- platform: libretiny_pwm
  id: output_cw
  pin: P9
  power_supply: led_power
- platform: libretiny_pwm
  id: output_ww
  pin: P24
  power_supply: led_power
power_supply:
  id: led_power
  pin: P6
remote_receiver:
  pin:
    number: P26
    mode:
      input: true
      pullup: true
  dump: all
binary_sensor:
- platform: gpio
  pin:
    number: P7
    inverted: true
    mode:
      input: true
      pullup: true
  name: Button
  on_press:
  - light.toggle: white_light
```
