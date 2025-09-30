---
title: Xiaomi Mi Desklamp 1S
date-published: 2021-12-27
type: light
standard: eu
board: esp32
---

```yaml
substitutions:
  friendly_name: Mi Desk Lamp 1S
  device_name: mi-desklamp-1s

# Basic Config
esphome:
  name: ${device_name}
  friendly_name: ${devicename_friendly}
  comment: ${friendly_name}

esp32:
  board: esp32doit-devkit-v1
  framework:
    type: esp-idf
    sdkconfig_options:
      CONFIG_FREERTOS_UNICORE: y
    advanced:
      ignore_efuse_mac_crc: true
      # See https://github.com/esphome/issues/issues/6333
      ignore_efuse_custom_mac: true

# WiFi connection
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: on
  ap:
    ssid: ${device_name}
    password: !secret ap_password
    ap_timeout: 1min

# Enable logging
logger:

# Enable captive portal (fallback AP)
captive_portal:

# Enable Home Assistant API
api:
  reboot_timeout: 0s
  encryption:
    key: !secret encryption_key

# Enable over-the-air updates
ota:
  - platform: esphome
    password: !secret ota_password

# Enable Web server
web_server:
  port: 80

# Sync time with Home Assistant
time:
  - platform: homeassistant
    id: homeassistant_time

# Text sensors with general information
text_sensor:
  - platform: version
    name: "Version"
    icon: mdi:cube-outline

  - platform: wifi_info
    ip_address:
      name: "IP Address"
      icon: mdi:lan

sensor:
  # Uptime sensor
  - platform: uptime
    name: "Uptime"
    update_interval: 60s
    icon: mdi:clock-outline

  # WiFi Signal sensor
  - platform: wifi_signal
    name: "WiFi Signal"
    update_interval: 60s
    icon: mdi:wifi

  # Knob
  - platform: rotary_encoder
    id: rotation
    pin_a: GPIO27
    pin_b: GPIO26
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
  # Knob push-button
  - platform: gpio
    id: button
    pin:
      number: GPIO33
      inverted: True
      mode: INPUT_PULLDOWN
    on_click:
      then:
        - light.toggle:
            id: light1
            transition_length: 0.2s
    filters:
      - delayed_off: 5ms

output:
  - platform: ledc
    pin: GPIO2
    id: output_cw
    power_supply: power
    frequency: 40000Hz

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
    name: "Light"
    default_transition_length: 0s
    constant_brightness: true
    cold_white: output_cw
    warm_white: output_ww
    cold_white_color_temperature: 4800 K
    # 2500k is the original value of the lamp. To correct binning for 2700k to look more like 2700k use 2650k instead
    warm_white_color_temperature: 2500 K
    restore_mode: RESTORE_DEFAULT_OFF
    gamma_correct: 0
```
