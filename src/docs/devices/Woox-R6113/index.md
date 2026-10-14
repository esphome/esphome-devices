---
title: Woox R6113 Smart Plug 16A
date-published: 2026-10-14
type: relay
standard: eu
board: bk72xx
---

## Images

![Woox R6113](./woox-r6113.png "Woox R6113")

![Woox R6113 back](./woox-r6113-back.png "Woox R6113 back")

## GPIO Pinout

| Pin | Function      |
| --- | ------------- |
| P6  | LED           |
| P7  | Button        |
| P8  | Relay         |
| P11 | SEL           |
| P24 | CF1           |
| P26 | CF            |


## Board Configuration

Full working config: [config.yaml](./config.yaml)

```yaml file=config.yaml
```

Specific ralay settings:

```yaml
           
bk72xx:
  board: generic-bk7231n-qfn32-tuya


switch:
  - platform: gpio
    id: relay
    name: "Relay"
    pin: P8
    restore_mode: ALWAYS_OFF
    on_turn_on:
      - light.turn_on: plug_led
    on_turn_off:
      - light.turn_off: plug_led

light:
  - platform: binary
    id: plug_led
    output: plug_led_output
    internal: true        

binary_sensor:
  - platform: gpio
    name: "Button"
    id: woox_button
    pin:
      number: P7
      mode:
        input: true
        pullup: true
      inverted: false
    filters:
      - delayed_on: 30ms
      - delayed_off: 30ms
    internal: true  
    on_press:
      then:
        - switch.toggle: relay

output:
  - platform: gpio
    id: plug_led_output
    pin:
      number: P6
      inverted: false

sensor:
  - platform: hlw8012
    model: BL0937

    # trying to calibrate voltage
    voltage_divider: 829
    # trying to calibrate power
    current_resistor: 0.0011707441386340468
    
    sel_pin:
      number: P11
      inverted: true

    cf_pin:
      number: P26
      inverted: true

    cf1_pin:
      number: P24
      inverted: true

    current:
      name: "Current"
      filters:
      # trying to calibrate
        - multiply: 0.5322126205722884

    voltage:
      name: "Voltage"

    power:
      name: "Power"
      id: power

    energy:
      name: "Energy"

    initial_mode: CURRENT
    change_mode_every: 4
    update_interval: 10s
```
