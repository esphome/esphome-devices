---
title: Renke RS-FSJT-N01 Wind speed anemometer
date-published: 2024-05-21
type: sensor
standard: global
---

## General Notes

The Renke RS-FSJT-N01 Wind speed anemometer is sold in four versions:
- RS485 digital ModBUS output
- 0-5V analog voltage output 
- 0-10V analog voltage output 
- 4-20mA analog current output 

![RS-FSJT-N01 Wind speed anemometer](/anemometer.png "RS-FSJT-N01 Wind speed")

Parameters:
- Measurement range: 0~30m/s, resolution 0.1m/s, accuracy ± 0.3m/s
- Starting wind speed: 0.5m/s
- DC power supply: 10~30V DC

Configuration presented here is for the RS485 digital ModBUS version.

### Wiring

The cable coming out through the bottom of the unit has the folling pinout:
- Brown: positive power supply
- Black: negative power supply and GND
- Green: RS485-A
- Blue:  RS485-B

### ModBUS Parameters

Wire up a an RS485 transceiver to an ESP32 to interface with the device using ESPHome's [Modbus Component](https://esphome.io/components/modbus.html)

Connection parameters:
- Baud Rate: 4800 (default), supports 2400 and 9600
- Data bit length: 8 bits
- Parity check: None
- Stop bit: 1 bit
- Device address: 0x01
- Register address for speed value: 0 
- Register data type for speed value: U_WORD, multiplied by 10

## Basic Configuration

Slow winds blow in small bursts, so it's recommended to use a sliding window moving average to have a better overview of the wind condition. That's why we're reading out the measurement every second, and apply a filter to the sensor, which publishes the value every minute, averaging the values over the last 60 reads:

```yaml
uart:
  rx_pin: GPIOXX
  tx_pin: GPIOXX
  baud_rate: 4800

modbus:
  id: modbus1

modbus_controller:
- id: wind_speed_meter
  address: 1
  modbus_id: modbus1
  setup_priority: -10
  command_throttle: 200ms
  update_interval: 1s

sensor:
- platform: modbus_controller
  modbus_controller_id: wind_speed_meter
  name: "Wind speed"
  device_class: wind_speed
  register_type: read
  address: 0
  unit_of_measurement: "m/s"
  value_type: U_WORD
  accuracy_decimals: 1
  filters:
    - multiply: 0.1
    - sliding_window_moving_average:
        window_size: 60
        send_every: 60
```

Note that the sensor is by default set to ModBUS address **1**, so out of the box it's not possible to connect it together with another one (like a RS-FXJT-N01 wind direction sensor) to the same ESP.

The manufacturer offers a helper application for Windows, called *485 Parameter Configuration Tool*. The sensor can be connected to the PC with a USB-to-RS485 adapter, and the configuration tool makes it easily possible to change the modbus address to something else, eg. **2** (just type it in the *Addr* box and press *Setup* button).

After that it becomes possible to simply connect the sensors in parrallel on the same cable, to a single RS485-TTL transceiver attached to a single UART on the ESP (you need to change the *address* value in the corresponding *modbus_controller* entry in the config).