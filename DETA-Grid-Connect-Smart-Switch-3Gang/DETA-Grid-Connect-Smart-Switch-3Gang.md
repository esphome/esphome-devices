---
title: DETA Grid Connect Smart Switch (3Gang)
date-published: 2020-07-21
type: switch
standard: au
---

1. TOC
{:toc}

## General Notes

The DETA [Smart Triple Switch (6903HA)](https://www.bunnings.com.au/deta-grid-connect-smart-triple-gang-touch-light-switch_p0161014) is made by Arlec as part of the [Grid Connect ecosystem](https://grid-connect.com.au/), and are sold at Bunnings in Australia and New Zealand.  Note that the 3 Gang switch does NOT work with TUYA Convert at this stage, you will need to revert to a serial based flash. [Flash instructions here](https://blog.mikejmcguire.com/2020/05/22/deta-grid-connect-3-and-4-gang-light-switches-and-home-assistant/)

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO4   | Status LED *(inverted)*            |
| GPIO16  | Button1, Bottom                    |
| GPIO04  | Button2, Bottom                    |
| GPIO03  | Button3, Bottom                    |
| GPIO05  | Relay1, Top *(includes LED)*       |
| GPIO14  | Relay2, Top *(includes LED)*       |
| GPIO12  | Relay3, Top *(includes LED)*       |

Note that each relay shares a pin with its associated LED; it's not possible to turn either relay on/off independently of its button LED.
The top/bottom designation here assumes that it is installed vertically, with the status LED (group of 6 dots) on the right-hand side.

## Getting it up and running

### Tuya Convert

Doesn't work due to updated protected firmware.

## Advanced Configuration - With timer on Heat and Fan

```yaml
substitutions:
  devicename: esppowderroom
  upper_devicename: Powder Room
  friendly_name: "Powder Room Switch"
  button1_name: "Heat"          ### Left or Top
  button2_name: "Fan"           ### Middle
  button3_name: "Light"         ### Right or Bottom

#################################
esphome:
  name: esppowderroom
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_pass
  
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Powder Room Switch"
    password: "Powder Room Switch"

captive_portal:

# Enable logging
logger:

# Enable Home Assistant API
api:
  password: !secret api_pass

ota:
  password: !secret ota_pass

sensor:
  - platform: uptime
    name: $upper_devicename Uptime

  - platform: wifi_signal
    name: $upper_devicename WiFi Signal
    update_interval: 15s

#################################  
  


output:
  ### Button1
  - platform: gpio
    pin: GPIO5
    id: relay1

  ### Button2
  - platform: gpio
    pin: GPIO14
    id: relay2

  ### Button3
  - platform: gpio
    pin: GPIO12
    id: relay3

light:
  - platform: binary
    name: $upper_devicename $button3_name
    output: relay3
    id: light1

switch:
  - platform: output
    output: relay2
    name: $upper_devicename $button2_name
    icon: "mdi:fan"
    id: fan1

  - platform: output
    name: $upper_devicename $button1_name
    output: relay1
    id: heat1

  - platform: restart
    name: $upper_devicename Restart

# Buttons
binary_sensor:
  ### Button1
  - platform: gpio
    device_class: heat
    pin:
      number: GPIO16
      mode: INPUT_PULLUP
      inverted: True
    name: "${button1_name} Button"
    ### toggle relay on push
    on_press:
      if:
        condition:
          switch.is_off: heat1
        then:
          - switch.turn_on: heat1
          - delay: 600s
          - switch.turn_off: heat1
        else:
          - switch.turn_off: heat1  

  ### Button2
  - platform: gpio
    pin:
      number: GPIO04
      mode: INPUT_PULLUP
      inverted: True
    name: "${button2_name} Button"
    ### toggle relay on push
    on_press:
      if:
        condition:
          switch.is_off: fan1
        then:
          - switch.turn_on: fan1
          - delay: 600s
          - switch.turn_off: fan1
        else:
          - switch.turn_off: fan1

  ### Button3
  - platform: gpio
    device_class: light
    pin:
      number: GPIO3
      mode: INPUT_PULLUP
      inverted: True
    name: "${button3_name} Button"
    ### toggle relay on push
    on_press:
      - light.toggle: light1

```
