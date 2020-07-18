---
title: Sonoff Mini Relay
Model: IM190416001
date-published: 2020-07-19
type: relay
standard: global
---
  ![alt text](Sonoff-Mini-Relay.png "Product Image")

[https://sonoff.tech/product/wifi-diy-smart-switches/sonoff-mini](https://sonoff.tech/product/wifi-diy-smart-switches/sonoff-mini)

## GPIO Pinout

| Pin    | Function                   |
|--------|----------------------------|
| GPIO00 | BUTTON                     |
| GPIO01 | TX                         |
| GPIO02 | AVAILABE                   |
| GPIO03 | RX                         |
| GPIO04 | S2 (external switch input) |
| GPIO12 | Relay and RED LED          |
| GPIO13 | BLUE LED                   |
| GPIO16 | OTA jumper pin             |
| GND    | S1 (external switch input) |

## Basic Config

```yaml
substitutions:
  device_name: sonoffmini_1
  device_ip: 192.168.x.x

esphome:
  name: ${device_name}
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  manual_ip:
    static_ip: ${device_ip}
    gateway: 192.168.x.x
    subnet: 255.255.255.0

logger:
  
api:
  reboot_timeout: 15min
  password: !secret api_password

ota:
  password: !secret ota_password

binary_sensor:
  - platform: gpio
    pin: GPIO00
    id: reset
    internal: true
    filters:
      - invert:
      - delayed_off: 10ms
    on_press:
      - switch.toggle:
          id: relay_1

  - platform: gpio
    name: ${device_name}_status
    pin: GPIO04
    id: switch_1
    on_press:
      then:
        - switch.toggle:
            id: relay_1
    on_release:
      then:
        - switch.toggle:
            id: relay_1

switch:
  - platform: gpio
    name: ${device_name}_switch
    icon: "mdi: lightbulb_outline"
    pin: GPIO12
    id: relay_1
    restore_mode: restore_default_off

status_led:
  pin:
    number: GPIO13
    inverted: true

output:
  - platform: esp8266_pwm
    id: blue_led
    pin: GPIO13
    inverted: True

light:
  - platform: monochromatic
    name: ${device_name}_blueled
    output: blue_led
```
