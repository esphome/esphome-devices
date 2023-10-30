---
title: Tuya WB5 WiFi 5 in 1 LED Controller
date-published: 2023-10-29
type: Light
standard: global
board: bk72xx
made-for-esphome: false
difficulty: 2
---

![WB5 WiFi 5 in 1 LED Controller](WB5-WiFi-5IN1-LED-Controller.jpg "WB5 WiFi 5 in 1 LED Controller")

This is a Led controller that can work with single colore, CCT, RGB, RGBw and RGBWW led strips. Its sold on aliexpress by a few diferent sellers there are also a few varients with screw terminals that might work.([exact one I got](https://www.aliexpress.com/item/1005003081976104.html?spm=a2g0o.order_list.order_list_main.41.3d091802QzgWWc)) It can be controlled via a rf remote or wifi. The controller is based on a Tuya CB3L(BK7231N) and a Tuya mcu. This means that the leds are not directly controlled by the BK7231N which you can flash with esphome. There are also varients with a Tuya CB3S but this controller is identical exept for a few more gpio pins.

# Setup

There are 2 ways of flashing esphome on to this controller 
- [Tuya Cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter) (no disassembly required)
- Manual flashing (disassembly required. soldering required depending on your tools and skillset)

# Pinout
![WB5 pcb](WB5-pcb.jpg "WB5 pcb")

| Pin | Function |
| RX1 | Transmit pin connected to the Tuya MCU |
| TX1 | Recieve pin connected to the Tuya MCU |



# Manual Flashing guide
![usb serial adapter](usb-serial-adapter.jpg "usb serial adapter")
# YAML example
