---
title: Martin Jerry Dimmer MJ-SD01
date-published: 2019-10-11
type: dimmer
standard: us
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                              |
|---------|---------------------------------------|
| GPIO0   | up button (inverted, input_pullup)    |
| GPIO1   | down button (inverted, input_pullup)  |
| GPIO3   | led5 (inverted)                       |
| GPIO5   | led4 (inverted)                       |
| GPIO12  | led3 (inverted)                       |
| GPIO13  | pwm                                   |
| GPIO14  | led2 (inverted)                       |
| GPIO15  | main button (input_pullup)            |
| GPIO16  | led1 + relay (inverted)               |


## Basic Configuration
```yaml
# Basic Config
---
substitutions:
#   # https://esphome.io/guides/configuration-types.html#substitutions
  device_name: martin_jerry_mj_sd01   # hostname & entity_id
  friendly_name: Martin Jerry MJ-SD01   # Displayed in HA frontend
  pwm_min_power: 15%   # keep dimming functional at lowest levels
  no_delay: 0s   # transition when changing dimmer_lvl & relay delay
  transition_length: .5s   # transition when turning on/off
  long_press_min: .4s   # minimum time to activate long-press action
  long_press_max: 2s   # maximum time to activate long-press action
  long_press_up: 100%   # long press brightness
  long_press_down: 33%   # long press brightness
  long_press_main: 50%   # long press brightness
  ip_address: !secret martin_jerry_mj_sd01_ip   # use /config/esphome/secrets.yaml


esphome:
  # https://esphome.io/components/esphome
  name: ${device_name}
  platform: ESP8266
  board: esp01_1m
  esp8266_restore_from_flash: true


wifi:
  # https://esphome.io/components/wifi
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
    channel: 1
    manual_ip: 
      static_ip: 192.168.1.1
      gateway: 192.168.1.1
      subnet: 255.255.255.0


web_server:
  port: 80
  # https://esphome.io/components/web_server.html


logger:
  # https://esphome.io/components/logger


api:
  password: !secret esphome_api_password
  # https://esphome.io/components/api


ota:
  password: !secret esphome_ota_password
  # https://esphome.io/components/ota


output:
  - platform: gpio
    # https://esphome.io/components/output/gpio.html
    pin: GPIO3
    inverted: true
    id: led5

  - platform: gpio
    # https://esphome.io/components/output/gpio.html
    pin: GPIO5
    inverted: true
    id: led4

  - platform: gpio
    # https://esphome.io/components/output/gpio.html
    pin: GPIO12
    inverted: true
    id: led3

  - platform: gpio
    # https://esphome.io/components/output/gpio.html
    pin: GPIO14
    inverted: true
    id: led2

  - platform: esp8266_pwm
    # https://esphome.io/components/output/index.html#config-output
    pin: GPIO13
    id: pwm
    power_supply: relay
    min_power: ${pwm_min_power}


light:
  - platform: monochromatic
    # https://esphome.io/components/light/monochromatic.html
    name: ${friendly_name}
    output: pwm
    default_transition_length: ${no_delay} 
    id: dimmer


power_supply:
  - id: relay
    # https://esphome.io/components/power_supply.html
    pin: 
      number: GPIO16
      inverted: True
    enable_time: ${no_delay}
    keep_on_time: ${no_delay}


binary_sensor:
  - platform: gpio
    # https://esphome.io/components/binary_sensor/gpio.html
    pin: 
      number: GPIO0
      inverted: True
      mode: INPUT_PULLUP
    name: ${friendly_name} Up Button
    id: up_button
    internal: True
    on_press:
      then:
        - lambda: |-
            if (id(dimmer_lvl) > .91) {
              id(dimmer_lvl) = 1.0;
            }
            else if (id(dimmer_lvl) <= .91) {
              id(dimmer_lvl) += .083;
            };
            id(apply_dimming).execute();
    on_click:
      # https://esphome.io/components/binary_sensor/index.html#on-click
      min_length: ${long_press_min}
      max_length: ${long_press_max}
      then:
        - light.turn_on:
            id: dimmer
            brightness: ${long_press_up}

  - platform: gpio
    # https://esphome.io/components/binary_sensor/gpio.html
    pin: 
      number: GPIO1
      inverted: True
      mode: INPUT_PULLUP
    name: ${friendly_name} Down Button
    internal: True
    on_press:
      then:
        - lambda: !lambda |-
            if (id(dimmer_lvl) < .10) {
              id(dimmer_lvl) = .01;
            }
            else if (id(dimmer_lvl) >= .10) {
              id(dimmer_lvl) -= .083;
            };
            id(apply_dimming).execute();
    on_click:
      # https://esphome.io/components/binary_sensor/index.html#on-click
      min_length: ${long_press_min}
      max_length: ${long_press_max}
      then:
        - light.turn_on:
            id: dimmer
            brightness: ${long_press_down}

  - platform: gpio
    # https://esphome.io/components/binary_sensor/gpio.html
    pin: 
      number: GPIO15
      mode: INPUT_PULLUP
    name: ${friendly_name} Main Button
    internal: True
    on_press:
      - light.toggle: dimmer
    on_click:
      # https://esphome.io/components/binary_sensor/index.html#on-click
      min_length: ${long_press_min}
      max_length: ${long_press_max}
      then:
        - light.turn_on:
            id: dimmer
            brightness: ${long_press_main}


globals:
  - id: dimmer_lvl
    # https://esphome.io/guides/automations.html#bonus-2-global-variables
    type: float
    restore_value: no
    initial_value: '1.0'


script:
  - id: apply_dimming
    # https://esphome.io/guides/automations.html#script-execute-action
    then:
      - lambda: |-
          auto call = id(dimmer).turn_on();
          call.set_brightness(id(dimmer_lvl));
          call.perform();
      - logger.log:
          format: "dimmer_lvl = %.2f"
          args: ['id(dimmer_lvl)']


interval:
  - interval: 250ms
    # https://esphome.io/guides/automations.html#interval
    then:
      - lambda: |-
          auto dimmer_vals = id(dimmer).get_current_values();
          if (dimmer_vals.is_on()) {
            id(dimmer_lvl) = dimmer_vals.get_brightness();
          }
          if (id(dimmer_lvl) > .19) { id(led2).turn_on(); }
          if (id(dimmer_lvl) < .20) { id(led2).turn_off(); }
          if (id(dimmer_lvl) > .39) { id(led3).turn_on(); }
          if (id(dimmer_lvl) < .40) { id(led3).turn_off(); }
          if (id(dimmer_lvl) > .59) { id(led4).turn_on(); }
          if (id(dimmer_lvl) < .60) { id(led4).turn_off(); }
          if (id(dimmer_lvl) > .79) { id(led5).turn_on(); }
          if (id(dimmer_lvl) < .80) { id(led5).turn_off(); }
          if (!dimmer_vals.is_on()) {
            id(led2).turn_off();
            id(led3).turn_off();
            id(led4).turn_off();
            id(led5).turn_off();
          }
 ```
