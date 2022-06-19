---
title: Shelly EM
date-published: 2022-06-19
type: sensor
standard: uk, us, eu
---

## GPIO Pinout

| Pin    | Function          |
| ------ | ----------------- |
| GPIO0  | LED               |
| GPIO12 | I2C SDA           |
| GPIO13 | ADE7953 IRQ       |
| GPIO14 | I2C SCL           |
| GPIO15 | Contactor Control |

## Configuration for 2-Phase Whole-Home Energy Monitor

Configuration to use a Shelly EM as a whole-home energy monitor for 2-phase power.  Requries 2x 120A CT clamps, which can be purchased from the shelly.cloud store.

Be sure to set GPIO13 to the ADE7953 IRQ pin to prevent overheating!

```yaml
esphome:
  name: shelly-em

esp8266:
  board: esp01_1m

# Enable logging
logger:

# Enable HA API
api:
  password: !secret api_password
  encryption:
    key: !secret api_key

# Enable OTAs
ota:
  password: !secret api_password

# Sync RTC with HA
time:
  - platform: homeassistant
    timezone: America/Chicago

# Wi-Fi Setup
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  power_save_mode: LIGHT

  # Enable fallback hotspot (captive portal) in case Wi-Fi connection fails
  ap:
    ssid: shelly-em AP
    password: !secret ap_password

captive_portal:

i2c:
  sda: GPIO12
  scl: GPIO14

sensor:
  - platform: ade7953
    # WARNING: Prevent overheating by setting this IRQ pin! - See https://esphome.io/components/sensor/ade7953.html
    irq_pin: GPIO13
    voltage:
      name: Shelly EM Voltage
      id: voltage
    current_a:
      name: Shelly EM Phase 1 Current
      id: current_phase_1
    current_b:
      name: Shelly EM Phase 2 Current
      id: current_phase_2
    active_power_a:
      name: Shelly EM Phase 1 Power
      id: power_phase_1
      # Consider calibrating CT clamps, measurements were closer to the stock Shelly EM firmware for me without calibration
      # See: https://community.home-assistant.io/t/anyone-using-shelly-em/149867
      #filters:
      #- lambda: if (x <= 0.0) return 0; else return x * 1.143207411;
    active_power_b:
      name: Shelly EM Phase 2 Power
      id: power_phase_2
      #filters:
      #- lambda: if (x <= 0.0) return 0; else return x * 1.143207411;
    update_interval: 5s

  - platform: template
    name: Shelly EM Total Power
    id: total_power
    state_class: measurement
    device_class: power
    lambda: return id(power_phase_1).state + id(power_phase_2).state;
    update_interval: 5s
    unit_of_measurement: W

  - platform: total_daily_energy
    name: Shelly EM Phase 1 Energy
    id: energy_phase_1
    power_id: power_phase_1
    filters:
      # Multiplication factor from W to kWh is 0.001
      - multiply: 0.001
    unit_of_measurement: kWh

  - platform: total_daily_energy
    name: Shelly EM Phase 2 Energy
    id: energy_phase_2
    power_id: power_phase_2
    filters:
      # Multiplication factor from W to kWh is 0.001
      - multiply: 0.001
    unit_of_measurement: kWh

  - platform: template
    name: Shelly EM Total Energy
    id: total_energy
    state_class: total_increasing
    device_class: energy
    lambda: return id(energy_phase_1).state + id(energy_phase_2).state;
    unit_of_measurement: kWh

  - platform: template
    name: Shelly EM Total Current
    id: total_current
    state_class: measurement
    device_class: current
    lambda: return id(current_phase_1).state + id(current_phase_2).state;
    update_interval: 5s
    unit_of_measurement: A

  - platform: template
    name: Shelly EM Phase 1 Apparent Power
    id: apparent_power_phase_1
    state_class: measurement
    device_class: power
    lambda: return id(current_phase_1).state * id(voltage).state;
    update_interval: 5s
    unit_of_measurement: VA

  - platform: template
    name: Shelly EM Phase 2 Apparent Power
    id: apparent_power_phase_2
    state_class: measurement
    device_class: power
    lambda: return id(current_phase_2).state * id(voltage).state;
    update_interval: 5s
    unit_of_measurement: VA

  - platform: template
    name: Shelly EM Total Apparent Power
    id: apparent_total_power
    state_class: measurement
    device_class: power
    lambda: return id(apparent_power_phase_1).state + id(apparent_power_phase_2).state;
    update_interval: 5s
    unit_of_measurement: VA

  - platform: template
    name: Shelly EM Phase 1 Power Factor
    id: power_factor_phase_1
    state_class: measurement
    device_class: power_factor
    lambda: return id(power_phase_1).state / id(apparent_power_phase_1).state;
    accuracy_decimals: 3
    update_interval: 5s
    unit_of_measurement: "%"

  - platform: template
    name: Shelly EM Phase 2 Power Factor
    id: power_factor_phase_2
    state_class: measurement
    device_class: power_factor
    lambda: return id(power_phase_2).state / id(apparent_power_phase_2).state;
    accuracy_decimals: 3
    update_interval: 5s
    unit_of_measurement: "%"

  - platform: template
    name: Shelly EM Total Power Factor
    id: total_power_factor
    state_class: measurement
    device_class: power_factor
    lambda: return id(total_power).state / id(apparent_total_power).state;
    accuracy_decimals: 3
    update_interval: 5s
    unit_of_measurement: "%"

status_led:
  pin:
    number: GPIO0
    inverted: yes

switch:
  - platform: gpio
    name: Shelly EM Switch
    pin: GPIO15
    id: relay
```
