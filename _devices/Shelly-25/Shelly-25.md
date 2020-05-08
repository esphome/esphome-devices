---
title: Shelly 2.5
date-published: 2020-05-08
type: relay
standard: uk, us, eu
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO0   | LED 1i                             |
| GPIO2   | Button 1                           |
| GPIO4   | Relay 1                            |
| GPIO5   | Switch 2 Input                     |
| GPIO12  | i2c SDA                            |
| GPIO13  | Switch 1 Input                     |
| GPIO14  | 12c SCL                            |
| GPIO15  | Relay 2                            |
| GPIO16  | ADE7953 IRQ (power measurement)    |
| GPIOA0  | Internal Temperature               |

## Basic Configuration As Relay

When integration with home assistant exists, it will appear as 2 Relays with icons and 2 switches (including power, current and sensors)
Use cases for this configuration: Roller / Shutter automation and device swichting and monitoring

Thanks to ["Anaro"](https://community.home-assistant.io/u/anarro/summary) from home assistant forum [topic](https://community.home-assistant.io/t/integration-of-new-power-sensor-ade7953-with-shelly-2-5/119235/8)
config tested by ["Datux"](https://github.com/dtx3k)

```yaml
# Basic Config
substitutions:
  devicename: shelly_25

esphome:
  name: ${devicename}
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret ssid1
  password: !secret ssid1_pass

captive_portal:

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:

i2c:
  sda: GPIO12
  scl: GPIO14

sensor:
  - platform: ade7953
    voltage:
      name: ${devicename} Voltage
    current_a:
      name: ${devicename} Current B
    current_b:
      name: ${devicename} Current A
    active_power_a:
      name: ${devicename} Active Power B
      filters:
        - multiply: -1
    active_power_b:
      name: ${devicename} Active Power A
      filters:
        - multiply: -1
    update_interval: 60s

  # NTC Temperature
  - platform: ntc
    sensor: temp_resistance_reading
    name: ${devicename} Temperature
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    icon: "mdi:thermometer"
    calibration:
      b_constant: 3350
      reference_resistance: 10kOhm
      reference_temperature: 298.15K
  - platform: resistance
    id: temp_resistance_reading
    sensor: temp_analog_reading
    configuration: DOWNSTREAM
    resistor: 32kOhm
  - platform: adc
    id: temp_analog_reading
    pin: A0

status_led:
  pin:
    number: GPIO0
    inverted: yes

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO13
    name: ${devicename} Switch1
    on_press:
      then:
        - switch.toggle: shelly_relay_1
  - platform: gpio
    pin:
      number: GPIO5
    name: ${devicename} Switch2
    on_press:
      then:
        - switch.toggle: shelly_relay_2

switch:
  - platform: gpio
    id: shelly_relay_1
    name: ${devicename} Relay1
    pin: GPIO15
    icon: "mdi:electric-switch"
    restore_mode: RESTORE_DEFAULT_OFF
  - platform: gpio
    id: shelly_relay_2
    name: ${devicename} Relay2
    pin: GPIO4
    icon: "mdi:electric-switch"
    restore_mode: RESTORE_DEFAULT_OFF

```

## Basic Configuration As Lights

Using this config wil make the Shelly show up as lights within Home Assistant
Use Case for this configuration: Automate light sources
Based uppon the Shelly 1 configuration (modified and tested by  ["Datux"](https://github.com/dtx3k) )

```yaml
# basic configuration

# Basic Config
substitutions:
  devicename: shelly_25

esphome:
  name: ${devicename}
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret ssid1
  password: !secret ssid1_pass

captive_portal:

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:

i2c:
  sda: GPIO12
  scl: GPIO14

sensor:
  - platform: ade7953
    voltage:
      name: ${devicename} Voltage
    current_a:
      name: ${devicename} Current B
    current_b:
      name: ${devicename} Current A
    active_power_a:
      name: ${devicename} Active Power B
      filters:
        - multiply: -1
    active_power_b:
      name: ${devicename} Active Power A
      filters:
        - multiply: -1
    update_interval: 60s

  # NTC Temperature
  - platform: ntc
    sensor: temp_resistance_reading
    name: ${devicename} Temperature
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    icon: "mdi:thermometer"
    calibration:
      b_constant: 3350
      reference_resistance: 10kOhm
      reference_temperature: 298.15K
  - platform: resistance
    id: temp_resistance_reading
    sensor: temp_analog_reading
    configuration: DOWNSTREAM
    resistor: 32kOhm
  - platform: adc
    id: temp_analog_reading
    pin: A0

status_led:
  pin:
    number: GPIO0
    inverted: yes

output:
  - platform: gpio
    pin: GPIO4
    id: shelly_25_relay_1
  - platform: gpio
    pin: GPIO15
    id: shelly_25_relay_2

light:
  - platform: binary
    name: "${devicename} Light 1"
    output: shelly_25_relay_1
    id: lightid1
  - platform: binary
    name: "${devicename} Light 2"
    output: shelly_25_relay_2
    id: lightid2

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO13
      #mode: INPUT_PULLUP
      #inverted: True
    name: "${devicename} Switch 1"
    on_state:
      then:
        - light.toggle: lightid1
    internal: true
    id: switchid1
  - platform: gpio
    pin:
      number: GPIO5
      #mode: INPUT_PULLUP
      #inverted: True
    name: "${devicename} Switch 2"
    on_state:
      then:
        - light.toggle: lightid2
    internal: true
    id: switchid2

```
