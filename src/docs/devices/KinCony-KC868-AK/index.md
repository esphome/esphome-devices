---
title: KinCony KC868-AK
date-published: 2023-04-28
type: sensor
standard: global
board: esp32
---

![Product](kc868-ak.png "Product Image")

## GPIO Pinout

| Pin    | Function  |
| ------ | --------- |
| GPIO36 | Free GPIO |
| GPIO39 | Free GPIO |
| GPIO34 | Free GPIO |
| GPIO35 | Free GPIO |
| GPIO4  | IIC_SDA   |
| GPIO5  | IIC_SCL   |
| GPIO16 | RS485_RXD |
| GPIO14 | RS485_TXD |
| GPIO33 | RS232_RXD |
| GPIO32 | RS232_TXD |

[Additional pinout/design details](https://www.kincony.com/esp32-programmable-keyboard.html)

## Basic Configuration

```yaml
esphome:
  name: kc868-ak
esp32:
  board: esp32dev
i2c:
  sda: 4
  scl: 5
  scan: true
  id: bus_a
wifi:
  ssid: KinCony
  password: a12345678
  ap:
    ssid: A4 Fallback Hotspot
    password: ZvKhDPUYilHj
pcf8574:
- id: pcf8574_hub_in_1
  address: 36
- id: pcf8574_hub_in_2
  address: 37
- id: pcf8574_hub_in_3
  address: 33
- id: pcf8574_hub_in_4
  address: 34
- id: pcf8574_hub_in_5
  address: 38
binary_sensor:
- platform: gpio
  name: ak-input1
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 0
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input2
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 1
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input3
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 2
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input4
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 3
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input5
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 4
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input6
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 5
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input7
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 6
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input8
  pin:
    pcf8574: pcf8574_hub_in_1
    number: 7
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input9
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 0
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input10
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 1
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input11
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 2
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input12
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 3
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input13
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 4
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input14
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 5
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input15
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 6
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input16
  pin:
    pcf8574: pcf8574_hub_in_2
    number: 7
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input17
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 0
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input18
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 1
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input19
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 2
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input20
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 3
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input21
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 4
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input22
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 5
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input23
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 6
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input24
  pin:
    pcf8574: pcf8574_hub_in_3
    number: 7
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input25
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 0
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input26
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 1
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input27
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 2
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input28
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 3
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input29
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 4
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input30
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 5
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input31
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 6
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input32
  pin:
    pcf8574: pcf8574_hub_in_4
    number: 7
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input33
  pin:
    pcf8574: pcf8574_hub_in_5
    number: 0
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input34
  pin:
    pcf8574: pcf8574_hub_in_5
    number: 1
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input35
  pin:
    pcf8574: pcf8574_hub_in_5
    number: 2
    mode: INPUT
    inverted: true
- platform: gpio
  name: ak-input36
  pin:
    pcf8574: pcf8574_hub_in_5
    number: 3
    mode: INPUT
    inverted: true
logger: null
api: null
```
