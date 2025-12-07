---
title: Tuya Smart Plug 20A with Power Monitoring
date-published: 2025-12-07
type: plug
standard: eu
board: bk72xx
made-for-esphome: False
difficulty: 4
---

![Tuya Smart Plug 20A](Tuya_plug_EU.png)

The smart plug is using the Tuya T34 module design incorporating a BK7231N chip
[T34 Datasheet](https://developer.tuya.com/en/docs/iot/t34-module-datasheet?id=Ka0l4h5zvg6j8)

The power monitoring chip is the BL0942, which is not so often seen in Tuya producta. It is connected using the UART feature to UART1.

[BL0942 Datasheet](https://www.belling.com.cn/media/file_object/bel_product/BL0942/datasheet/BL0942_V1.06_en.pdf)

[BL0942 Application](https://support.tuya.com/en/help/_detail/Kd2fly62orx3p)

[BL0942 ESPHome](https://esphome.io/components/sensor/bl0942/)

The BL0942 is a sophisticated, calibration-free integrated circuit (IC) for energy measurement from Shanghai Belling Corp.
It is used in single-phase electricity meters, smart plugs and smart home devices to enable accurate measurements of voltage, current and power via a UART/SPI interface, offering a cost-effective solution for energy monitoring. 

![Tuya Smart Plug PCB view](Tuya_PCB.png)

## GPIO Pinout

| Pin | Function          |
| --- | ----------------- |
| P25 | BL0942(10) TX     |
| P26 | BL0942(9)  RX     |
| P14 | Relay & red LED   |
| P26 | Button (Inverted) |
| P24 | Blue LED          |

## Programming

Based on available documentation (links above) the T34 chip can be programmed using ESPHome tools
- pin 25 as UART_RXD
- pin 26 as UART_TXD

It is easier to use the corresponding BL0942 pins to connect the programmers RX & TX pins.
Programmer TX must be connected to pin 10 and RX must beconnected to pin 9.
Connect a 5V DC source to the voltage regulator. Start programming and then cycle power of the 5V source to enter the bootlöoader.

It is important to limit the download speed to 19200 baud (--upload_speed 19200) otherwise the programming terminates.


