---
title: Shelly EM Gen3
date-published: 2026-01-21
type: sensor
standard: au, br, eu, in, uk, us, global
board: esp32
made-for-esphome: false
difficulty: 2
---

![Shelly EM Gen3 Product Image](./shelly_em_gen3.jpg "Shelly EM Gen3")

## Quick start / Example config

* Minimal (hardware definitions only): [`shelly-em-gen3-minimal.yaml`](./shelly-em-gen3-minimal.yaml)
* Full example (includes energy monitoring): [`shelly-em-gen3-full.yaml`](./shelly-em-gen3-full.yaml)

Note that you should set AP & OTA passwords before using any ESPHome device in production.

## GPIO Pinout

| Pin    | Function                         |
| ------ | -------------------------------- |
| GPIO0  | Relay                            |
| GPIO1  | Button                           |
| GPIO3  | ADC for NTC temperature sensor   |
| GPIO4  | ADE7953 IRQ pin (active low)     |
| GPIO5  | ADE7953 RESET pin (active low)   |
| GPIO6  | I2C SCL                          |
| GPIO7  | I2C SDA                          |
| GPIO9  | Status LED                       |
| GPIO18 | Pin 1 of 7-pin header            |
| GPIO20 | UART receive (U0RXD)             |
| GPIO21 | UART transmit (U0TXD)            |

## I2C Devices

| Address | Function                                            |
| ------- | --------------------------------------------------- |
|    0x38 | ADE7953 power sensor                                |
|    0x51 | AiP8563 RTC (not currently supported by ESPHome)    |

## 7-pin programming header

[![PCB pinout diagram](./pcb_pinout_diagram.thumb.jpg)](./pcb_pinout_diagram.jpg)

| Pin     | Label           | Description                   | GPIO      |
| ------- | --------------- | ----------------------------- | --------- |
|   1     | ESP_DBG_UART    |                               | GPIO18    |
|   2     | U0TXD           | connect to serial RxD pin     | GPIO21    |
|   3     | U0RXD           | connect to serial TxD pin     | GPIO20    |
|   4     | +3.3_ESP        | connect to 3.3V power supply  |           |
|   5     | EN              | connect to serial RTS pin     |           |
|   6     | GPIO0           | connect to serial DTR pin     | GPIO0     |
|   7     | U0RXD           | connect to serial GND pin     |           |

Programming voltage: 0 to 3.3V

## CT connector

[![Current transformer connector photo 1](./ct1.thumb.jpg)](./ct1.jpg)
[![Current transformer connector photo 2](./ct2.thumb.jpg)](./ct2.jpg)
[![Current transformer connector photo 3](./ct3.thumb.jpg)](./ct3.jpg)

| Type                  | Description           |
| --------------------- | --------------------- |
| Manufacturer          | Molex                 |
| Series                | Micro-Fit 3.0 214755  |
| Pitch                 | 3.0 mm                |
| Number of Positions   | 2                     |
| Number of Rows        | 2                     |

## Photos

### Package photos

![Package front](./package_front.jpg "Package front")
![Package back](./package_back.jpg "Package back")
![Package left](./package_left.jpg "Package left")
![Package right](./package_right.jpg "Package right")
![Package top](./package_top.jpg "Package top")
![Package bottom](./package_bottom.jpg "Package bottom")

### Device photos

![Device top](./device_top.jpg "Device top")
![Device bottom](./device_bottom.jpg "Device bottom")
![Device terminals](./device_terminals.jpg "Device terminals")

### PCB photos

[![PCB bottom](./pcb_bottom.thumb.jpg)](./pcb_bottom.jpg)

[![PCB top](./pcb_top.thumb.jpg)](./pcb_top.jpg)
[![PCB left](./pcb_left.thumb.jpg)](./pcb_left.jpg)
[![PCB front](./pcb_front.thumb.jpg)](./pcb_front.jpg)
[![PCB right](./pcb_right.thumb.jpg)](./pcb_right.jpg)
[![Voltage regulator](./pcb_top_regulator.thumb.jpg "Voltage regulator")](./pcb_top_regulator.jpg)

## Resources

* [Shelly Knowledge Base page](https://kb.shelly.cloud/knowledge-base/shelly-em-gen3)
* [Shelly EU store page](https://www.shelly.com/products/shelly-em-gen3)
* [Shelly USA store page](https://us.shelly.com/products/shelly-em-gen3-50a)
* [ADE7953 datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/ade7953.pdf)
* [AiP8563 RTC datasheet](https://dfsimg3.hqewimg.com/group5/M00/0F/C7/wKhk3WToPnaAbpAtAA10M9o8two933.pdf)
* [ESP32-C3 datasheet](https://documentation.espressif.com/esp32-c3_datasheet_en.pdf)
* [DLitz's personal config for this device](https://github.com/dlitz/esphome-configs-dlitz/blob/main/shelly-em-gen3.yaml)
* [Earlier HA Community post about this device](https://community.home-assistant.io/t/shelly-em-gen3-solved/944171)
