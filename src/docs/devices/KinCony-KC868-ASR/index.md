---
title: KinCony KC868-ASR
date-published: 2023-04-19
type: relay
standard: global
board: esp32
---

## GPIO Pinout

| Pin    | Function            |
| ------ | ------------------- |
| GPIO19 | Relay1              |
| GPIO5  | Relay2              |
| GPIO23 | LED1                |
| GPIO22 | LED2                |
| GPIO18 | Beep                |
| GPIO32 | TH1:1-Wire GPIO     |
| GPIO33 | TH2:1-Wire GPIO     |
| GPIO26 | IIC_SDA             |
| GPIO27 | IIC_SCL             |
| GPIO16 | Free GPIOs for user |
| GPIO17 | Free GPIOs for user |

[Additional pinout/design details](https://www.kincony.com/esp32-sd-card-sensor-rtc-record-board.html)

## Basic Configuration

```yaml
esphome:
  name: KC868-ASR
esp32:
  board: esp32dev
  framework:
    type: arduino
logger: null
api:
  encryption:
    key: Xqy9f8iJ49cr7o8IWE1sFnG9EAEnxHVYlGUQBdnKE6Q=
ota:
  platform: esphome
  password: d13799179d079d89758ad1a0fd1c4560
wifi:
  ssid: KinCony
  password: a12345678
  ap:
    ssid: Asr Fallback Hotspot
    password: KqbpeFnrzcWf
i2c:
  sda: 26
  scl: 27
  scan: true
  id: bus_a
switch:
- platform: gpio
  pin: GPIO19
  name: asr-relay1
- platform: gpio
  pin: GPIO5
  name: asr-relay2
- platform: gpio
  pin: GPIO23
  name: asr-led1
- platform: gpio
  pin: GPIO22
  name: asr-led2
- platform: gpio
  pin: GPIO18
  name: asr-beep
binary_sensor:
- platform: gpio
  pin:
    number: 0
    inverted: true
  name: asr-button
one_wire:
- pin: 32
  update_interval: 5s
sensor:
- platform: dallas_temp
  address: 8864809624804098344
  name: asr-t2
```
