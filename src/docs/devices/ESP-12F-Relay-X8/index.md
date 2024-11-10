---
title: ESP-12F_Relay_X8
date-published: 2022-08-28
type: relay
standard: global
board: esp8266
---

![Product](./image.jpg "Product Image")

## Product description

This is a 8-relay board with an ESP-12F.

Each relay has COM+NO+NC exposed. Product descriptions don't seem to specify maximum load.

The board can be powered either via 7-30VDC or via 5VDC (separate connectors).

I bought it from: https://s.click.aliexpress.com/e/_DnEOi2r (affiliation link so i can make others like this, no guarantee it will continue to exist).

## GPIO Pinout

This board has headers for every GPIO pin on its ESP-12F.

| Pin   | Comment                                                 |
| ----- | ------------------------------------------------------- |
| 5V    | Do not use 5V for programming                           |
| TX    | Exposed on board 3.3V level!                            |
| RX    | Exposed on board 3.3V level!                            |
| GPIO0 | 3.3V level! (pulled up, connect to GND for programming) |
| GND   |                                                         |
| GND   |                                                         |

| Pin    | Comment                                       |
| ------ | --------------------------------------------- |
| 3V3    | For programming, inject 3.3V power here       |
| 3V3    | For programming, inject 3.3V power here       |
| 5V     |                                               |
| 5V     |                                               |
| GND    |                                               |
| GND    |                                               |
|        |                                               |
| GPIO5  | Relay 8                                       |
| GPIO4  | Relay 7                                       |
| GPIO0  | Relay 6                                       |
| GPIO2  | Exposed on board | (blue) LED on the ESP-12F  |
| GPIO15 | Relay 5                                       |
| GND    |                                               |

| Pin    | Comment                                 |
| ------ | --------------------------------------- |
| ADC    | Exposed on board ( 0V-1V only )         |
| EN     | Pulled up                               |
| GPIO16 | Relay 1                                 |
| GPIO14 | Relay 2                                 |
| GPIO12 | Relay 3                                 |
| GPIO13 | Relay 4                                 |

## Basic Config

```yaml
esphome:
  name: relayboard
  platform: ESP8266
  board: esp12e



# Status LED
light:
  - platform: status_led
    name: "RelayBoard LED"
    restore_mode: ALWAYS_ON
    pin:
      number: GPIO02
      inverted: True

# 8 relay outputs, exposed as switches in Home Assistant
switch:
  - platform: gpio
    pin: GPIO16
    name: Relay1
    id: relay1
  - platform: gpio
    pin: GPIO14
    name: Relay2
    id: relay2
  - platform: gpio
    pin: GPIO12
    name: Relay3
    id: relay3
  - platform: gpio
    pin: GPIO13
    name: Relay4
    id: relay4
  - platform: gpio
    pin: GPIO15
    name: Relay5
    id: relay5
  - platform: gpio
    pin: GPIO00
    name: Relay6
    id: relay6
  - platform: gpio
    pin: GPIO04
    name: Relay7
    id: relay7
  - platform: gpio
    pin: GPIO05
    name: Relay8
    id: relay8
```
