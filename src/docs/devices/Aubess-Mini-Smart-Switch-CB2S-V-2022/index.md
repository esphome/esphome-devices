---
title: Aubess WiFi Smart Switch (CB2S) V.2022
date-published: 2026-03-31
type: switch
standard: global
board: bk72xx
pcb: CB2S
---

![Product Image](./Aubess-Mini-Smart-Switch-V2022-Product-image.jpg)

![General View](./Aubess-Mini-Smart-Switch-V2022-General-View.jpg)


Maker: [https://aubess.net/](https://aubess.net/)

Also on Aliexpress.

## GPIO Pinout

|Pin|Function|
|-|-|
|P10|Button|
|P26|External Switch|
|P8|Relay|
|P7|Status Led|

## Internals

![Internals Image](./Aubess-Mini-Smart-Switch-V2022-bottom.jpg)

## UART Pinout

VERY IMPORTANT INFO:
Before programing, you must desolder the pin RX1 from the main board (is not necessary to desold all the CB2S board)

![UART PINOUT Image 1](./Aubess-Mini-Smart-Switch-V2022-Pinout1.jpg)

![UART PINOUT Image 2](./Aubess-Mini-Smart-Switch-V2022-Pinout2.jpg)


## Basic Configuration

```yaml
esphome:
  name: Wifi-Switch
  friendly\_name: Wifi Switch

bk72xx:
  board: cb2s

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:

wifi:
  ssid: !secret wifi\_ssid
  password: !secret wifi\_password

# Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:

captive\_portal:

## -----------------------##
## Substitution Variables ##
## -----------------------##
substitutions:
  device\_friendly\_name: Wifi Switch
  device\_icon: "mdi:power"

## ---------------- ##
##    Status LED    ##
## ---------------- ##

light:
  - platform: status\_led
    name: "Switch state"
    id: led
    pin:
      number: P7
      inverted: true

## ---------------- ##
##  Binary Sensors  ##
## ---------------- ##
binary\_sensor:
  # Button 1
  - platform: gpio
    id: button\_back
    pin:
      number: P10
      inverted: true
      mode: INPUT\_PULLUP
    on\_press:
      then:
        - switch.toggle: relay
    filters:
      - delayed\_on\_off: 50ms
  # Rocker switch
  - platform: gpio
    name: "${device\_friendly\_name} Switch S1-S2"
    pin: P26
    on\_press:
      then:
        - switch.toggle: relay
    filters:
      - delayed\_on\_off: 50ms

## ---------------- ##
##      Switch      ##
## ---------------- ##
switch:
  #Relay
  - platform: output
    name: "${device\_friendly\_name} Relay"
    icon: ${device\_icon}
    output: relayoutput
    id: relay
    on\_turn\_on:
      - light.turn\_on: led
    on\_turn\_off:
      - light.turn\_off: led
    restore\_mode: ALWAYS\_OFF

## ---------------- ##
##      Relays      ##
## ---------------- ##
output:
  # Relay
  - platform: gpio
    id: relayoutput
    pin: P8
#    inverted: true

time:
  - platform: homeassistant
    id: homeassistant\_time

text\_sensor:
  - platform: wifi\_info
    ip\_address:
      name: "IP Address"
    ssid:
      name: "Connected SSID"
```

