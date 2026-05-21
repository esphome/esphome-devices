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

The Neato Target IR is a WiFi-enabled infrared shooting gallery target designed for interactive
gaming attractions, laser tag arenas, escape rooms, and home automation entertainment. Built on
ESP32, each target detects IR hits from laser tag guns or standard IR remotes and responds with
WS2812 LED effects, relay-triggered props, and optional servo movement.

Targets coordinate with Home Assistant or operate standalone (AP mode) without any hub. Multiple
targets can be networked together for multi-player scoring, synchronized effects, and Falcon
Player (FPP) light show integration.

**Key features:**

- Multi-protocol IR receiver: laser tag, NEC, and raw-capture modes
- Dual WS2812 LED strips with configurable animations (rainbow, color wipe, scanner, twinkle)
- 2 A relay output for external props (solenoids, buzzers, mechanical resets)
- Servo output for physical target movement on hit
- Configurable hit duration, cooldown, and points via web UI
- Mobile-friendly web interface with one-tap test button
- OTA firmware updates
- Home Assistant event integration (`esphome.target-hit` with address, player, and points data)

## Hardware

| Component | Specification |
|-----------|--------------|
| MCU | ESP32 (Wemos D1 Mini32 form factor) |
| Flash | 4 MB |
| Input voltage | 7–14 V DC |
| WiFi | 802.11 b/g/n 2.4 GHz |
| LED strips | WS2812 (primary + secondary) |
| IR receiver | 38 kHz, 3.3 V |
| Relay | 2 A, N.O. output |
| Servo | PWM 50 Hz |

Two PCB revisions are available:

- **Rev 1.x** — original design, single LED strip
- **Rev 3.x** — dual LED strips, servo, auxiliary power rail, extra GPIO expansion

## GPIO Pinout (Rev 3.x)

| GPIO | Function |
|------|----------|
| GPIO5 | Primary WS2812 LED strip (data) |
| GPIO19 | IR receiver (signal) |
| GPIO23 | Relay output |
| GPIO4 | Servo PWM output |
| GPIO22 | Secondary WS2812 LED strip (data) |
| GPIO26 | Auxiliary power control |
| GPIO33 | 12 V GND switch |
| GPIO18 | External trigger input (TRIGGER net) |
| GPIO25 | GPIO25 hit trigger input (optional) |
| GPIO16 | General I/O expansion |
| GPIO17 | General I/O expansion |
| GPIO34 | ADC input (analog voltage sense) |

![ESP32 pinout schematic](./esp32-pinout.png)

## Configuration

The device is configured through a modular package system. Select your hardware revision,
operating mode, and IR protocol in `main.yaml`:

```yaml url=https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Targets/NeatoTargetIR/main.yaml
```

### Operating modes

- **Standalone** — creates its own WiFi AP; no hub required. Use `configs/standalone.yaml`.
- **Networked** — joins your WiFi and exposes the Home Assistant ESPHome API. Use
  `configs/networked.yaml`. Fires `esphome.target-hit` events with hit address, player, and
  points payload.

### IR protocols

| Protocol | File | Use case |
|----------|------|----------|
| Laser Tag | `protocols/ir_laser_tag.yaml` | Multi-player laser tag guns (recommended) |
| NEC | `protocols/ir_nec.yaml` | Standard TV remotes (testing) |
| Raw | `protocols/ir_raw.yaml` | Protocol analysis / development |

## Links

- [GitHub repository](https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Targets/NeatoTargetIR)
- [Rev 3.x manual (PDF)](https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Targets/NeatoTargetIR/docs/Smart%20Target%20Rev3.x%20Manual.pdf)
- [Rev 1.x manual (PDF)](https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Targets/NeatoTargetIR/docs/Smart%20Target%20Rev1.x%20Manual.pdf)
