---
title: Dewenwils Heavy Duty 40A Outdoor Plug (HOWT01A)
date-published: 2023-07-01
type: switch
standard: us
board: esp8266
Made-for-esphome: False
difficulty: 4
---
# Dewenwils HOWT01A

The device has 2 indicator LEDs, 1 power button, 1 reset button and 1 controllable  double pole relay.
The device is controlled by a ESP8266 that is from ECO-PLUGS, and the [FCC filing](https://fcc.report/FCC-ID/PAGECO-PLUGS) can be found here.
The device uses a Proprietary app that cannot be flashed to ESPHome OTA, the initial install must be USB to Serial. Once ESPHome is installed all future downloads can be OTA.
Link to product can be found [here](https://www.amazon.com/gp/product/B07PP2KNNH/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1).

## Product Image

![HOWT01A](https://github.com/ryansmigley/esphome-devices/assets/104950813/4a7bd27b-d218-4875-a22f-0dc72123332b)

## GPIO Pinout

The GPIO pinout was learned from [NorthernMan54](https://gist.github.com/NorthernMan54/ef912a07482b9ab83fa80b91b5b763e8) and [Tasmota](https://templates.blakadder.com/dewenwils_HOWT01A.html) documentation.
![HOWT01AGPIO](https://github.com/ryansmigley/esphome-devices/assets/104950813/cbc4297f-3980-41e7-ad7e-895ee2d140a1)

The GPIOs being used are:

* Button: GPIO13
* Relay1: GPIO15
  
## Basic Configuration

```yaml
esphome:
  name: ecoplug
  friendly_name: EcoPlug

esp8266:
  board: esp01_1m

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: !secret

ota:
  password: !secret

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "$proper_devicename Hotspot"
    password: !secret ap_password

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO13
    id: button
    on_press:
     - switch.toggle: relay1

  - platform: status
    name: Eco Plug

switch:
  - platform: gpio
    name: "Eco Plug 1"
    pin: GPIO15
    id: relay1
    icon: "mdi:power-socket-us"

captive_portal:
```
