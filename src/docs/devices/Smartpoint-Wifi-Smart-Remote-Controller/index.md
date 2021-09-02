---
title: Smartpoint-Wifi-Smart-Remote-Controller
date-published: 2021-09-02
type: misc
standard: global
---

![Product Image](/Smartpoint-Wifi-Smart-Remote-Controller.jpg "Product Image")
Manufacturer: [SmartPoint](https://www.smartpointco.com/product-page/smart-wifi-remote-control)

Available at:
    - [Walmart](https://www.walmart.com/ip/Smartpoint-Wifi-Smart-Remote-Controller-Compatible-with-Alexa-and-Google-Assistant-Hands-Free-Voice-Control/824016383)
    - [Amazon](https://www.amazon.com/dp/B08NFBJCSQ/)

## GPIO Pinout

| Pin    | Function            |
| ------ | ------------------- |
| GPIO4  | External Blue LED   |
| GPIO5  | IR Receiver         | 
| GPIO14 | IR Blaster Array    |

## Flashing

A note about flashing this device:
    - On older models of this device, [tuya-convert](https://github.com/ct-Open-Source/tuya-convert) should be able to flash this device, but I am unsure how old the device needs to be for this method to still work.
    - On newer patched devices (likely yours), [tuya-convert](https://github.com/ct-Open-Source/tuya-convert) will not work. In order to flash, gain access to the [TYWE3S](https://tasmota.github.io/docs/Pinouts/#tywe3s) board by prying off the top of the device and unscrewing the PCB from the plastic housing. On the underside of the PCB, the [TYWE3S](https://tasmota.github.io/docs/Pinouts/#tywe3s) board will reveal itself.

## Basic Configuration

```yaml
substitutions:
  devicename: smartpoint-ir
  friendly_name: Smartpoint IR

# Set device attributes
esphome:
  name: $devicename
  platform: ESP8266
  board: esp01_1m

# Enable Wi-Fi connection
wifi:
  ssid: My_Wireless
  password: !secret wifi_password
  ap:
    ssid: ESP-${devicename}
    password: !secret fallback_password

# Enable captive poral
captive_portal:

# Enable websever
web_server:
  port: 80
  auth:
    username: !secret web_username
    password: !secret web_password

# Enable HomeAssistant API
api:
  password: !secret api_password

# Enable OTA updates
ota:
  password: !secret ota_password
  safe_mode: True

# Enable logging without UART support as there would be no way to read it
logger:
  baud_rate: 0

# Enable external blue LED as a status indictator
status_led:
  pin:
    number: GPIO4

# Enable the IR receiver to dump all IR commands to the log. Change dump type to your capture remote type. Use the captured IR command to replicate that IR command. You can disable this part when you aren't capturing IR command data.
remote_receiver:
  pin: GPIO5
  dump: all

# Enable the remote transmitter
remote_transmitter:
  pin: GPIO14
  carrier_duty_percent: 50%

# Simple example template switch to control the power of a Samsung TV using IR commands
switch:
  - platform: template
    name: "TV Power"
    optimistic: true
    assumed_state: true
    turn_on_action:
        # Data would be the IR command captured in the log by the remote receiver
      - remote_transmitter.transmit_samsung:
          data: 0xE0E09966
    turn_off_action:
        # Data would be the IR command captured in the log by the remote receiver
      - remote_transmitter.transmit_samsung:
          data: 0xE0E019E6

```
