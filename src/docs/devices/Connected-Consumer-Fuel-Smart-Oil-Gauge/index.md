---
title: Smart Oil Gauge
date-published: 2025-02-23
type: sensor
standard: us
board: esp8266
difficulty: 3
---

Maker: https://www.smartoilgauge.com/

Product Page: https://www.smartoilgauge.com/shop/product/ccf901i/


ESP-WROOM-02 \
https://www.espressif.com/sites/default/files/documentation/0c-esp-wroom-02_datasheet_en.pdf


## Pinout

| Pin    | Function                                 |
| ------ | ---------------------------------------- |
| GPIO14 | Ultrasonic Power                         |
| GPIO12 | Control Button (HIGH = off, LOW = on)    |
| GPIO13 | System Timer DONE (TP5111)               |
| GPIO15 | Analog Switch SELECT (SN74LVC1G3157)     |
| GPIO2  | Control Board LED (HIGH = off, LOW = on) |
| GPIO0  | UART download                            |
| GPIO16 | Connected to RST                         |
| A0     | Temperature or Battery Voltage           |
| RST    | Reset, Connected to GPIO16               | 
| GPIO5  | Ultrasonic Echo (JSN-SR04T)              |
| TXD    | UART0_TXD                                |
| RXD    | UART0_RXD                                |
| GPIO4  | Ultrasonic Trigger (JSN-SR04T)           |


## Ultrasonic JSN-SR04T
https://components101.com/sites/default/files/component_datasheet/JSN-SR04-Datasheet.pdf

The Ultrasonic JSN-SR04T is configured with R27 open. This causes the JSN-SR04T to operate using Trigger and Echo Pulses like an HC-SR04 Ultrasonic Distance Sensor.

## IC References

### TPL5111 - Nano-Power System Timer for Power Gating
SMD Marking: ZFVX \
https://www.ti.com/lit/ds/symlink/tpl5111.pdf?ts=1739630376626&ref_url=https%253A%252F%252Fwww.google.com%252F

Power Gating of 3.3VDC to the ESP8266.\
Hardwired to restart the controller every hour.\
Timer will cut 3.3V when DONE pin goes HIGH, will wake after 1hr.


### SN74LVC1G3157 - Single-Pole Double-Throw Analog Switch
SMD Marking: C5F \
https://www.ti.com/lit/ds/symlink/sn74lvc1g3157.pdf?ts=1740393486499

Switches the connection to A0 (GPIO17) 
| SELECT (GPIO15) | A0 (GPIO17)                  |
| ------ | ---------------------------- |
| LOW    | Battery Voltage*             |
| HIGH   | Temperature (MCP9700AT-E/TT) |

*Battery Voltage is measured with a voltage divider circuit using R1= 10MOhm, R2= 1MOhm.

### MCP9700AT-E/TT - Low-Power Linear Active Thermistor IC
SMD Marking: AFT3 \
https://ww1.microchip.com/downloads/aemDocuments/documents/MSLD/ProductDocuments/DataSheets/MCP970X-Family-Data-Sheet-DS20001942.pdf


