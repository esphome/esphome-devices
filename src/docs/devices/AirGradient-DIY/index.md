---
title: AirGradient-DIY
date-published: 2021-09-23
type: sensor
standard: us
---

Air environment sensor from PM2.5, CO2, Temperature and Humidity from [AirGradient](https://www.airgradient.com/diy/).

Variations of the components are possible. Check your components.

This configuration does not include support for an LCD screen on the sensor board; adding support may be possible.

If you have multiple sensor boards, you will likely need to make each sensor name unique across the boards
(e.g. "1st AirGradient Temperature"), so there aren't naming conflicts.

## Basic Configuration

```yaml
esphome:
  name: airgradient
  platform: ESP8266
  board: d1_mini

# Enable logging
logger:

# Enable Home Assistant API
api:
  password: ""

ota:
  password: ""

captive_portal:

i2c:
  sda: D2
  scl: D1

uart:
  - rx_pin: D5
    tx_pin: D6
    baud_rate: 9600
    id: uart1
  - rx_pin: D4
    tx_pin: D3
    baud_rate: 9600
    id: uart2

sensor:
  - platform: sht3xd
    temperature:
      id: temp
      name: "Temperature"
    humidity:
      id: humidity
      name: "Humidity"
    address: 0x44
    update_interval: 5s
  - platform: pmsx003
    type: PMSX003
    uart_id: uart1
    pm_2_5:
      id: pm25
      name: "Particulate Matter <2.5µm Concentration"
  - platform: senseair
    uart_id: uart2
    co2:
      id: co2
      name: "SenseAir CO2 Value"
    update_interval: 60s
```
