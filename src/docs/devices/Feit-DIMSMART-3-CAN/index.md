---
title: Feit Electric Smart Dimmers
date-published: 2024-11-08
type: dimmer
standard: us
board: bk72xx
---
![Product Image](Feit-DIMSMART-3-CAN.jpg "Box Image")

I purchased this at Costco in Canada in November of 2022 and then again in November of 2024. The Costco item number was 1734165.

It is hold together with screws, making it very easy to open and flash.

First, I took the unit apart. Then I soldered pin headers onto the board. I took 3v3 and gnd from a 
nearby ESP32 devkit and connected it to my computer.

You also need to solder a wire to the NRST pad on the bottom of the board.

Connect NRST to gnd, then provide power to the board.

First, I copied the firmware off of the board.
`ltchiptool flash read beken-72xx ./dimmer1`

Then I used ltchiptool's UPK2ESPHome to parse the firmware. The result is the configuration below. Put 
that config into a .yml file and compile the firmware:
`esphome conpile dimmer.yml`

Next, write that firmware:

ltchiptool flash write .esphome/build/dimmer/.pioenvs/dimmer/esphome_2024.10.0_generic-bk7231n-qfn32-tuya_bk7231n_lt1.7.0.uf2





