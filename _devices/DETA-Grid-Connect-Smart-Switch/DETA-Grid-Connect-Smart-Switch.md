---
title: DETA Grid Connect Smart Switch (Single / Double)
date-published: 2020-02-05
type: switch
standard: au
---

1. TOC
{:toc}

## General Notes
The DETA [Smart Single Switch (6911HA)](https://www.bunnings.com.au/deta-smart-single-gang-light-switch-touch-activated-with-grid-connect_p0098811) and [Smart Double Switch (6912HA)](https://www.bunnings.com.au/deta-smart-double-gang-light-switch-touch-activated-with-grid-connect_p0098812) are made by Arlec as part of the [Grid Connect ecosystem](https://grid-connect.com.au/), and are sold at Bunnings in Australia and New Zealand.  They can be flashed without disassembly or soldering [using tuya-convert](#tuya-convert).

[Triple](https://www.bunnings.com.au/deta-smart-touch-activated-triple-gang-light-switch-with-grid-connect_p0161014) and [quadruple](https://www.bunnings.com.au/deta-smart-touch-activated-quad-gang-light-switch-with-grid-connect_p0161015) variants also appear to be available in Australia, but not currently in New Zealand.  Given that the double uses the same pins as the single, it is likely that the triple and quadruple variants also share their pin configurations for the first two switches - but this has not been confirmed.

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO4   | Status LED *(inverted)*            |
| GPIO12  | Button, Bottom                     |
| GPIO13  | Relay, Top *(includes LED)*        |
| GPIO14  | Relay, Bottom *(includes LED)*     |
| GPIO16  | Button, Top                        |

Note that each relay shares a pin with its associated LED; it's not possible to turn either relay on/off independently of its button LED.
The top/bottom designation here assumes that it is installed vertically, with the status LED (group of 6 dots) on the right-hand side.

## Getting it up and running
### Tuya Convert
These switches are Tuya devices, so if you don't want to open them up to flash directly, you can [use tuya-convert to initially get ESPHome onto them](/guides/tuya-convert/).  After that, you can use ESPHome's OTA functionality to make any further changes.

- Put the switch into "smartconfig" / "autoconfig" / pairing mode by holding any button for about 5 seconds.
- The status LED (to the side of the button(s)) blinks rapidly to confirm that it has entered pairing mode.

## Basic Configuration
```yaml
substitutions:
  device_name: esphome_dining_room_switch
  friendly_name: "Dining Room Switch"

#################################

esphome:
  platform: ESP8266
  board: esp01_1m
  name: ${device_name}
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_pwd
  fast_connect: on

api:
  password: !secret api_password

ota:
  password: !secret ota_password

logger:

#################################

status_led:
  pin:
    number: GPIO4
    inverted: True

output:
  # Top (or only) button
  - platform: gpio
    pin: GPIO13
    id: relay1

  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: gpio
    pin: GPIO14
    id: relay2

light:
  # Top (or only) button
  - platform: binary
    name: "${friendly_name} Top"
    output: relay1
    id: light1

  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: binary
    name: "${friendly_name} Bottom"
    output: relay2
    id: light2

# Buttons
binary_sensor:
  # Top (or only) button
  - platform: gpio
    pin:
      number: GPIO16
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} Top Button"
    #toggle relay on push
    on_press:
      - light.toggle: light1

  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: gpio
    pin:
      number: GPIO12
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} Bottom Button"
    #toggle relay on push
    on_press:
      - light.toggle: light2

switch:
- platform: restart
  name: "${friendly_name} REBOOT"

```
