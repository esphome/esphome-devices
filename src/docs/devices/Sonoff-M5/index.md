---
title: Sonoff M5 Wall Switch 1/2/3-gang
date-published: 2023-07-30
type: switch
standard: eu
board: esp32
difficulty: 3
---

## Notes

- status LED (blue) in left-most button
- channel LEDs (red) are dimmable (PWM)
  while relays OFF; 100% bright when ON
- in 2-gang version LED 2 to/can be
  activated separately from Relay

![header](/Sonoff_M5_2gang_MB.jpg "Pin header for flashing incl. GPIO00")

## GPIO Pinout

### 1-Gang Version

| Pin    | Function                            |
| ------ | ----------------------------------- |
| GPIO00 | Button 1                            |
| GPIO23 | Relay  1 / LED 1                    |
| GPIO05 | Status LED                          |
| GPIO18 | PWM for LED 1                       |

### 2-Gang Version

| Pin    | Function                            |
| ------ | ----------------------------------- |
| GPIO04 | Button 1                            |
| GPIO15 | Button 2                            |
| GPIO23 | Relay  1 / LED 1                    |
| GPIO19 | Relay  2                            |
| GPIO22 | LED    2                            |
| GPIO05 | Status LED                          |
| GPIO18 | PWM for LED 1/2                     |

### 3-Gang Version

| Pin    | Function                            |
| ------ | ----------------------------------- |
| GPIO04 | Button 1                            |
| GPIO00 | Button 2                            |
| GPIO15 | Button 3                            |
| GPIO23 | Relay  1 / LED 1                    |
| GPIO19 | Relay  2 / LED 2                    |
| GPIO22 | Relay  3 / LED 3                    |
| GPIO05 | Status LED                          |
| GPIO18 | PWM for LED 1/2/3                   |

## Basic Configuration (2-Gang)

```yaml
esphome:
  name: Sonoff M5 2gang

esp32:
  board: esp32dev
  framework:
    type: arduino

logger:
  level: INFO

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

api:
  encryption:
    key: !secret esp_api_key

ota:
  password: !secret ota_secret

sensor:  
  - platform: wifi_signal
    name: "RSSI"
    id: sensor_rssi
    update_interval: 90s
    entity_category: "diagnostic"

  - platform: uptime
    name: "Uptime"
    id: sensor_uptime
    update_interval: 300s
    entity_category: "diagnostic"

button:
  - platform: restart
    name: "Restart"
    id: button_restart

switch:
  - platform: gpio
    name: "Left"
    pin: GPIO23
    id: relay_1

  - platform: gpio
    name: "Right"
    pin: GPIO19
    id: relay_2
    on_turn_on:
      - output.turn_on: led_2
    on_turn_off:
      - output.turn_off: led_2

output:
  - platform: gpio
    id: led_2
    pin:
      number: GPIO22
      inverted: False

  - platform: ledc
    id: pwm_output
    pin: GPIO18
    frequency: 1000 Hz

binary_sensor:
  - platform: status
    name: "Status"
    id: sensor_status

  - platform: template
    name: "API connected"
    id: sensor_api_connected
    internal: True
    entity_category: 'diagnostic'
    device_class: 'connectivity'
    lambda: return global_api_server->is_connected();
    on_press:
      - light.turn_on: led_status
    on_release:
      - light.turn_off: led_status

  - platform: gpio
    name: "Left"
    pin:
      number: GPIO04
      mode: INPUT_PULLUP
      inverted: False
    on_press:
      - switch.toggle: relay_1

  - platform: gpio
    name: "Right"
    pin:
      number: GPIO15
      mode: INPUT_PULLUP
      inverted: False
    on_press:
      - switch.toggle: relay_2

light:
  - platform: status_led
    name: "LED"
    id: led_status
    pin:
      number: GPIO05
      inverted: True
    internal: True
    restore_mode: ALWAYS_OFF

  - platform: monochromatic
    output: pwm_output
    name: "LEDs"
    restore_mode: RESTORE_DEFAULT_OFF
    icon: 'mdi:led-outline'
    entity_category: 'config'
```
