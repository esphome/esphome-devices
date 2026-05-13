---
title: HomeMaster MiniPLC
date-published: 2026-05-13
type: relay
standard: global
board: esp32
project-url: https://github.com/isystemsautomation/homemaster-dev/tree/main/MiniPLC
made-for-esphome: True
difficulty: 1
---

## HomeMaster MiniPLC

![Device](./miniplc.png)

## Description

The HomeMaster MiniPLC is an ESP32-based DIN-rail controller designed for
robust and scalable smart automation in residential, commercial, and light
industrial environments. It combines digital inputs, relay outputs, analog
inputs, a 0–10 V analog output, RTD and 1-Wire temperature inputs, a
front-panel OLED + buttons, a battery-backed real-time clock, and isolated
RS-485 (Modbus RTU) — all powered from 24 V DC or a wide-range AC/DC
supply.

The device is designed for local operation using ESPHome and integrates
directly with Home Assistant. It runs offline without any cloud dependency
and can act as a stand-alone controller or as a Modbus RTU master for
expansion via RS-485 field devices.

This page includes the full ESPHome configuration used on shipped devices
(including vendor OTA update settings).

For complete product documentation (connections, compliance/certifications,
wiring, and schematics), see:

- Product page: [home-master.eu shop](https://www.home-master.eu/shop/esp32-miniplc-55)
- Repository: [GitHub repository](https://github.com/isystemsautomation/homemaster-dev/tree/main/MiniPLC)
- Datasheet (PDF):
  [MiniPLC_Datasheet.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Manuals/MiniPLC_Datasheet.pdf)
- User Manual (PDF):
  [User Manual.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Manuals/User%20Manual.pdf)
- Declaration of Conformity (PDF):
  [DoC-MiniPLC-V1.0.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Manuals/DoC-MiniPLC-V1.0.pdf)
- Schematics (PDF):
  - MCU Board:
    [MCU_Board.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Schematic/MCU_Board.pdf)
  - Relay Board:
    [Relay_Board.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Schematic/Relay_Board.pdf)
  - USB Board:
    [USB_Board.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Schematic/USB_Board.pdf)

- Maker: [home-master.eu](https://www.home-master.eu/)

## Hardware Details

- **MCU:** ESP32-WROOM-32U (dual-core, Wi-Fi + Bluetooth, external antenna connector)
- **Architecture:** Modular — MCU Board + Relay Board + USB Board
- **Part number:** MiniPLC-R1
- **Hardware version:** V1.0
- **Manufacturer:** ISYSTEMS AUTOMATION S.R.L.

## Power Input

Use **only one** power input method at a time:

| Method   | Terminals    | Range                  |
|----------|--------------|------------------------|
| 24 V DC  | V+ / 0V      | 24 V DC nominal        |
| AC mains | L / N        | 85–265 V AC            |
| Wide DC  | L / N (+ / −)| 120–370 V DC           |

## Terminal Connections

### Digital inputs

4 × isolated 24 V DC discrete inputs (DIx + GNDx), supporting dry-contact
closure. Protected by per-channel PTC fuse, TVS surge suppression, and
EMI filtering.

| Label | Function     | GPIO   |
|-------|--------------|--------|
| DI1   | Digital In 1 | GPIO36 |
| DI2   | Digital In 2 | GPIO39 |
| DI3   | Digital In 3 | GPIO34 |
| DI4   | Digital In 4 | GPIO35 |

### Analog inputs (0–10 V, 16-bit, ADS1115 @ I²C 0x48)

| Label | Function       | ADC Channel |
|-------|----------------|-------------|
| AI1   | Analog Input 1 | A3          |
| AI2   | Analog Input 2 | A2          |
| AI3   | Analog Input 3 | A1          |
| AI4   | Analog Input 4 | A0          |

### Analog output

| Label | Function          | Device              |
|-------|-------------------|---------------------|
| AO    | 0–10 V, 12-bit    | MCP4725 (I²C)       |

### Temperature inputs

- 2 × RTD inputs — PT100 / PT1000 via MAX31865 (SPI)
- 2 × 1-Wire buses — DS18B20 compatible

### Relay outputs

6 × SPDT dry-contact relays (Relay Board). Driven through two PCF8574 I²C
I/O expanders.

| Label   | Expander             | Pin |
|---------|----------------------|-----|
| RELAY 1 | PCF8574 hub_b (0x39) | P2  |
| RELAY 2 | PCF8574 hub_b (0x39) | P1  |
| RELAY 3 | PCF8574 hub_b (0x39) | P0  |
| RELAY 4 | PCF8574 hub_a (0x38) | P6  |
| RELAY 5 | PCF8574 hub_a (0x38) | P5  |
| RELAY 6 | PCF8574 hub_a (0x38) | P4  |

### Front panel

| Label    | Function                | Connection           |
|----------|-------------------------|----------------------|
| Button 1 | Front-panel button      | PCF8574 hub_a P0     |
| Button 2 | Front-panel button      | PCF8574 hub_a P1     |
| Button 3 | Front-panel button      | PCF8574 hub_a P2     |
| Button 4 | Front-panel button      | PCF8574 hub_a P3     |
| LED 2    | User LED                | PCF8574 hub_b P3     |
| LED 3    | User LED                | PCF8574 hub_b P4     |
| Status   | Status LED              | PCF8574 hub_a P7     |
| Buzzer   | Piezo buzzer (LEDC PWM) | GPIO2                |
| OLED     | SH1106 128×64 display   | I²C 0x3C             |

Total 16 front-panel LEDs (Power, 3 user, 1 status, RX, TX, relay-status,
DI-status).

### Communication and bus

| Label   | Function                              | GPIO   |
|---------|---------------------------------------|--------|
| RS-485  | Isolated Modbus RTU (MAX485, TX)      | GPIO17 |
| RS-485  | Isolated Modbus RTU (MAX485, RX)      | GPIO16 |
| SDA     | I²C bus                               | GPIO32 |
| SCL     | I²C bus                               | GPIO33 |
| 1W-1    | 1-Wire Bus 1                          | GPIO5  |
| 1W-2    | 1-Wire Bus 2                          | GPIO4  |

RS-485 includes TVS surge protection, PTC fuses, EMI choke, and fail-safe
biasing.

### I²C device map

| Address | Device                                            |
|---------|---------------------------------------------------|
| 0x38    | PCF8574 hub_a (buttons / relays 4–6 / status LED) |
| 0x39    | PCF8574 hub_b (relays 1–3 / user LEDs)            |
| 0x48    | ADS1115 (4× analog inputs)                        |
| 0x51    | PCF8563 (battery-backed RTC)                      |
| 0x3C    | SH1106 OLED display                               |
| —       | MCP4725 (DAC 0–10 V)                              |

### Storage and USB

- microSD card slot (SPI interface, power-switched 3.3 V rail)
- USB Type-C with ESD protection and CC detection (data to ESP32)
- Optional Ethernet (LAN8720 PHY)

## GPIO Notes

### GPIO5 — 1-Wire Bus 1 (Strapping Pin)

GPIO5 is an ESP32 strapping pin that must be HIGH at boot. On this device
the 1-Wire bus is buffered so the strapping requirement is satisfied at
power-on before the ESP32 initializes — no external pull-up or firmware
workaround is needed.

## Relay Specifications

- 6 × SPDT dry-contact relays
- System limit (resistive contact rating): **3 A @ 250 VAC**
- Max load: **750 VA @ 250 VAC**
- Max load: **90 W @ 30 VDC**
- Not internally fused — external overcurrent protection required

Relay components are individually rated up to 16 A @ 250 VAC (resistive);
this component rating does not apply to the complete module. The system
limit above always governs.

## Terminal Specifications

| Parameter            | Value                                    |
|----------------------|------------------------------------------|
| Terminal type        | Pluggable screw terminal blocks          |
| Terminal pitch       | 5.08 mm                                  |
| Wire cross-section   | 0.2–2.5 mm² (AWG 24–12)                  |
| Conductor type       | Solid or stranded copper                 |
| Stranded wire        | Ferrules recommended                     |
| Tightening torque    | 0.4 Nm (max)                             |

## Compliance

CE marked. Designed to comply with the applicable EU directives. The
manufacturer maintains the technical documentation and a signed EU
Declaration of Conformity (DoC).

**EU Directives**

- EMC Directive 2014/30/EU
- LVD Directive 2014/35/EU
- RED Directive 2014/53/EU
- RoHS Directive 2011/65/EU

**Harmonised standards**

- EMC: EN 61000-6-1 (Immunity), EN 61000-6-3 (Emissions)
- Electrical safety: EN 62368-1
- Radio: EN 300 328, EN 301 489-1, EN 301 489-17
- RoHS: EN IEC 63000

The product integrates a pre-certified ESP32 Wi-Fi radio module (2.4 GHz).

## Features

- ESP32-WROOM-32U (dual-core, Wi-Fi + Bluetooth)
- 4 × isolated 24 V DC digital inputs
- 6 × SPDT dry-contact relay outputs (3 A @ 250 VAC resistive)
- 4 × analog inputs 0–10 V (ADS1115, 16-bit)
- 1 × analog output 0–10 V (MCP4725, 12-bit)
- 2 × RTD inputs (PT100 / PT1000 via MAX31865)
- 2 × 1-Wire buses (DS18B20 compatible)
- Isolated RS-485 / Modbus RTU
- 128 × 64 OLED display (SH1106)
- 4 front-panel buttons + 16 front-panel LEDs
- Piezo buzzer
- PCF8563 battery-backed real-time clock
- microSD card storage (SPI)
- USB Type-C
- Optional Ethernet (LAN8720 PHY)
- Power input options: 24 V DC, 85–265 V AC, or 120–370 V DC
- ESPHome pre-installed
- OTA updates (ESPHome + HTTP)
- Improv provisioning (Serial + BLE)
- DIN-rail mounting

## Electrical and Safety Notes

- Use only one power input method at a time.
- L / N terminals carry hazardous voltage; 24 V DC input is SELV.
- Installation and service by qualified personnel only.
- Relay outputs are dry-contact and not internally fused.
- Add external overcurrent protection (fuse or breaker) for relay/mains
  circuits; use external contactors for loads above 3 A or for inductive
  / high-inrush loads.
- Install inside a control cabinet with ventilation. The cabinet must
  include a protective front plate and a closing protective door.
- All wiring terminals must be protected against accidental contact by
  an insulating front plate, wiring duct, or terminal cover.

## Mechanical and Environmental

- Operating temperature: `0 °C` to `+40 °C`
- Storage temperature: `-10 °C` to `+55 °C`
- Relative humidity: `0–90 %` RH, non-condensing
- Protection rating: `IP20` (inside cabinet)
- Dimensions: `157.4 × 91 × 58.4 mm` (L × W × H)
- DIN width: `9 DIN modules` (≈160 mm DIN rail width)
- Mounting: `35 mm DIN rail`
- Net weight: `300 g` · Gross weight: `450 g`

## Cable Recommendations

Applies to Analog (0–10 V), Temperature (RTD / 1-Wire) and RS-485 wiring.

- Route low-level signal cables separately from mains, relay outputs,
  contactors, VFD motor cables, and power wiring. If crossing is
  unavoidable, cross at 90°.
- **Analog (0–10 V):** twisted pair (Signal + GND) per channel with overall
  shield (e.g. J-Y(ST)Y) or individually shielded pairs in high-EMI
  environments (e.g. LI2YCY PIMF).
- **RTD (PT100 / PT1000):** shielded multi-core for 2/3-wire; shielded
  pairs for best accuracy in 4-wire (e.g. LI2YCY PIMF 2×2×0.50).
- **1-Wire (DS18B20):** shielded 3-core (+5V / DATA / GND); daisy-chain
  bus topology, stubs ≤ 0.5 m, 4.7 kΩ pull-up typical.
- **RS-485:** 120 Ω twisted pair for A/B, second pair for COM (0V); overall
  shield in cabinets, individually shielded pairs + overall shield in
  high-EMI environments.
- **Shield grounding:** bond cable shields to cabinet PE/EMC ground at the
  PLC end only. Do not connect shields to signal terminals.

## Pinout

![Pinout](./pinout.png)

## Getting Started

The device supports two setup methods:

- **Improv Wi-Fi (recommended)**
- **Fallback Access Point**

### Improv Wi-Fi Setup (Recommended)

1. Power on the device
2. Open [improv-wifi.com](https://improv-wifi.com)
3. Connect via USB or Bluetooth
4. Enter Wi-Fi credentials
5. Wait for connection

After connection, the device will appear automatically in:

- ESPHome Dashboard
- Home Assistant

Click **Take Control** to import the full configuration.

### Fallback Access Point

If the device cannot connect to Wi-Fi, it starts a fallback Access Point.

#### Steps

1. Power on the device and wait approximately 60 seconds
2. Connect to the fallback Access Point exposed by the device
3. Open a browser and navigate to: [http://192.168.4.1](http://192.168.4.1)
4. Enter your Wi-Fi credentials and save

The device will restart and connect to your network.

### Notes

- The captive portal page may open automatically. If it does not, open
  `http://192.168.4.1` manually.
- Mobile devices may continue using mobile data; disable it if the page
  does not load.
- The fallback Access Point is only active when the device cannot connect
  to Wi-Fi.
- Improv Wi-Fi is the preferred setup method.

## Firmware Updates

The device supports two firmware update methods:

### ESPHome Updates (User-controlled)

After taking control in ESPHome Dashboard, firmware can be updated manually:

- Build new firmware from ESPHome
- Upload via OTA or USB
- Full control over configuration

### Managed Updates (HTTP)

The device also supports vendor-provided firmware updates.

A firmware update entity is exposed in Home Assistant, allowing the device
to check for new firmware versions and install updates directly.

This mechanism uses:

- `update.http_request`
- a hosted firmware manifest
- OTA firmware downloads over HTTPS

If a newer firmware version is available, it can be installed directly
from Home Assistant.

## ESPHome Compatibility

- Minimum ESPHome version used and tested: **2025.7.0**

## 1-Wire Bus Note

- In the provided configuration, the 1-Wire buses do not define fixed
  sensor `address` values.
- With this setup, use one sensor per bus (`GPIO5` and `GPIO4`) for
  predictable operation.
- If you connect multiple sensors on the same bus, you must set each
  sensor `address` explicitly in YAML.

## Example Entities

The example configuration below exposes:

- 4 × Digital Input (DI #1 – DI #4)
- 6 × Relay (RELAY #1 – RELAY #6)
- 4 × Front-panel Button
- 2 × User LED + Status LED
- Buzzer switch
- 4 × Analog Input (AI1 – AI4, ADS1115)
- 0–10 V analog output (DAC, MCP4725)
- OLED display (SH1106 128×64)
- PCF8563 real-time clock + "Current time" text sensor
- 1-Wire Bus 1 / Bus 2 (Dallas sensors, optional)
- Firmware Update

## Minimal ESPHome Configuration

Use this minimal configuration to connect the device to your network and
import the full shipped configuration.

```yaml
esphome:
  name: homemaster-miniplc
  name_add_mac_suffix: true
  friendly_name: HomeMaster MiniPLC
  project:
    name: homemaster.miniplc
    version: "1.0.0"

esp32:
  board: esp32dev
  framework:
    type: esp-idf

logger:

api:

ota:
  - platform: esphome

wifi:
  ap: {}

captive_portal:

esp32_improv:
  authorizer: none

improv_serial:

dashboard_import:
  package_import_url: github://isystemsautomation/homemaster-dev/MiniPLC/Firmware/miniplc.yaml@main
  import_full_config: true
```

## Full ESPHome Configuration (Shipped Device)

```yaml
substitutions:
  name: "miniplc"
  friendly_name: "HomeMaster MiniPLC"
  device_description: "HomeMaster MiniPLC"
  project_name: "homemaster.miniplc"
  project_version: "1.0.0"

esphome:
  name: "${name}"
  friendly_name: "${friendly_name}"
  comment: "${device_description}"
  min_version: 2025.7.0
  name_add_mac_suffix: true
  project:
    name: "${project_name}"
    version: "${project_version}"

esp32:
  board: esp32dev
  framework:
    type: esp-idf
    version: recommended

logger:
  baud_rate: 115200

mdns:
  disabled: false

api:

wifi:
  ap: {}
  on_connect:
    then:
      - delay: 10s
      - component.update: firmware_update

captive_portal:

improv_serial:

esp32_improv:
  authorizer: none

dashboard_import:
  package_import_url: github://isystemsautomation/homemaster-dev/MiniPLC/Firmware/miniplc.yaml@main
  import_full_config: true

http_request:

ota:
  - platform: esphome
  - platform: http_request

update:
  - platform: http_request
    id: firmware_update
    name: "Firmware Update"
    source: https://isystemsautomation.github.io/homemaster-dev/MiniPLC/Firmware/manifest.json
    update_interval: 6h

uart:
  id: uart_modbus
  tx_pin: GPIO17
  rx_pin: GPIO16
  baud_rate: 19200

one_wire:
  - platform: gpio
    pin: GPIO5
    id: hub_1
  - platform: gpio
    pin: GPIO4
    id: hub_2

i2c:
  - id: bus_a
    sda: GPIO32
    scl: GPIO33
    frequency: 400kHz
    timeout: 1s
    scan: true

time:
  - platform: pcf8563
    id: pcf8563_time
    address: 0x51
  - platform: homeassistant
    on_time_sync:
      then:
        pcf8563.write_time:

pcf8574:
  - id: pcf8574_hub_a
    address: 0x38
    pcf8575: false
  - id: pcf8574_hub_b
    address: 0x39
    pcf8575: false

ads1115:
  - address: 0x48

font:
  - file: "gfonts://Roboto"
    id: font1
    size: 8
  - file: "gfonts://Roboto"
    id: font2
    size: 48
  - file: "gfonts://Roboto"
    id: font3
    size: 14

display:
  - platform: ssd1306_i2c
    model: "SH1106 128x64"
    address: 0x3C
    rotation: 180
    contrast: 100%
    id: oled_display
    update_interval: 1s
    lambda: |-
       it.printf(64, 0, id(font1), TextAlign::TOP_CENTER, "HOMEMASTER");
       it.strftime(0, 60, id(font2), TextAlign::BASELINE_LEFT, "%H:%M", id(pcf8563_time).now());

text_sensor:
  - platform: template
    name: "Current time"
    id: current_time
    lambda: |-
      char str[17];
      time_t currTime = id(pcf8563_time).now().timestamp;
      strftime(str, sizeof(str), "%Y-%m-%d %H:%M", localtime(&currTime));
      return  { str };
    update_interval: 60s
  - platform: version
    name: "ESPHome Version"
    entity_category: diagnostic
  - platform: wifi_info
    ip_address:
      name: "ESP IP Address"
      entity_category: diagnostic

binary_sensor:
  - platform: status
    id: esp_status
    name: "ESP Status"
    entity_category: diagnostic

  - platform: gpio
    pin:
      number: GPIO36
    name: "DI #1"
  - platform: gpio
    pin:
      number: GPIO39
    name: "DI #2"
  - platform: gpio
    pin:
      number: GPIO34
    name: "DI #3"
  - platform: gpio
    pin:
      number: GPIO35
    name: "DI #4"

  - platform: gpio
    name: "Button #1"
    pin:
      pcf8574: pcf8574_hub_a
      number: 0
      inverted: true
  - platform: gpio
    name: "Button #2"
    pin:
      pcf8574: pcf8574_hub_a
      number: 1
      inverted: true
  - platform: gpio
    name: "Button #3"
    pin:
      pcf8574: pcf8574_hub_a
      number: 2
      inverted: true
  - platform: gpio
    name: "Button #4"
    pin:
      pcf8574: pcf8574_hub_a
      number: 3
      inverted: true

switch:
  - platform: gpio
    name: "RELAY #1"
    pin:
      pcf8574: pcf8574_hub_b
      number: 2
      mode:
        output: true
      inverted: true
  - platform: gpio
    name: "RELAY #2"
    pin:
      pcf8574: pcf8574_hub_b
      number: 1
      mode:
        output: true
      inverted: true
  - platform: gpio
    name: "RELAY #3"
    pin:
      pcf8574: pcf8574_hub_b
      number: 0
      mode:
        output: true
      inverted: true
  - platform: gpio
    name: "RELAY #4"
    pin:
      pcf8574: pcf8574_hub_a
      number: 6
      mode:
        output: true
      inverted: true
  - platform: gpio
    name: "RELAY #5"
    pin:
      pcf8574: pcf8574_hub_a
      number: 5
      mode:
        output: true
      inverted: true
  - platform: gpio
    name: "RELAY #6"
    pin:
      pcf8574: pcf8574_hub_a
      number: 4
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "LED #2"
    pin:
      pcf8574: pcf8574_hub_b
      number: 3
      mode:
        output: true
      inverted: true
  - platform: gpio
    name: "LED #3"
    pin:
      pcf8574: pcf8574_hub_b
      number: 4
      mode:
        output: true
      inverted: true

  - platform: template
    name: "Switch buzzer"
    optimistic: true
    turn_on_action:
      - output.turn_on: buzzer_output
      - output.ledc.set_frequency:
          id: buzzer_output
          frequency: "2441Hz"
      - output.set_level:
          id: buzzer_output
          level: "75%"
    turn_off_action:
      - output.turn_off: buzzer_output

fan:
  - platform: speed
    output: dac_output
    name: "DAC 0-10V"

sensor:
  - platform: uptime
    id: esp_uptime
    internal: true
    update_interval: 60s

  - platform: wifi_signal
    id: wifi_signal_db
    name: "WiFi Signal"
    update_interval: 60s
    entity_category: diagnostic

  - platform: internal_temperature
    id: esp32_temperature
    name: "ESP32 Temperature"
    update_interval: 60s
    entity_category: diagnostic

  - platform: ads1115
    multiplexer: 'A0_GND'
    gain: 6.144
    name: "ADC AI4"
    update_interval: 60s
    filters:
      - multiply: 3
  - platform: ads1115
    multiplexer: 'A1_GND'
    gain: 6.144
    name: "ADC AI3"
    update_interval: 60s
    filters:
      - multiply: 3
  - platform: ads1115
    multiplexer: 'A2_GND'
    gain: 6.144
    name: "ADC AI2"
    update_interval: 60s
    filters:
      - multiply: 3
  - platform: ads1115
    multiplexer: 'A3_GND'
    gain: 6.144
    name: "ADC AI1"
    update_interval: 60s
    filters:
      - multiply: 3

output:
  - platform: ledc
    pin: GPIO2
    id: buzzer_output
  - platform: mcp4725
    id: dac_output

status_led:
  pin:
    pcf8574: pcf8574_hub_a
    number: 7
    mode:
      output: true
    inverted: false
```

## License

This project uses a hybrid licensing model.

**Hardware**

Hardware designs (schematics, PCB layouts, BOMs) are licensed under:
CERN-OHL-W v2

**Firmware & ESPHome Integration**

All firmware, ESPHome configurations, and software components are licensed under:
MIT License

This ensures full compatibility with ESPHome and Home Assistant while
protecting hardware designs.

See LICENSE files in each directory for full terms.
