---
title: Sonoff THR320D
date-published: 2023-01-07
type: plug
standard: us
---

## Bootloop Workaround

Some people experience a boot loop when trying to flash esphome directly.
Here's a workaround: <https://community.home-assistant.io/t/bootloop-workaround-for-flashing-sonoff-th-elite-thr316d-thr320d-and-maybe-others-with-esphome-for-the-first-time/498868>

## GPIO Pinout

(Source: <https://templates.blakadder.com/sonoff_THR320D.html>)
Most GPIO are active-low, meaning they're "on" when they're pulled low.
In ESPHome that's often called "inverted".

| Pin    | Function                                                                  |
| ------ | ----------------------------------                                        |
| GPIO0  | Push Button (HIGH = off, LOW = on)                                        |
| GPIO4  | Small Relay (Dry Contact)                                                 |
| GPIO19 | Large/Main Relay pin 1                                                    |
| GPIO22 | Large/Main Relay pin 2, both have to be low to toggle the relay           |
| GPIO5  | Display (TM1621) Data                                                     |
| GPIO17 | Display (TM1621) CS                                                       |
| GPIO18 | Display (TM1621) Write                                                    |
| GPIO23 | Display (TM1621) Read                                                     |
| GPIO16 | Left LED (Red)                                                            |
| GPIO15 | Middle LED (Blue)                                                         |
| GPIO13 | Right LED (Green)                                                         |

## Basic Configuration

```yaml
substitutions:
  name: "sonoffth320d"
  friendly_name: "Sonoff THR320D"
  project_name: "thermostats"
  project_version: "1.0"
  light_restore_mode: RESTORE_DEFAULT_OFF

esphome:
  name: "${name}"
  # supply the external temp/hum sensor with 3v power by pulling this GPIO high
  on_boot:
    - priority: 90
      then:
      - switch.turn_on: ${name}_sensor_power

esp32:
  board: nodemcu-32s

api:
  password: "api-password-for-ha"

ota:
  password: "ota-password"

logger:
  baud_rate: 0

web_server:
  port: 80

wifi:
  ssid: "SSID"
  password: "PASSWORD"
  power_save_mode: none

captive_portal:

# This will take care of the display automatically.
# You don't need to tell it to print something to the display manually.
# It'll update every 60s or so.
display:
  platform: tm1621
  id: tm1621_display
  cs_pin: GPIO17
  data_pin: GPIO5
  read_pin: GPIO23
  write_pin: GPIO18
  lambda: |-
    it.printf(0, "%.1f", id(${name}_temp).state);
    it.display_celsius(true);
    it.printf(1, "%.1f", id(${name}_humi).state);
    it.display_humidity(true);

binary_sensor:
  # single main button that also puts device into flash mode when held on boot
  - platform: gpio
    pin:
      number: GPIO0
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} Button"
    # when pressed, it toggles 2 GPIO pins, both of which are needed to
    # activate the main (big) relay
    on_press:
      then:
        - switch.toggle: relay1
        - switch.toggle: relay2
        - switch.toggle: ${name}_onoff_led
  - platform: status
    name: "${friendly_name} Status"



switch:
  # I don't fully understand this - the main relay needs 2 GPIO pins,
  # GPIO19 and GPIO22 to be low in order to activate.
  # There's probably a better way to do that in esphome with switch
  # templates but I wasn't able to get that to work.
  - platform: gpio
    id: relay1
    internal: True
    pin:
      number: GPIO19
      inverted: true
  - platform: gpio
    id: relay2
    internal: True
    pin:
      number: GPIO22
      inverted: true
  # Rightmost (green) LED that's kinda useless
  - platform: gpio
    id: ${name}_idk_led
    pin:
      number: GPIO13
      inverted: true
    restore_mode: ALWAYS_OFF
  # Leftmost (red) LED that's used to indicate the relay being on/off
  - platform: gpio
    id: ${name}_onoff_led
    pin:
      number: GPIO16
      inverted: true
    restore_mode: ALWAYS_OFF
  # This is needed to power the external temp/humidity sensor.
  # It receives 3v from this pin, which is pulled up on boot.
  # TODO: This should probably be an internal switch.
  - platform: gpio
    pin: GPIO27
    id: ${name}_sensor_power
    restore_mode: ALWAYS_ON


light:
  # The middle (blue) LED is used as wifi status indicator.
  - platform: status_led
    name: "${friendly_name} State"
    pin:
      number: GPIO15
      inverted: true


sensor:
  # You need to specify here that it's an SI7021 sensor.
  # This assumes you're using their device "Sonoff THS01"
  - platform: dht
    pin: GPIO25
    model: SI7021
    temperature:
      name: "${friendly_name} Temperature"
      id: ${name}_temp
    humidity:
      name: "${friendly_name} Humidity"
      id: ${name}_humi
    update_interval: 60s

climate:
  - platform: thermostat
    name: "${friendly_name} Climate"
    sensor: ${name}_temp
    default_preset: Home
    preset:
      - name: Home
        default_target_temperature_low: 21 °C
        mode: heat
    min_heating_off_time: 300s
    min_heating_run_time: 300s
    min_idle_time: 30s
    heat_action:
      - switch.turn_on: relay1
      - switch.turn_on: relay2
      - switch.turn_on: ${name}_onoff_led
    idle_action:
      - switch.turn_off: relay1
      - switch.turn_off: relay2
      - switch.turn_off: ${name}_onoff_led
    heat_deadband: 0.5 # how many degrees can we go under the temp before starting to heat
    heat_overrun: 0.5 # how many degrees can we go over the temp before stopping

text_sensor:
  - platform: wifi_info
    ip_address:
      name: "${friendly_name} IP Address"
      disabled_by_default: true
```
