---
title: Orno Triple Phase Energy meter OR-WE-517
date-published: 2021-11-20
type: misc
standard: eu
board: esp8266
---

## GPIO Pinout

| Pin    | Function  |
| ------ | --------- |
| GPIO03 | modbus RX |
| GPIO01 | modbus TX |

## Connection

Use RS485 adapter like this one: [https://esphome.io/_images/rs485.jpg](https://esphome.io/_images/rs485.jpg)
This one works with 3.3V and does direction switching automatically

```yaml
esphome:
  name: energie12
esp8266:
  board: d1_mini
logger:
  level: DEBUG
  baud_rate: 0
api: null
wifi:
  ssid: your_ssid
  password: your_password
  ap:
    ssid: Fallback Hotspot
    password: xxxxxxxxxxxxxxx
uart:
  id: mod_bus
  rx_pin: GPIO01
  tx_pin: GPIO03
  baud_rate: 9600
  parity: EVEN
  stop_bits: 1
modbus:
  id: modbus1
modbus_controller:
- id: orno_we_517
  address: 1
  modbus_id: modbus1
  update_interval: 60s
  command_throttle: 1s
  setup_priority: -10
sensor:
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Voltage_L1
  id: orno_we_17_modbus_voltage_L1
  register_type: holding
  address: 14
  unit_of_measurement: V
  accuracy_decimals: 2
  value_type: FP32
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Voltage_L2
  id: orno_we_17_modbus_voltage_L2
  register_type: holding
  address: 16
  unit_of_measurement: V
  accuracy_decimals: 2
  value_type: FP32
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Voltage_L3
  id: orno_we_17_modbus_voltage_L3
  register_type: holding
  address: 18
  unit_of_measurement: V
  accuracy_decimals: 2
  value_type: FP32
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Current_L1
  id: orno_we_517_modbus_current_L1
  register_type: holding
  address: 22
  unit_of_measurement: A
  value_type: FP32
  filters:
  - multiply: 0.01
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Current_L2
  id: orno_we_517_modbus_current_L2
  register_type: holding
  address: 24
  unit_of_measurement: A
  value_type: FP32
  filters:
  - multiply: 0.01
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 03_Current_L3
  id: orno_we_517_modbus_current_L3
  register_type: holding
  address: 26
  unit_of_measurement: A
  value_type: FP32
  filters:
  - multiply: 0.01
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 03_Current_ALL
  id: orno_we_517_modbus_current_ALL
  register_type: holding
  address: 28
  unit_of_measurement: kW
  value_type: FP32
  filters:
  - multiply: 0.01
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Leistung_L1
  id: orno_we_517_modbus_Kw_01
  register_type: holding
  address: 30
  unit_of_measurement: kW
  value_type: FP32
  filters:
  - multiply: 1000
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Leistung_L2
  id: orno_we_517_modbus_Kw_02
  register_type: holding
  address: 32
  unit_of_measurement: kW
  value_type: FP32
  filters:
  - multiply: 1000
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Leistung_L3
  id: orno_we_517_modbus_Kw_03
  register_type: holding
  address: 34
  unit_of_measurement: kW
  value_type: FP32
  filters:
  - multiply: 1000
- platform: modbus_controller
  modbus_controller_id: orno_we_517
  name: 02_Hz_L1
  id: orno_we_17_modbus_Hz
  register_type: holding
  address: 20
  unit_of_measurement: Hz
  accuracy_decimals: 2
  value_type: FP32
```
