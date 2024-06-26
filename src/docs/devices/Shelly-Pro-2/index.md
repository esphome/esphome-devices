---
title: Shelly Pro 2
date-published: 2024-01-12
type: relay
standard: uk, eu
board: esp32
---

Information about the pinout and internals of the Shelly Pro 2.

It's the same board as the Shelly Pro 1. The only difference is the addition of a second relay.

![Shelly Pro 2](shelly-pro-2.jpg)

## Pinout

ESP32 DOWDQ6| SN74HC595B | LAN8720A | Component
------------|------------|----------|----------
GPIO 4      |RCLK        |          |
GPIO 13     |SER         |          |
GPIO 14     |SRCLK       |          |
GPIO 17     |            |CLKIN     |
GPIO 18     |            |MDIO      |
GPIO 19     |            |TXD0      |
GPIO 21     |            |TXEN      |
GPIO 22     |            |TXD1      |
GPIO 23     |            |MDC       |
GPIO 25     |            |RXD0      |
GPIO 26     |            |RXD1      |
GPIO 27     |            |CRS_DV    |
GPIO 35     |            |          |Reset Button
GPIO 36     |            |          |ADC Temperature
GPIO 38     |            |          |Switch input 1
GPIO 39     |            |          |Switch input 2

## Shift register

A shift register is controlling the WIFI RGB LEDs and the 2 relays.

![Shift Register](shift-register.jpg)

SN74HC595B| Component
----------|----------
QA        |Relay 1 + Out 1 LED
QB        |Relay 2 + Out 2 LED
QC        |WIFI RGB LED (Blue)
QD        |WIFI RGB LED (Green)
QE        |WIFI RGB LED (Red)
QF        |NC
QG        |NC
QH        |NC

The Out 1 status LED and the relay 1 are on the same output. The same is true for the Out 2 status LED and the relay 2.
Turning on the relay turns the corresponding LED on.

The WIFI LED is an RGB LED. By turning each component on or off, you have access to 8 configurations:

R|G|B| Color
-|-|-|-------
0|0|0|OFF
0|0|1|Blue
0|1|0|Green
0|1|1|Cyan
1|0|0|Red
1|0|1|Magenta
1|1|0|Yellow
1|1|1|White

## Programming Pinout

![Shelly Pro pinout](https://user-images.githubusercontent.com/38843794/156607973-259d2b27-976c-4b71-9198-ec737f6e95fb.png)

Note that the pin pitch is 1.27mm, so standard 2.54mm Dupont cables won't work.

## Basic Configuration

```yaml

esphome:
  name: shelly-pro-2

esp32:
  board: esp32dev
  framework:
    type: arduino
    
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

# ethernet:
#   type: LAN8720
#   mdc_pin: GPIO23
#   mdio_pin: GPIO18
#   clk_mode: GPIO17_OUT

button:
  - platform: restart
    id: restart_1

binary_sensor:
  - platform: gpio
    id: reset_button
    pin:
      number: 35
      inverted: true
    on_click:
      min_length: 200ms
      max_length: 1000ms
      then:
        button.press: restart_1

  - platform: gpio
    id: input1
    pin:
      number: 38
    on_press:
      then:
        switch.toggle: relay1

  - platform: gpio
    id: input2
    pin:
      number: 39
    on_press:
      then:
        switch.toggle: relay2

sensor:
  - platform: adc
    id: temp_voltage
    pin: GPIO36
    attenuation: auto
  - platform: resistance
    id: temp_resistance
    sensor: temp_voltage
    configuration: DOWNSTREAM
    resistor: 10kOhm
  - platform: ntc
    sensor: temp_resistance
    name: Temperature
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    icon: "mdi:thermometer"
    calibration:
      b_constant: 3350
      reference_resistance: 10kOhm
      reference_temperature: 298.15K
    on_value_range:
      - above: 90
        then:
          - switch.turn_off: relay1
          - switch.turn_off: relay2

sn74hc595:
  - id: 'sn74hc595_hub'
    data_pin: GPIO13
    clock_pin: GPIO14
    latch_pin: GPIO4
    sr_count: 1

switch:
  - platform: gpio
    name: "Relay 1"
    id: relay1
    pin:
      sn74hc595: sn74hc595_hub
      number: 0
      inverted: false

  - platform: gpio
    name: "Relay 2"
    id: relay2
    pin:
      sn74hc595: sn74hc595_hub
      number: 1
      inverted: false

  - platform: gpio
    id: wifi_led_blue
    pin:
      sn74hc595: sn74hc595_hub
      number: 2
      inverted: true

  - platform: gpio
    id: wifi_led_green
    pin:
      sn74hc595: sn74hc595_hub
      number: 3
      inverted: true

  - platform: gpio
    id: wifi_led_red
    pin:
      sn74hc595: sn74hc595_hub
      number: 4
      inverted: true
```
