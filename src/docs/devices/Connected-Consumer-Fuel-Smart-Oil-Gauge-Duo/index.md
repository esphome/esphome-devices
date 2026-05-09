---
title: Smart Oil Gauge Duo
date-published: 2026-XX-XX
type: sensor
standard: us
board: esp8266
difficulty: 3
---

![alt text](Product-Image.jpg "Smart Oil Gauge")

Product Page: [https://www.smartoilgauge.com/shop/product/smart-oil-gauge-duo/](https://www.smartoilgauge.com/shop/product/smart-oil-gauge-duo/)

SKU: CCF-903

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
| GPIO5  | Ultrasonic Echo (DYP-A22)                |
| TXD    | UART0_TXD                                |
| RXD    | UART0_RXD                                |
| GPIO4  | Ultrasonic Trigger (DYP-A22)             |

## Flashing

1. REMOVE THE BATTERIES!!
2. Open the internal electronics (2 screws)
3. Unplug the distance sensor
4. Remove the control board
5. Locate the contact points required for physically connecting to your device. Use the following photos for reference:
   ![alt text](Connections-Front.jpg "Front Flashing Contact Points")
   ![alt text](Connections-Back.jpg "Back Flashing Contact Points")
6. Solderless connections to the edge contact points can be made using hook test leads such as these:
   [https://www.sparkfun.com/hook-test-lead-set.html](https://www.sparkfun.com/hook-test-lead-set.html)
   ![alt text](Flashing-Front.jpg "Front Flashing Connection")
   ![alt text](Flashing-Edge.jpg "Edge Flashing Connection")
7. Follow the directions as outlined by ESPHome for physically connecting to your device:
  
[https://esphome.io/guides/physical_device_connection#physically-connecting-to-your-device](https://esphome.io/guides/physical_device_connection/)

## Setup and Configuration Notes

Be sure to modify the substitution section of the code for your `tank_size`, `tank_orientation`, `volume_calc_method`, and `oil_depth_offset`.

#### Volume Calculation Method
The oil volume can be calculated from the oil depth either geometrically, or using a look-up table.\

The geometric method uses geometry to calculate the volume of oil needed to fill an oil tank of somewhat standard dimensions up to the level of the measured oil depth.

The table method uses ESPHome's Calibrate Linear Filter to go directly from oil depth to oil volume. If the manufacturer of your tank provides an oil volume chart, it may be possible to get a more accurate oil volume measurement by inputting their chart data and using the table method.\
The Basic Configuration below has chart data as published by [Fuel Snap](https://www.fuelsnap.com/heating_oil_tank_charts.php) for all configurable tank sizes. There are also links to other published oil volume charts.


#### Oil Depth Offset
The removeable electronics module design of the Smart Oil Gauge Duo allows for easy access to directly measure the distance from the bottom of the tank to the surface of the oil using an appropriate measuring stick. This distance is being refered to as the Oil Depth. \
`oil_depth_offset = (Oil Depth by Stick Measurement) - (Oil Depth reported by the sensor)`

#### Power Supply
It is highly recommended to use an external 6.5 to 7.4 VDC power supply. Running this code will likely deplete the
batteries faster than the stock firmware. Power leads can be soldered onto the battery contacts and pass through a hole drilled through the top cap.

#### Assembly
The oil gauge must be fully reassembled with all gasgets inplace

## Operation

The controller wakes every hour, sends three level readings to Home Assistant, and then powers down for another hour
waiting for the TPL5111 to power it back up.

Pressing the control button once will either wake up the controller, or power it back down.

Double pressing the control button while powered on will toggle between allowing and not allowing the automatic power
down. When the controller is on, and the automatic power down is allowed, the LED on the control board will be OFF and
briefly blink ON every second. When the controller is on, and the automatic power down is not allowed, the LED on the
control board will be ON and briefly blink OFF every second. Wait about 15 to 20 seconds after waking the controller
before attempting to disable the automatic power down. Disabling the Automatic power down gives time to flash Esphome
code updates.

| LED Behavior                 | Controller State (Double Press Control Button to switch states)                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Short Blink ON every Second  | Controller is awake, after sending 3 oil volume measurements, will power down for 1 hour. (Default State) |
| Short Blink OFF every Second | Controller is awake, will continue to stay awake until restarted. Useful for reprogramming.               |

