---
title: Narada NPFC
date-published: 2024-01-09
type: misc
standard: global
---

This documents the Narada NPFC series of high capacity batteries, which
can be accessed over modbus. There are a number of variables which can
be queried to determine the current state of the battery, such as overall
voltage, current, temperature, etc, as well as per cell voltage and temp.

The entities are provided in a package which can be included in the config
of any ESPHome device that has a RS485 transceiver, a UART and
modbus_controller: configured.

Example:

```yaml
uart:
  - id: modbus_uart
    baud_rate: 9600
    tx_pin: GPIO17
    rx_pin: GPIO16

modbus:
  id: modbus1
  uart_id: modbus_uart
  flow_control_pin: GPIO4

modbus_controller:
  - id: narada_39
    address: 39
    modbus_id: modbus1
    setup_priority: -10

  - id: narada_40
    address: 40
    modbus_id: modbus1
    setup_priority: -10

packages:
  battery_1: !include
    file: .narada-npfc.yaml
    vars:
      modbus_controller_id: narada_39
      battery: Battery 1
  battery_2: !include
    file: .narada-npfc.yaml
    vars:
      modbus_controller_id: narada_40
      battery: Battery 2
```

Note that while the battery ID is set to a value between 1 and 15 using
the dip switches, the modbus address is 38+(ID). i.e. starts at 39.
