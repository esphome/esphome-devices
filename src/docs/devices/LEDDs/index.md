---
title: LEDDs v2
date-published: 2026-01-25
type: dimmer
standard: eu, uk, in, au
board: esp32
project-url: https://github.com/VasilKalchev/LEDDs
---

![LEDDs front view](ledds-on-front-1440p.jpg)

## Overview

**LEDDs** is an open-hardware, DIY, **trailing-edge** dimmer designed specifically for dimmable LED bulbs.
It is intended for DIY users who have experience with mains-powered electronics.

## Hardware

The project is fully open source, including:

- schematics and PCB files
- 3D printable enclosure

![enclosure and PCB](enclosure-pcb-side-angle-1440p.jpg)

- **MCU module:** ESP32-C3-12F
- **Mains voltage:** 230 V AC, 50Hz
- **Dimming method:** trailing-edge phase cut
- **Load type:** dimmable LED bulbs (capacitive)

> ⚠️ **Warning:**
> This device operates at **mains voltage**. Building and using it requires experience with high-voltage electronics.
> Improper assembly can result in serious injury, fire, or equipment damage.

## ESPHome configuration

LEDDs is configured using ESPHome and exposes itself as a dimmable light entity.
Complete, working ESPHome configurations are provided in the project repository: [https://github.com/VasilKalchev/LEDDs/tree/main/fw/esphome/yaml](https://github.com/VasilKalchev/LEDDs/tree/main/fw/esphome/yaml).

## Installation

This device is **not pre-flashed** and **not commercially available**.

To use it you must:

1. Build the hardware yourself
2. Flash the ESP32 using ESPHome
3. Configure and calibrate dimming parameters

Refer to the project documentation for detailed build and setup instructions.
