---
title: Tuya Generic S09 Temperature/Humidity/Clock/IR
date-published: 2025-01-04
type: sensor
standard: global
board: bk72xx
---

## General Notes

There are a few similar models of this device, some without the IR function, such as the TH06.
Some have different date formats and 24 hour time.
There's detailed teardown info at [Elektroda](https://www.elektroda.com/rtvforum/topic4035679.html).

![S09](S09.jpg)

## GPIO Pinout

| Pin | Function       |
| --- | -------------- |
| P6  | Button         |
| P8  | LED            |
| P26 | IR Transmitter |
| P9  | Status pin     |

## Flashing

The S09 that I got has a CB3S module. Others have a WB3S, but they're very similar.

I used `ltchiptool` to backup the original firmware and flash an esphome uf2 binary to it.

## Configuration

```yaml
bk72xx:
  board: cb3s

uart:
  tx_pin: TX1
  rx_pin: RX1
  baud_rate: 9600

time:
  - platform: sntp
    id: sntptime

tuya:
  time_id: sntptime
  status_pin:
    number: 9
    inverted: true

sensor:
  - platform: tuya
    name: Temperature
    sensor_datapoint: 101
    unit_of_measurement: °C
    accuracy_decimals: 1
    device_class: temperature
    filters:
      multiply: 0.1
  - platform: tuya
    name: Humidity
    sensor_datapoint: 102
    unit_of_measurement: "%"
    device_class: humidity

binary_sensor:
  - platform: gpio
    id: btn
    pin:
      number: 6
      mode: input_pullup
      inverted: true

remote_transmitter:
  pin: 26
  carrier_duty_percent: 50%

remote_receiver:
  pin:
    number: 8
    inverted: True
    mode:
      input: true
      pullup: true
  tolerance: 55%
```
