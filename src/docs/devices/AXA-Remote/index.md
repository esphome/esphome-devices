---
title: 
date-published: 2025-10-23
type: misc
standard: global
board: esp32
project-url: https://github.com/rrooggiieerr/esphome-axaremote
made-for-esphome: False
difficulty: 1
---

The AXA Remote is a [rigid chain actuator](https://en.wikipedia.org/wiki/Rigid_chain_actuator) driven electronic window
opener that is mounted in the window frame. It comes with an infrared remote controll but can also be controlled using
serial commands.

<img src="AXA Remote.jpg"/>

The [AXA Remote component for ESPHome](https://github.com/rrooggiieerr/esphome-axaremote) lets you control an AXA
Remote window opener using these serial commands.

The component features:
- Open/Stop/Close the window
- Move window to a given position
- Calibrate the open/close timings
- Use remote control simultaneously

## PCB

A custom PCB is developed that fits in the battery compartment of the AXA Remote and can controll up to two window
openers. Only minor modifications to the battery compartment are needed.

<img src="PCB in battery compartment.png"/>

The PCB is powered from the AXA Remote power supply and uses an ESP32 which is pre-loaded with the required ESPHome
firmware. The firmware supports the open [Improv Wi-Fi](https://www.improv-wifi.com/) standard via BLE and a captive
portal to easily setup your local Wi-Fi network credentials.

Additionally a Light-Dependent Resistor (LDR) can be installed to add a light sensor to the board.

[Read more about the PCB](https://github.com/rrooggiieerr/esphome-axaremote/blob/master/PCB.md)