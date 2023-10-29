---
title: Sonoff POW Origin 16Amp (POWR316)
date-published: 2013-07-18
type: relay
standard: global
board: esp32
---

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| GPIO00 | Push Button (HIGH = off, LOW = on) |
| GPIO05 | Wifi_LED                           |
| GPIO13 | Relay1                             |
| GPIO16 | CSE7766 Rx                         |
| GPIO18 | Status LED (HIGH = off, LOW = on)  |

## Initial Setup

Remove the 4 screws at the back of the device and expose the board. The board is mounted to the front panel and can be un screwed also to install a permanent 4 pin header to attach jumper cables. Hold down the button while powering on the device to put it into bootloader mode.

## Product Images

![Sonoff POw Origin 16Amp External](sonoff-POWR316-external.png "Sonoff POW Origin 16Amp External")
![Sonoff POw Origin 16Amp Internal with labels](sonoff-POWR316-internal-labels.png "Sonoff POW Origin 16Amp Internal with labels")

## Basic Configuration

```yaml
# Basic Config
substitutions:
  friendly_name: POW Origin 16A
  device_name: pow-origin-16a

esphome:
  name: ${device_name}
  friendly_name: ${friendly_name}
  
esp32:
  board: nodemcu-32s

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: ${device_name}
    password: !secret wifi_failover

captive_portal:

logger:

api:

ota:
  password: !secret ota_pwd

#optional
web_server:
  port: 80

uart:
  rx_pin: GPIO16
  baud_rate: 4800
  
sensor:
  - platform: cse7766
    update_interval: 10s
    current:
      name: ${friendly_name} Current
      id: a_sensor
    voltage:
      name: ${friendly_name} Voltage
      id: v_sensor
    power:
      name: ${friendly_name} Power
      id: w_sensor
      on_value_range:
        - above: 4.0
          then:
            - light.turn_on: switch_led
        - below: 3.0
          then:
            - light.turn_off: switch_led
    energy:
      name: ${friendly_name} Energy
      id: wh_sensor

output:
  - platform: ledc
    id: led
    pin:
      number: GPIO18
      inverted: True

light:
  - platform: monochromatic
    id: switch_led
    output: led
    internal: True
  - platform: status_led
    id: wifi_status_led
    internal: True
    pin:
      number: GPIO05
      inverted: True

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode:
        input: true
        pullup: true
      inverted: true
    name: "${dev_nice_name} - Button"
    on_press:
      - switch.toggle: relay

switch:
  - platform: gpio
    name: "${dev_nice_name} - Relay Switch"
    pin: GPIO13
    id: relay
```
