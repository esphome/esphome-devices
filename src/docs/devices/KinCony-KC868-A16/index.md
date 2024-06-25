---
title: KinCony KC868-A16
date-published: 2023-04-27
type: relay
standard: global
board: esp32
---

![Product](kc868-a16.jpg "Product Image")

## GPIO Pinout

| Pin    | Function            |
| ------ | ------------------- |
| GPIO36 | ANALOG_A1           |
| GPIO34 | ANALOG_A2           |
| GPIO35 | ANALOG_A3           |
| GPIO39 | ANALOG_A4           |
| GPIO4  | IIC_SDA             |
| GPIO5  | IIC_SCL             |
| GPIO32 | 1-Wire GPIO         |
| GPIO33 | 1-Wire GPIO         |
| GPIO14 | 1-Wire GPIO         |
| GPIO2  | 433MHz Receiver     |
| GPIO15 | 433MHz Sender       |
| GPIO16 | RS485_RXD           |
| GPIO13 | RS485_TXD           |

[Additional pinout/design details](https://www.kincony.com/arduino-esp32-16-channel-relay-module-2.html)

## Basic Configuration

```yaml
# Basic Config
esphome:
  name: relay1
  platform: ESP32
  board: esp32dev

# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

# Example configuration entry for ESP32
i2c:
  sda: 4
  scl: 5
  scan: true
  id: bus_a

# Example configuration entry
ethernet:
  type: LAN8720
  mdc_pin: GPIO23
  mdio_pin: GPIO18
  clk_mode: GPIO17_OUT
  phy_addr: 0

  # Optional manual IP
  manual_ip:
    static_ip: 192.168.1.199
    gateway: 192.168.1.1
    subnet: 255.255.255.0  

# Example configuration entry
pcf8574:
  - id: 'pcf8574_hub_out_1'  # for output channel 1-8
    address: 0x24

  - id: 'pcf8574_hub_out_2'  # for output channel 9-16
    address: 0x25

  - id: 'pcf8574_hub_in_1'  # for input channel 1-8
    address: 0x21

  - id: 'pcf8574_hub_in_2'  # for input channel 9-16
    address: 0x22

# Individual outputs
switch:
  - platform: gpio
    name: "light1"
    pin:
      pcf8574: pcf8574_hub_out_1
      # Use pin number 0
      number: 0
      # One of INPUT or OUTPUT
      mode: OUTPUT
      inverted: false

  - platform: gpio
    name: "light9"
    pin:
      pcf8574: pcf8574_hub_out_2
      # Use pin number 0
      number: 0
      # One of INPUT or OUTPUT
      mode: OUTPUT
      inverted: false

binary_sensor:
  - platform: gpio
    name: "input1"
    pin:
      pcf8574: pcf8574_hub_in_1
      # Use pin number 0
      number: 0
      # One of INPUT or OUTPUT
      mode: INPUT
      inverted: false

  - platform: gpio
    name: "input9"
    pin:
      pcf8574: pcf8574_hub_in_2
      # Use pin number 0
      number: 0
      # One of INPUT or OUTPUT
      mode: INPUT
      inverted: false

```
