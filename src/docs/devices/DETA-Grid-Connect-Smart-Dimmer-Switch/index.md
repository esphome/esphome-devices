---
title: DETA Grid Connect Smart Dimmer Switch 6910HA
date-published: 2022-06-23
type: dimmer
standard: au
board: esp8266
---

## General Notes

The DETA [Smart Dimmer Switch 6910HA](https://www.bunnings.com.au/deta-white-grid-connect-smart-touch-single-dimmer_p0237206) uses the UART on GPIO 1 and 3. This switch comes with a WB3S chip and requires replacement in order to be used with ESPHome.
It is still possible to convert these switches to ESPHome by replacing the WB3S chip with a ESP-12F chip and adding a 10k pull-down resister on GPIO15 as WB3S does not require it and omits it from the board.

## GPIO Pinout

| Pin    | Function      |
| ------ | ------------- |
| GPIO1  | UART TX       |
| GPIO3  | UART RX       |
| EN     | 10k pull-up   |
| RES    | 10k pull-up   |
| GPIO15 | 10k pull-down |

## Getting it up and running

These switches are Tuya devices, however as the main W3BS chip needs to be replaced with a ESP12F it is best to serial flash the unit. There's useful guide to disassemble and serial flash these switches [here.](https://blog.mikejmcguire.com/2020/05/22/deta-grid-connect-3-and-4-gang-light-switches-and-home-assistant/) After that, you can use ESPHome's OTA functionality to make any further changes.

## Dimmer Configuration

```yaml
substitutions:
  device_name: detadimmerwitch
  friendly_name: "Dimmer Switch"
  device_ip: 192.168.0.x

#################################

esphome:
  platform: ESP8266
  board: esp01_1m
  name: ${device_name}
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  manual_ip:
    static_ip: ${device_ip}
    gateway: 192.168.0.1
    subnet: 255.255.255.0
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ESPHOME"
    password: "12345678"

api:
  password: !secret api_password

ota:
  password: !secret ota_password

# The web_server & sensor components can be removed without affecting core functionaility.
web_server:
  port: 80

sensor:
  - platform: wifi_signal
    name: ${device_name} Wifi Signal Strength
    update_interval: 60s
  - platform: uptime
    name: ${device_name} Uptime

#################################
# disable logging over UART
logger:
  baud_rate: 0

# setup UART for Tuya mcu
uart:
  rx_pin: GPIO3
  tx_pin: GPIO1
  baud_rate: 9600

# Register the Tuya MCU connection
tuya:

# light settings
light:
  - platform: "tuya"
    name: "${friendly_name}"
    # dimmers current value
    dimmer_datapoint: 2
    # dimmer on/off
    switch_datapoint: 1
    min_value: 0
    max_value: 1000

switch:
  - platform: restart
    name: "${friendly_name} REBOOT"
```
