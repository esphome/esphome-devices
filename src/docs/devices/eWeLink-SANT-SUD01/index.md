---
title: eWeLink PCIe Computer Remote (SANT-SUD01)
date-published: 2022-12-23
type: misc
standard: global
board: esp8266
---

A simple remote control/monitor device for use with standard PCs.

Installed between the power button and the motherboard, it's able to simulate pressing the power button.
As the headers are connected directly together, there's no way to "lock out" the physical button as some similar devices offer.
It uses the PCIe power rails to determine whether the host PC is turned on, but this is reported to the ESP by a secondary MCU which pulses GPIO0.

![Product Image](eWeLink-SANT-SUD01-PCIe-power-remote.jpg "Product Image")

## Flashing

The module has a convenient row of `2.54mm` pitch throgh holes below the ESP8285 chip which provide power and serial communication for the ESP.
To enter flashing mode, hold the "WiFi Configuration" button down while powering up the ESP.

| ESP8285 Pin | USB Serial Pin | Comments                                                                                                                          |
| ----------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| G           | Ground         | If using a dedicated power supply with the USB programmer, make sure that the GND for the programmer and power supply are linked! |
| V           | 3V3            | Connect to dedicated 3V3 1A power supply if encountering brown out                                                                |
| Rx          | TX             |                                                                                                                                   |
| Tx          | RX             |                                                                                                                                   |

Connect all 4 pins as indicated, hold the "WiFi Configuration" button down and _then_ power up the device and _then_ plug in the USB programmer.
The module should immediately enter boot loader mode and should be "discoverable" with `esptool.py`.

While not strictly necessary, you may wish to backup the flash content before overwriting with ESPHome.

```shell
# Confirm that you can "see" the module
❯ esptool.py --port /dev/ttyUSB0 chip_id

# Double check the type/size of the flash chip
❯ esptool.py --port /dev/ttyUSB0 flash_id

# Read out the flash; in this case, the `flash_id` command indicated that the ESP had 1MB of built in flash memory
❯ esptool.py --port /dev/ttyUSB0 read_flash 0x000000 0x100000 flash_backup.bin
```

## GPIO Pinout

| Pin    | Function | Notes                                                                                       |
| ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| GPIO0  | INPUT    | Button on module PCB, used by OEM firmware for WiFi config (inverted); also receives a ~2.5Hz signal when the PC is turned on |
| GPIO12 | OUTPUT   | Wired to the PC power button / motherboard, to simulate pressing the power button                                             |
| GPIO13 | OUTPUT   | Status LED (inverted)                                                                                                         |

## Basic Configuration

The configuration below covers just the basics for getting the core functionality (turning PC on/off and seeing its status) usable in ESPHome.
Depending on your specific needs, more configuration may be needed.
E.G.: most motherboards will interpret the power button being pressed for 5+ seconds to mean "shutdown _now_". Exposing `GPIO12` to Home Assistant _directly_ as a gpio switch may result in the PC powering off a few seconds after it's powered on.

As GPIO0 is shared by the "WiFi Configuration" button and the PC power status signal, the button isn't included in the config below; if you wish to use it in your configuration, you'll need to determine how to reliably discern a button press from the "PC is on" signal (which appears to be around 2.5Hz / 150 pulses per minute; a threshold of 60 pulses per minute is used here to ensure detection).

```yaml
substitutions:
  friendly_name: "My PC Power Control"
  friendly_name_short: "My PC"

  hostname: "my-pc-power-remote-control"

esphome:
  name: ${hostname}

  # Shows up in UI
  comment: "Remote power button for ${friendly_name_short}."

esp8266:
  # Specifically a 'ESP8285N08' with 1MB built in flash
  # See: https://docs.platformio.org/en/stable/boards/espressif8266/esp8285.html
  board: esp8285

logger:
  level: INFO

script:
  - id: regular_press
    mode: single
    then:
      - output.turn_on: out_relay
      - delay: .5s
      - output.turn_off: out_relay

status_led:
  pin:
    number: GPIO13
    inverted: True

sensor:
  - platform: pulse_meter
    id: power_status_pulses
    pin: GPIO0
    timeout: 5s

switch:
  - name: "${friendly_name_short} Power"
    id: sw_pc_power
    platform: template
    lambda: |-
      if (id(power_status_pulses).state > 60.0f) {
        return true;
      } else {
        return false;
      }

    # Mimic the user pressing the button
    turn_on_action:
      - script.execute: regular_press
    turn_off_action:
      - script.execute: regular_press

output:
  - platform: gpio
    id: out_relay
    pin: GPIO12
```
