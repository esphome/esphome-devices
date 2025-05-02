---
title: Tuya Generic IRC03 IR Blaster
date-published: 2025-01-04
type: misc
standard: global
board: bk72xx
---

## General Notes

There's detailed teardown info at [Elektroda](https://www.elektroda.com/rtvforum/topic4012905.html).

Despite appearing outwardly identical to the [Tuya Generic IR Remote Control](/devices/Tuya-Generic-WiFi-IR-Remote-Control), the IRC03 has a custom PCB with the BK7231N directly integrated into it as opposed to using the CB3S module. The pinouts between the two devices differ as a result.

![IRC03](IRC03.jpg)

## GPIO Pinout

| Pin | Function      |
| --- | ------------- |
| P7  | IR Transmitter|
| P8  | IR Receiver   |
| P9  | Button        |
| P24 | LED           |

## Flashing

I used ``ltchiptool`` to backup the original firmware and flash an esphome uf2 binary to it.
The pads are all nicely labeled.

As of May 2025, these devices are also vulnerable to ``tuya-cloudcutter``, allowing for disassembly-free flashing. I've had success using the generic 2.1.5 BK7231N template as well as a 2.1.5 CB3S template to flash ESPHome Kickstart to the device, from which I uploaded a proper UF2 binary. 

## Configuration

```yaml
bk72xx:
  board: generic-bk7231n-qfn32-tuya

output:
  - platform: libretiny_pwm
    id: led
    pin: 24

light:
  - platform: monochromatic
    name: LED
    output: led

binary_sensor:
  - platform: gpio
    id: btn
    pin:
      number: 9
      mode: input_pullup
      inverted: true

remote_transmitter:
  pin: 7
  carrier_duty_percent: 50%

remote_receiver:
  pin:
    number: 8
    inverted: true
    mode:
      input: true
      pullup: true
  tolerance: 55%
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
