---
title: "Generic Tuya S06 Pro Wifi IR Blaster (WB3S)"
date-published: 2026-05-15
type: misc
standard: global
board: bk72xx
difficulty: 3
made-for-esphome: false
---

# Generic Tuya S06 Pro Wifi IR Blaster (WB3S)

![S06 Pro](tuya-s06-pro.jpg)

[S06 Pro](https://s.click.aliexpress.com/e/_c4WmrJJt) universal remote controller with built-in temperature and humidity sensor (AHT10), based on the WB3S Wi-Fi module.

This device supports both IR transmitting and receiving, making it suitable for ESPHome IR remote projects such as air conditioners, TVs, fans, and other IR-controlled devices.

This device is based on PCB version `S06Pro-WB3S-AHT10-V2`. I also have a full detailed teardown and flashing instruction here: [Tuya S06 Pro Teardown](https://simplymaker.net/smart-home/tuya-s06-pro-ir-blaster-wb3s-teardown-and-esphome-flashing/)

![S06 Pro(WB3S) Teardown](Tuya-S06-Pro-WB3S-pcb-v2_1k.jpg)

## GPIO Pinout
| Pin     | Function           |
| ------- | ------------------ |
| P26     | Remote Transmitter |
| P8      | Remote Receiver    |
| P6      | Reset Button       |
| P9      | Status LED         |
| TX1/RX1 | Tuya UART          |

## Flashing
This device can be flashed directly over UART using [LTChipTool](https://docs.libretiny.eu/docs/flashing/tools/ltchiptool/).

| Serial | CB3S        |
| ------ | ----------- |
| RX     | TX1         |
| TX     | RX1         |
| RST    | CEN         |
| 3.3V   | 3.3V        |
| GND    | GND         |

To enter bootloader mode:
briefly short CEN to GND while LTChipTool shows Connecting...

## Basic Configuration

```yaml
# Pa# Basic Config
esphome: 
  name: ir-s06-pro
  friendly_name: IR S06 Pro

bk72xx:
  board: wb3s

wifi: 
  ssid: !secret wifi_ssid 
  password: !secret wifi_password


# Enable logging
logger:
  level: DEBUG # Default

# Enable Home Assistant API
api:
  encryption:
    key: !secret api_encryption_key

captive_portal:

remote_transmitter:
  pin: P26
  carrier_duty_percent: 50%

remote_receiver:
  pin:
    number: P8
    inverted: true
  tolerance: 30%
  idle: 8ms

binary_sensor:
  - platform: gpio
    name: "Button"
    id: gpio_button
    pin:
      number: P6
      inverted: true
      mode:
        input: true
        pullup: true

light:
  - platform: status_led
    name: "Status LED"
    pin: P9

##### AHT10 ######
uart:
  rx_pin: RX1
  tx_pin: TX1
  baud_rate: 9600

tuya:

sensor:
  - platform: tuya
    sensor_datapoint: 101
    id: temperature
    name: "Temperature"
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    filters:
      - multiply: 0.1
  - platform: tuya
    sensor_datapoint: 102
    id: humidity
    name: "Humidity"
    unit_of_measurement: "%"
    accuracy_decimals: 0
```
