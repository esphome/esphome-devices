---
title: DETA Outdoor Double Powerpoint (6294HA)
date-published: 2023-04-10
type: plug
standard: au
---

## General Notes

The [DETA Outdoor Double Powerpoint](https://www.bunnings.com.au/deta-grid-connect-smart-outdoor-double-powerpoint_p0172781) is supplied with a WB2S module that requires replacing with a ESP-02S or equivalent module.

Power measuring uses a HLW8032, CSE7766 compatible protocol at 4800 baud. As RX pin is used, you must program the device before installing module.

## GPIO Pinout

| Pin    | Function                  |
| ------ | ------------------------- |
| GPIO03 | RX for CSE7766            |
| GPIO04 | Button 1 (inverted)       |
| GPIO05 | LED (inverted)            |
| GPIO12 | Button 2 (inverted)       |
| GPIO13 | Relay 1                   |
| GPIO14 | Relay 2                   |

## Calibration

Frenck has an excellant [article](https://frenck.dev/calibrating-an-esphome-flashed-power-plug/#7-applying-corrections-to-the-firmware) for calibrating the filters.

## Configuration

Includes examples of calibration data, change as required.

```yaml
substitutions:
  name: "deta-outdoor-2g-01"
  friendly_name: "DETA Outdoor 2G"
  project_name: "DETA.6294HA"
  project_version: "1.0"
  device_description: "Outdoor Power Switch"

esphome:
  name: "${name}"
  comment: "${device_description}"
  project:
    name: "${project_name}"
    version: "${project_version}"

esp8266:
  board: esp01_1m

# Enable logging (no UART)
logger:
  level: DEBUG
  baud_rate: 0

# Enable Home Assistant API
api:
  encryption:
    key: "your key"

ota:
  password: "your password"

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Deta-Outdoor-2G-01"
    password: "fallback password"

captive_portal:

sensor:
  - platform: wifi_signal
    name: "${friendly_name} wifi signal"
    update_interval: 600s
  - platform: uptime
    name: Uptime Sensor
    id: uptime_sensor
    update_interval: 60s
    disabled_by_default: true
    on_raw_value:
      then:
        - text_sensor.template.publish:
            id: uptime_human
            state: !lambda |-
              int seconds = round(id(uptime_sensor).raw_state);
              int days = seconds / (24 * 3600);
              seconds = seconds % (24 * 3600);
              int hours = seconds / 3600;
              seconds = seconds % 3600;
              int minutes = seconds /  60;
              seconds = seconds % 60;
              return (
                (days ? to_string(days) + "d " : "") +
                (hours ? to_string(hours) + "h " : "") +
                (minutes ? to_string(minutes) + "m " : "") +
                (to_string(seconds) + "s")
              ).c_str();
  - platform: cse7766
    update_interval: 3s
    current:
      name: current
      unit_of_measurement: A
      accuracy_decimals: 3
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
          - 0.0 -> 0.00
          - 0.02673 -> 0.056
          - 7.99895 -> 7.679
    voltage:
      name: voltage
      unit_of_measurement: V
      accuracy_decimals: 1
      filters:
      # Map from sensor -> measured value
        - calibrate_linear:
          - 0.0 -> 0.0
          - 121.08233 -> 227.9
    power:
      id: power
      name: power
      unit_of_measurement: W
      accuracy_decimals: 0
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
          - 0.0 -> 0.00
          - 9.32028 -> 15.13
          - 1138.26147 -> 2023
uart:
  rx_pin: RX
  baud_rate: 4800

status_led:
  pin:
    number: GPIO5
    inverted: True

switch:
  # Top (or only) button
  - platform: gpio
    pin: GPIO13
    id: relay1
  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: gpio
    pin: GPIO14
    id: relay2
  - platform: template
    name: "${friendly_name} Left Socket"
    id: relay_template1
    lambda: |-
      if (id(relay1).state) {
        return true;
      } else {
        return false;
      }
    turn_on_action:
      - switch.turn_on: relay1
    turn_off_action:
      - switch.turn_off: relay1

  - platform: template
    name: "${friendly_name} Right Socket"
    id: relay_template2
    lambda: |-
      if (id(relay2).state) {
        return true;
      } else {
        return false;
      }
    turn_on_action:
      - switch.turn_on: relay2
    turn_off_action:
      - switch.turn_off: relay2

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO4
      mode: INPUT
      inverted: True
    id: button1
    name: "${friendly_name} Left Button"
    on_click:
      - min_length: 300ms
        max_length: 1000ms
        then:
          - switch.toggle: relay_template1
    internal: True
  - platform: gpio
    pin:
      number: GPIO12
      mode: INPUT
      inverted: True
    id: button2
    name: "${friendly_name} Right Button"
    on_click:
      - min_length: 300ms
        max_length: 1000ms
        then:
          - switch.toggle: relay_template2
    internal: True

button:
  - platform: restart
    id: restart_button
    name: "${friendly_name} Restart"
    disabled_by_default: true

text_sensor:
  - platform: wifi_info
    ip_address:
      name: "${friendly_name} IP Address"
      disabled_by_default: true
    bssid:
      name: "${friendly_name} BSSID"
      disabled_by_default: true
  - platform: template
    name: Uptime
    id: uptime_human
    icon: mdi:clock-start
```
