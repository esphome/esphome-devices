---
title: "Dingtian DT-R002"
date-published: 2026-04-24
type: relay
standard: global
board: esp32
difficulty: 3
---

# Dingtian DT-R002

A 2-channel relay board with an ESP32 and an Ethernet interface. Available direct from the manufacturer on
[AliExpress](https://www.aliexpress.com/item/4001232791244.html).

Unlike the variants with more channels, the two relays on this model are directly controlled by GPIOs and no I/O
expander is used.

When ordering this board ask for relay board with test firmware, otherwise the ESP32 will be locked.

Initial programming can then be done using the
[pin descriptions](https://github.com/dtlzp/relay_dev_demo/blob/main/gpio_pinout/2ch.png) and
[pinout photo](https://github.com/dtlzp/relay_dev_demo/blob/main/gpio_pinout/debug_port_2CH_V2.png).

Disconnect external power while programming. Connect GND and 3V3 to your programmer's power supply (which must be set
to 3.3V). Connect IO1 (TX) to your programmer's RX, and IO3 (RX) to your programmer's TX. Connect IO0 to GND while
booting to enter bootloader. Once programmed, you can perform future upgrades OTA.

## Basic Configuration

The ESP32 naturally supports wifi, however as you've bought this relay board because it has Ethernet, the example
configuration here enables only Ethernet and not wifi.

If you bought the version with a case, both the LED and the "factory" button are within the case and are inaccessible
when closed, but are exposed in this example anyway.

```yaml
esphome:
  name: dingtian-relay-2ch

esp32:
  board: esp32dev
  framework:
    type: esp-idf
    advanced:
      minimum_chip_revision: 3.1
      sram1_as_iram: true

# Above the "FACTORY" button there are two LEDs. One is wired in series with the switch and the other is
# controllable via GPIO. Use the second one as a status indicator.
status_led:
  pin:
    number: GPIO32
    inverted: true

ethernet:
  type: JL1101
  mdc_pin: GPIO23
  mdio_pin: GPIO18
  phy_addr: 0
  clk:
    mode: CLK_OUT
    pin: GPIO17
  power_pin: GPIO0

# Enable Home Assistant API
api:
  encryption:
    key: !secret dingtian_relay_api_key

# Enable OTA updates
ota:
  - platform: esphome
    password: !secret dingtian_relay_ota_password

# Enable web server (optional)
web_server:
  port: 80

# Enable logging
logger:

binary_sensor:

# The "factory reset" button
  - platform: gpio
    name: "User Button"
    pin:
      number: GPIO34
      inverted: true

  # The two sets of contacts for manual trigger
  # input is pulled up to 3.3V by default.
  - name: "User Input 1"
    platform: gpio
    pin:
      number: GPIO36
      inverted: true

  - name: "User Input 2"
    platform: gpio
    pin:
      number: GPIO39
      inverted: true

switch:
  - name: "Relay 1"
    platform: gpio
    pin: GPIO2

  - name: "Relay 2"
    platform: gpio
    pin: GPIO16

```
