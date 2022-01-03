---
title: Mirabella Genio Wi-Fi Strip Light
date-published: 2020-01-24
type: light
standard: au
---

## General Notes

The [Mirabella Genio Wi-Fi LED Strip Light](https://mirabellagenio.net.au/led-strip-light) features a row of both RGB and cool white LEDs alternating between the two along the strip.

![Genio Wi-Fi LED Strip Light](/Mirabella-Genio-WiFi-LED-Strip-Light.jpg "Genio Wi-Fi LED Strip Light")

They are sold at Kmart in a [3m version](https://www.kmart.com.au/product/mirabella-genio-wi-fi-led-strip-light/2622813) and a [5m version](https://www.kmart.com.au/product/mirabella-genio-wi-fi-led-strip-light/2754878).

Inside is a TYWE3S module based on the ESP8266 microcontroller. It is possible to flash older units [OTA using tuya-convert](/guides/tuya-convert/) and may also work with current ones. If you attempt to flash a current unit OTA, you should update this page to include if it's still possible or not.

![Genio Wi-Fi LED Strip Light Teardown](/Mirabella-Genio-WiFi-LED-Strip-Light_Teardown.jpg "Genio Wi-Fi LED Strip Light Teardown")

## GPIO Pinout

| Pin    | Function      |
| ------ | ------------- |
| GPIO0  | Push Button   |
| GPIO4  | Light - Red   |
| GPIO5  | Light - White |
| GPIO12 | Light - Green |
| GPIO14 | Light - Blue  |

## Basic Configuration

```yaml
# Config for Mirabella Genio WiFi LED Strip Light
# https://www.esphome-devices.com/devices/Mirabella-Genio-WiFi-LED-Strip-Light/
esphome:
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: "strip_light"
    password: "ap_password"

# Enable logging
logger:

# Enable Home Assistant API
api:
  password: "api_password"

ota:
  password: "ota_password"

output:
  - platform: esp8266_pwm
    id: output_red
    pin: GPIO4
  - platform: esp8266_pwm
    id: output_green
    pin: GPIO12
  - platform: esp8266_pwm
    id: output_blue
    pin: GPIO14
  - platform: esp8266_pwm
    id: output_white
    pin: GPIO5

light:
  - platform: rgbw
    name: "Strip Light"
    id: strip_light
    red: output_red
    green: output_green
    blue: output_blue
    white: output_white

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: true
    name: "strip_light_pushbutton"
    internal: true
    on_press:
      then:
        - light.toggle: strip_light
```
