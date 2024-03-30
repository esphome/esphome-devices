---
title: ESP-12F_Relay_X1
date-published: 2024-03-29
type: relay
standard: global
board: esp8266
---

## Product description

This is a 1-relay board based on ESP-12F, including AC and DC power supplies.

The relay has COM+NO+NC exposed. Print on relay says it can do 10A at 250VAC.

The board can be powered either via 90-250VAC or via 7-30VDC, or via 5VDC from USB (separate connectors).

It can be found in many online shops.

## GPIO Pinout

This board has headers for every GPIO pin on its ESP-12F.

By default, the relay is connected to GPIO5. If you want to change that, remove R14 and connect the header "Relay" to the desired GPIO.

Programming header:

| Pin   | Comment                                                 |
| ----- | ------------------------------------------------------- |
| 5V    | Do not use 5V for programming                           |
| TX    | 3.3V level!                                             |
| RX    | 3.3V level!                                             |
| GPIO0 | 3.3V level! (pulled up, connect to GND for flashing)    |
| GND   |                                                         |
| GND   |                                                         |

| Pin    | Comment                                 |
| ------ | --------------------------------------- |
| 3V3    | For programming, inject 3.3V power here |
| 3V3    | For programming, inject 3.3V power here |
| 5V     |                                         |
| 5V     |                                         |
| GND    |                                         |
| GND    |                                         |
|        |                                         |
| GPIO5  | 3.3V level, Blue LED (inverted)         |
| GPIO4  | 3.3V level                              |
| GPIO0  | 3.3V level                              |
| GPIO2  | 3.3V level                              |
| GPIO15 | 3.3V level                              |
| GND    |                                         |

| Pin    | Comment                               |
| ------ | ------------------------------------- |
| ADC    | 0V-1V only                            |
| EN     | Pulled up                             |
| GPIO5  | Use a jumper to RY1 to enable Relay 1 |
| GPIO4  | Use a jumper to RY2 to enable Relay 2 |

## Basic Config

```yaml
esphome:
  name: esp12frelayx1

esp8266:
  board: esp12e

# Use the red LED in the device as a status LED, which will blink if there are warnings (slow) or errors (fast)
status_led:
  pin:
    number: GPI16
    inverted: True

# relay output, exposed as switches in Home Assistant
switch:
  - platform: gpio
    pin: GPIO5
    name: Relay
    id: relay
```
