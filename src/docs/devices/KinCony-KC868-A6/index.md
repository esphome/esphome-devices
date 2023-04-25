---
title: KinCony KC868-A6
date-published: 2023-04-20
type: relay
standard: global
---

![Product](https://github.com/hzkincony/esphome-devices/blob/main/kc868-a6.jpg "Product Image")

## GPIO Pinout

| Pin    | Function            |
| ------ | ------------------- |
| GPIO36 | ANALOG_A1           |
| GPIO39 | ANALOG_A2           |
| GPIO34 | ANALOG_A3           |
| GPIO35 | ANALOG_A4           |
| GPIO4  | IIC_SDA             |
| GPIO15 | IIC_SCL             |
| GPIO32 | 1-Wire GPIO         |
| GPIO33 | 1-Wire GPIO         |
| GPIO26 | analog  output1     |
| GPIO25 | analog  output2     |
| GPIO14 | RS485_RXD           |
| GPIO27 | RS485_TXD           |
| GPIO17 | RS232_RXD           |
| GPIO16 | RS232_TXD           |
| GPIO5  | CS   (SPI_Bus)      |
| GPIO23 | MOSI (SPI_Bus)      |
| GPIO19 | MISO (SPI_Bus)      |
| GPIO18 | CSK  (SPI_Bus)      |

[Additional pinout/design details](https://www.kincony.com/esp32-6-channel-relay-module-kc868-a6.html)

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: kc868-a4
  platform: ESP32
  board: esp32dev

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:
  password: "4d5a388de4f759bf88e71cde7a31af6f"

wifi:
  ssid: "KinCony"
  password: "a12345678"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Kc868-A4 Fallback Hotspot"
    password: "QOU4hbAjJ5Wb"

captive_portal:

switch:
  - platform: gpio
    name: "light1"
    pin: 2
    inverted: false

  - platform: gpio
    name: "light2"
    pin: 15
    inverted: false

  - platform: gpio
    name: "light3"
    pin: 5
    inverted: false

  - platform: gpio
    name: "light4"
    pin: 4
    inverted: false

binary_sensor:
  - platform: gpio
    name: "input1"
    pin:
      number: 36
      inverted: true

  - platform: gpio
    name: "input2"
    pin:
      number: 39
      inverted: true

  - platform: gpio
    name: "input3"
    pin:
      number: 27
      inverted: true

  - platform: gpio
    name: "input4"
    pin:
      number: 14
      inverted: true
```
