---
title: Advanced Detection Solutions Wi-Fi Temperature Monitor (WSM-1A)
date-published: 2025-12-01
type: sensor
standard: global
board: esp8266
---

## Product description

The Advanced Detection Solutions Wi-Fi Temperature Monitor (WSM-1A) is a two zone Wi-Fi temperature monitor. It is designed for use with a proprietary cloud backend but can be repurposed as a generic ESPHome device. The board uses an ESP8266MOD (ESP-12F chip). After removing the bottom housing, it runs on an ESP8266MOD (ESP-12F). The board has two 3.5mm stereo jack inputs for DS18B20 one wire thermometers, a microUSB port (which is only used for 5V power and has no data function) and 5V barrel power connector either of which can be used to power the device, a reset button, a green status LED to indicate power on and a GPIO controlable orange LED. 

If using factory software, holding reset puts it into Wi-Fi hotspot mode. Connecting to the hotspot only allows for connection to another Wi-Fi network. Once it joins Wi-Fi, status LED goes solid green with orange flashes every 5 seconds, port 80 is opened to give a basic HTML page that reports Wi-Fi connection information (SSID, channel, signal strength) only and provides input to change Wi-Fi network credentials only; it does not report temperature data on this page. If Wi-Fi credentials are wrong, status LED turns solid orange. All other features require a cloud subscription to use on factory firmware.

ESPHome is flashed intially using a USB to Serial TTL converter and connecting the ESP8266 TxD/GPIO1 to RxD, RxD/GPIO3 to TxD, GND to GND and short FLASH/GPIO0 to GND.

The DS18B20 one wire thermometers are connected to GPIO2 and the orange LED is connected to GPIO15. The green LED is always on as long as the board is powered. Reset button function has not been decoded at time of writing. Fill in correct Wi-Fi credentials, encryption keys, etc. from !secret before uploading YAML code.

After uploading the YAML code, check the debug logs for the addresses of the DS18B20 thermometers and further update YAML code as necessary.

This code also programs the orange LED to flash if disconnected from Wi-Fi.

## Config

```yaml
esphome:
  name: WSM-1A
  friendly_name: Advanced Detection Solutions Wi-Fi Temperature Monitor (WSM-1A)
  comment: Two zone Wi-Fi temperature monitor

esp8266:
  board: esp01_1m

# Enable logging
logger:
  level: DEBUG

web_server:
  port: 80

#enable one wire bus for thermometers
one_wire:
  - platform: gpio
    pin: GPIO2

sensor:
# Temperature sensor 1 
  - platform: dallas_temp
    name: Temperature_1
    update_interval: 30s
    address: (FILL IN ONE-WIRE BUS ADDRESS)
    unit_of_measurement: "°C"
    device_class: "temperature"
    accuracy_decimals: 1
    state_class: "measurement"
    icon: "mdi:thermometer"
# Temperature sensor 2
  - platform: dallas_temp
    name: Temperature_2
    update_interval: 30s
    address: (FILL IN ONE-WIRE BUS ADDRESS)
    unit_of_measurement: "°C"
    device_class: "temperature"
    accuracy_decimals: 1
    state_class: "measurement"
    icon: "mdi:thermometer"
#Wifi signal strength
  - platform: wifi_signal
    name: "WiFi Signal Strength"
    unit_of_measurement: "dBm"
    accuracy_decimals: 0
    update_interval: 30s
# Uptime
- platform: uptime
    type: seconds
    name: Uptime

switch:
#Orange LED switch
  - platform: gpio
    pin: GPIO15
    id: "Orange_LED"
    restore_mode: ALWAYS_OFF

ota:
  - platform: esphome
    password: "ota_password"

# Enable Home Assistant API
api:
  encryption:
    key: !secret api_encryption_key    

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  reboot_timeout: 0s  # Disable automatic reboot
  power_save_mode: none
  fast_connect: true # Trigger when Wi-Fi disconnects
  on_disconnect:
    - logger.log: "Wi-Fi Disconnected! Attempting reconnection..."
    - while:
        condition:
          not:
            wifi.connected:
        then:
          - switch.turn_on: Orange_LED
          - delay: 500ms
          - switch.turn_off: Orange_LED
          - delay: 500ms


  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "WSM-1A Fallback Hotspot"
    password: !secret captive_portal_password

captive_portal:

```
