---
title: Arlec DCF4002WHA/DCF4002BHA Ceiling Fan+Light
date-published: 2023-12-17
type: fan
standard: au
board: bk72xx
---

The Arlec DCF4002 ceiling Fan+Light combo, marketed as the "Smart Madrid" model by Arlec is part of the [Grid Connect ecosystem](https://grid-connect.com.au/) and is sold at Bunnings in Australia and New Zealand.

The device comes with a BK7231T chip in the same form factor as an ESP8266, and uses a Tuya MCU for device control.  The BK731T is mounted on a daughterboard on pin headers, which allows for easy removal and reflashing without needing a soldering iron.

The LibreTiny Chip Tool [ltchiptool](https://github.com/libretiny-eu/ltchiptool) can be used to reflash the board via its UART pins which are exposed via the pin header. Reflashing via UART using ltchiptool is covered in this [guide on YouTube for installing ESPHome on a Tuya Beken BK7231 w/ltchiptool](https://www.youtube.com/watch?v=t0o8nMbqOSA), however we recommend peforming the following steps:

- Open the ESPHome Add-On Dashboard
- Click "New Device" in the bottom-right corner
- Click Continue
- Enter a name for the device and click Next
- Click on any of the device types
- On the next screewn, click SKIP. Do not click Install
- When the device is listed in the dashboard, click Edit
- Paste in the YAML config from this page
- Click Save
- Click Install
- Select the "Manual Download" option
- Download the UF2 version of the file and Flash using ltchiptool

## Basic Configuration

It is critical that you disable serial logging as per the YAML provided here.  If you do not do this, the Tuya MCU spits out gibberish and is not recognised by ESPHome.

```yaml
esphome:
  name: Arlec-fanlight
  friendly_name: Arlec Fan+Light

bk72xx:
  board: generic-bk7231t-qfn32-tuya

# Dissble Serial Logging so the Tuya MCU functions
logger:
  baud_rate: 0

api:

ota:

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  # This config assumes you have defined a shared password in the ESPHome secrets file.
  ap:
    ssid: "Arlec-Fanlight"
    password: !secret wifi_ap_password

captive_portal:

uart:
  rx_pin: RX1
  tx_pin: TX1
  baud_rate: 9600  # This is a common baud rate for Tuya devices

# Configure the Tuya component and ignore the datapoints not used in this configuration (e.g. sleep timer)
tuya:
  ignore_mcu_update_on_datapoints:
    - 102
    - 103

# Fan configuration
fan:
  - platform: tuya
    name: "Ceiling Fan"
    id: ceiling_fan
    switch_datapoint: 1
    speed_datapoint: 3
    direction_datapoint: 4
    speed_count: 6

# Light configuration
light:
  - platform: tuya
    name: "Light"
    id: ceiling_fan_light
    switch_datapoint: 9
    dimmer_datapoint: 10
    min_value: 10
    max_value: 100
    color_temperature_datapoint: 11
    color_temperature_max_value: 216
    color_temperature_invert: false
    cold_white_color_temperature: 6493 K
    warm_white_color_temperature: 2825 K
```
