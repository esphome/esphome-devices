---
title: Teckin SP-20
date-published: 2019-10-11
type: plug
standard: us
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO0   | Status LED - Red                   |
| GPIO12  | sel_pin hlw8012                    |
| GPIO5   | cf_pin hlw8012                     |
| GPIO14  | cf1_pin hlw8012                    |
| GPIO2   | Status LED - Blue                  |
| GPIO13  | Button                             |
| GPIO4   | Relay                              |

## Basic Configuration
```
# Basic Config

substitutions:
  device_name: sp20
  friendly_name: SP20
  ip_address: <assigned static ip address for this device>
  
esphome:
  name: ${device_name}
  platform: ESP8266
  board: esp01_1m
  esp8266_restore_from_flash: true


wifi:
  ssid: !secret wifissid
  password: !secret wifipass
  manual_ip:
    static_ip: ${ip_address}
    gateway: !secret wifigateway
    subnet: !secret wifisubnet
    dns1: !secret wifidns
  ap:
    ssid: ${friendly_name}_AP
    password: !secret wifipass
    
web_server:
  port: 80
  

logger:


api:
  password: !secret espapipass
  

ota:
  password: !secret espotapass


time:
  - platform: homeassistant
    id: homeassistant_time


sensor:
  - platform: hlw8012
    sel_pin: 
      number: GPIO12
      inverted: True
    cf_pin: GPIO5
    cf1_pin: GPIO14
    current:
      name: ${friendly_name} Current
    power:
      name: ${friendly_name} Power
      id: power_monitor_value
      filters:
        - lambda: return (x / 2.2);
    voltage:
      name: ${friendly_name} Voltage
    current_resistor: 0.001  # default 0.001
    voltage_divider: 910  # default 2351
    change_mode_every: 3  # default 8
    update_interval: 3s  # default 60s

  - platform: total_daily_energy
    # https://esphome.io/components/sensor/total_daily_energy.html
    name: ${friendly_name} Total Daily Energy
    power_id: power_monitor_value
    filters:
      - multiply: 0.001   # convert Wh to kWh
    unit_of_measurement: kWh
    
  - platform: uptime
    name: ${friendly_name} Uptime
    
  - platform: wifi_signal
    name: ${friendly_name} Wifi Signal
    update_interval: 60s
  
text_sensor:  
  - platform: version
    name: ${friendly_name} ESPhome Version
  - platform: wifi_info
    ip_address:
      name: ${friendly_name} IP

status_led:
  pin:
    number: GPIO0   # Red LED
    inverted: True


output:
  - platform: esp8266_pwm
    id: blue_led_output
    pin:
      number: GPIO2
      inverted: True


light:
  - platform: monochromatic
    name: ${friendly_name} Blue LED
    output: blue_led_output
    id: blue_led
    default_transition_length: 1ms # default 1s
    internal: True


binary_sensor:
  - platform: gpio
    pin:
      number: GPIO13
    id: button
    name: ${friendly_name} Button
    on_press:
      - switch.toggle: relay_template
    internal: True
      

switch:
  - platform: gpio
    pin: GPIO4
    id: relay
  
  - platform: template
    # https://esphome.io/components/switch/template.html
    name: ${friendly_name}
    id: relay_template
    lambda: |-
      if (id(relay).state) {
        return true;
      } else {
        return false;
      }
    turn_on_action:
      - light.turn_on: blue_led
      - switch.turn_on: relay
    turn_off_action:
      - light.turn_off: blue_led
      - switch.turn_off: relay
```
