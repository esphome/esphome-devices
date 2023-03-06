---
title: Nous A5t
date-published: 2022-12-19
type: plug
standard: eu
---

## GPIO Pinout

[see pinout](https://nous.technology/product/a5t.html?show=manual)

| Pin    | Function   |
| ------ | ---------- |
| GPIO00 | None       |
| GPIO01 | CSE7766 tx |
| GPIO02 | LedLink    |
| GPIO03 | CSE7766 rx |
| GPIO04 | None       |
| GPIO05 | Relay4i    |
| GPIO09 | None       |
| GPIO10 | None       |
| GPIO12 | Relay2     |
| GPIO13 | Relay3     |
| GPIO14 | Relay1     |
| GPIO15 | None       |
| GPIO16 | Button1    |
|  FLAG  | None       |

## Basic Configuration

```yaml

captive_portal:

substitutions:
  friendly_name: "A5T"
  devicename: "nous-a5t"
  upper_devicename: "Nous A5T"

esphome:
  name: $devicename
  platform: ESP8266
  board: esp8285

logger:
  baud_rate: 0

uart:
  rx_pin: GPIO3
  baud_rate: 4800

text_sensor:
  - platform: version
    name: "${friendly_name} - Version"
    icon: mdi:cube-outline
  - platform: wifi_info
    ip_address:
      name: "${friendly_name} - IP Address"
    mac_address:
      name: "${friendly_name} - Mac Address"

binary_sensor:
  - platform: status
    name: "${friendly_name} - Status"
    device_class: connectivity

  - platform: gpio
    pin:
      number: GPIO16
      # mode: INPUT_PULLUP
      inverted: True
    id: "${friendly_name}_button_state0"
    on_press:
      - switch.toggle: button_switch1
      - switch.toggle: button_switch2
      - switch.toggle: button_switch3

sensor:
  - platform: wifi_signal
    name: "${friendly_name} - Wifi Signal"
    update_interval: 60s
    icon: mdi:wifi

  - platform: uptime
    name: "${friendly_name} - Uptime"
    update_interval: 60s
    icon: mdi:clock-outline

  - platform: total_daily_energy
    name: "${friendly_name} - Energie"
    power_id: "power_wattage"
    filters:
      - multiply: 0.001
    unit_of_measurement: kWh
    icon: mdi:calendar-clock

  # Small buttons over ADC - see https://templates.blakadder.com/nous_A5T.html
  - platform: adc
    pin: VCC
    id: a0_vcc
    update_interval: 1s
    internal: true
    on_value_range:
      - below: 4
        then:
          - lambda: !lambda |-
              if (id(a0_vcc).state > 3) {
                id(relay1).toggle();
              } else if (id(a0_vcc).state <= 3 && id(a0_vcc).state > 2) {
                id(relay2).toggle();
              } else {
                id(relay3).toggle();
              }

  - platform: cse7766
    current:
      name: "${friendly_name} - Ampere"
      unit_of_measurement: A
      accuracy_decimals: 3
      icon: mdi:current-ac
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
            - 0.0 -> 0.013
            - 0.061 -> 0.065
            - 0.153 -> 0.1565
            - 5.072 -> 3.1869
            - 6.573 -> 6.7608
        # Make everything below 0.01A appear as just 0A.
        # Furthermore it corrects 0.013A for the power usage of the plug.
        - lambda: if (x < (0.01 - 0.013)) return 0; else return (x - 0.013);
    voltage:
      name: "${friendly_name} - Volt"
      unit_of_measurement: V
      accuracy_decimals: 1
      icon: mdi:flash-outline
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
            - 0.0 -> 0.0
            - 95.5 -> 230.0
    power:
      name: "${friendly_name} - Watt"
      unit_of_measurement: W
      id: "power_wattage"
      icon: mdi:gauge
      filters:
        # Map from sensor -> measured value
        - calibrate_linear:
            - 0.0 -> 2.2
            - 3.0 -> 15
            - 11.6 -> 36
            - 87 -> 284
            - 274.3 -> 733
            - 569.5 -> 1555
        # Make everything below 2W appear as just 0W.
        # Furthermore it corrects 1.14W for the power usage of the plug.
        - lambda: if (x < (2 + 2.2)) return 0; else return (x - 2.2);

    energy:
      name: "${friendly_name} - Energie"
      unit_of_measurement: Wh
      icon: mdi:calendar-clock

status_led:
  pin:
    number: GPIO02
    inverted: True
  id: led_blue

switch:
  - platform: template
    name: "${friendly_name} - Switch 1"
    icon: mdi:power
    lambda: |-
      if (id(relay1).state) {
        return true;
      } else {
        return false;
      }
    id: button_switch1
    turn_on_action:
      - switch.turn_on: relay1
    turn_off_action:
      - switch.turn_off: relay1
  - platform: template
    name: "${friendly_name} - Switch 2"
    icon: mdi:power
    lambda: |-
      if (id(relay2).state) {
        return true;
      } else {
        return false;
      }
    id: button_switch2
    turn_on_action:
      - switch.turn_on: relay2
    turn_off_action:
      - switch.turn_off: relay2
  - platform: template
    name: "${friendly_name} - Switch 3"
    icon: mdi:power
    lambda: |-
      if (id(relay3).state) {
        return true;
      } else {
        return false;
      }
    id: button_switch3
    turn_on_action:
      - switch.turn_on: relay3
    turn_off_action:
      - switch.turn_off: relay3
  - platform: template
    name: "${friendly_name} - Switch USB"
    icon: mdi:power
    lambda: |-
      if (id(relay4).state) {
        return true;
      } else {
        return false;
      }
    id: button_switch4
    turn_on_action:
      - switch.turn_on: relay4
    turn_off_action:
      - switch.turn_off: relay4
  - platform: gpio
    pin: GPIO14
    id: relay1
    restore_mode: ALWAYS_ON
  - platform: gpio
    pin: GPIO12
    id: relay2
    restore_mode: ALWAYS_ON
  - platform: gpio
    pin: GPIO13
    id: relay3
    restore_mode: ALWAYS_ON
  - platform: gpio
    pin: GPIO5
    inverted: True
    id: relay4
    restore_mode: ALWAYS_ON

```
