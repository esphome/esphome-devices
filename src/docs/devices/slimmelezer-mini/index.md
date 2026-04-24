---
title: SlimmeLezer Mini
date-published: 2026-04-24
type: sensor
standard: global
board: esp32c3
difficulty: 1
made-for-esphome: true
project-url: https://github.com/zuidwijk/SlimmeLezer/tree/main/Mini
---

# SlimmeLezer Mini

<!-- Describe the device here. See the front-matter table on the contributing page for valid options. -->

## Basic Configuration

```yaml
substitutions:
  device_name: slimmelezer-mini
  device_description: "SlimmeLezer Mini (ESP32C3) module to read your smart meter"
  friendly_name: SlimmeLezer Mini

esphome:
  name: ${device_name}
  comment: "${device_description}" 
  name_add_mac_suffix: false
  project: 
    name: "zuidwijk.slimmelezer-mini"
    version: "1.0"
  platformio_options:
    upload_speed: 1500000
    board_build.flash_mode: dio
    
esp32:
  board: esp32-c3-devkitm-1
  framework:
    type: esp-idf

wifi:
  power_save_mode: none
#  ssid: !secret wifi_ssid 
#  password: !secret wifi_password

# Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: ${device_name}
    ap_timeout: 15s

improv_serial:
  next_url: http://{{ip_address}}

captive_portal:

time:
  - platform: homeassistant
    id: esptime

esp32_improv:
  authorizer: none

status_led:
  pin:
    number: GPIO08
    inverted: true
    id: led

api:
  reboot_timeout: 0s
  services:
    - service: slimmelezer_reboot
      then:
        - button.press:
            id: reboot
ota:
  - platform: esphome
  - platform: web_server


dashboard_import:
  package_import_url: github://zuidwijk/slimmelezer/mini/config.yaml
  

web_server:
  port: 80
  
# Enable logging
logger:
  level: DEBUG

uart:
  - id: p1_uart
    rx_pin:
      number: 20
      inverted: true
    baud_rate: 115200
    rx_buffer_size: 1700

dsmr:
  id: dsmr_instance
  uart_id: p1_uart
  receive_timeout: 200ms
  max_telegram_length: 2400
#  gas_mbus_id: 2 //change mbus position of gas meter
#  water_mbus_id: 2
#  crc_check: false #dsmr2

switch:
  - platform: factory_reset
    name: Restart with Factory Default Settings
    id: resetbutton
    internal: true

button:  
  - platform: restart
    name: "_Restart device"
    id: reboot
  - platform: factory_reset
    name: "_Restart with Factory Default Settings"

binary_sensor:
  - platform: gpio
    name: "Reset switch GPIO9"
    pin: 
      number: GPIO09
      mode:
        input: true
        pullup: true
#    on_press: 
#      then:
#        - logger.log: "Reset button pressed"
#        - switch.turn_on: resetbutton

sensor:
  - platform: dsmr
    energy_delivered_lux:
      name: "Energy Consumed Luxembourg"
      state_class: total_increasing
    energy_delivered_tariff1:
      name: "Energy Consumed Tariff 1"
      state_class: total_increasing
      device_class: energy
    energy_delivered_tariff2:
      name: "Energy Consumed Tariff 2"
      state_class: total_increasing
      device_class: energy
    energy_returned_lux:
      name: "Energy Produced Luxembourg"
      state_class: total_increasing
    energy_returned_tariff1:
      name: "Energy Produced Tariff 1"
      state_class: total_increasing
    energy_returned_tariff2:
      name: "Energy Produced Tariff 2"
      state_class: total_increasing
    power_delivered:
      name: "Power Consumed"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    power_returned:
      name: "Power Produced"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    electricity_failures:
      name: "Electricity Failures"
      icon: mdi:alert
    electricity_long_failures:
      name: "Long Electricity Failures"
      icon: mdi:alert
    voltage_l1:
      name: "Voltage Phase 1"
    voltage_l2:
      name: "Voltage Phase 2"
    voltage_l3:
      name: "Voltage Phase 3"
    current_l1:
      name: "Current Phase 1"
    current_l2:
      name: "Current Phase 2"
    current_l3:
      name: "Current Phase 3"
    power_delivered_l1:
      name: "Power Consumed Phase 1"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    power_delivered_l2:
      name: "Power Consumed Phase 2"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    power_delivered_l3:
      name: "Power Consumed Phase 3"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    power_returned_l1:
      name: "Power Produced Phase 1"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    power_returned_l2:
      name: "Power Produced Phase 2"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    power_returned_l3:
      name: "Power Produced Phase 3"
      unit_of_measurement: "W"
      state_class: "measurement"
      accuracy_decimals: 0
      filters:
        - multiply: 1000
    water_delivered:
      name: Water delivered
      state_class: total_increasing
    gas_delivered:
      name: "Gas Consumed"
      state_class: total_increasing
#for Belgium users
    gas_delivered_be:
      name: "Gas Consumed Belgium"
      state_class: total_increasing
    active_energy_import_current_average_demand:
      name: "Current Average Demand"
    active_energy_import_maximum_demand_running_month:
      name: "Maximum Month Demand"
    active_energy_import_maximum_demand_last_13_months:
      name: "13 Month Maximum Quarterly Demand"      
  - platform: uptime
    name: "Uptime"
  - platform: wifi_signal
    name: "Wi-Fi Signal"
    update_interval: 60s

text_sensor:
  - platform: dsmr
    identification:
      name: "DSMR Identification"
    p1_version:
      name: "DSMR Version"
    p1_version_be:
      name: "DSMR Version Belgium"
  - platform: version
    name: "ESPHome Version"
    hide_timestamp: true
  - platform: wifi_info
    ip_address:
      name: "IP Address"
    ssid:
      name: "Wi-Fi SSID"
    bssid:
      name: "Wi-Fi BSSID"```
