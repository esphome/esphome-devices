---
title: LEDVANCE E27 DIM Light 806lm
date-published: 2025-03-21
type: light
standard: eu
board: bk72xx
---

Product ID: AC33908

Can be flashed with esphome kickstart via [tuya-cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter)!

## Product Images

![LEDVANCE E27 DIM Light](ledvance-e27-dim.jpg "LEDVANCE E27 DIM Light")

## GPIO Pinout

| Function      | GPIO-Pin |
| ------------- | -------- |
| PWM_brighness | P9       |

## Basic Configuration

```yaml
esphome:
  name: ledvance-e27-dim
  comment: LEDVANCE E27 DIM Bulb
  friendly_name: LEDVANCE E27 DIM Bulb
bk72xx:
  board: generic-bk7231t-qfn32-tuya
logger:
  baud_rate: 0
api: null
ota:
- platform: esphome
wifi:
  ap: null
web_server: null
output:
- platform: libretiny_pwm
  id: output_brightness
  pin: P9
light:
- platform: monochromatic
  name: None
  output: output_brightness
  effects:
  - flicker:
      name: Flicker
  - pulse:
      name: Pulse
```
