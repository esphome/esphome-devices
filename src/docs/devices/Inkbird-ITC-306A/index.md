---
title: Inkbird ITC-306A
date-published: 2024-04-08
type: misc
standard: uk, us, eu, au
board: RTL8710BN
made-for-esphome: False
difficulty: 4
---

The Inkbird ITC-306A is similar to ITC-308 (wireless temperature controller that comes in a variety of socket types) but designed for aquarium use and controls only the heater element.

## WiFi Modules

Tuya WR3 with RTL8710BN.

## Flashing

The WR3 sits on a daughter board which needs to be desoldered before flashing. Detailss on flashing procedure: https://docs.libretiny.eu/boards/wr3/

## Board Configuration

```yaml
eesphome:
  name: inkbird_itc-306a
  comment: Reef tank Temperature control and logger
  area: Reef

rtl87xx:
  board: wr3

# Enable logging
logger:
  baud_rate: 115200

uart:
  rx_pin: PA18
  tx_pin: PA23
  baud_rate: 9600

  
# Enable Home Assistant API
api:
  encryption:
    key: "/zNq2DikrAMMpyMwvkJciJAshuJD6VtoFfLXVFRp4Iw="

ota:
  password: "senha1"

web_server:
  port: 80

wifi:
  ssid: "HFNET"
  password: "6791J@B!3n1974"

  manual_ip:
    static_ip: 10.17.1.97
    gateway: 10.17.1.1
    subnet: 255.255.255.0  

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ITC306A"
    password: "nk2QvmzRqbRj"

captive_portal:
    
tuya:

########################
# Start Sensors Config #
########################
sensor:
  - platform: wifi_signal
    name: "WiFi Status"
    update_interval: 60s

  - platform: tuya
    name: "Current Temp."
    sensor_datapoint: 104
    accuracy_decimals: 1
    icon: mdi:thermometer
    unit_of_measurement: "°C"
    filters:
     - multiply: 0.1

select:
  - platform: "tuya"
    name: "Power Status"
    enum_datapoint: 103
    optimistic: true
    options:
      0: "On"
      1: "Off"
    icon: mdi:toggle-switch      
      
binary_sensor:
  - platform: "tuya"
    name: "Heater"
    id: "heater_relay_status"
    sensor_datapoint: 115
    icon: mdi:toggle-switch

  - platform: "tuya"
    name: "High Temp. Alarm"
    sensor_datapoint: 111
    icon: mdi:alarm-light

  - platform: "tuya"
    name: "Low Temp. Alarm"
    sensor_datapoint: 112
    icon: mdi:alarm-light

  - platform: "tuya"
    name: "Temperature Alarm"
    sensor_datapoint: 113
    icon: mdi:alarm-light

  - platform: "tuya"
    name: "Probe1 Alarm"
    sensor_datapoint: 117
    icon: mdi:alarm-light

  - platform: "tuya"
    name: "Probe2 Alarm"
    sensor_datapoint: 118
    icon: mdi:alarm-light

  - platform: "tuya"
    name: "Heater Alarm"
    sensor_datapoint: 119
    icon: mdi:alarm-light

  - platform: "tuya"
    name: "Heating Time Alarm"
    sensor_datapoint: 120
    icon: mdi:timer-alert
    
number:
  - platform: "tuya"
    name: "Temp. Calibration"
    number_datapoint: 102
    mode: box
    min_value: -9.9
    max_value: 9.9
    step: 0.1
    unit_of_measurement: "°C"
    multiply: 10
    icon: mdi:tune

  - platform: "tuya"
    name: "Heater turns on at (T1)"
    number_datapoint: 106
    mode: box
    min_value: 20
    max_value: 35
    step: 0.1
    unit_of_measurement: "°C"
    multiply: 10
    icon: mdi:thermometer-low

  - platform: "tuya"
    name: "Heater turns off at (T2)"
    number_datapoint: 114
    mode: box
    min_value: 20
    max_value: 35
    step: 0.1
    unit_of_measurement: "°C"
    multiply: 10
    icon: mdi:thermometer-high

  - platform: "tuya"
    name: "Continuous Heating Time"
    number_datapoint: 108
    mode: box
    min_value: 0
    max_value: 72
    step: 1
    unit_of_measurement: "Minutes"
    icon: mdi:clock

  - platform: "tuya"
    name: "High Temp. Alarm"
    number_datapoint: 109
    min_value: 0
    max_value: 100
    step: 0.1
    multiply: 10
    icon: mdi:thermometer-alert

  - platform: "tuya"
    name: "Low Temp. Alarm"
    number_datapoint: 110
    min_value: 0
    max_value: 100
    step: 0.1
    multiply: 10
    icon: mdi:thermometer-alert

