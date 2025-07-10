---
title: Duux Borsa Dehumidifier (DXDH02)
date-published: 2025-07-10
type: misc
standard: eu
board: esp32
made-for-esphome: False
difficulty: 3
---



## GPIO Pinout

| Pin    | Function   |
| ------ | ---------- |
| GPIO00 | Nono       |
| GPIO01 | None       |
| GPIO02 | None       |
| GPIO03 | None       |
| GPIO04 | None       |
| GPIO05 | None       |
| GPIO09 | None       |
| GPIO10 | None       |
| GPIO12 | None       |
| GPIO16 | Tuya Rx    |
| GPIO14 | None       |
| GPIO17 | Tuya Tx    |
| GPIO16 | None       |
|  FLAG  | None       |

## Basic Configuration

```yaml

esphome:
  name: $devicename
  friendly_name: "Duux Dehumidifier DXDH02"

esp32:
  board: esp32dev
  framework:
    type: esp-idf

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key:

ota:
  password:

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid:
    password:

captive_portal:

time:
  - platform: homeassistant
    id: homeassistant_time

uart:
  tx_pin: GPIO17
  rx_pin: GPIO16
  baud_rate: 9600
  debug:

# Register the Tuya MCU connection
tuya:
 on_datapoint_update:
  - sensor_datapoint: 11
    datapoint_type: bitmask
    then:
      - lambda: |-
          ESP_LOGD("main", "on_datapoint_update %s", format_hex_pretty(x).c_str());
          // only seen in the wild is decimal value 8, for Water Tank Full
          id(water_tank_full).publish_state((x >> 3) & 1);

binary_sensor:
  - platform: template
    id: water_tank_full
    name: "Water tank"
    device_class: problem
    icon: "mdi:water-alert"

switch:
  - platform: tuya
    name: "Power"
    switch_datapoint: 1
  - platform: tuya
    name: "Night mode"
    icon: "mdi:sleep"
    switch_datapoint: 5
  - platform: tuya
    name: "Child lock"
    icon: "mdi:lock"
    switch_datapoint: 7
  - platform: tuya
    name: "Cleaning Mode"
    icon: "mdi:monitor-shimmer"
    switch_datapoint: 101

number:
  - platform: tuya
    name: "Target humidity"
    number_datapoint: 4
    unit_of_measurement: "%"
    device_class: "humidity"
    min_value: 30
    max_value: 80
    step: 5

sensor:
  - platform: tuya
    name: "Humidity"
    sensor_datapoint: 3
    unit_of_measurement: "%"
    device_class: "humidity"
    accuracy_decimals: 0

select:
  - platform: tuya
    name: "Mode"
    icon: "mdi:cog"
    enum_datapoint: 2
    options:
      0: Auto
      1: Purify only
  - platform: tuya
    name: "Fan speed"
    icon: "mdi:fan"
    enum_datapoint: 6
    options:
      0: High
      1: Low

```

