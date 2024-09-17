---
title: Rego 600
date-published: 2024-09-17
type: misc
standard: global
board: esp32
made-for-esphome: false
---
<!--project-url: https://github.com/dala318/esphome-rego600-->

Gateway to communicate with REGO 6xx equiped heat-pumps. Using serial communication over RS232 via optocoupler from ESP UART.

Are ready-made devices from [Husdata H66](https://husdata.se/produkt/h66-wifi-gateway/) which should be compatible

Other noteworthy links
  - [how to connect heat pump with Rego 6xx controller](https://rago600.sourceforge.net/) (a lot of information about the Rego600 interface)
  - [openhab addons](https://github.com/openhab/openhab-addons/tree/main/bundles/org.openhab.binding.regoheatpump), [mappings](https://github.com/openhab/openhab-addons/blob/main/bundles/org.openhab.binding.regoheatpump/src/main/java/org/openhab/binding/regoheatpump/internal/rego6xx/RegoRegisterMapper.java) (SW implementation for the interface)
  - [Serial communication via optocouplers](https://forum.arduino.cc/t/serial-communication-via-optocouplers/686872/26) (basics for galvanic isolation and voltage level adaption)

## Device Specific Config

```yaml
external_components:
  - source: github://dala318/esphome-rego600

uart:
  id: uart_bus
  tx_pin: GPIO12
  rx_pin: GPIO13
  baud_rate: 19200
  debug:            # Optional, good for degugging input/output of UART
    direction: BOTH
    dummy_receiver: false

rego600:
  uart_id: uart_bus
  log_all: true
  id: rego600_hub
  log_all: true     # Optional, print some more
  read_delay: 10ms  # Optional, delay to first reading of UART
  retry_sleep: 20ms # Optional, delay between read attempts
  retry_attempts: 1 # Optional, number of read retry attempts

binary_sensor:
  - platform: rego600
    rego600_id: rego600_hub  # Optional if only one hub
    name: Radiator pump P1
    rego_variable: 0x0203

sensor:
  - platform: rego600
    name: Radiator return GT1
    rego_variable: 0x0209
    value_factor: 0.1         # Optional, scale factor multiply register-value -> real
    # All configurations inherited from basic sensor
    unit_of_measurement: °C
    state_class: measurement
    accuracy_decimals: 1

  - platform: rego600
    name: Outdoor GT2
    rego_variable: 0x020A

  # - platform: homeassistant  # Get actual indoor temp from other sensor, could also be a sensor read from rego600
  #   entity_id: sensor.indoor_temperature
  #   id: indoor_temp

number:               # UNTESTED!
  - platform: rego600
    name: GT1 Target value
    rego_variable: 0x006E
    value_factor: 0.1 # Optional, scale factor multiply register-value -> real
    retry_write: 1    # Optional, retry writing event if com bussy
    # All configurations inherited from basic number
    min_value: 0
    max_value: 100
    step: 1

button:               # UNTESTED!
  - platform: rego600
    name: External control
    rego_variable: 0x0213
    payload: 0x01     # Optional, data to provide on action
    retry_write: 3    # Optional, retry writing event if com bussy

# Disabled: not implemented, use the number component to set values
# climate:
#   - platform: rego600
#     name: House temp
#     rego_variable: 0x0010
#     sensor_id: indoor_temp
```
