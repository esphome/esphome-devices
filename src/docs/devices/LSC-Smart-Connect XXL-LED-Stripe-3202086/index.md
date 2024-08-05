---
title: LSC Smart Connect XXL-LED-Stripe 3202086
date-published: 2024-08-05
type: light
board: bk72xx
---

## General Notes

This configuration is for the [LSC Smart Connect XXL-LED-Stripe 3202086](https://www.action.com/de-at/p/3202086/lsc-smart-connect-xxl-led-streifen/)
which comes as a colour changing LED strip with controller and transformer.

![LSC Smart Connect XXL-LED-Stripe 3202086](/LSC-Smart-Connect XXL-LED-Stripe-3202086.png "LSC Smart Connect XXL-LED-Stripe 3202086")

## GPIO Pinout

| Pin    | Function      |
| ------ | ------------- |
| P9     | Cold White    |
| P24    | Warm White    |
| P16    | WS2812        |
| P6     | Power for LEDs|
| P7     | Button        |
| P26    | IR-Receiver   |

```yaml
# LSC Smart Connect XXL-LED-Stripe 3202086

substitutions:
  device_name: terasse-led-stripe
  device_name_letters: terasseLedStripe
  device_description: LSC Smart Connect XXL-LED-Stripe 3202086
  friendly_name: LSC Smart Connect XXL-LED-Stripe 3202086

esphome:
  name: ${device_name}
  comment: ${device_description}
  friendly_name: ${friendly_name}

bk72xx:
  board: generic-bk7231n-qfn32-tuya

# Enable logging
logger:
  baud_rate: 0

# Enable Home Assistant API
api:

ota:
  - platform: esphome

# Enable Web server
web_server:
  port: 80

# Sync time with Home Assistant
time:
  - platform: homeassistant
    id: homeassistant_time

# WiFi connection
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: ${device_name}_fallback
    password: !secret ap_password
    ap_timeout: 1min
  use_address: ${device_name}.lan

captive_portal:

text_sensor:
  - platform: wifi_info
    ip_address:
      name: ESP IP Address
    ssid:
      name: ESP Connected SSID
    bssid:
      name: ESP Connected BSSID
    mac_address:
      name: ESP Mac Wifi Address

light:
  - platform: cwww
    id: white_light
    name: "White Light"
    cold_white: output_cw
    warm_white: output_ww
    cold_white_color_temperature: 6500 K
    warm_white_color_temperature: 2700 K
    on_turn_on:
      - switch.turn_on: LED_Power
      - light.turn_off: color_light
    on_turn_off:
      - if:
          condition:
            light.is_off: color_light
          then:
            - switch.turn_off: LED_Power

  - platform: beken_spi_led_strip
    id: color_light
    name: "Color Light"
    pin: P16
    chipset: WS2812
    num_leds: 40
    rgb_order: RBG
    effects:
     - random:
     - pulse:
     - strobe:
     - flicker:
     - addressable_rainbow:
     - addressable_color_wipe:
     - addressable_scan:
     - addressable_twinkle:
     - addressable_random_twinkle:
     - addressable_fireworks:
     - addressable_flicker:
    on_turn_on:
      - switch.turn_on: LED_Power
      - light.turn_off: white_light
    on_turn_off:
      - if:
          condition:
            light.is_off: white_light
          then:
            - switch.turn_off: LED_Power

output:
  - platform: libretiny_pwm
    id: output_cw
    pin: P9
  - platform: libretiny_pwm
    id: output_ww
    pin: P24

switch:
  # Switch to toggle the relay (Power output)
  - platform: gpio
    name: "LED Power 24V"
    id: LED_Power
    pin: P6
    internal: True

sensor:
    # Uptime sensor
  - platform: uptime
    name: ${friendly_name} Uptime
    unit_of_measurement: minutes
    filters:
      - lambda: return x / 60.0;
  - platform: wifi_signal
    name: ${friendly_name} Signal
    update_interval: 60s
  - platform: internal_temperature
    name: "Internal Temperature"

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
      inverted: True
      mode:
        input: True
        pullup: True
    name: "Button"
    on_press:
      - light.toggle: white_light
```
