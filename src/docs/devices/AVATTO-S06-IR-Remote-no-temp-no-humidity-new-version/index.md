---
title: AVATTO S06 WiFi IR Universal Remote Controller (No Temp/No Humidity) - New Version
date-published: 2025-05-02
type: misc
standard: global
board: bk72xx
difficulty: 2
---
![Product Image](/AVATTO-S06-WiFi-IR-Universal-Remote-Controller.jpg "Product Image")

## General Notes

There's two hardware iterations of this particular IR blaster: [an older version that uses an ESP01 module](/devices/AVATTO-S06-IR-Remote-no-temp-no-humidity), and this newer one that uses a CB3S module (a Beken BK7231N module in the same form factor as the older ESP01). Outwardly, both appear identical.

## GPIO Pinout

| Pin    | Function           |
| ------ | ------------------ |
| GPIO8  | Blue Status LED    |
| GPIO26 | Remote Transmitter |
| GPIO7  | Remote Receiver    |
| GPIO6  | Reset Button       |

## Flashing

The device is vulnerable to `tuya-cloudcutter`, and likely `tuya-convert` as well. I flashed mine with ESPHome Kickstart using Cloudcutter, then uploaded an ESPHome UF2 binary from there.

[According to documentation on Elektroda](https://www.elektroda.com/rtvforum/topic3961676.html), you can also use tools such as `ltchiptool` to flash this via serial. There are UART pads labeled on the board and easily accessible. The chip operates at 3.3v.

## Configuration

Some sections containing default ESPHome configuration have been removed from here. Make sure they're filled out in your config.

```yaml
esphome:
  name: s06_ir_blaster
  friendly_name: S06 IR Blaster

bk72xx:
  board: cb3s

logger:

api:

ota:

wifi:

captive_portal:

light:
  - platform: status_led
    name: "Status LED"
    pin: GPIO8

binary_sensor:
  - platform: gpio
    pin: GPIO6
    name: "Button"
    filters:
      - invert:

remote_transmitter:
  pin: GPIO26
  carrier_duty_percent: 50%
  
remote_receiver:
  pin:
    number: GPIO7
    inverted: true
```

For use with Home Assistant integrations such as SmartIR that send raw IR commands, make sure to set the IR carrier frequency to about 38KHz. Leaving it as default may cause raw IR commands to fail to work properly.

```yaml
api:
  encryption:
    key: "xxxxxxx"
  services:
    - service: send_raw_command
      variables:
        command: int[]
      then:
        - remote_transmitter.transmit_raw:
            code: !lambda "return command;"
            carrier_frequency: !lambda "return 38029.0;"
```