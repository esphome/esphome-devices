---
title: Sonoff S60TPF
date-published: 2025-07-01
type: plug
standard: eu
board: esp32
made-for-esphome: False
difficulty: 2
---

![Product Image](./sonoff-iplug-wi-fi-smart-plug-s60-type-e-f.png "Device front")

## GPIO Pinout

| Pin   | Function                           |
| ----- | ---------------------------------- |
| GPIO9 | Push Button (HIGH = off, LOW = on) |
| GPIO4 | Relay and its status red LED       |
| GPIO5 | Status LED                         |
| GPIO7 | TX pin (CSE7759B meter)            |

## Notes
Can be flashed wirelessly without disassembly using [Sonoff-OTA](https://github.com/adamsthws/Sonoff-OTA) to Tasmota then to ESPHome [Migrating from Tasmota](https://esphome.io/guides/migrate_sonoff_tasmota/)

## Links

- [Product Page](https://itead.cc/product/sonoff-iplug-wi-fi-smart-plug-s60/)
- [Sonoff S60 version Europe : tasmotized](https://github.com/arendst/Tasmota/discussions/21255)
- [Sonoff-OTA](https://github.com/adamsthws/Sonoff-OTA)

## Basic Configuration

```yaml file=config.yaml
```
