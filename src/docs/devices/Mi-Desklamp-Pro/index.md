---
title: Xiaomi Mi Smart LED Desk Lamp Pro
date-published: 2021-09-09
type: light
standard: eu
---

```yaml
esphome:
  name: midesklamppro
  platform: ESP32
  board: esp32doit-devkit-v1
  platformio_options:
    platform:
     - espressif32@3.0.0
    platform_packages:
     - tasmota/framework-arduinoespressif32 @ 3.10006.210420

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

# Enable logging
logger:

api:
  reboot_timeout: 0s
  password: !secret password

ota:
  password: !secret password

sensor:
  - platform: rotary_encoder
    id: rotation
    pin_a: GPIO26
    pin_b: GPIO27
    resolution: 2
    on_value:
      then:
        - if:
            condition:
              # Check if Button is pressed while rotating
              lambda: "return id(button).state;"
            then:
              # If Button is pressed, change CW/WW
              - lambda: |-
                  auto min_temp = id(light1).get_traits().get_min_mireds();
                  auto max_temp = id(light1).get_traits().get_max_mireds();
                  auto cur_temp = id(light1).current_values.get_color_temperature();
                  auto new_temp = max(min_temp, min(max_temp, cur_temp + (x*10)));
                  auto call = id(light1).turn_on();
                  call.set_color_temperature(new_temp);
                  call.perform();
            else:
              # If Button is not pressed, change brightness
              - light.dim_relative:
                  id: light1
                  relative_brightness: !lambda |-
                    return x / 25.0;
        # Reset Rotation to 0
        - sensor.rotary_encoder.set_value:
            id: rotation
            value: 0

binary_sensor:
  - platform: gpio
    id: button
    pin:
      number: GPIO33
      inverted: True
      mode: INPUT_PULLDOWN
    on_click:
      then:
        - light.toggle: light1

output:
  - platform: ledc
    pin: GPIO2
    id: output_cw
    frequency: 40000Hz
    power_supply: power
  - platform: ledc
    pin: GPIO4
    id: output_ww
    power_supply: power
    frequency: 40000Hz

power_supply:
  - id: power
    pin: GPIO12
    enable_time: 0s
    keep_on_time: 0s

light:
  - platform: cwww
    id: light1
    default_transition_length: 0s
    constant_brightness: true
    name: "Lights"
    cold_white: output_cw
    warm_white: output_ww
    cold_white_color_temperature: 4800 K
    warm_white_color_temperature: 2500 K #2500k is the original value of the lamp. To correct binning for 2700k to look more like 2700k use 2650k instead
    restore_mode: ALWAYS_ON
    gamma_correct: 0
```
