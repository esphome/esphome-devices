---
title: Ilonda Wifi Smart Fish Feeder (L88)
date-published: 2023-04-11
type: misc
standard: global
board: esp8266
---

Ilonda Wifi Smart Fish Feeder (L88) is a Tuya-based device sold by
Amazon (not only under Ilonda, but also under other brand names).

![image](/ilonda-wifi-smart-fish-feeder.jpg)

Originally intended to be used with its companion app, once flashed
using [tuya-convert](https://github.com/ct-Open-Source/tuya-convert),
ESPHome generated firmware can be uploaded allowing you to control the
Wifi Smart Fish Feeder via Home Assistant.

## Configuration

Thanks to the amazing [Tasmota
template](https://templates.blakadder.com/ilonda_L88.html), managed to
build a fully working esphome configuration. This assumes you have a
secret.yaml with ssid and password keys.

``` yaml
esphome:
  name: wifi_smart_fish_feeder

esp8266:
  board: esp01_1m
  
# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

# Binary Sensor to allow relay to be switched when physical button is pressed
binary_sensor:
  - platform: gpio
    id: button
    pin:
      number: GPIO4
      mode:
        input: true
        pullup: true
      inverted: True
    name: 'Switch feeder'
    on_press:
      - switch.turn_on: relay

  - platform: status
    name: "Status"

switch:
# Switch to turn feeder on for 3 seconds/off and turn on/off LED
  - platform: gpio
    name: 'Relay feeder'
    id: relay
    pin: GPIO14
    on_turn_on:
      - light.turn_on: led
      - delay: 3s
      - switch.turn_off: relay
      - light.turn_off: led
    restore_mode: ALWAYS_OFF

sensor:
# Feeder counter
  - platform: pulse_meter
    pin: GPIO12
    name: 'Counter/min'
    unit_of_measurement: 'time(s)'
    internal: true
    total:
      unit_of_measurement: 'time(s)'
      name: 'Counter feeder'

# To allow led to be controlled via GPIO
output:
  - platform: esp8266_pwm
    id: blue_led
    pin:
      number: GPIO5
      inverted: true

# LED control
light:
  - platform: monochromatic
    output: blue_led
    id: led
```

You can now add your Wifi Smart Fish Feeder to Home Assistant via the
configurations page, look for \'ESPHome\' under the Integrations option
and click \'Configure\'.

## See Also

- [Fish Feeder diagrams and pictures](https://community.openhab.org/t/ilonda-fish-feeder-openhab/99190).
