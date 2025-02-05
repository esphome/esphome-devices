# TYWRD-RF WiFi Smart Garage Door Opener Switch

Smart switch with rf receiver, one relay. CB3S microcontroller. Input Voltage: AC85-250V or Micro-USB DC5V

## GPIO Pinout

| Pin    | Function                           |
| ------ | ---------------------------------- |
| P6     | Button 1                           |
| P14    | Button 2                           |
| P24    | Relay                              |
| P26    | RF Receiver                        |


## Basic Configuration

```yaml
esphome:
  name: tywrd-rf

bk72xx:
  board: cb3s

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:

logger:

api:

ota:

remote_receiver:
  pin: P26
  dump: rc_switch
  tolerance: 50%
  filter: 250us
  idle: 4ms

binary_sensor:
  - platform: gpio
    pin: P6
    name: "Button 1"
    on_press:
    - switch.turn_on: garagedoor
  - platform: gpio
    pin: P14
    name: "Button 1"
  - platform: remote_receiver
    name: "RF1"
    rc_switch_raw:
      code: '011111010000001101110011'
    on_press:
    - switch.turn_on: garagedoor

switch:
  - platform: gpio
    pin: P24
    name: "Garagedoor"
    icon: "mdi:garage"
    id: garagedoor
    on_turn_on:
    - delay: 500ms
    - switch.turn_off: garagedoor
```
