---
title: Teckin SR46
date-published: 2020-08-05
type: dimmer
standard: us
---

1. TOC
{:toc}

## General Notes

This plugs use tuya so you can [use tuya-convert to flash ESPHome](/guides/tuya-convert/).
The UART ports is connected to GPIO1 and GPIO3.
The on/off switch is on datapoint 20 and the dimmer is on datapoint 22.

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO1   | UART Tx                            |
| GPIO3   | UART Rx                            |

## Basic Configuration

```yaml

uart:
  tx_pin: GPIO1
  rx_pin: GPIO3
  baud_rate: 9600
  
logger:
  baud_rate: 0
  
tuya:

light:
  - platform: "tuya"
    name: "dimmer"
    switch_datapoint: 20
    dimmer_datapoint: 22
    min_value: 1
    max_value: 1024

```
