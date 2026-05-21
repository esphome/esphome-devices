---
title: Neato Motor
date-published: 2026-05-21
type: misc
standard: global
board: esp32
project-url: https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Controllers/NeatoMotor
made-for-esphome: true
difficulty: 2
---

## Overview

The Neato Motor is a WiFi-enabled bidirectional DC motor controller for animated props,
linear actuators, escape room mechanisms, and entertainment attractions. Built on ESP32 with
dual BTN8962TA H-bridge modules, it provides variable-speed control in both directions with
hardware limit switches, real-time current sensing, and automatic stall protection.

**Key features:**

- Dual BTN8962TA H-bridge — up to 8 A per direction, 12 V or 24 V supply
- PWM speed control (0–100%) independently on each H-bridge channel
- Open and closed limit switches with configurable behavior
- Two momentary toggle inputs for local physical control
- Automatic stall detection via current sense ADC (default threshold: 8 A)
- Travel modes: 1-Direction (stop at end) or Bi-direction (auto-reverse)
- Configurable open-position hold dwell time before auto-close
- Timed runs or run-until-limit operation selectable via web UI
- OTA firmware updates
- Home Assistant cover entity integration in networked mode
- Winch variant available (`main_winch.yaml` / `boards/rev3_winch.yaml`)

## Hardware

| Component | Specification |
|-----------|--------------|
| MCU | ESP32 (Wemos D1 Mini32) |
| Flash | 4 MB |
| Motor driver | 2 × BTN8962TA half-bridge (H-bridge pair) |
| Max motor current | 8 A (stall cutoff) |
| Supply voltage | 7–14 V DC (12 V typical) or 24 V variant |
| WiFi | 802.11 b/g/n 2.4 GHz |
| Limit switches | 2 × N.C. (INPUT_PULLUP) |
| Toggle inputs | 2 × momentary (INPUT_PULLUP) |
| Current sense | 2 × ADC (R_IS / L_IS) |

## GPIO Pinout

| GPIO | Function |
|------|----------|
| GPIO19 | R_PWM — right H-bridge direction (LEDC 1 kHz) |
| GPIO18 | L_PWM — left H-bridge direction (LEDC 1 kHz) |
| GPIO17 | R_EN — right H-bridge enable (INH) |
| GPIO16 | L_EN — left H-bridge enable (INH) |
| GPIO34 | R_IS — right H-bridge current sense (ADC, input-only) |
| GPIO35 | L_IS — left H-bridge current sense (ADC, input-only) |
| GPIO4 | OPEN_SWITCH — forward/open end limit switch |
| GPIO13 | CLOSED_SWITCH — reverse/closed end limit switch |
| GPIO32 | TOGGLE_1 — momentary switch input 1 |
| GPIO27 | TOGGLE_2 — momentary switch input 2 |
| GPIO26 | STATUS_LED — external heartbeat LED |

## Configuration

```yaml
substitutions:
  id: "1"
  name: motor-${id}
  friendly_name: "Neato Motor ${id}"
  project_name: "CodeMakesItGo.Motor"
  project_version: "1.0.0"

packages:
  board: github://CodeMakesItGo/NeatoFx_Public/Controllers/NeatoMotor/boards/rev3.yaml@main
```

For a fully networked install with Home Assistant, limit switch config, and travel mode controls,
import the complete configuration:

```yaml url=https://github.com/CodeMakesItGo/NeatoFx_Public/blob/main/Controllers/NeatoMotor/main.yaml
```

### Variants

| File | Description |
|------|-------------|
| `main.yaml` | Standard bidirectional motor controller |
| `main_winch.yaml` | Winch/hoist variant with modified limit behavior |

### Operating modes

- **Networked** — joins home WiFi and exposes a Home Assistant cover entity
  (`configs/networked.yaml`). Motor direction maps to cover open/close.
- **Standalone** — creates its own WiFi AP for direct web control
  (`configs/standalone.yaml`).

### Motor behavior settings (configurable via web UI)

| Setting | Description |
|---------|-------------|
| Motor Timer | 0 = run until limit/toggle; ≥ 10 ms = timed run |
| Travel Mode | 1 Direction (stop) or Bi-direction (auto-reverse) |
| Open Hold Time | Dwell at open position before auto-close (ms) |
| Toggle Delay | Pause between stop and direction change (ms) |
| Open/Closed Switch Enabled | Enable or bypass each limit switch |

## Links

- [GitHub repository](https://github.com/CodeMakesItGo/NeatoFx_Public/tree/main/Controllers/NeatoMotor)
