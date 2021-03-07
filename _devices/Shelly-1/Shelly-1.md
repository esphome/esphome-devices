---
title: Shelly 1
date-published: 2019-10-20
type: switch
standard: uk, us, eu
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO4   | Relay                              |
| GPIO5   | Switch Input                       |

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: shelly_1
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
api:
ota:

# Device Specific Config
output:
  - platform: gpio
    pin: GPIO4
    id: shelly_1_relay

light:
  - platform: binary
    name: "Shelly 1 Light"
    output: shelly_1_relay
    id: lightid

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO5
      #mode: INPUT_PULLUP
      #inverted: True
    name: "Switch Shelly 1"
    on_state:
      then:
        - light.toggle: lightid
    internal: true
    id: switchid
```

## Detached switch mode

This config will send events to Home Assistant so you can use the Shelly as detached switch. The events can be used as triggers for automations to toggle an attached (smart) light, and to perform other actions on double click and long click (e.g. turn off all the lights on the floor, start a "go to bed" automation).

In case there is no connection to Wifi, or no API connection (normally Home Assistant) the config will toggle the relay, so it will still toggle the attached light in cases where Wifi or HA fails.

The relay is exposed to Home Assistant as a switch. As well as  some (optional) sensors with information on the ESPHome version and Wifi status

```yaml
# Basic config

substitutions:
  device_name: Shelly1
  
esphome:
  name: shelly_detached
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_pass
  
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: ${device_name} Hotspot
    password: !secret hotspot_pass
  
captive_portal:
  
# Enable logging
logger:

# Enable Home Assistant API
api:

# Enable OTA updates
ota:

# Enable Web server (optional).
web_server:
  port: 80

# Text sensors with general information.
text_sensor:
  # Expose ESPHome version as sensor.
  - platform: version
    name: ${device_name} ESPHome Version
  # Expose WiFi information as sensors.
  - platform: wifi_info
    ip_address:
      name: ${device_name} IP
    ssid:
      name: ${device_name} SSID
    bssid:
      name: ${device_name} BSSID

# Sensors with general information.
sensor:
  # Uptime sensor.
  - platform: uptime
    name: ${device_name} Uptime

  # WiFi Signal sensor.
  - platform: wifi_signal
    name: ${device_name} WiFi Signal
    update_interval: 60s

# Shelly 1 detached switch config with multi click options and fallback in case of wifi or api fail

switch:
  - platform: gpio
    name: shelly1 ${device_name}
    pin: GPIO4
    id: shelly_relay
    restore_mode: restore_default_off

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO5
    name: ${device_name} button
    # config for multi click actions
    on_multi_click:
      # double click
    - timing:
        - ON for at most 1s
        - OFF for at most 1s
        - ON for at most 1s
        - OFF for at least 0.2s
      then:
        - if:
            condition:
              and:
                - wifi.connected:
                - api.connected:
            # send double click event in case wifi and api are conncected
            then:
              - homeassistant.event:
                  event: esphome.button_pressed
                  data:
                    title: shelly ${device_name} double click
            # toggle relay in case either wifi or api are not connected
            else:
              - switch.toggle: shelly_relay
      # long click
    - timing:
        - ON for at least 1.5s
      then:
        - if:
            condition:
              and:
                - wifi.connected:
                - api.connected:
            # send long click event in case wifi and api are conncected
            then:
              - homeassistant.event:
                  event: esphome.button_pressed
                  data:
                    title: shelly ${device_name} long click
            # toggle relay in case either wifi or api are not connected
            else:
              - switch.toggle: shelly_relay
      # single click
    - timing:
        - ON for at most 1s
        - OFF for at least 0.5s
      then:
        - if:
            condition:
              and:
                - wifi.connected:
                - api.connected:
            # send single click event in case wifi and api are conncected
            then:
              - homeassistant.event:
                  event: esphome.button_pressed
                  data:
                    title: shelly ${device_name} short click
            # toggle relay in case either wifi or api are not connected
            else:
              - switch.toggle: shelly_relay
    internal: true
    id: button
```
