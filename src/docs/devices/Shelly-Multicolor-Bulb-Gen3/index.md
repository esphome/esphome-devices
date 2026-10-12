---
title: Shelly Multicolor Bulb Gen3
date-published: 2026-10-12
type: light
standard: eu
board: esp32
difficulty: 2
---

The Shelly Multicolor Bulb E27 Gen3 (`S3BL-C010007AEU`, board marking `RGBCCTBulbG3`) is a Wi-Fi LED bulb with an E27
socket (ESP32-C3, 8 MB flash).

Its LED driver is a **KP18068** (5-channel constant-current driver, 2-wire bus), which ESPHome does not support itself.
The configuration uses an external component for it.

![Shelly Multicolor Bulb Gen3](../Shelly-Multicolor-Bulb-Gen3/Shelly-Multicolor-Bulb-Gen3.png "Shelly Multicolor Bulb Gen3")

The bulb has red, green and blue LEDs and **one fixed warm white**, so it is an `rgbw` light; cool whites are mixed
from the RGB LEDs.

Tested on real bulbs: flashing over UART, the OTA install (on a second, new bulb), a normal ESPHome run and the
LED channel order. Not tested: colour accuracy, the lowest dimming steps, the driver currents (taken from the Shelly
firmware) and power consumption.

> **Warning:** The bulb contains a **non-isolated mains power supply**. Never open it or connect a serial adapter while
> it is connected to mains voltage.

## Flashing

### Option 1: OTA from the stock firmware (Free-Shelly-OTA)

The bulb does not have to be opened. The community tool [Free-Shelly-OTA](https://github.com/oxynatOr/free-shelly-ota)
can send an ESPHome image to the bulb while it still runs the Shelly firmware. The steps and the ESPHome settings it
needs are on the tool's
[device page](https://github.com/oxynatOr/free-shelly-ota/blob/main/docs/devices/RGBCCTBulbG3.md).

### Option 2: UART

Open the bulb and connect a 3.3 V USB-to-serial adapter to TX, RX, GND, 3V3 and BOOT (GPIO9). Take the bulb out of the
socket and power it only from the adapter. To enter download mode, connect BOOT to GND while powering on and release it
after the chip has started.

As always, first take a dump!

```bash
esptool --chip esp32c3 --port COM11 --baud 460800 read_flash 0x0 0x800000 shelly_multicolor_bulb_gen3.bin
```

Then flash the `firmware.factory.bin` of your build to `0x0`:

```bash
esptool --chip esp32c3 --port COM11 --baud 460800 write_flash 0x0 firmware.factory.bin
```

## GPIO Pinout

| Pin    | Function                         |
| ------ | -------------------------------- |
| GPIO4  | LED driver data (SDA)            |
| GPIO5  | LED driver clock (SCL)           |
| GPIO9  | BOOT (download mode, low-active) |
| GPIO20 | UART RX (console, logger)        |
| GPIO21 | UART TX (console, logger)        |

| LED driver output | LED                        |
| ----------------- | -------------------------- |
| OUT1              | Blue                       |
| OUT2              | Red                        |
| OUT3              | Green                      |
| OUT4              | Warm white                 |
| OUT5              | No visible effect          |

The Shelly firmware writes the same value to OUT4 and OUT5; the configuration leaves OUT5 unused.

## Configuration

The external component bit-bangs the two driver pins, so there is no `i2c:` block. The driver currents are the values
of the Shelly firmware (9 mA colours, 27.5 mA white). The white is driven on OUT4.

```yaml file=config.yaml
```

Slider values below about 8 % round to zero (10-bit driver plus gamma correction 2.8), so the lowest steps stay dark.
This is derived from the driver code, not observed. `min_power` with `zero_means_zero: true` on the outputs would avoid
it.
