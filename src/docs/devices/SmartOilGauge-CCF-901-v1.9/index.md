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

## Pinout

| Pin    | Function                               |
| ------ | -------------------------------------- |
| GPIO14 | Ultrasonic Power                       |
| GPIO12 | Control Button (HIGH = off, LOW = on)  |
| GPIO13 | TP5111 DONE                            |
| GPIO15 | 


## IC References

### TPL5111 Nano-Power System Timer for Power Gating
SMD Marking: ZFVX \
https://www.ti.com/lit/ds/symlink/tpl5111.pdf?ts=1739630376626&ref_url=https%253A%252F%252Fwww.google.com%252F

Power Gating of 3.3VDC to the ESP8266.\
Hardwired to restart the controller every hour.\
Timer will cut 3.3V when DONE pin goes HIGH, will wake after 1hr.
