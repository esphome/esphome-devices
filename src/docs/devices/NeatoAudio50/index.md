---
title: Neato Audio 50
date-published: 2026-05-21
type: misc
standard: global
board: esp32
project-url: https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Audio/NeatoAudio50
made-for-esphome: true
difficulty: 3
---

## Overview

The Neato Audio 50 is a WiFi-enabled MP3 audio controller designed for shooting galleries,
escape rooms, and interactive entertainment attractions. Built on ESP32, it plays sound effects
from a MicroSD card via a DFPlayer Mini module in response to hardwired trigger inputs, wireless
RF buttons, or Home Assistant automations.

**Key features:**

- DFPlayer Mini MP3 player — up to 255 sound files on MicroSD
- 2 hardwired trigger inputs (debounced, active-low)
- 4 RF wireless button inputs (A/B/C/D) via on-board receiver
- Per-input configurable: specific file or random from SD card
- Background ambient loop with auto-return after triggered playback
- 30-level software volume control (saved across reboots)
- 2 relay outputs + 2 FET (PWM spotlight) outputs assignable per input
- Amplifier wake/mute management (GPIO-controlled)
- Playback timeout watchdog (5–300 s, resets stuck DFPlayer)
- OTA firmware updates
- Home Assistant integration in networked mode

## Hardware

| Component | Specification |
|-----------|--------------|
| MCU | ESP32 (Wemos D1 Mini32 form factor) |
| Flash | 4 MB |
| Input voltage | 7–12 V DC |
| WiFi | 802.11 b/g/n 2.4 GHz |
| Audio | DFPlayer Mini (UART, MicroSD) |
| Relay outputs | 2 × relay (N.O.) |
| FET outputs | 2 × LEDC PWM (spotlight dimming) |
| RF inputs | 4 × digital (A/B/C/D) |
| Trigger inputs | 2 × hardwired (active-low) |

Two PCB revisions are supported:

- **Rev 2.3** — original design
- **Rev 2.4** — current production, RF transmitter option on RFTX connector

The RFTX connector can be configured as either 4 RF trigger inputs (`boards/rftx_inputs.yaml`)
or as trigger outputs (`boards/rftx_outputs.yaml`).

## GPIO Pinout

| GPIO | Function |
|------|----------|
| GPIO17 | DFPlayer Mini TX (UART RX on DFPlayer) |
| GPIO16 | DFPlayer Mini RX (UART TX on DFPlayer) |
| GPIO26 | Relay 1 output |
| GPIO27 | Relay 2 output |
| GPIO33 | FET 1 — SpotLight 1 (LEDC PWM) |
| GPIO25 | FET 2 — SpotLight 2 (LEDC PWM) |
| GPIO0 | Amplifier wake (active-high) |
| GPIO5 | Amplifier unmute (active-low) |
| GPIO22 | Heartbeat LED output |
| GPIO23 | Status LED (COM LED, active-low) |
| GPIO4 | RF TX power enable |
| GPIO34 | Input 1 (hardwired trigger, active-low) |
| GPIO39 | Input 2 (hardwired trigger, active-low) |
| GPIO32 | Push button (INPUT_PULLUP) |
| GPIO36 | RF remote button A |
| GPIO2 | RF remote button B |
| GPIO15 | RF remote button C |
| GPIO35 | RF remote button D |

## Configuration

```yaml url=https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Audio/NeatoAudio50/main.yaml
```

### Variants

| File | Board | RFTX mode |
|------|-------|-----------|
| `main.yaml` | Rev 2.4 | Transmitter outputs (default) |
| `main_rftx.yaml` | Rev 2.4 | 4 trigger inputs |
| `main_rev2_3.yaml` | Rev 2.3 | Transmitter outputs |
| `main_rev2_3_rftx.yaml` | Rev 2.3 | 4 trigger inputs |

### Operating modes

- **Standalone** — creates its own WiFi AP for direct web control. Use `configs/standalone.yaml`.
- **Networked** — joins home WiFi and exposes the Home Assistant ESPHome API. Use
  `configs/networked.yaml`.

## Links

- [GitHub repository](https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Audio/NeatoAudio50)
