# HomeMaster MiniPLC

![Device](./Images/MiniPLC.png)

**Part No.:** MiniPLC-R1 · **Hardware Version:** V1.0 · **Manufacturer:** ISYSTEMS AUTOMATION S.R.L.

## Description

The HomeMaster MiniPLC is an ESP32-based DIN-rail automation controller designed for residential, commercial, and light industrial smart automation. It combines industrial digital inputs, mechanical relay outputs, analog I/O, RTD and 1-Wire temperature inputs, an OLED display, front-panel buttons, a battery-backed RTC, and an isolated RS-485 / Modbus RTU bus.

The device is designed for local operation using ESPHome and integrates directly with Home Assistant. It runs offline without cloud dependency and can act as a stand-alone controller or as a Modbus RTU master for expansion via RS-485 HomeMaster I/O modules.

This repository includes the full ESPHome configuration used on shipped devices (including vendor OTA update settings).

## Quick Start

1. Mount the device on 35 mm DIN rail inside a closed control cabinet.
2. Connect ONE power input (24 V DC at V+/0V, OR 85–265 V AC at L/N).
3. Wire your field signals: DI, AI, AO, RTD, 1-Wire, RS-485 — as needed.
4. Power on, open <https://improv-wifi.com>, and provision Wi-Fi via Bluetooth (BLE) or USB (Serial).
5. Open ESPHome Dashboard → click **Take Control** to import the configuration. The device appears in Home Assistant under Settings → Devices & Services → ESPHome.

| Resource | Link |
|---|---|
| 🛒 Product page | [home-master.eu](https://www.home-master.eu/shop/esp32-miniplc-55) |
| 📁 Repository | [GitHub](https://github.com/isystemsautomation/homemaster-dev/tree/main/MiniPLC) |
| 📄 Datasheet (PDF) | [MiniPLC_Datasheet.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Manuals/MiniPLC_Datasheet.pdf) |
| 📘 User Manual (PDF) | [User Manual.pdf](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Manuals/User%20Manual.pdf) |
| ⚙️ Default Firmware (YAML) | [miniplc.yaml](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Firmware/miniplc.yaml) |
| 🔧 Schematics | [Schematic/](https://github.com/isystemsautomation/homemaster-dev/tree/main/MiniPLC/Schematic) |
| 🏠 Maker | [home-master.eu](https://www.home-master.eu/) |

## Table of Contents

- [Description](#description)
- [Quick Start](#quick-start)
- [Features](#features)
- [Compatible Expansion Modules](#compatible-expansion-modules)
- [Electrical and Safety Notes](#electrical-and-safety-notes)
- [Mechanical and Environmental](#mechanical-and-environmental)
- [Installation](#installation)
- [Cable Recommendations & Shield Grounding](#cable-recommendations--shield-grounding)
- [Wiring](#wiring)
- [Pinout](#pinout)
- [Terminal Reference](#terminal-reference)
- [LED and Button Behaviour](#led-and-button-behaviour)
- [GPIO Map](#gpio-map)
- [RTD DIP Switch Configuration](#rtd-dip-switch-configuration)
- [Enabling RTD Sensors in YAML](#enabling-rtd-sensors-in-yaml)
- [Enabling 1-Wire Sensors in YAML](#enabling-1-wire-sensors-in-yaml)
- [Real-Time Clock (RTC) Battery](#real-time-clock-rtc-battery)
- [Network Requirements](#network-requirements)
- [First Boot & Wi-Fi Setup](#first-boot--wi-fi-setup)
- [Optional Ethernet (LAN8720)](#optional-ethernet-lan8720)
- [Home Assistant Integration](#home-assistant-integration)
- [Firmware Updates](#firmware-updates)
- [Device Behaviour Reference](#device-behaviour-reference)
- [Troubleshooting](#troubleshooting)
- [Entity Reference](#entity-reference)
- [Default Firmware Configuration](#default-firmware-configuration)
- [Support & Community](#support--community)
- [Compliance & Certifications](#compliance--certifications)
- [License](#license)
- [Changelog](#changelog)

## Features

- ESP32-WROOM-32U (dual-core, Wi-Fi + Bluetooth, external antenna)
- 4 × isolated 24 V DC digital inputs (ISO1212), per-channel PTC fuse, TVS and EMI filtering
- 6 × SPDT mechanical relay outputs (HF115F/005-1ZS3) with NO / NC / COM terminals. System limit **3 A @ 250 VAC** (resistive) per channel; relay component rated up to 12 A but the board/system rating governs.
- 4 × analog inputs 0–10 V (ADS1115, 16-bit) with op-amp buffer and scaling network
- 1 × analog output 0–10 V (MCP4725, 12-bit DAC) with op-amp output stage
- 2 × RTD inputs (PT100 / PT1000 via MAX31865) with on-board DIP switch configuration for sensor type and 2/3/4-wire mode
- 2 × 1-Wire buses (DS18B20 compatible) with auxiliary +5 V supply
- Isolated RS-485 / Modbus RTU bus (MAX485 with TVS, PTC fuses, EMI choke, fail-safe biasing)
- 128 × 64 OLED display (SH1106, I²C)
- 4 front-panel buttons + 3 user LEDs + 1 status LED + buzzer
- PCF8563 real-time clock with on-board battery holder (battery sold separately)
- microSD card slot (SPI, power-switched 3.3 V rail)
- Power input options: 24 V DC or 85–265 V AC (single isolated input module)
- USB Type-C for programming and serial console (CP2102N, ESD-protected)
- Wi-Fi 2.4 GHz (pre-certified ESP32 radio module) and Bluetooth
- Optional Ethernet via on-board LAN8720 PHY (RMII, fixed pins)
- ESPHome pre-installed
- OTA updates (ESPHome + HTTP vendor-managed)
- Improv provisioning (BLE + USB Serial)
- DIN-rail mounting (9 DIN modules ≈ 160 mm)
- Modular architecture: MCU Board + Relay Board + USB Board

## Compatible Expansion Modules

The MiniPLC acts as a Modbus RTU master on its RS-485 bus. Add HomeMaster I/O modules using the standard `modbus_controller:` or pre-built `packages:` blocks from each module's repository folder.

| Module | Function | Repository |
|---|---|---|
| DIO-430-R1 | 4 × digital inputs + 3 × relays | [DIO-430-R1/](https://github.com/isystemsautomation/homemaster-dev/tree/main/DIO-430-R1) |
| DIM-420-R1 | 4 × triac dimmer outputs | [DIM-420-R1/](https://github.com/isystemsautomation/homemaster-dev/tree/main/DIM-420-R1) |
| ENM-223-R1 | Energy monitor (single-phase) | [ENM-223-R1/](https://github.com/isystemsautomation/homemaster-dev/tree/main/ENM-223-R1) |
| ALM-173-R1 | Alarm panel (17 zones, 3 outputs) | [ALM-173-R1/](https://github.com/isystemsautomation/homemaster-dev/tree/main/ALM-173-R1) |
| AIO-422-R1 | 4 × analog inputs + 2 × analog outputs | [AIO-422-R1/](https://github.com/isystemsautomation/homemaster-dev/tree/main/AIO-422-R1) |
| DIO-430-R1 / DIM-420-R1 / RGB-621-R1 / STR-3221-R1 / WLD-521-R1 | Additional digital, RGB, stair-light, and leak-detection modules | See repository root |

Any standard Modbus RTU slave device can also be connected. Refer to each module's own `README.md` for register maps and the recommended YAML package import.

## Electrical and Safety Notes

> ⚠️ **Safety — read before installation:**
> - **L / N terminals carry hazardous mains voltage.** Installation by qualified personnel only.
> - **Use only ONE power input at a time** (24 V DC at V+/0V, OR AC/DC at L/N). Never connect multiple power inputs simultaneously.
> - **Disconnect all power before wiring changes.**
> - Relay outputs are **not internally fused** — always add an external fuse or circuit breaker per channel (max 3 A).
> - Loads above 3 A or inductive/high-inrush loads MUST be switched using an external contactor; the MiniPLC relay acts as a control signal.
> - Install inside a closed control cabinet only. Protect all terminals from accidental contact.
> - **24 V DC input** is SELV (Safety Extra-Low Voltage).
> - Follow local electrical code.

## Mechanical and Environmental

- Operating temperature: `0 °C` to `+40 °C`
- Storage temperature: `-10 °C` to `+55 °C`
- Relative humidity: `0–90 % RH`, non-condensing
- Protection rating: `IP20` (inside cabinet)
- Dimensions: `157.4 × 91 × 58.4 mm` (L × W × H)
- DIN width: `9 DIN modules` (≈ 160 mm)
- Mounting: `35 mm DIN rail`
- Net weight: `300 g` · Gross weight: `450 g`
- Pack size: `230 × 140 × 87 mm` (L × W × H)

> ℹ️ The 0–40 °C range assumes installation inside a heated indoor control cabinet. Do not deploy in unheated garages, outbuildings, or outdoor enclosures.

![Mechanical Drawing](./Images/dimension.png)

*Mechanical drawing: front view + side view + DIN-clip depth (all dimensions in mm).*

## Installation

### DIN Rail Mounting

- Mount on 35 mm DIN rail. The device occupies 9 DIN modules (≈ 160 mm width).
- Install only inside a ventilated control cabinet.
- The cabinet must include a protective front plate covering all terminals and a closing protective door.
- Not suitable for outdoor or exposed installation.

### Terminal Wiring

- Terminal type: pluggable screw terminal blocks, 5.08 mm pitch.
- Wire cross-section: 0.2–2.5 mm² (AWG 24–12), solid or stranded copper.
- Use ferrules for stranded wire. Tightening torque: 0.4 Nm maximum.
- All wiring terminals must be protected against accidental contact by an insulating front plate, wiring duct, or terminal cover. **Exposed live terminals are not permitted.**

## Cable Recommendations & Shield Grounding

This section applies to **Analog (0–10 V)**, **Temperature (RTD / 1-Wire)**, and **RS-485** wiring. Use shielded, twisted constructions and bond shields correctly to reduce EMI and ground-loop issues.

### General Routing Rules

- Route low-level signal cables (Analog / RTD / 1-Wire / RS-485) separately from mains, relay outputs, contactors, VFD motor cables, and power wiring.
- If crossing power cables is unavoidable, cross at **90°**.
- Keep cable runs as short as practical and avoid parallel runs with high-current conductors.

### Analog (0–10 V) Cable

- Construction: twisted pair (Signal + GND) per channel.
- Shielding: overall shield (standard) or individually shielded pairs (high-EMI).
- Examples: `J-Y(ST)Y` (overall shield) or `LI2YCY PiMF` (shielded twisted pairs).

### RTD (PT100 / PT1000) Cable

- Recommended: shielded multi-core for 2/3-wire; shielded pairs for best accuracy (4-wire).
- Examples: `J-Y(ST)Y` (overall shield) or `LI2YCY PiMF 2×2×0.50` for 4-wire.

### 1-Wire (DS18B20) Cable

- Recommended: shielded 3-core (+5 V / DATA / GND) for typical installations.
- High-EMI / long runs: shielded pairs + overall shield (e.g. `LI2YCY PiMF 2×2×0.50`).
- Topology: **daisy-chain (bus) only** — star wiring is not supported.
- Keep sensor stubs ≤ **0.5 m**.
- Maximum total bus length: **100 m** (DS18B20 with external power).
- Maximum recommended sensors per bus: **10**.

### RS-485 Cable

- Construction: twisted pair for A/B.
- Characteristic impedance: **120 Ω** recommended.
- Shielding: overall shield in cabinets; individually shielded pairs + overall shield in high-EMI.
- Examples: `J-Y(ST)Y 2×2×0.5 mm²` or `LI2YCY PiMF 2×2×0.50`.
- Use one twisted pair for A/B and the second pair for COM (0 V reference) or spare.

### Shield Grounding

- Default: bond cable shields to cabinet **PE/EMC ground at the PLC end only** (single-end bonding).
- Do not connect shields to signal terminals (AI / AO / RTD / 1-Wire / RS-485 A/B/COM).
- If both ends are in equipotential-bonded cabinets, both-end bonding is permitted using proper 360° clamps.

## Wiring

### Power Input

> ⚠️ **Critical:** Exactly **ONE** power input may be used at a time. V+/0V and L/N must never be connected simultaneously.

| Input | Terminals | Range |
|---|---|---|
| 24 V DC | V+ / 0V | 24 V DC nominal |
| AC Mains | L / N | 85–265 V AC, 47–63 Hz |

| 24 V DC Input | 230 V AC Input |
|:---:|:---:|
| ![24V DC wiring](./Images/wiring_ps_dc.png)<br>*Connect + to V+, − to 0V.* | ![230V AC wiring](./Images/wiring_ps_ac1.png)<br>*Connect Live to L, Neutral to N.* |

- Typical current at 24 V DC: **~150 mA** (≈ 3.6 W).
- Internal service fuse: **1.0 A** (soldered).
- Recommended upstream protection: external **T0.5 A** slow-blow fuse or **0.5 A** breaker on the input.
- AC/DC input passes through an isolated AC/DC power module that generates the internal 24 V rail.

### Digital Input Wiring

| Dry contact | Shared common |
|:---:|:---:|
| ![DI wiring 1](./Images/wiring_DI_2.png)<br>*Dry-contact wiring to DI inputs.* | ![DI wiring 2](./Images/wiring_DI_3.png)<br>*Shared common wiring approach.* |

### Relay Output Wiring

> ⚠️ **External protection required:** Every relay output MUST be protected by an external fuse or circuit breaker, rated max **3 A** per channel. If using a common protective device for multiple relays, the rating must still not exceed 3 A per channel (do NOT sum across relays).

> ⚠️ **Loads above 3 A or inductive / high-inrush loads** MUST be switched using an external contactor. The MiniPLC relay then drives the contactor coil, not the load directly.

![Relay wiring](./Images/wiring_relays1.png)

*Example wiring using NO and NC relay contacts. Each relay exposes COM / NO / NC.*

For inductive or DC loads, use appropriate suppression (RC snubbers, MOVs, or flyback diodes).

### Analog Input Wiring (0–10 V)

![AI wiring](./Images/wiring_ai1.png)

*Multiple 0–10 V sensors with shared 0 V/GND reference.*

- Reference: connect sensor 0 V to AI GND.
- Use a twisted pair (Signal + GND) for long runs.
- Keep AI wiring away from relay outputs, mains, and motor cables.

### Analog Output Wiring (0–10 V)

![AO wiring](./Images/wiring_ao1.png)

*0–10 V analog output to external device (VFD, valve actuator, controller).*

- Use a twisted pair (AO + AO GND) for long runs.
- Keep AO wiring away from power switching and motor cables.

### RTD Sensor Wiring (PT100 / PT1000)

| 2-wire | 3-wire | 4-wire |
|:---:|:---:|:---:|
| ![RTD 2-wire](./Images/wiring_rtd1.png) | ![RTD 3-wire](./Images/wiring_rtd2.png) | ![RTD 4-wire](./Images/wiring_rtd4.png) |

The sensor type (PT100 vs PT1000) and wiring mode (2/3/4-wire) are selected by on-board DIP switches — see [RTD DIP Switch Configuration](#rtd-dip-switch-configuration) below.

### 1-Wire Sensor Wiring

![1-Wire wiring](./Images/wiring_1wire2.png)

*Daisy-chain DS18B20 sensors with +5 V / DATA / GND. Stubs ≤ 0.5 m.*

> ⚠️ **One sensor per bus by default.** The shipped configuration does not pin sensor addresses. With multiple sensors on the same 1-Wire bus, ESPHome reads the first sensor it discovers — assignment is non-deterministic across reboots. For multiple sensors per bus, set explicit `address:` values in YAML (visible in ESPHome logs at boot).

### RS-485 / Modbus RTU Wiring

| Two-wire bus | Termination |
|:---:|:---:|
| ![RS-485 wiring 1](./Images/wiring_rs485_1.png)<br>*Connect A, B, and COM to the bus.* | ![RS-485 wiring 2](./Images/wiring_rs485_2.png)<br>*120 Ω termination only at the two physical ends.* |

- Terminate with **120 Ω** only at the two ends of the line.
- Connect **COM** between all RS-485 nodes — this limits common-mode voltage.
- Fail-safe biasing is already provided inside the MiniPLC; do not add external bias resistors.
- Use the same power supply for MiniPLC and extension modules where possible (or tie 0 V references together at one point).

## Pinout

![Pinout](./pinout.png)

## Terminal Reference

### Top terminals (Signal)

| Terminal | Signal | Description |
|---|---|---|
| DI1–DI4 | Digital Inputs | Isolated 24 V DC inputs (4 channels) |
| AI1–AI4 | Analog Inputs | 0–10 V analog inputs (4 channels, 16-bit) |
| AO | Analog Output | 0–10 V analog output (1 channel, 12-bit) |
| RTD1, RTD2 | RTD Inputs | PT100 / PT1000 (4 terminals each: FORCE+, RTDIN+, RTDIN−, FORCE−) |
| D1, D2 | 1-Wire DATA | DS18B20-compatible (GPIO5 and GPIO4) |
| +5V | +5 V output | Auxiliary supply for 1-Wire sensors |
| Gnd | Signal ground | Common ground reference for signal terminals |
| A, B, COM | RS-485 / Modbus | Half-duplex RS-485 bus with isolated transceiver |

### Bottom terminals (Power & Relay)

| Terminal | Signal | Description |
|---|---|---|
| 0V / V+ | DC input | 24 V DC negative / positive |
| L / N | AC mains input | 85–265 V AC, 47–63 Hz |
| R1–R6 (COM, NO, NC) | Relay outputs | 6 × SPDT mechanical relays |

## LED and Button Behaviour

### LEDs

The device has 12 LEDs total on the front panel: **PWR**, **U.1**, **U.2**, **U.3** (status), **RX**, **TX**, **DI×4**, and **R×6**.

| LED | Behaviour | Meaning |
|---|---|---|
| PWR | Solid ON | Device is powered |
| RX / TX | Activity | RS-485 / Modbus traffic |
| DI 1–4 | Solid ON when input is active | Digital input state mirror |
| R 1–6 | Solid ON when relay energised | Relay output state mirror |
| U.1, U.2 | Firmware-controlled | User-assignable via ESPHome YAML |
| U.3 (Status) | Solid ON | Normal operation (Wi-Fi + API connected) |
| U.3 (Status) | Fast blink | Wi-Fi connecting or API disconnected |
| U.3 (Status) | Blink pattern | OTA update in progress |

### Buttons (GPIO via PCF8574A)

The 4 front-panel buttons are exposed as binary sensors in ESPHome (`button_1` through `button_4`). Default behaviour: read-only input — pressing each triggers the matching binary sensor.

You can add automations in ESPHome or Home Assistant to assign actions (e.g., toggle a relay, restart device, trigger a scene).

## GPIO Map

All hardware-assigned GPIOs are listed below. Do not reassign reserved GPIOs in custom ESPHome YAML.

| GPIO | Function | User-configurable |
|---|---|---|
| GPIO36 | Digital Input #1 (24 V DC, isolated) | No — reserved |
| GPIO39 | Digital Input #2 (24 V DC, isolated) | No — reserved |
| GPIO34 | Digital Input #3 (24 V DC, isolated) | No — reserved |
| GPIO35 | Digital Input #4 (24 V DC, isolated) | No — reserved |
| GPIO32 | I²C SDA — OLED, RTC, ADC, DAC, PCF8574 | No — reserved |
| GPIO33 | I²C SCL — OLED, RTC, ADC, DAC, PCF8574 | No — reserved |
| GPIO17 | RS-485 UART TX | No — reserved |
| GPIO16 | RS-485 UART RX | No — reserved |
| GPIO5 | 1-Wire Bus 1 (D1 terminal) — strapping pin, must be HIGH at boot | No — reserved |
| GPIO4 | 1-Wire Bus 2 (D2 terminal) | No — reserved |
| GPIO2 | Buzzer (PWM via LEDC) — strapping pin | No — reserved |
| GPIO12 | SPI MISO — microSD + MAX31865 RTD | No — reserved |
| GPIO13 | SPI MOSI — microSD + MAX31865 RTD | No — reserved |
| GPIO14 | SPI SCLK — microSD + MAX31865 RTD | No — reserved |
| GPIO15 | SPI CS — microSD | No — reserved |
| GPIO1 | SPI CS — MAX31865 RTD #1 | No — reserved |
| GPIO3 | SPI CS — MAX31865 RTD #2 | No — reserved |
| GPIO23 | RMII MDC (Ethernet) | No — reserved (Ethernet) |
| GPIO18 | RMII MDIO (Ethernet) | No — reserved (Ethernet) |
| GPIO19 | RMII TXD0 (Ethernet) | No — reserved (Ethernet) |
| GPIO22 | RMII TXD1 (Ethernet) | No — reserved (Ethernet) |
| GPIO21 | RMII TXEN (Ethernet) | No — reserved (Ethernet) |
| GPIO26 | RMII RXD0 (Ethernet) | No — reserved (Ethernet) |
| GPIO25 | RMII RXD1 (Ethernet) | No — reserved (Ethernet) |
| GPIO27 | RMII CRS_DV (Ethernet) | No — reserved (Ethernet) |
| GPIO0 | RMII 50 MHz REF (Ethernet) — strapping pin | No — reserved (Ethernet) |

### PCF8574 Mapping

**PCF8574A (I²C 0x38)** — buttons, user LEDs, and status LED

| Pin | Signal | Function |
|---|---|---|
| P0 | BTN1 | Button #1 |
| P1 | BTN2 | Button #2 |
| P2 | BTN3 | Button #3 |
| P3 | BTN4 | Button #4 |
| P4 | LED1 | User LED #1 (Relay #6 control in default firmware) |
| P5 | LED2 | User LED #2 (Relay #5 control in default firmware) |
| P6 | LED3 | User LED #3 (Relay #4 control in default firmware) |
| P7 | LED_STATUS | Status LED U.3 |

**PCF8574B (I²C 0x39)** — relays #1–#3 and user LEDs

| Pin | Signal | Function |
|---|---|---|
| P0 | Relay #3 | SPDT relay output |
| P1 | Relay #2 | SPDT relay output |
| P2 | Relay #1 | SPDT relay output |
| P3 | LED #2 | User LED |
| P4 | LED #3 | User LED |

> ℹ️ Relays #4, #5, #6 share PCF8574A pins P6, P5, P4 with the user LEDs U.3 / U.2 / U.1 silkscreen labels — they are the same physical signal lines driving both the relay coil and the front-panel relay-status LED.

## RTD DIP Switch Configuration

The MiniPLC includes **two MAX31865 RTD interface ICs** for direct connection of **PT100 and PT1000 sensors** in **2-, 3-, or 4-wire** configurations.

Each RTD channel has an on-board **8-position DIP switch block** (SW1 = RTD1, SW2 = RTD2) that configures the complete RTD bias, sense, and compensation network. **Every switch position is functional** — there is no unused or "default OFF" position. The entire 8-switch pattern must match the selected sensor type and wiring mode.

![RTD DIP Switch](./Images/jumpers.png)

*RTD DIP switch blocks (RTD1 and RTD2) on the MiniPLC PCB with silkscreened configuration table.*

### Factory configuration (as shipped)

#### RTD1 → PT100, 2-wire

| Switch | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| State | **ON** | **ON** | **OFF** | **OFF** | **ON** | **ON** | **OFF** | **ON** |

#### RTD2 → PT1000, 2-wire

| Switch | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| State | **ON** | **OFF** | **ON** | **OFF** | **ON** | **OFF** | **ON** | **ON** |

### DIP switch logic (per channel)

| Switch | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **PT100** | – | ON | OFF | – | – | ON | OFF | – |
| **PT1000** | – | OFF | ON | – | – | OFF | ON | – |
| **2-wire** | ON | – | – | OFF | ON | – | – | ON |
| **3-wire** | OFF | – | – | ON | OFF | – | – | ON |
| **4-wire** | OFF | – | – | OFF | ON | – | – | OFF |

Switches **1 and 4–5 and 8** select wiring mode. Switches **2–3 and 6–7** select sensor type. The full pattern must be set consistently.

### Terminal mapping (per RTD block)

| Terminal | Signal |
|---|---|
| 1 | FORCE+ |
| 2 | RTDIN+ |
| 3 | RTDIN− |
| 4 | FORCE− |

### How to change sensor type or wiring

1. Power OFF the MiniPLC.
2. Set all 8 DIP positions per the logic table above.
3. Update ESPHome YAML: change `rtd_nominal_resistance` (100 or 1000) and `wires` (2, 3, or 4).
4. Power ON and verify temperature readings.

**Fixed by hardware:** MAX31865 IC, SPI pins, CS pins, reference resistor network, terminal order.

**Configurable in YAML:** sensor type (`rtd_nominal_resistance: 100` or `1000`), wiring mode (`wires: 2/3/4`), update interval, filters, alarm thresholds.

## Enabling RTD Sensors in YAML

RTD inputs are **disabled in the factory firmware** because the MAX31865 chip-select lines are wired to **GPIO1** and **GPIO3**, which are the ESP32 UART0 TX/RX pins used by the USB serial logger and Improv Serial provisioning.

> ⚠️ **Trade-off:** Enabling RTD sensors disables the USB serial logger and Improv Serial. After this change, the device can be flashed only via OTA (Wi-Fi or Ethernet).

To enable RTD sensors, after taking control of the device:

1. Disable the serial logger:

```yaml
   logger:
     baud_rate: 0
```

2. Remove the `improv_serial:` block.

3. Add the SPI bus and the MAX31865 sensors:

```yaml
   spi:
     miso_pin: GPIO12
     mosi_pin: GPIO13
     clk_pin: GPIO14

   sensor:
     - platform: max31865
       id: rtd_1
       name: "RTD Temperature 1"
       cs_pin: GPIO1
       reference_resistance: 400 Ω
       rtd_nominal_resistance: 100 Ω
       wires: 2
       update_interval: 60s
     - platform: max31865
       id: rtd_2
       name: "RTD Temperature 2"
       cs_pin: GPIO3
       reference_resistance: 4000 Ω
       rtd_nominal_resistance: 1000 Ω
       wires: 2
       update_interval: 60s
```

4. Adjust `rtd_nominal_resistance` (`100` for PT100, `1000` for PT1000) and `wires` (`2`, `3`, or `4`) to match the DIP-switch settings — see [RTD DIP Switch Configuration](#rtd-dip-switch-configuration).

## Enabling 1-Wire Sensors in YAML

The two 1-Wire buses (GPIO5 and GPIO4) are pre-declared in the factory firmware, but no DS18B20 sensors are read until they are added to the YAML.

```yaml
sensor:
  - platform: dallas_temp
    id: ow_bus_1_temp
    one_wire_id: ow_bus_1
    name: "1-Wire Bus 1 Temperature"
    update_interval: 60s
  - platform: dallas_temp
    id: ow_bus_2_temp
    one_wire_id: ow_bus_2
    name: "1-Wire Bus 2 Temperature"
    update_interval: 60s
```

If you wire more than one sensor to the same bus, set an explicit `address:` for each entry — discovered addresses are printed in the ESPHome boot logs.

## Real-Time Clock (RTC) Battery

The MiniPLC includes a **PCF8563** real-time clock chip on the I²C bus (address `0x51`), with an on-board **coin-cell battery holder** for keeping time during power loss.

> ℹ️ **Battery is NOT installed by default.** The unit ships without a coin cell in the holder. The RTC and timekeeping work normally while the device is powered; install a battery only if you need the clock to keep running after a power outage.

To enable battery backup:

1. Power OFF the MiniPLC and disconnect all inputs.
2. Open the enclosure (refer to the hardware schematics for the battery-holder location on the MCU Board).
3. Insert a fresh coin cell into the holder, observing the polarity marked on the PCB.
4. Re-assemble and power on.

The PCF8563 draws negligible current from the battery in standby — a typical CR-series coin cell will last for years.

In normal operation the MiniPLC synchronises time from Home Assistant on every Wi-Fi connect (see `time: platform: homeassistant` in the default firmware), so timekeeping works fully without a battery as long as the network is reachable. The battery only matters if you want correct timestamps on the OLED display and in local time-based automations during a power outage.

## Network Requirements

- Device and Home Assistant must be on the **same subnet**.
- **mDNS** must be functional on the network for auto-discovery. In VLAN setups, configure an mDNS repeater or use a static IP assigned via ESPHome YAML.
- ESPHome API uses **TCP port 6053**. Ensure this port is not blocked by firewall rules between the device and Home Assistant.
- Vendor-managed OTA updates require outbound **HTTPS (port 443)** access to GitHub Pages from the device.

## First Boot & Wi-Fi Setup

The MiniPLC is configured exclusively through **Improv Wi-Fi provisioning** — there is no captive-portal fallback Access Point.

### Improv Wi-Fi Setup

You can provision Wi-Fi via either **Bluetooth (BLE)** or **USB-C (Serial)** — pick whichever is convenient.

1. Power on the device.
2. Open <https://improv-wifi.com> in Chrome or Edge (desktop or mobile).
3. Click **Connect device** and choose:
   - **Bluetooth LE** — pair with the device wirelessly (recommended for devices already mounted in a cabinet).
   - **USB Serial** — connect a USB-C cable from the MiniPLC to your computer.
4. Enter your Wi-Fi SSID and password, press **Connect**.
5. Wait a few seconds — the device joins your Wi-Fi.

ℹ️ BLE Improv provisioning is open (`authorizer: none`) until the device successfully connects to Wi-Fi for the first time. Provision in a private location and avoid leaving an un-provisioned device powered on within BLE range of untrusted devices.

After successful Wi-Fi connection, the device appears automatically in:

- **ESPHome Dashboard** — for configuration and logs.
- **Home Assistant** — under Settings → Devices & Services → ESPHome.

Click **Take Control** in ESPHome Dashboard to import the full shipped configuration.

## Optional Ethernet (LAN8720)

The MiniPLC has an on-board LAN8720 PHY (RMII, fixed pins) but Ethernet is **not enabled in the factory firmware** — Wi-Fi is used by default.

ESPHome does not allow `wifi:` and `ethernet:` to be enabled at the same time, so switching to Ethernet means **replacing** the Wi-Fi setup, not adding to it.

To enable Ethernet, after taking control of the device:

1. Add the `ethernet:` block:

```yaml
   ethernet:
     type: LAN8720
     id: eth_phy
     mdc_pin: GPIO23
     mdio_pin: GPIO18
     clk_mode: GPIO0_OUT
     phy_addr: 1
```

2. Remove (or comment out) all Wi-Fi-related blocks:
   - `wifi:`
   - `captive_portal:`
   - `improv_serial:`
   - `esp32_improv:`
   - `wifi_signal` sensor under `sensor:`
   - `wifi_info` text sensor under `text_sensor:`

The `api:`, `web_server:`, `ota:`, `update:`, `dashboard_import:` and all other non-Wi-Fi components continue to work over Ethernet without changes.

> ⚠️ After switching to Ethernet you lose Wi-Fi provisioning via Improv. To go back, restore the Wi-Fi blocks and remove the `ethernet:` block.

## Home Assistant Integration

After Wi-Fi provisioning, the device appears automatically in:

- **ESPHome Dashboard** — for configuration and logs.
- **Home Assistant** — under Settings → Devices & Services → ESPHome.

Click **Take Control** in ESPHome Dashboard to import the full configuration and manage firmware yourself.

### ⚠️ Note on Taking Control

After taking control, vendor-managed OTA updates stop working unless you keep the `http_request`, `ota: platform: http_request`, and `update` blocks from the original configuration in your YAML.

If you remove these blocks, update via ESPHome OTA or USB instead.

⚠️ `import_full_config: true` in the `dashboard_import:` block will overwrite any local edits to your YAML on every dashboard import. After your first successful import, set it to `false` (or remove the `dashboard_import:` block entirely) if you want to keep custom changes.

### ESPHome Compatibility

- Minimum ESPHome version used and tested: **2025.7.0**

## Firmware Updates

The device supports two firmware update methods:

### ESPHome Updates (User-controlled)

After taking control in ESPHome Dashboard, firmware can be updated manually:

- Build new firmware from ESPHome.
- Upload via OTA or USB.
- Full control over configuration.

### Managed Updates (HTTP)

The device also supports vendor-provided firmware updates. A `Firmware Update` entity is exposed in Home Assistant, allowing the device to check for new firmware versions and install updates directly.

This mechanism uses the `update.http_request` component with a hosted firmware manifest, downloading updates over HTTPS directly to the device.

The device polls the firmware manifest every 6 hours (`update_interval: 6h`). To disable vendor-managed OTA, remove the `update:`, `http_request:`, and `ota: platform: http_request` blocks from your YAML. Updates will then only be possible via ESPHome OTA or USB.

> ℹ️ **OTA security:** OTA updates are downloaded over HTTPS from GitHub Pages. Trust depends on the security of the HomeMaster GitHub account; firmware files are not separately signed. If you need a stricter trust model, take control in ESPHome Dashboard and manage updates yourself.

> ⚠️ **OTA safety:** Do not interrupt a firmware update once started. If an OTA update is interrupted mid-flash, the device may fail to boot. If this occurs, reflash via USB-C using ESPHome or the ESP flashing tool. ESPHome safe mode is active for the first 10 boot attempts after a failed OTA — connect via USB and reflash to recover.

## Device Behaviour Reference

| Condition | Relays | DIs / AIs / RTD / 1-Wire | Modbus / RS-485 |
|---|---|---|---|
| Normal operation | Controlled by HA | Reported to HA | Master polls slaves |
| Wi-Fi lost | Hold last state | Continue local reading | Continue polling |
| HA disconnected | Hold last state | Continue local reading | Continue polling |
| ESP reboot | Restore OFF (relays open) | — | Restarts polling |
| Modbus slave offline | Unaffected | Unaffected | Logs timeout |

> ⚠️ After reboot all relays restore to OFF (open). Verify this is safe for your installation before deploying.

## Troubleshooting

| Symptom | Checks | Action |
|---|---|---|
| Device not in HA or ESPHome Dashboard | PWR LED solid ON? Status LED fast-blinking? Same subnet as HA? | Wait 60 s for Wi-Fi. If status LED blinks, device is connecting. If it does not connect, re-run Improv via BLE or USB. |
| Digital input not responding | DI LED on front panel ON when input active? Wiring correct (24 V DC sourcing)? | Check the source side supplies 24 V DC and is connected to the correct DI terminal and GND. Verify the input is not inverted in YAML. |
| Relay does not switch | `RELAY #n` switch entity present in HA? | Toggle from HA. Check external fuse / breaker on the load circuit. Note: load needs its own power supply — relays are dry contact. |
| Analog input reads 0 V | Sensor 0 V tied to AI GND? Sensor powered? | Tie sensor reference to AI GND. Check that sensor output is actually in 0–10 V range (some sensors output 4–20 mA — those need a separate 250 Ω resistor or a 4–20 mA-capable module). |
| RTD reads `NaN` or constant -242 °C | DIP switches set correctly for sensor type and wiring mode? YAML `rtd_nominal_resistance` and `wires` match? | Cross-check the DIP-switch table above against the sensor wiring. PT100 vs PT1000 mismatch is the most common cause. |
| 1-Wire sensor shows unknown / no value | Sensor wired correctly (+5 V / DATA / Gnd)? Stubs ≤ 0.5 m? Daisy-chain topology? | If multiple sensors on one bus, assign explicit addresses in YAML. |
| OLED display blank | I²C bus working? | Look at ESPHome logs for I²C scan output at boot. Verify 0x3C appears. |
| Modbus slave not responding | Address correct on slave WebConfig? Same baud / parity? A/B not swapped? | Check ESPHome logs for `[modbus]` timeouts. Confirm A→A and B→B (not crossed). Confirm COM is tied between all nodes. |
| Firmware update fails | Device has internet access? | Check manifest URL reachable: `https://isystemsautomation.github.io/homemaster-dev/MiniPLC/Firmware/manifest.json`. If `http_request` / `update` blocks removed from YAML, use ESPHome OTA instead. |
| Wi-Fi credentials changed, device unreachable | — | Re-provision Wi-Fi via USB-C Serial Improv at <https://improv-wifi.com>. The serial path always works regardless of Wi-Fi state. |
| Device completely unreachable | Boot loop? OTA interrupted? | Reflash via USB. Driver: CP2102N (Silicon Labs, auto on macOS/Linux). Use <https://web.esphome.io> (Chrome/Edge) or ESPHome Dashboard → Install → Plug into computer. |

## Entity Reference

<details>
<summary>Click to expand full entity reference table</summary>

| Entity | Type | Default | Description |
|---|---|---|---|
| ESP Status | Binary Sensor | Enabled | Wi-Fi / API connection status |
| DI #1 – DI #4 | Binary Sensor | Enabled | 24 V DC digital inputs (GPIO36/39/34/35) |
| Button #1 – Button #4 | Binary Sensor | Enabled | Front-panel buttons (PCF8574A pins 0–3) |
| RELAY #1 – RELAY #6 | Switch | Enabled | SPDT relay outputs (PCF8574 pins) |
| LED #2, LED #3 | Switch | Enabled | User LEDs |
| Buzzer | Switch | Enabled | Front-panel piezo buzzer (PWM, GPIO2) |
| AI 1 – AI 4 | Sensor | Enabled | 0–10 V analog inputs (ADS1115 channels A3 / A2 / A1 / A0) |
| DAC 0-10V | Fan / Output | Enabled | 0–10 V analog output (MCP4725) |
| 1-Wire Bus 1 Temperature | Sensor | Disabled by default | DS18B20 on GPIO5 — uncomment in YAML, set explicit address |
| 1-Wire Bus 2 Temperature | Sensor | Disabled by default | DS18B20 on GPIO4 — uncomment in YAML, set explicit address |
| RTD Temperature 1 | Sensor | Disabled by default | MAX31865 PT100/PT1000 — enable in YAML, set DIP switches |
| RTD Temperature 2 | Sensor | Disabled by default | MAX31865 PT100/PT1000 — enable in YAML, set DIP switches |
| Uptime | Sensor | Enabled (diagnostic) | Device uptime in seconds |
| WiFi Signal | Sensor | Enabled (diagnostic) | RSSI in dBm |
| ESP32 Temperature | Sensor | Enabled (diagnostic) | Internal chip temperature |
| Current Time | Text Sensor | Enabled (diagnostic) | Formatted RTC time |
| ESPHome Version | Text Sensor | Enabled (diagnostic) | Running ESPHome version |
| IP Address | Text Sensor | Enabled (diagnostic) | Device IP address |
| Firmware Update | Update | Enabled | Vendor OTA update entity (HTTP) |

</details>

## Default Firmware Configuration

The full shipped configuration is available in the repository:
[miniplc.yaml](https://github.com/isystemsautomation/homemaster-dev/blob/main/MiniPLC/Firmware/miniplc.yaml)

The file includes:

- ESP32 board / framework
- Wi-Fi with fallback AP and Improv (BLE + Serial)
- ESPHome API + vendor HTTP OTA (`update.http_request`) + ESPHome OTA
- `dashboard_import` for one-click Take Control
- `web_server` on port 80 for local diagnostics
- I²C bus with all on-board peripherals (PCF8574 ×2, ADS1115, MCP4725, PCF8563, SH1106)
- RS-485 UART (GPIO17 / GPIO16, 19200 baud) ready for Modbus
- All digital inputs, buttons, relays, user LEDs, status LED, buzzer, analog inputs, analog output (DAC) with explicit `id` on every entity (Made for ESPHome compliant)

Optional features (1-Wire DS18B20 sensors, MAX31865 RTD sensors, microSD, Ethernet) are present in commented-out blocks — uncomment and adjust to enable. See also [Enabling RTD Sensors in YAML](#enabling-rtd-sensors-in-yaml), [Enabling 1-Wire Sensors in YAML](#enabling-1-wire-sensors-in-yaml), and [Optional Ethernet (LAN8720)](#optional-ethernet-lan8720).

## Support & Community

| Channel | Link |
|---|---|
| 🛠️ Official Support | [home-master.eu/support](https://www.home-master.eu/support) |
| 📺 YouTube | [youtube.com/@HomeMaster](https://youtube.com/@HomeMaster) |
| 🛡️ Reddit | [reddit.com/r/HomeMaster](https://reddit.com/r/HomeMaster) |
| 📷 Instagram | [instagram.com/home_master.eu](https://instagram.com/home_master.eu) |
| 🔬 Hackster | [hackster.io/homemaster](https://hackster.io/homemaster) |
| 🐙 GitHub | [isystemsautomation/homemaster-dev](https://github.com/isystemsautomation/homemaster-dev) |

## Compliance & Certifications

The MiniPLC module is CE marked. **ISYSTEMS AUTOMATION S.R.L.** (HomeMaster® brand) maintains the technical documentation and a signed EU Declaration of Conformity (DoC).

### Applicable EU directives

- **EMC Directive 2014/30/EU** — EN 55032:2015 + AC:2016-07 + A11:2020 + A1:2020 (Class B emissions), EN 55035:2017 + A11:2020 (immunity); tested by Idvorsky Laboratories Ltd., Belgrade, Serbia.
- **Low Voltage Directive 2014/35/EU** — EN 62368-1:2020 + A11:2020; in-house dielectric and isolation test by ISYSTEMS AUTOMATION S.R.L. internal compliance laboratory.
- **RED Directive 2014/53/EU** — radio module pre-certification (ESP32 module) plus product-level EMC and EN 300 328 verification.
- **RoHS Directive 2011/65/EU** — EN IEC 63000 technical documentation.

### Compliance documents

| Document | File |
|---|---|
| EU Declaration of Conformity (DoC) | [DoC-MiniPLC-V1.0.pdf](./Manuals/DoC-MiniPLC-V1.0.pdf) |
| Datasheet | [MiniPLC_Datasheet.pdf](./Manuals/MiniPLC_Datasheet.pdf) |
| User Manual | [User Manual.pdf](./Manuals/User%20Manual.pdf) |

### Trademark

**HomeMaster®** is a registered European Union trademark of ISYSTEMS AUTOMATION S.R.L., EUTM No. 019082911, registered with EUIPO on 15 January 2025.

## License

This project uses a hybrid licensing model.

### Hardware

Hardware designs (schematics, PCB layouts, BOMs) are licensed under **CERN-OHL-W v2**.

### Firmware & ESPHome Integration

All firmware, ESPHome configurations, and software components are licensed under the **MIT License**.

This ensures full compatibility with ESPHome and Home Assistant while protecting hardware designs. See LICENSE files in each directory for full terms.

## Changelog

### v1.0.1 — current

- Aligned README structure with the OpenTherm Gateway README.
- Removed captive-portal fallback AP from documentation — provisioning is now Improv-only (BLE + USB Serial).
- Added Real-Time Clock battery notes (coin cell not installed by default; install if you need offline timekeeping).
- Added detailed RTD DIP-switch configuration tables for PT100 / PT1000 and 2/3/4-wire modes.
- Added YAML configuration sections for optional RTD (MAX31865) and 1-Wire sensors, including the GPIO1/GPIO3 vs USB serial trade-off.
- Added YAML configuration section for optional wired Ethernet (LAN8720).
- Documented compatible HomeMaster expansion modules (DIO-430-R1, DIM-420-R1, ENM-223-R1, ALM-173-R1, AIO-422-R1).
- All ESPHome entities given explicit `id:` values (Made for ESPHome compliant).
- Updated I²C address map: PCF8574 expanders at 0x20 / 0x21 (was 0x38 / 0x39 in earlier prototypes).
- Added `web_server: port: 80` for built-in local web UI.
- `mcp4725` (DAC) explicit `address: 0x60`.
- HTTP OTA `update.firmware_update` entity sourcing manifest from GitHub Pages with verified MD5.

### v1.0.0

- Initial public firmware release for MiniPLC-R1 hardware V1.0.

---

**Manufacturer:** ISYSTEMS AUTOMATION S.R.L. (HomeMaster® brand)
**Registered office (sediul social):** Str. Domnișori, Nr. 81, Bl. 62, Scara A, Etaj 3, Ap. 12, 100284 Ploiești, Jud. Prahova, Romania
**Office / Contact address:** Diligentei 18, Ploiești, Romania
**CUI / VAT:** RO 21537032
**EUID:** ROONRC.J2007000919293
**Telephone:** +40 747 757 798
**Website:** [https://www.home-master.eu](https://www.home-master.eu)
