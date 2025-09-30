---
title: Tuya WiFi Smart Switch (CB2S WHD06 v.1.2)
date-published: 2025-03-17
type: switch
standard: global
board: bk72xx
pcb: CB2S
---
![Product Image](./Tuya-WiFi-Smart-Switch-SB2S-front.jpg "Device front")
![Product Image](./Tuya-WiFi-Smart-Switch-SB2S-pcb-front.jpg "PCB front")
![Product Image](./Tuya-WiFi-Smart-Switch-SB2S-pcb-back.jpg "PCB back")
![Product Image](./Tuya-WiFi-Smart-Switch-SB2S-submodule-front.jpg "SB2S front")
![Product Image](./Tuya-WiFi-Smart-Switch-SB2S-submodule-back.jpg "SB2S back")

## GPIO Pinout

| Pin    | Function            |
| ------ | ------------------- |
| P8     | Button              |
| P7     | Status Led          |
| p24    | Relay               |

## Basic Configuration

```yaml

esphome:
  name: relayname
  friendly_name: relayname

bk72xx:
  board: cb2s

logger:
api:
captive_portal:
ota:

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:

#Pinout: https://docs.libretiny.eu/boards/cb2s/#pinout
#PCB CB2S

## -----------------------##
## Substitution Variables ##
## -----------------------##
substitutions:
  device_friendly_name: relayname
  device_icon: "mdi:power"

## ---------------- ##
##    Status LED    ##
## Если есть ошибка в ESPhome, то диод мигает. Eсли все хорошо, то индикатором можно управлять из HA
## ---------------- ##

light:
  - platform: status_led
    name: "Switch state"
    id: led
    pin:
      number: P7
      inverted: true
## ---------------- ##
##  Binary Sensors  ##
## ---------------- ##
binary_sensor:
# Button 1
  - platform: gpio
    id: button
    pin:
      number: P8
      inverted: true
      mode: INPUT_PULLUP
    on_press:
      then:
        - switch.toggle: relay
    filters:
      - delayed_on_off: 50ms
## ---------------- ##
##      Switch      ##
## ---------------- ##
switch:
#Relay
  - platform: output
    name: "${device_friendly_name} Relay"
    icon: ${device_icon}
    output: relayoutput
    id: relay
    on_turn_on:
      - light.turn_on: led
    on_turn_off:
      - light.turn_off: led
    restore_mode: ALWAYS_OFF
## ---------------- ##
##      Relays      ##
## ---------------- ##

output:
  # Relay
  - platform: gpio
    id: relayoutput
    pin: P24
#    inverted: true

time:
  - platform: homeassistant
    id: homeassistant_time

text_sensor:
  - platform: wifi_info
    ip_address:
      name: "IP Address"
    ssid:
      name: "Connected SSID"
  - platform: libretiny
    version:
      name: LibreTiny Version
```
