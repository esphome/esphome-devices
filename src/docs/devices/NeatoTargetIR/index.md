---
title: Neato Target IR
date-published: 2026-05-21
type: misc
standard: global
board: esp32
project-url: https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Targets/NeatoTargetIR
made-for-esphome: true
difficulty: 1
---

## Overview

The Neato Target IR is a self-contained WiFi-enabled infrared hit detector and prop controller.
Wire it up, configure it from any browser, and it runs your prop — relay, servo, LEDs, and
scoring — with no custom coding or external controller required.

Common applications include shooting galleries, haunted house props, escape room sequences,
museum interactive exhibits, themed restaurant interactions, and scavenger hunt activations.

Each target ships pre-flashed and tested. Settings persist in flash across power cycles.
Targets daisy-chain (up to 5 units per power supply) and support OTA updates individually
or in batch via Home Assistant.

**Key features:**

- 38 kHz IR receiver — ambient-light tolerant, up to 20 ft range; laser tag, NEC, and raw protocols
- WS2811/WS2812 RGB LEDs — 6 face LEDs onboard + independent strip output (up to 100 LEDs)
- SPDT relay — 2 A @ 120 VAC or 24 VDC (motors, solenoids, bells, air cannons, AC lighting)
- GND switch (NPN) — 3 A continuous, 12 V max, auto-reset at 4 A
- Servo output — PWM 50 Hz, 0–180°, 5 V @ 3 A auxiliary power
- 3 debounced digital inputs + 1 analog input (0–3.3 V) for buttons, PIR, pressure pads
- Browser-based configuration: point value, LED colors/animations, relay hold time, servo angles, IR sensitivity, static IP
- Home Assistant native (ESPHome API) — discovered automatically within 60 seconds of joining WiFi
- Standalone AP mode — no hub required; hotspot `NEATO-target-1` / `neato123`, web UI at `192.168.4.1`
- OTA firmware updates
- ¼" camera thread mount with CCTV swivel mount included

## Hardware

| Component | Specification |
|-----------|--------------|
| MCU | ESP32 Mini D1 (replaceable) |
| Input voltage | 5–24 V DC, reverse-polarity protected |
| WiFi | 802.11 b/g/n 2.4 GHz, static IP supported |
| IR receiver | 38 kHz, up to 20 ft range |
| Relay | SPDT, 2 A @ 120 VAC or 24 VDC |
| GND switch | NPN, 3 A continuous, 12 V max, auto-reset at 4 A |
| LED strips | WS2811/WS2812 — 6 face LEDs + up to 100 on strip output |
| Servo | PWM 50 Hz, 0–180°, 5 V @ 3 A aux |
| Digital inputs | 3 × debounced, 3.3 V logic |
| Analog input | 1 × 0–3.3 V |
| 5 V auxiliary | 2 × 5 V @ 3 A |
| Mounting | ¼" camera thread + CCTV swivel mount |
| Daisy-chain | Up to 5 units per power supply |

### Hardware revisions

- **Rev 1.x** — original design, single LED strip
- **Rev 3.x** — current production; dual LED strips, servo, auxiliary power rail, expanded GPIO

## GPIO Pinout (Rev 3.x)

| GPIO | Function |
|------|----------|
| GPIO5 | Face LED strip — WS2812 (6 onboard LEDs) |
| GPIO22 | External LED strip output — WS2811/WS2812 (up to 100 LEDs) |
| GPIO19 | IR receiver (38 kHz) |
| GPIO23 | Relay output (SPDT) |
| GPIO33 | GND switch (NPN low-side) |
| GPIO4 | Servo PWM output (50 Hz) |
| GPIO26 | Auxiliary power control |
| GPIO18 | External trigger input (TRIGGER net, H4 connector) |
| GPIO25 | GPIO25 hit trigger input (optional) |
| GPIO16 | Digital input / expansion |
| GPIO17 | Digital input / expansion |
| GPIO34 | Analog input (0–3.3 V, ADC) |

![ESP32 pinout schematic](./esp32-pinout.png)

## Quick Start

1. Power on — target broadcasts WiFi hotspot `NEATO-target-1` (password: `neato123`)
2. Connect phone or laptop to the hotspot — captive portal opens automatically
3. Select your venue WiFi network and enter credentials
4. Home Assistant discovers the device within 60 seconds
5. Open the web UI at the device IP to adjust point value, LED colors, relay timing, and more

For standalone operation (no hub), skip steps 3–4. Access the web UI at `192.168.4.1` while
connected to the hotspot.

## Configuration

```yaml url=https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Targets/NeatoTargetIR/main.yaml
```

### Firmware builds

| Build | IR protocol | Networking |
|-------|-------------|-----------|
| Standard (`main.yaml`, networked mode) | NEC + laser tag | Joins WiFi, Home Assistant API |
| Standalone (`configs/standalone.yaml`) | NEC + laser tag | AP hotspot only, no hub required |

### IR protocols (selectable)

| Protocol | File | Use case |
|----------|------|----------|
| Laser Tag | `protocols/ir_laser_tag.yaml` | Multi-player laser tag guns (recommended) |
| NEC | `protocols/ir_nec.yaml` | Standard TV remotes (testing) |
| Raw | `protocols/ir_raw.yaml` | Protocol analysis / development |

## Links

- [Product page](https://neatofx.com/products/neato-fx-target-ir)
- [Support & documentation](https://neatofx.com/pages/support-target)
- [GitHub repository](https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Targets/NeatoTargetIR)
- [Rev 3.x manual (PDF)](https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Targets/NeatoTargetIR/docs/Smart%20Target%20Rev3.x%20Manual.pdf)
- [Rev 1.x manual (PDF)](https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Targets/NeatoTargetIR/docs/Smart%20Target%20Rev1.x%20Manual.pdf)
