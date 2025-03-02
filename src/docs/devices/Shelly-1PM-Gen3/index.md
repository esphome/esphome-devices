---
title: Shelly 1PM Gen3
date-published: 2025-03-01
type: relay
standard: uk, us, eu, au, nz
board: esp32
difficulty: 2
---

This is the third generation of the Shelly 1PM.  It sports a single 16A
relay, power monitoring, and uses the ESP-Shelly-C38F, a derivative of
the ESP32-C3 with 8MB flash.

This device includes the Belling BL0942 Energy Monitor that is supported
by ESPHome.

## Serial Pinout

The Shelly 1PM Gen3 includes the six-pin "proprietary serial interface"
1.27mm header broken out on the back that can be used for flashing.  An
inexpensive 1.27mm to 2.54mm pitch changer board can make flashing these
devices easier than they already are.

The serial pinout is:

| Label        | Description | GPIO   |
|--------------|-------------|--------|
| ESP_DBG_UART |             | GPIO19 |
| U0TXD        | UART0 RX    | GPIO20 |
| U0RXD        | UART0 TX    | GPIO21 |
| +3.3_ESP     | 3.3v        |        |
| GPIO0        | BootSEL     | GPIO0  |
| GND          | Ground      |        |

## GPIO Pinout

| Pin    | Function     |
|--------|--------------|
| GPIO0  | LED          |
| GPIO1  | Button       |
| GPIO3  | NTC sensor   |
| GPIO4  | Relay        |
| GPIO6  | BL0942 TX    |
| GPIO7  | BL0942 RX    |
| GPIO10 | Switch       |
| GPIO19 | ESP_DBG_UART |

## Basic Configuration

```yaml
esphome:
  platformio_options:
    board_build.mcu: esp32c3
    board_build.variant: esp32c3
    board_build.f_cpu: 160000000L
    board_build.f_flash: 80000000L
    board_build.flash_mode: dio
    board_build.flash_size: 8MB

esp32:
  variant: esp32c3
  board: esp32-c3-devkitm-1

api:

ota:

wifi:

uart:
  id: bl0942_uart
  tx_pin: GPIO6
  rx_pin: GPIO7
  baud_rate: 9600
  stop_bits: 1

output:
  - id: shelly_1pm_gen3_relay
    platform: gpio
    pin: GPIO4

binary_sensor:
  - id: shelly_1pm_gen3_switch
    name: Switch
    platform: gpio
    pin: GPIO10
  - id: shelly_1pm_gen3_button
    name: Button
    platform: gpio
    pin: GPIO1

sensor:
  - id: temperature
    name: Temperature
    platform: ntc
    sensor: temperature_sensor_resistance
    icon: mdi:thermometer
    entity_category: diagnostic
    unit_of_measurement: °C
    accuracy_decimals: 1
    calibration:
      b_constant: 3350
      reference_resistance: 10kOhm
      reference_temperature: 25°C
  - id: temperature_sensor_resistance
    platform: resistance
    sensor: temperature_sensor_voltage
    configuration: DOWNSTREAM
    resistor: 10kOhm
  - id: temperature_sensor_voltage
    platform: adc
    pin: GPIO3
    attenuation: 11db
  - platform: bl0942
    uart_id: bl0942_uart
    line_frequency: 60Hz
    voltage:
      name: Voltage
    current:
      name: Current
    power:
      name: Power
    frequency:
      name: Frequency
      accuracy_decimals: 2
```

## Application-specific Configuration

Following is an application-specific configuration of the Shelly 1PM
Gen3 for shutting off power to an attached clothes washer in the event
of a frozen drain line.

```yaml
substitutions:
  device_id: lauwshpow
  device_name: LAUWSHPOW
  channel_1_id: washer_outlet
  channel_1_name: Washer Outlet

esphome:
  name: $device_id
  area: Laundry Room
  platformio_options:
    board_build.mcu: esp32c3
    board_build.variant: esp32c3
    board_build.f_cpu: 160000000L
    board_build.f_flash: 80000000L
    board_build.flash_mode: dio
    board_build.flash_size: 8MB

esp32:
  variant: esp32c3
  board: esp32-c3-devkitm-1

api:

ota:

wifi:

# Newer ESP32 variants (including the C3) enable USB on the UART pins by
# default unless we explicitly specify that we want to use UART0 for the
# logger.
#
# You can check this by looking at the generated PlatformIO config file.
# For example, in .esphome/build/lauwshpow/platformio.ini, the following
# build_flags would be set if U0RXD/U0TXD are configured to speak USB:
#
#     -DARDUINO_USB_CDC_ON_BOOT=1
#     -DARDUINO_USB_MODE=1
#
# I don't care about USB; I'd prefer to be able to view the console, so
# configure the logger to use UART0.

logger:
  hardware_uart: uart0

# Configure a separate UART peripheral on GPIO6/GPIO7 for the BL0942.

uart:
  id: bl0942_uart
  tx_pin: GPIO6
  rx_pin: GPIO7
  baud_rate: 9600
  stop_bits: 1

# Setup an output and associated switch for the relay on GPIO4.

output:
  - id: relay_output_1
    platform: gpio
    pin: GPIO4

switch:
  - id: ${channel_1_id}
    name: ${channel_1_name}
    platform: output
    output: relay_output_1
    device_class: outlet
    restore_mode: RESTORE_DEFAULT_ON

binary_sensor:
  # Binary sensors for the line-level switch input and the button on
  # the rear of the device.  These are commented out because I'm not
  # using them.
  #
  #- id: line_switch_input
  #  name: ${device_name} Switch
  #  platform: gpio
  #  pin: GPIO10
  #- id: shelly_1pm_button
  #  name: ${device_name} Button
  #  platform: gpio
  #  pin: GPIO1

  # Template binary sensors to use for my application-specific automations.
  - id: washer_running
    name: Washer Running
    platform: template
    icon: mdi:washing-machine
    device_class: running
  - id: drain_below_freezing
    name: Washer Drain Below Freezing
    platform: template
    icon: mdi:pipe-disconnected

# Configure an external DS18B20 sensor on GPIO19 to use for monitoring
# the temperature of the washer drain line.  We use the on_value_range
# events to setup automations to kill the washer at -2°C (28°F), which
# is far enough below freezing to begin worrying.  If that happens, we
# don't want to turn it back on until the temperature rises far enough
# above freezing to stop worrying -- 5°C (40°F) seems good.  We'll can
# also publish sensor states at the zero-cross (with a 0.1°C buffer to
# avoid thrashing) for surfacing in the Home Assistant UI.

one_wire:
  - platform: gpio
    pin: GPIO19

sensor:
  # 1-wire DS18B20 temperature probe
  - id: drain_temperature
    platform: dallas_temp
    address: 0xf4000007875cd674
    name: Washer Drain Temperature
    update_interval: 5s
    on_value_range:
      - above: 5
        then:
          - switch.turn_on: ${channel_1_id}
      - above: 0.1
        then:
          - binary_sensor.template.publish:
              id: drain_below_freezing
              state: OFF
      - below: -0.1
        then:
          - binary_sensor.template.publish:
              id: drain_below_freezing
              state: ON
      - below: -2
        then:
          - switch.turn_off: ${channel_1_id}

  # Internal NTC temperature sensor
  - id: ${device_id}_temperature
    name: ${device_name} Temperature
    platform: ntc
    sensor: ${device_id}_temperature_sensor_resistance
    icon: mdi:thermometer
    entity_category: diagnostic
    unit_of_measurement: °C
    accuracy_decimals: 1
    calibration:
      b_constant: 3350
      reference_resistance: 10kOhm
      reference_temperature: 25°C

  # Required for NTC sensor
  - id: ${device_id}_temperature_sensor_resistance
    platform: resistance
    sensor: ${device_id}_temperature_sensor_voltage
    configuration: DOWNSTREAM
    resistor: 10kOhm

  # Required for NTC sensor
  - id: ${device_id}_temperature_sensor_voltage
    platform: adc
    pin: GPIO3
    attenuation: 11db

  # Belling BL0942 Energy Monitor
  - platform: bl0942
    uart_id: bl0942_uart
    line_frequency: 60Hz
    voltage:
      name: Washer AC Voltage
    current:
      name: Washer AC Current
    power:
      name: Washer AC Power
      on_value_range:
        - above: 50
          then:
            - binary_sensor.template.publish:
                id: washer_running
                state: ON
        - below: 5
          then:
            - binary_sensor.template.publish:
                id: washer_running
                state: OFF
    frequency:
      name: Washer AC Frequency
      accuracy_decimals: 2
    update_interval: 5s
```
