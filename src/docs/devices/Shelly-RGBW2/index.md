---
title: Shelly RGBW2
date-published: 2021-09-19
type: light
standard: uk, us, eu
---

[Amazon Link](https://amzn.to/2OAz8de)

## GPIO Pinout

| Pin   | Function     |
| ----- | ------------ |
| GPIO2 | Led Link     |
| GPIO4 | PWM 4 (W)    |
| GPI05 | Switch input |
| GPI12 | PWM 1 (R)    |
| GPI14 | PWM 3 (B)    |
| GPI15 | PWM 2 (G)    |
| A0    | OpAmp Current Monitor |

## Configuration for RGBW

```yaml
esphome:
  name: shelly_rgbw2
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

captive_portal:
logger:
api:
ota:

light:
  - platform: rgbw
    name: ledstrip_shelly_rgbw2
    red: pwm_r
    green: pwm_g
    blue: pwm_b
    white: pwm_w
    effects:
      - random:
      - strobe:
      - flicker:

output:
  - platform: esp8266_pwm
    pin: GPIO12
    frequency: 1000 Hz
    id: pwm_r

  - platform: esp8266_pwm
    pin: GPIO15
    frequency: 1000 Hz
    id: pwm_g

  - platform: esp8266_pwm
    pin: GPIO14
    frequency: 1000 Hz
    id: pwm_b

  - platform: esp8266_pwm
    pin: GPIO4
    frequency: 1000 Hz
    id: pwm_w
```

## Configuration for 4 monochromatic channels

```yaml
substitutions:
  device_name: shelly_rgbw2

esphome:
  name: ${device_name}
  platform: ESP8266
  board: esp01_1m

logger:
api:
ota:

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

light:
  - platform: monochromatic
    name: ${device_name}_ch1
    id: ${device_name}_ch1
    output: ${device_name}_out_ch1
  - platform: monochromatic
    name: ${device_name}_ch2
    id: ${device_name}_ch2
    output: ${device_name}_out_ch2
  - platform: monochromatic
    name: ${device_name}_ch3
    id: ${device_name}_ch3
    output: ${device_name}_out_ch3
  - platform: monochromatic
    name: ${device_name}_ch4
    id: ${device_name}_ch4
    output: ${device_name}_out_ch4
# Example output entry
output:
  - platform: esp8266_pwm
    id: ${device_name}_out_ch1
    pin: GPIO12
    frequency: 1000 Hz
  - platform: esp8266_pwm
    id: ${device_name}_out_ch2
    pin: GPIO15
    frequency: 1000 Hz
  - platform: esp8266_pwm
    id: ${device_name}_out_ch3
    pin: GPIO14
    frequency: 1000 Hz
  - platform: esp8266_pwm
    id: ${device_name}_out_ch4
    pin: GPIO4
    frequency: 1000 Hz


binary_sensor:
  - platform: gpio
    pin: GPIO5
    id: light_0_touch
    on_click:
      then:
      - if:
            condition:
             - light.is_off: ${device_name}_ch1
             - light.is_off: ${device_name}_ch2
             - light.is_off: ${device_name}_ch3
             - light.is_off: ${device_name}_ch4
            then:
              - light.turn_on: 
                 id: ${device_name}_ch1
                 brightness: 1.0
              - light.turn_on: 
                 id: ${device_name}_ch2
                 brightness: 1.0
              - light.turn_on: 
                 id: ${device_name}_ch3
                 brightness: 1.0
              - light.turn_on: 
                 id: ${device_name}_ch4
                 brightness: 1.0
            else:
              - light.turn_off: ${device_name}_ch1
              - light.turn_off: ${device_name}_ch2
              - light.turn_off: ${device_name}_ch3
              - light.turn_off: ${device_name}_ch4
    on_press:
      then:
      - if:
          condition: 
            light.is_off: ${device_name}_ch1
          then:
          - delay: 0.5s
          - while:
              condition:
                binary_sensor.is_on: light_0_touch
              then:
                - light.dim_relative:
                    id: ${device_name}_ch1
                    relative_brightness: 5%
                    transition_length: 0.1s
                - delay: 0.1s
                - light.dim_relative:
                    id: ${device_name}_ch2
                    relative_brightness: 5%
                    transition_length: 0.1s
                - delay: 0.1s
                - light.dim_relative:
                    id: ${device_name}_ch3
                    relative_brightness: 5%
                    transition_length: 0.1s
                - delay: 0.1s
                - light.dim_relative:
                    id: ${device_name}_ch4
                    relative_brightness: 5%
                    transition_length: 0.1s
                - delay: 0.1s                
          else:
          - delay: 0.5s
          - while:
              condition:
                and:
                  - binary_sensor.is_on: light_0_touch
                  - light.is_on: ${device_name}_ch1
              then:
                - light.dim_relative:
                    id: ${device_name}_ch1
                    relative_brightness: -5%
                    transition_length: 0.1s
                - delay: 0.1s
                - light.dim_relative:
                    id: ${device_name}_ch2
                    relative_brightness: -5%
                    transition_length: 0.1s
                - delay: 0.1s
                - light.dim_relative:
                    id: ${device_name}_ch3
                    relative_brightness: -5%
                    transition_length: 0.1s
                - delay: 0.1s
                - light.dim_relative:
                    id: ${device_name}_ch4
                    relative_brightness: -5%
                    transition_length: 0.1s
                - delay: 0.1s   
```