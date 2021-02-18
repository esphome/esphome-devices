---
title: Make Good MG-MD04W 4-Gang Wifi Switch with Power Monitoring
date-published: 2021-19-02
type: switch
standard: au
---

## TuyaMCU Pinout

| Dpid # | Component |
|:------:|----------:|
| D1 | Switch1 |
| D2 | Switch2 |
| D3 | Switch3 |
| D4 | Switch4 |
| D7 | SwitchTimer1 |
| D8 | SwitchTimer2 |
| D9 | SwitchTimer3 |
| D10 | SwitchTimer4 |
| D102 | Amps (x 0.001) |
| D103 | Watts (x 0.1) |
| D104 | Volts (x 0.1) |

## Getting it up and running

These switches can no longer be converted with Tuya-convert. See discussion here https://github.com/sillyfrog/contact/issues/4

## Basic Functionality with Power Monitoring and Device status sensors (No Timers)

```yaml
substitutions:
  device_name: mg-md04w
  friendly_name: "Touch WIFI Light Switch"

esphome:
  name: ${device_name}
  platform: ESP8266
  board: esp01_1m
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret iot_wifi_ssid
  password: !secret iot_wifi_pwd
  fast_connect: on

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: ${device_name} Fallback
    password: ""

captive_portal:

logger:
  baud_rate: 0

api:

ota:

web_server:
  port: 80

time:
  - platform: sntp
    id: my_time

tuya:

uart:
  rx_pin: GPIO3
  tx_pin: GPIO1
  baud_rate: 9600
  
sensor:
  - platform: wifi_signal
    name: Wifi Signal Strength
    update_interval: 60s
  - platform: uptime
    name: Uptime
  - platform: tuya
    name: Watts
    id: total_watts
    sensor_datapoint: 103
    unit_of_measurement: W
    accuracy_decimals: 1
    filters:
    - multiply: 0.1
  - platform: tuya
    name: Amps
    sensor_datapoint: 102
    unit_of_measurement: A
    accuracy_decimals: 3
    filters:
    - multiply: 0.001
  - platform: tuya
    name: Volts
    sensor_datapoint: 104
    unit_of_measurement: VAC
    accuracy_decimals: 0
    filters:
    - multiply: 0.1
  - platform: total_daily_energy
    name: "Total Daily Energy"
    power_id: total_watts


text_sensor:
  - platform: wifi_info
    ip_address:
      name: IP
    ssid:
      name: SSID
    bssid:
      name: BSSID
    mac_address:
      name: Mac
    
switch:
  - platform: restart
    name: REBOOT
  - platform: tuya
    name: Switch 1
    switch_datapoint: 1
  - platform: tuya
    name: Switch 2
    switch_datapoint: 2
  - platform: tuya
    name: Switch 3
    switch_datapoint: 3
  - platform: tuya
    name: Switch 4
    switch_datapoint: 4
    
```
