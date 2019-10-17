---
title: Gosund WP3
date-published: 2019-10-17
type: plug
standard: us
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO04  | Push Button inverted               |
| GPIO12  | Status LED                         |
| GPIO14  | Relay 1                            |

## Basic Configuration

```yaml
# Basic Config
---
esphome:
  name: gosund_1
  platform: ESP8266
  board: esp01_1m


wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  manual_ip:
    static_ip: !secret gosund_1_ip
    gateway: !secret house_gateway
    subnet: 255.255.255.0

# Enable logging
logger:

# Enable Home Assistant API
api:
  password: !secret ha_esp_api_pw

ota:
  password: !secret gosund_1_ota
  

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO4
      mode: INPUT_PULLUP
      inverted: True
    name: "Gosund_1 button"
    on_press:
      - switch.toggle: relay

switch:
  - platform: gpio
    name: "Gosund_1 relay"
    pin: GPIO14
    id: relay

status_led:
  pin:
    number: GPIO12
    inverted: yes
    
sensor:
  - platform: wifi_signal
    name: "Gosund_1 WiFi signal"
    update_interval: 60s

  - platform: uptime
    name: "Gosund_1 uptime"

text_sensor:
  - platform: version
    name: "Gosund_1 ESPHome version"
```
