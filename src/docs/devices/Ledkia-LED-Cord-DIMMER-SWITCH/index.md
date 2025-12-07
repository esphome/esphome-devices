---
title: Ledkia LED Cord DIMMER Switch
date-published: 2025-12-07
type: dimmer
standard: EU
board: rtl87xx
made-for-esphome: False
difficulty: 4
---

![Ledkia LED Cord DIMMER Switch](Ledkia-LED-Cord-DIMMER-device.webp "Ledkia LED Cord DIMMER Switch")

"The Smart Wi-Fi dimmer is powered by Tuya platform with excellent compatibility to most Dimmable LED lamps also works pefectly with halogen or eclectronic transformer and incandescent lighting.
Possibiliity of wireless voice control via Alexa or Google home."

Also known as C152547 WIFI LED Cord Dimmer is a dimmer based on Tuya, with 2 microcontrollers. The dimmer side is controlled by stm microcontroller, and the Wi-Fi functionality by a [**Tuya WR3**](https://developer.tuya.com/en/docs/iot/wr3-module-datasheet?id=K9g3ainzbj9z1) module.

**Specs**
|   Description     |    Value |
|-------------------|-----------------------|
|Rated input voltage| 220-240 Vac, 50Hz|
|Power range        | 5-50VA @ 220-240V LED
|Power range        |10-100W @ 220-240 INC, HAL
|Type of load       | LED retrofit-Incandescent-halogen|
|Dimming Method     | Rotary|
|Ambient temperature| 35°C|
|Cables section     | 0.75 mm²|
|Dimension          | 96.7mm*24.9mm*39.4mm|
|Item weight        | 41g|

**Original paperwork**

![Ledkia LED Cord DIMMER Switch](Ledkia-LED-Cord-DIMMER-manual.png "Ledkia LED Cord DIMMER Switch")


## Pinout

![Ledkia LED Cord DIMMER Switch](Ledkia-LED-Cord-DIMMER-topside.jpg "Ledkia LED Cord DIMMER Switch board top")
![Ledkia LED Cord DIMMER Switch](Ledkia-LED-Cord-DIMMER-underside.jpg "Ledkia LED Cord DIMMER Switch board under")

| Pin | Function                                   |
| --- | ------------------------------------------ |
| GND | Ground connection                          |
| 3V3 | 3.3V input for powering the controller     |
| TX0 | Transmit pin connected to the Tuya MCU     |
| RX0 | Receive pin connected to the Tuya MCU      |
| TX2 | Transmit pin used for flashing/programming |
| RX2 | Receive pin used for flashing/programming  |

## Prerequisites

- Connect your **serial programming adapter** to the **WR3 module** as follows:

  - **GND** → GND
  - **3V3** → 3V3
  - **RX** → TX2
  - **TX** → RX2  
    Refer to the image above for the pinout layout.

- If you haven’t already, download [**ltchiptool**](https://github.com/libretiny-eu/ltchiptool), a command-line utility
  for flashing and dumping firmware.  
  **Note**: The standard ESP flasher is not compatible with this device.

## Flashing

Before flashing or dumping firmware, the device must be placed in **download mode**:

1. **Short TX2 to GND.**
2. **Power on the device** by connecting either:
   - the **3.3V and GND lines** to an adjustable power supply, or
   - the device’s **12–24V DC power supply** via the `INPUT` plug connection.
3. Connect the programming adapter to your PC.
   > _ltchiptool will prompt you later to disconnect TX2 from GND._

**Note:** As an alternative to disconnecting and reconnecting power, you can also **power cycle** the device by shorting
the **EN** pin to **GND**

## Backing up the original firmware

Before flashing ESPHome, it’s highly recommended to back up the original firmware in case you want to restore the stock
functionality later. Run:

```shell
ltchiptool flash read realtek-ambz lcds_backup.uf2
```

After issuing the command, disconnect TX2 from GND to begin the backup process.

### Flashing ESPHome

1. In the ESPHome device builder, after configuring your firmware, select:
   **Install > Manual download**, then click **UF2 package** to download the compiled binary.
2. Put the device back into download mode (short TX2 to GND, then power on).
3. Flash the new firmware using:

```shell
ltchiptool flash write realtek-ambz firmware.uf2
```

## Basic configuration

```yaml
esphome:
  name: miboxer-wl5
  friendly_name: MiBoxer WL5
  comment: MiBoxer WiFi 5 in 1 LED Strip Controller
  project:
    name: MiBoxer.WL5
    version: "2025.8.0"

rtl87xx:
  board: wr3
  framework:
    version: latest

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "MiBoxer WL5 Fallback Hotspot"

# Note: At the time of writing, enabling `web_server` or `captive_portal` causes the firmware compilation to fail.
captive_portal:

uart:
  rx_pin: RX0
  tx_pin: TX0
  baud_rate: 9600

tuya:

number:
  - platform: tuya
    name: Auto-off timer
    number_datapoint: 26
    min_value: 0
    max_value: 86400
    step: 1
    multiply: 60
    unit_of_measurement: min.
    entity_category: config
    icon: mdi:timer

select:
  - platform: tuya
    name: Mode
    enum_datapoint: 21
    optimistic: true
    options:
      0: White
      1: Color
      2: Scene
    icon: mdi:menu-open
    entity_category: config
```