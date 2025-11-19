---
title: Kogan Smart Air Purifier 2S
Model: KAIRPRFR2SA & KAFLTPRF2SA
date-published: 2022-02-09
type: misc
standard: au
board: esp8266
---

![Product Image](KoganSmartAirPurifier2S.jpg "Kogan Smart Air Purifier 2S")

[Product Listing](https://www.kogan.com/au/buy/kogan-smarterhome-4-stage-air-purifier-2s-with-h13-filter-130-cadr/)

[Flashing Tips (Home Assistant Thread)](https://community.home-assistant.io/t/tuya-tywe1s-flash-help/273747/).

[Tear down, mods/enhancements, Home Assistant configs, and more detailed write up (Home Assistant Thread)](https://community.home-assistant.io/t/kogan-smart-air-purifier-2s-working-with-esphome/390526)

## GPIO Pinout

| Pin    | Function |
| ------ | -------- |
| GPIO13 | RX       |
| GPIO15 | TX       |

## Basic Config

```yaml
substitutions:
  name: kogan-air-purifier
esphome:
  name: ${name}
esp8266:
  board: esp01_1m
wifi:
  ssid: YourSSID
  password: YourWifiPassword
logger:
  baud_rate: 0
api: null
ota:
  id: esphome_ota
  platform: esphome
uart:
- id: uart_0
  rx_pin: GPIO13
  tx_pin: GPIO15
  baud_rate: 9600
tuya:
  uart_id: uart_0
fan:
- platform: tuya
  name: ${kogan-air-purifier}
  switch_datapoint: 1
  speed_datapoint: 4
  speed_count: 3
number:
- platform: tuya
  name: ${name} Timer Mode
  number_datapoint: 19
  min_value: 0
  max_value: 2
  step: 1
- platform: tuya
  name: ${name} Timer Countdown Mins
  number_datapoint: 20
  min_value: 0
  max_value: 480
  step: 1
- platform: tuya
  name: ${name} LED Brightness
  number_datapoint: 101
  min_value: 0
  max_value: 2
  step: 1
- platform: tuya
  name: ${name} Air Quality Level
  number_datapoint: 22
  min_value: 0
  max_value: 2
  step: 1
```
