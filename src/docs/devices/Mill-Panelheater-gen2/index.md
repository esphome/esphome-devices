---
title: Mill panel heater (generation 2)
date-published: 2025-01-20
type: misc
standard: global
board: esp8266
project-url: https://github.com/owangen/esphome/tree/dev/esphome/components/mill_panelheater_gen2
made-for-esphome: false
difficulty: 5
---

## General Notes

Mill panel heaters are available in various versions. This component is specifically designed for <strong>Generation 2 panel heaters</strong> (not compatible with portable heater models).
If you have a Generation 3 panel heater (which comes with a built-in ESP32), check out this component: Mill Heater ESP32 Component. https://github.com/ssieb/esphome_components/tree/mill/components/mill_heater

To use this component with a Generation 2 panel heater, you’ll need to replace the HF-LPT120A module with an ESP8266
![Desolder](./desolder.jpg "Desolder the LPT120A chip")

HF-LPT120A desoldered
![Removed](./removed.jpg "Removed the LPT120A chip")

Solder the ESP8266 in place.
Refer to the <strong>GPIO Pinout section</strong> for detailed instructions
![Solder](./soldered.jpg "Soldered 8266")

## GPIO Pinout

| PIN (mill board) | ESP8266    | Description              |
|------------------|------------|--------------------------|
| +3.3V            | VCC        | Power input (3.3V)       |
| GND              | GND        | Ground                   |
| WTX              | TX (GPIO1) | UART transmitter         |
| WRX              | RX (GPIO3) | UART receiver            |

## Configuration

```yaml
substitutions:
  devicename: "millzero_soverom"  #Lower case name
  friendly_name: "Mill Zero Soverom"

esphome:
  name: "${devicename}"

external_components:
  source:
    type: git
    url: https://github.com/owangen/esphome
  components: [ mill_panelheater_gen2 ]

esp8266:
  board: d1_mini

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:

captive_portal:

# Enable logging
logger:
  baud_rate: 0 # Deactived to prevent conflict with UART, sending UART to mill controller does not work if enabled

# Enable Home Assistant API
api:

ota:

uart:
  id: uart_bus
  tx_pin: GPIO01
  rx_pin: GPIO03
  baud_rate: 9600

climate:
  - platform: mill_panelheater_gen2
    name: Mill heater
```

## Credits

This component is based on the work by https://github.com/JDolven/Replacing-HF_LPT120A-in-a-millheat-heater and https://github.com/trondsundt/MillHeat-ESPHome-NodeMCU
