---
title: LSC Smart Connect Switch
date-published: 2019-12-11
type: plug
standard: eu
---

1. TOC
{:toc}

## Notice

- This plug is flashable using the latest tuya-convert with a compiled ESPHome binary

## Product Images

![plug with box](https://www.action.com/globalassets/cmsarticleimages/79/77/2578677_8712879142799-111.png?preset=mediaSliderImageLargeHD)
![plug](https://www.action.com/globalassets/cmsarticleimages/79/78/2578677_8712879142799-110_02.png?preset=mediaSliderImageLargeHD)

## GPIO Pinout

| Pin     | Function                            |
|---------|-------------------------------------|
| GPIO4   | LED (on: 0 /off: 1)                 |
| GPIO12  | Relay (on: 1 /off: 0)               |
| GPIO14  | Switch/button (pressed: 0 / off: 1) |

## Basic configuration

```yml
esphome:
  name: lsc_smart_connect_node_bedroom
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

api:
logger:
ota:

binary_sensor:
  - platform: status
    name: "LSC Smart Connect Bedroom Status"
  - platform: gpio
    pin:
      number: GPIO14
      mode: INPUT_PULLUP
      inverted: true
    name: "LSC Smart Connect Power Button"
    internal: true
    on_press:
      - switch.toggle: relay

output:
  - platform: esp8266_pwm
    id: led
    pin:
      number: GPIO4
      inverted: true

light:
  - platform: monochromatic
    id: status_led
    name: "LSC Smart Connect Bedroom Light"
    output: led

switch:
  - platform: gpio
    id: relay
    pin: GPIO12
  - platform: template
    name: "LSC Smart Connect Bedroom Relay"
    optimistic: true
    id: relay_and_light
    turn_on_action:
      - switch.turn_on: relay
      - light.turn_on: status_led
    turn_off_action:
      - switch.turn_off: relay
      - light.turn_off: status_led
```

> Configuration and details from this blogpost: [https://thibmaek.com/post/flashing-esphome-to-lsc-smart-connect-action-switches-power-plugs](https://thibmaek.com/post/flashing-esphome-to-lsc-smart-connect-action-switches-power-plugs)
