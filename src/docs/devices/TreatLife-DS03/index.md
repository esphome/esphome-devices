---
title: TreatLife DS03 Fan Controller
date-published: 2021-01-06
type: dimmer
standard: us
board: esp8266, bk72xx
---

[Amazon Link](https://www.amazon.com/dp/B086PPRWL7)

## Notes

Different revisions of this product may come with different types of Tuya WiFi modules (e.g TYWE3S, WB3S, CB3S). The 
physical layout of these modules is very similar but they do have different GPIO naming schemas. There are also slight 
differences in Tuya MCU data point configurations. Please pay close attention before flashing.

This TuyaMCU requires a baud rate of 115200. This will generate a error in the log saying 9600 is requested. This is to
be expected and will be ignored. Setting baud rate to 9600 will cause boot issues

## ESP8266 GPIO Pinout

| Pin   | Function |
| ----- | -------- |
| GPIO1 | Tuya Tx  |
| GPIO3 | Tuya Rx  |

## CB3S GPIO Pinout

| Pin   | Function |
| ----- | -------- |
|  P11  | Tuya Tx  |
|  P10  | Tuya Rx  |

## ESP8266 Configuration

```yaml
substitutions:
  devicename: fan_switch
  friendly_name: Fan Switch

esphome:
  name: ${devicename}

esp8266:
  board: esp01_1m

wifi:
  ssid: !secret <ssid>
  password: !secret <password>

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: $friendly_name Fallback Hotspot
    password: <password>

captive_portal:

# Enable logging
logger:
  baud_rate: 0

# Enable Home Assistant API
api:

ota:

uart:
  rx_pin: GPIO3
  tx_pin: GPIO1
  baud_rate: 115200

tuya:

sensor:
  - platform: wifi_signal
    name: $friendly_name Wifi Signal
    update_interval: 60s

  - platform: uptime
    name: $friendly_name uptime

light:
  - platform: "tuya"
    name: $friendly_name Light
    dimmer_datapoint: 10
    switch_datapoint: 9
    min_value: 100
    max_value: 1000

fan:
  - platform: "tuya"
    name: $friendly_name Speed
    switch_datapoint: 1
    speed_datapoint: 3
    speed_count: 4
```

## CB3S Configuration

```yaml
substitutions:
  devicename: fan_switch
  friendly_name: Fan Switch
  
esphome:
  name: ${name}
  friendly_name: ${friendly_name}

# Tuya CB3S-FT module
bk72xx:
  board: generic-bk7231n-qfn32-tuya

wifi:
  ssid: !secret <ssid>
  password: !secret <password>

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: $friendly_name Fallback Hotspot
    password: <password>

captive_portal:

# Enable logging
logger:
  baud_rate: 0

# Enable Home Assistant API
api:

ota:

uart:
  rx_pin: RX1
  tx_pin: TX1
  baud_rate: 115200

tuya:

sensor:
  - platform: wifi_signal
    name: $friendly_name Wifi Signal
    update_interval: 60s

  - platform: uptime
    name: $friendly_name uptime

light:
  - platform: tuya
    name: $friendly_name Light
    switch_datapoint: 101
    dimmer_datapoint: 6
    min_value: 10
    max_value: 1000

fan:
  - platform: tuya
    name: Fan
    switch_datapoint: 1
    speed_datapoint: 3
    speed_count: 4 

select:
  - platform: tuya
    enum_datapoint: 106
    name: Dimming Curve
    entity_category: CONFIG
    optimistic: true
    options:
      0: Low
      1: Mid
      2: High

number:
  - platform: tuya
    number_datapoint: 105
    name: Dimmer Floor
    entity_category: CONFIG
    min_value: 10
    max_value: 1000
    step: 10
  # 0 - indicator on when light/fan off, 1 - indicator on when light/fan on
  - platform: tuya
    number_datapoint: 108
    name: Indicator Mode
    entity_category: CONFIG
    min_value: 0
    max_value: 1
    step: 1
```
