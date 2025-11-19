---
title: UMAX U-Smart Wifi Plug Duo
date-published: 2021-05-14
type: plug
standard: eu
board: esp8266
---

![alt text](umax-wifi-plug-duo.jpeg "UMAX U-Smart Wifi Plug Duo")

Tuya inside. pinouts for measurement and rations for dividers uncertain :(

Leds for active sockets are not controlled separatelly, only through the switch.

## GPIO Pinout

| Pin    | Function       |
| ------ | -------------- |
| GPIO0  | Button2i       |
| GPIO4  | HLWBL CF ???   |
| GPIO5  | HLWBL CF1 ???  |
| GPIO12 | HLWBL SELi ??? |
| GPIO13 | Status LEDi    |
| GPIO14 | Relay1         |
| GPIO15 | Relay2         |
| GPIO16 | Button1i       |

## Basic Configuration

```yaml
esphome:
  name: umax
esp8266:
  board: esp8285
wifi:
  ssid: ssid
  password: password
  ap:
    ssid: Umax Fallback Hotspot
    password: ''
logger:
  level: INFO
api: null
ota:
  id: esphome_ota
  platform: esphome
time:
- platform: homeassistant
  id: homeassistant_time
substitutions:
  plug_name: umax
  current_res: '0.05'
  voltage_div: '720'
web_server:
  port: 80
sensor:
- platform: wifi_signal
  name: ${plug_name} - WiFi Signal
  update_interval: 60s
- platform: uptime
  name: ${plug_name} - Uptime
  icon: mdi:clock-outline
  update_interval: 60s
- platform: hlw8012
  sel_pin:
    number: GPIO12
    inverted: true
  cf_pin: GPIO04
  cf1_pin: GPIO05
  current_resistor: ${current_res}
  voltage_divider: ${voltage_div}
  current:
    name: ${plug_name} - Ampere
    unit_of_measurement: A
    accuracy_decimals: 3
    icon: mdi:flash-outline
  voltage:
    name: ${plug_name} - Volt
    unit_of_measurement: V
    accuracy_decimals: 1
    icon: mdi:flash-outline
  power:
    name: ${plug_name} - Watt
    unit_of_measurement: W
    id: ${plug_name}_Wattage
    icon: mdi:flash-outline
  change_mode_every: 4
  update_interval: 3s
- platform: total_daily_energy
  name: ${plug_name} - daily
  power_id: ${plug_name}_Wattage
  filters:
  - multiply: 0.001
  unit_of_measurement: kWh
  icon: mdi:clock-alert
text_sensor:
- platform: version
  name: ${plug_name} - ESPHome Version
status_led:
  pin:
    number: GPIO13
    inverted: true
binary_sensor:
- platform: gpio
  id: button1
  internal: true
  pin:
    number: GPIO16
    mode: INPUT_PULLUP
    inverted: true
  on_press:
  - switch.toggle: relay1
- platform: gpio
  id: button2
  internal: true
  pin:
    number: GPIO00
    mode: INPUT_PULLUP
    inverted: true
  on_press:
  - switch.toggle: relay2
switch:
- platform: gpio
  pin: GPIO14
  id: relay1
  restore_mode: RESTORE_DEFAULT_OFF
  name: ${plug_name} - Switch1
  icon: mdi:power-socket-eu
- platform: gpio
  pin: GPIO15
  id: relay2
  restore_mode: RESTORE_DEFAULT_OFF
  name: ${plug_name} - Switch2
  icon: mdi:power-socket-eu
```
