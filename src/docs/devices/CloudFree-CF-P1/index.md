---
title: CloudFree CF-P1
date-published: 2025-12-01
type: plug
standard: us
board: esp8266
---
  ![alt text](./cloudfree-cf-p1.jpg "Product Image")
  ![alt text](./cloudfree-cf-p1-back.jpg "Product Model Info")

Model reference: CF-P1

Equivalent devices:

- [FrankEver FK-PW801US](https://devices.esphome.io/devices/frankever-fk-pw801us/)

Manufacturer: [CloudFree](https://cloudfree.shop/)

## GPIO Pinout

| Pin    | Function                   |
|--------|----------------------------|
| GPIO02 | Blue LED (Inverted: true)  |
| GPIO13 | Push Button                |
| GPIO15 | Relay                      |

## Basic Config

```yaml
substitutions:
  devicename: cloudfree_cf_p1
  friendly_name: CloudFree CF-P1
  device_description: CloudFree smart plug with button and blue led.

esphome:
  name: ${devicename}
  comment: ${device_description}

esp8266:
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: ${friendly_name}
    password: !secret AP_Password

captive_portal:

# Enable logging
logger:

# Web server can be removed after enabling HA API
#web_server:
#  port: 80

# Enable Home Assistant API
api:
  encryption:
    key: !secret api_encryption_key

ota:
  password: !secret OTA_Password

sensor:
  # Reports how long the device has been powered (in minutes)
  - platform: uptime
    name: ${friendly_name} Uptime
    filters:
      - lambda: return x / 60.0;
    unit_of_measurement: minutes

  # Reports the WiFi signal strength
  - platform: wifi_signal
    name: ${friendly_name} Wifi Signal
    update_interval: 60s

binary_sensor:
  # Button on the front is pressed and then toggle relay
  - platform: gpio
    device_class: power
    pin:
      number: GPIO13
      mode: INPUT_PULLUP
    # Name to make button visible in HA
    name: ${friendly_name} Button
    on_press:
      - switch.toggle: relay
  # Reports On/Off Status
  - platform: status
    name: "${friendly_name} Status"
    id: "${device_name}_status"

text_sensor:
  # Reports the ESPHome Version with compile date
  - platform: version
    name: ${friendly_name} ESPHome Version

  # Reports detailed wifi info
  - platform: wifi_info
    ip_address:
      name: ${friendly_name} IP Address

switch:
  # Relay itself
  - platform: gpio
    name: ${friendly_name}
    pin: GPIO15
    id: relay
    # Try to restore relay state after reboot/power-loss event
    restore_mode: RESTORE_DEFAULT_OFF
    on_turn_on:
      - output.turn_on: ${devicename}_led
    on_turn_off:
      - output.turn_off: ${devicename}_led

output:
  # Output GPIOs for blue led
  - platform: gpio
    id: ${devicename}_led
    pin:
      number: GPIO02
      inverted: true
```
