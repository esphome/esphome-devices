---
title: Nerdiy's ePaper frame insert
date-published: 2025-07-25
type: misc
standard: global
board: esp32
project-url: https://github.com/Nerdiyde/ESPHomeSnippets/blob/main/Snippets/eInk_frame_insert_ribba_5inchX7inch/config/nerdiys-epaper-frame.yaml
made-for-esphome: false
difficulty: 4
---

## General Notes

Inspired by [Madalena’s esphome-weatherman-dashboard](https://github.com/Madelena), this project evolved into a battery-powered Ikea ePaper frame insert that displays real-time data sourced from your Home Assistant instance.

To simplify the hardware setup, a precisely designed 3D-printable mount was created to perfectly fit the ePaper display and all electronics inside the Ikea RÖDALM/RIBBA 13x18 cm (5″x7″) frame. The custom case features:

This elegant solution makes your Smart Home data visually accessible with minimal power consumption and a stylish appearance.

## Files for 3D print

More info and the housing STLs are available here:
 - [RIBBA 5"x7" frame insert](https://nerdiy.de/en/product-2/eink-frame-insert-suitable-for-ikea-ribba-5x7-picture-frame-3d-printable-stl-files/)
- [RÖDALM 5"x7" frame insert](https://nerdiy.de/en/product-2/ikea-roedalm-eink-rahmeneinsatz-fuer-13x18cm-5x7-bilderrahmen-3d-druckbar-stl-dateien/)



## GPIO Pinout

| Pin     | Function              |
|-------- |-----------------------|
| GPIO07  | I²C Clock (SCL)       |
| GPIO06  | I²C Data (SDA)        |
| GPIO04  | Deep Sleep Wake-Up    |
| GPIO08  | Display SPI Clock (CLK)       |
| GPIO10  | Display SPI MOSI              |
| GPIO03  | Display Chip Select   |
| GPIO05  | Display Data/Command  |
| GPIO02  | Display Reset         |

## Basic Config

The latest state of the configuration is available [here](https://github.com/Nerdiyde/ESPHomeSnippets/blob/main/Snippets/eInk_frame_insert_ribba_5inchX7inch/config/nerdiys-epaper-frame.yaml).

## Material list

### RIBBA frame

| Quantity | Item                                                                                          |
|----------|-----------------------------------------------------------------------------------------------|
| 1x       | [USB Power Supply (Optional)](https://www.amazon.de/dp/B00WLI5E3M?tag=nerdiyde018-21&linkCode=ogi)   |
| 1x       | [USB-C Cable 5V/3A](https://www.amazon.de/dp/B098WVHH5L?tag=nerdiyde018-21&linkCode=ogi)           |
| 1x       | [Waveshare 7.5 Inch E-Paper Display HAT Module V2 Kit](https://www.amazon.de/dp/B075R4QY3L?tag=nerdiyde018-21&linkCode=ogi) |
| 1x       | [Seeed Studio XIAO ESP32-C3](https://www.amazon.de/dp/B0B94JZ2YF?tag=nerdiyde018-21&linkCode=ogi)  |
| 1x       | [LiPo 18650 Battery](https://www.amazon.de/dp/B0CY8JRJ3B?tag=nerdiyde018-21&linkCode=ogi)         |
| 1x       | [18650 Battery Holder](https://www.amazon.de/dp/B07FKPL7NS?tag=nerdiyde018-21&linkCode=ogi)       |
| 10x      | [M2 Threaded Inserts](https://www.amazon.de/dp/B088QJG676?tag=nerdiyde018-21&linkCode=ogi)        |
| 5x       | [M3 Threaded Inserts](https://www.amazon.de/dp/B0957TSYBY?tag=nerdiyde018-21&linkCode=ogi)        |
| 5x       | [M3x8 Countersunk Screws](https://www.amazon.de/dp/B0957T69W6?tag=nerdiyde018-21&linkCode=ogi)    |
| 4x       | [M2x10 Countersunk Screws](https://www.amazon.de/dp/B0957SLZTB?tag=nerdiyde018-21&linkCode=ogi)   |
| 2x       | [M2x6 Countersunk Screws](https://www.amazon.de/dp/B0957W34XS?tag=nerdiyde018-21&linkCode=ogi)    |
| 4x       | [M2x12 Countersunk Screws](https://www.amazon.de/dp/B0957VNMTS?tag=nerdiyde018-21&linkCode=ogi)   |
| 1x       | [Mini Switch](https://www.amazon.de/dp/B08SJ8XY2B?tag=nerdiyde018-21&linkCode=ogi)                |
| 1x       | [MAX17043 Breakout Board](https://www.amazon.de/dp/B07Z64D8TW?tag=nerdiyde018-21&linkCode=ogi)    |
| 1x       | [Stranded Wire](https://www.amazon.de/dp/B0C7TJG9YB?tag=nerdiyde018-21&linkCode=ogi)              |
| 1x       | [USB-C Cable](https://www.amazon.de/dp/B0BPCBP15P?tag=nerdiyde018-21&linkCode=ogi)                |
| 1x       | [USB Power Supply 5V/3A](https://www.amazon.de/dp/B00WLI5E3M?tag=nerdiyde018-21&linkCode=ogi)     |
| 1x       | [Ikea Ribba Picture Frame 5 x 7 Inch](https://www.amazon.de/dp/B0BW8SGP2T?tag=nerdiyde018-21&linkCode=ogi) |

### RÖDALM frame

| Quantity | Item                                                                                          |
|----------|-----------------------------------------------------------------------------------------------|
| 1x       | [USB Power Supply (Optional)](https://www.amazon.de/dp/B00WLI5E3M?tag=nerdiyde018-21&linkCode=ogi)   |
| 1x       | [USB-C Cable 5V/3A](https://www.amazon.de/dp/B098WVHH5L?tag=nerdiyde018-21&linkCode=ogi)           |
| 1x       | [Waveshare 7.5 Inch E-Paper Display HAT Module V2 Kit](https://www.amazon.de/dp/B075R4QY3L?tag=nerdiyde018-21&linkCode=ogi) |
| 1x       | [Seeed Studio XIAO ESP32-C3](https://www.amazon.de/dp/B0B94JZ2YF?tag=nerdiyde018-21&linkCode=ogi)  |
| 1x       | [LiPo 14500 Battery](https://www.amazon.de/dp/B01BDRIX34?tag=nerdiyde018-21&linkCode=ogi)         |
| 1x       | [14500 Battery Holder](https://www.amazon.de/dp/B000U1KYLO?tag=nerdiyde018-21&linkCode=ogi)       |
| 10x      | [M2 Threaded Inserts](https://www.amazon.de/dp/B088QJG676?tag=nerdiyde018-21&linkCode=ogi)        |
| 5x       | [M3 Threaded Inserts](https://www.amazon.de/dp/B08BCRZZS3?tag=nerdiyde018-21&linkCode=ogi)        |
| 5x       | [M3x8 Countersunk Screws](https://www.amazon.de/dp/B0957T69W6?tag=nerdiyde018-21&linkCode=ogi)    |
| 4x       | [M2x10 Countersunk Screws](https://www.amazon.de/dp/B0957SLZTB?tag=nerdiyde018-21&linkCode=ogi)   |
| 2x       | [M2x6 Countersunk Screws](https://www.amazon.de/dp/B0957W34XS?tag=nerdiyde018-21&linkCode=ogi)    |
| 4x       | [M2x12 Countersunk Screws](https://www.amazon.de/dp/B0957VNMTS?tag=nerdiyde018-21&linkCode=ogi)   |
| 1x       | [Mini Switch](https://www.amazon.de/dp/B08SJ8XY2B?tag=nerdiyde018-21&linkCode=ogi)                |
| 1x       | [MAX17043 Breakout Board](https://www.amazon.de/dp/B07Z64D8TW?tag=nerdiyde018-21&linkCode=ogi)    |
| 1x       | [Stranded Wire](https://www.amazon.de/dp/B0C7TJG9YB?tag=nerdiyde018-21&linkCode=ogi)              |
| 1x       | [USB-C Cable](https://www.amazon.de/dp/B0BPCBP15P?tag=nerdiyde018-21&linkCode=ogi)                |
| 1x       | [USB Power Supply 5V/3A](https://www.amazon.de/dp/B00WLI5E3M?tag=nerdiyde018-21&linkCode=ogi)     |
| 1x       | [Ikea RÖDALM Picture Frame 5 x 7 Inch](https://www.amazon.de/dp/B0DRGT6H7P?tag=nerdiyde018-21&linkCode=ogi) |


## Dimensions


## Pictures

### RIBBA frame insert


### RÖDALM frame insert
