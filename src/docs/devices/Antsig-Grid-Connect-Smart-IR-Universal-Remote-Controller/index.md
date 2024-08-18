---
title: Antsig Grid Connect Smart IR Universal Remote Controller
date-published: 2024-08-xx
type: misc
standard: au
board: cb3s
difficulty: 2
---
# Antsig Grid Connect Smart IR Universal Remote Controller
## Overview

![HUBIR01HA](HUBIR01HA.jpg)

Manufacturer's product number: HUBIR01HA

This is an infrared transceiver based on the [Tuya TYSW-012](https://developer.tuya.com/en/docs/iot/tysw012-round-universal-remote-control?id=K9lnm617oupeb) board, using a [CB3S wifi module (BK7231N)](https://developer.tuya.com/en/docs/Document/cb3s?id=Kamwxujmesun8). It uses 7x IR emitter LEDs for good transmission coverage, and 1x IR receiver (probably a TSOP38238 or similar) at the front of the unit. It can be powered by micro USB, and conveniently we can also access UART over this USB connection. It can be purchased from Bunnings for $29.

I noticed while I examining the board and other internals, the bottom of the case has two small steel inserts. Most likely included the make it heavy enough to stay put, it also means it should be possible to construct a magnetic mounting bracket.

## Flashing

### Easiest: Cloudcutter

As of August 2024, the device ships with firmware version 2.0.0 which is vulnerable to the [Cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter) exploit, and so can be flashed OTA. Create your ESPHome config (board: cb3s) and choose manual download, selecting the option for Cloudcutter image. Put the firmware file in the tuya-cloudcutter/custom-firmware directory before running tuya-cloudcutter.sh.

### Optional: USB

The CB3S' UART pins are connected to the micro USB port, so flashing over USB should be possible. I didn't try it so I can't tell you what the process would be.

## ESPHome Configuration

Infrared transceivers have a lot of different possible uses with ESPHome so I will only provide an example configuration. Here are some resources to help you get this device set up:

- [Setting up IR devices](https://esphome.io/guides/setting_up_rmt_devices) - a guide for settiing up IR remotes, including a basic guide on decoding IR signals (e.g., air conditioner and TV remotes)
- [Remote transmitter component](https://esphome.io/components/remote_transmitter) - ESPHome component for controlling IR (and RF) transmitters
- [Remote receiver component](https://esphome.io/components/remote_receiver) - ESPHome component for controlling IR (and RF) receivers
- [IR Remote Climate](https://esphome.io/components/climate/climate_ir.html) - ESPHome component for controlling several different brands/models of split system air conditioners

### GPIO Pinout

| Pin | Function                                        |
| --- | ----------------------------------------------- |
| P6  | Button (underside of case/board, near USB port) |
| P7  | IR Rx                                           |
| P8  | LED - blue, front side of case/board            |
| P26 | IR Tx                                           |

### Example .yaml

This will configure the CB3S module with the remote transmitter and receiver components, and very basic functionality for the LED and button. The remote receiver includes the dump: all flag so you may start decoding your IR remotes. You may want to configure the LED to pulse when the IR transmitter is active for example, as I have. There are several unused GPIO on the CB3S that are easily accessible, so this device has a lot of potential for creative and determined individuals.

```yaml
esphome:
  name: tysw-012-smart-ir-cb3s
  friendly_name: "TYSW-012 Universal Remote Control"
  comment: "Antsig Grid Connect Smart IR Universal Remote Control (Tuya TYSW-012)"

bk72xx:
  board: cb3s

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "your encryption key here"

ota:
  - platform: esphome
    password: "your password here"

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password


output:
  - platform: gpio
    id: led_indicator            # the blue LED on the front of the unit
    pin: P8

light:
  - platform: binary
    name: "Indicator LED"
    output: led_indicator

binary_sensor:
  - platform: gpio
    pin: P6
    name: Button                 # the button on the bottom of the unit
    filters:
      - invert:  

remote_transmitter:
  - pin: P26
    carrier_duty_percent: 50%    # IR remotes use 50% duty cycle
    id: ir_tx

remote_receiver:
  pin:
    number: P7
    mode:
      input: true # input mode required
      pullup: true # use internal pullup resistor
  id: ir_rx
  dump: all       # this will dump all received IR codes to the log, with their interpreted commands if know, otherwise raw
```
