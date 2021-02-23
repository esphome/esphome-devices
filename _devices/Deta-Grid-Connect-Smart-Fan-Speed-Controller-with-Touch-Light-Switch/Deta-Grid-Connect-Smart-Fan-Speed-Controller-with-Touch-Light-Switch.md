---
title: Deta Grid Connect Smart Fan Speed Controller with Touch Light Switch
date-published: 2021-02-02
type: switch
standard: au
---

## GPIO Pinout

| GPIO # | Component |
|:------:|----------:|
| GPIO00 |   Button2 |
| GPIO01 |      None |
| GPIO02 |      None |
| GPIO03 |   LedLink |
| GPIO04 |    Relay3 |
| GPIO05 |   Button3 |
| GPIO09 |      None |
| GPIO10 |      None |
| GPIO12 |      None |
| GPIO13 |    Relay2 |
| GPIO14 |    Relay1 |
| GPIO15 |    Relay4 |
| GPIO16 |   Button1 |
|  FLAG  |      None |

## Getting it up and running

### Tuya Convert

These switches are Tuya devices, so if you don't want to open them up to flash directly, you can attempt to [use tuya-convert to initially get ESPHome onto them](/guides/tuya-convert/) however recently purchased devices are no longer Tuya-Convert compatible.  There's useful guide to disassemble and serial flash similar switches [here.](https://blog.mikejmcguire.com/2020/05/22/deta-grid-connect-3-and-4-gang-light-switches-and-home-assistant/) After that, you can use ESPHome's OTA functionality to make any further changes.

- Put the switch into "smartconfig" / "autoconfig" / pairing mode by holding any button for about 5 seconds.
- The status LED (to the side of the button(s)) blinks rapidly to confirm that it has entered pairing mode.

## Basic Functionality with Status LED inverted and cycling up through speeds

```yaml
substitutions:
  device_name: deta_fan_controller
  friendly_name: "Deta Smart Fan Speed Controller"

##########################

esphome:
  name: ${device_name}
  platform: ESP8266
  board: esp01_1m
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret iot_wifi_ssid
  password: !secret iot_wifi_pwd
  fast_connect: on

  ap:
    ssid: ${device_name} Fallback
    password: ""

captive_portal:

sensor:
  - platform: wifi_signal
    name: ${friendly_name} Wifi Signal Strength
    update_interval: 60s
  - platform: uptime
    name: ${friendly_name} Uptime

text_sensor:
  - platform: wifi_info
    ip_address:
      name: ${friendly_name} IP
    ssid:
      name: ${friendly_name} SSID
    bssid:
      name: ${friendly_name} BSSID
    mac_address:
      name: ${friendly_name} Mac

logger:

api:

ota:

web_server:
  port: 80

light:
  - platform: binary
    output: relay_light
    id: light1
    name: ${friendly_name} Light

status_led:
  pin:
    number: GPIO3
    inverted: True

output:
  - platform: gpio
    id: relay_light
    pin: GPIO14
  - platform: template
    id: fan_speed
    type: float
    write_action:
      - then:
        - if:
            condition:
              lambda: return ((state > 0) && (state < .4));
            then:
              - switch.turn_on: relay_fan_1
              - delay: 20ms
              - switch.turn_off: relay_fan_2
              - delay: 20ms
              - switch.turn_off: relay_fan_3
        - if:
            condition:
              lambda: return ((state > .4) && (state < .7));
            then:
              - switch.turn_on: relay_fan_1
              - delay: 20ms
              - switch.turn_on: relay_fan_2
              - delay: 20ms
              - switch.turn_off: relay_fan_3
        - if:
            condition:
              lambda: return (state > .7);
            then:
              - switch.turn_on: relay_fan_1
              - delay: 20ms
              - switch.turn_on: relay_fan_2
              - delay: 20ms
              - switch.turn_on: relay_fan_3
        - if:
            condition:
              lambda: return (state < 0.01);
            then:
              - switch.turn_off: relay_fan_1
              - delay: 20ms
              - switch.turn_off: relay_fan_2
              - delay: 20ms
              - switch.turn_off: relay_fan_3

binary_sensor:
  - platform: gpio
    id: fan_light_sensor
    pin:
      number: GPIO16
      mode: INPUT_PULLUP
      inverted: True
    on_press:
      - light.toggle: light1
  - platform: gpio
    id: fan_power_sensor
    pin:
      number: GPIO00
      mode: INPUT_PULLUP
      inverted: True
    on_press:
      then:
        - fan.toggle: fan_1
  - platform: gpio
    id: fan_speed_sensor
    pin:
      number: GPIO05
      mode: INPUT_PULLUP
      inverted: True
    on_press:
      then:
        - if:
            condition:
              and:
                - switch.is_on: relay_fan_1
                - switch.is_off: relay_fan_2
                - switch.is_off: relay_fan_3
            then:
              - fan.turn_on:
                  id: fan_1
                  speed: MEDIUM
        - if:
            condition:
              and:
                - switch.is_on: relay_fan_1
                - switch.is_on: relay_fan_2
                - switch.is_off: relay_fan_3
            then:
              - fan.turn_on:
                  id: fan_1
                  speed: HIGH
        - if:
            condition:
              and:
                - switch.is_on: relay_fan_1
                - switch.is_on: relay_fan_2
                - switch.is_on: relay_fan_3
            then:
              - fan.turn_on:
                  id: fan_1
                  speed: LOW

fan:
  - platform: speed
    id: fan_1
    output: fan_speed
    name: ${friendly_name} Fan Speed

switch:
  - platform: restart
    name: ${friendly_name} REBOOT
  - platform: gpio
    id: relay_fan_1
    pin: GPIO13
  - platform: gpio
    id: relay_fan_2
    pin: GPIO04
  - platform: gpio
    id: relay_fan_3
    pin: GPIO15
  - platform: template
    id: update_fan_speed
    optimistic: True
    turn_on_action:
      then:
        - delay: 200ms
        - if:
            condition:
              and:
                - switch.is_off: relay_fan_1
                - switch.is_off: relay_fan_2
                - switch.is_off: relay_fan_3
            then:
              - fan.turn_off: fan_1
        - if:
            condition:
              and:
                - switch.is_on: relay_fan_1
                - switch.is_off: relay_fan_2
                - switch.is_off: relay_fan_3
            then:
              - fan.turn_on:
                  id: fan_1
                  speed: LOW
        - if:
            condition:
              and:
                - switch.is_on: relay_fan_1
                - switch.is_on: relay_fan_2
                - switch.is_off: relay_fan_3
            then:
              - fan.turn_on:
                  id: fan_1
                  speed: MEDIUM
        - if:
            condition:
              and:
                - switch.is_on: relay_fan_1
                - switch.is_off: relay_fan_2
                - switch.is_on: relay_fan_3
            then:
              - fan.turn_on:
                  id: fan_1
                  speed: HIGH

```
