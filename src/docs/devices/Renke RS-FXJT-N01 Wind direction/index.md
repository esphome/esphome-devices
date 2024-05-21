---
title: Renke RS-FXJT-N01 Wind directtion meter
date-published: 2024-05-21
type: sensor
standard: global
---

## General Notes

The Renke RS-FXJT-N01 Wind directtion meter is sold in four versions:

- RS485 digital ModBUS output
- 0-5V analog voltage output
- 0-10V analog voltage output
- 4-20mA analog current output

![RS-FXJT-N01 Wind directtion meter](/directionmeter.png "RS-FXJT-N01 Wind directtion")

Parameters:

- Measurement range: 8 directions
- DC power supply: 10~30V DC

Note: there's an arrow on the base of the unit, make sure you point that to the North when fixing it to its final location.

Configuration presented here is for the RS485 digital ModBUS version.

### Wiring

The cable coming out through the bottom of the unit has the folling pinout:

- Brown: positive power supply
- Black: negative power supply and GND
- Green: RS485-A
- Blue:  RS485-B

### ModBUS Parameters

Wire up a an RS485 transceiver to an ESP32 to interface with the device using ESPHome's [Modbus Component](https://esphome.io/components/modbus.html).

Connection parameters:

- Baud Rate: `4800` (default), supports `2400` and `9600`
- Data bit length: `8` bits
- Parity check: `None`
- Stop bit: `1` bit
- Device address: `1`
- Register address for direction gear: `0` (values from `0` to `7`, representing cardinals)
- Register address for direction value: `1` (valies from `0` to `360`, representing degrees)
- Registers data type: `U_WORD`

## Basic Configuration

A translation from the numeric values of gear can be done using a template text sensor to show the cardinals textually:

```yaml
uart:
  rx_pin: GPIOXX
  tx_pin: GPIOXX
  baud_rate: 4800

modbus:
  id: modbus1

modbus_controller:
  - id: wind_direction_meter
    address: 1
    modbus_id: modbus1
    setup_priority: -10
    command_throttle: 200ms
    update_interval: 60s

sensor:
  - platform: modbus_controller
    modbus_controller_id: wind_direction_meter
    name: "Wind direction gear"
    internal: true
    register_type: read
    address: 0
    value_type: U_WORD
    accuracy_decimals: 0
    on_value:
      - lambda: |-
          if (x == 0) {
              id(wind_direction_cardinal).publish_state("N");  //North
          } else if (x == 1) {
              id(wind_direction_cardinal).publish_state("NE"); //North-East
          } else if (x == 2) {
              id(wind_direction_cardinal).publish_state("E");  //East
          } else if (x == 3) {
              id(wind_direction_cardinal).publish_state("SE"); //South-East
          } else if (x == 4) {
              id(wind_direction_cardinal).publish_state("SE"); //South
          } else if (x == 5) {
              id(wind_direction_cardinal).publish_state("SW"); //South-West
          } else if (x == 6) {
              id(wind_direction_cardinal).publish_state("W");  //West
          } else if (x == 7) {
              id(wind_direction_cardinal).publish_state("NW"); //North-West
          } else {
              id(wind_direction_cardinal).publish_state("");   //invalid
          }

  - platform: modbus_controller
    modbus_controller_id: wind_direction_meter
    name: "Wind direction degree"
    icon: mdi:compass-outline
    register_type: read
    address: 1
    value_type: U_WORD
    accuracy_decimals: 0
    state_class: measurement
    unit_of_measurement: "°"

text_sensor:
  - platform: template
    name: "Wind direction cardinal"
    id: wind_direction_cardinal
    icon: mdi:compass-rose
```

Note that the sensor is by default set to ModBUS address `1`, so out of the box it's not possible to connect it together with another one (like a RS-FSJT-N01 wind speed sensor) to the same ESP.

The manufacturer offers a helper application for Windows, called *485 Parameter Configuration Tool*. The sensor can be connected to the PC with a USB-to-RS485 adapter, and the configuration tool makes it easily possible to change the modbus address to something else, eg. `2` (just type it in the *Addr* box and press *Setup* button).

After that it becomes possible to simply connect the sensors in parrallel on the same cable, to a single RS485-TTL transceiver attached to a single UART on the ESP (you need to change the `address` value in the corresponding `modbus_controller` entry in the config).
