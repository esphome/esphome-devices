---
title: Knightsbridge CU9KW Smart Wall Socket
date-published: 2025-07-11
type: plug
standard: uk
board: esp8266
---

## General Notes

The Knightsbridge CU9KW is a UK-format smart wall socket that lets you switch two outlets on/off remotely and monitors real-time power usage and cumulative energy consumption over Wi-Fi. It fits a standard 2-gang back box and supports OTA updates via ESPHome.

The Knightsbridge OP9KW is the exact same product, with the outdoor case, so instructions will work exactly the same for both.

Manufacturer: [Knightsbridge (ML Accessories)](http://www.mlaccessories.co.uk) :contentReference[oaicite:0]{index=0}  

![Product](./knightsbridge-cu9kw.jpg "Product Image")
![Product](./knightsbridge-op9kw.jpg "Product Image")

## GPIO Pinout

| Pin    | Function                                 |
| ------ | ---------------------------------------- |
| GPIO15 | Relay output for Outlet 1                |
| GPIO4  | Relay output for Outlet 2                |
| GPIO2  | LED indicator for Outlet 1 (inverted)    |
| GPIO0  | LED indicator for Outlet 2 (inverted)    |
| GPIO16 | Push-button for Outlet 1                 |
| GPIO13 | Push-button for Outlet 2                 |
| GPIO12 | HLW8012 SEL pin (power/energy selector)  |
| GPIO5  | HLW8012 CF pin (power pulse)             |
| GPIO14 | HLW8012 CF1 pin (voltage pulse)          |

## Flashing

Based on the procedure shared by [maxwroc](https://community.home-assistant.io/t/smartknight-ml-accessories-ltd-smart-plug/504892/3) in the Home Assistant community forum:

1. **Remove the metal bracket**  
   Gently squeeze a screwdriver between the metal part and the plastic housing, then pry the metal bracket up around its ends to release it.  
   ![Disassembly](./knightsbridge-cu9kw-disassembly.jpg "Removing the metal bracket")

2. **Extract the ESP8266 module**  
   Carefully lift the Wi-Fi module straight up from its plastic clips once the bracket is removed.  
   ![ESP Board](./knightsbridge-cu9kw-ESP-board.jpg "ESP8266 module ready for flashing")

3. **Wire for flashing**  
   - Solder a header or wires to the module’s pins (3.3 V, GND, TX, RX, and GPIO0).  
   - Connect TX→RX, RX→TX, GND→GND, and 3.3 V→3.3 V (do **not** use 5 V).  
   - Hold **GPIO0** to GND while applying power to enter the ESP8266 bootloader.  
   - Use your preferred flasher (e.g., `esptool.py`) to write the ESPHome firmware.  


## ESPHome Configuration
Here is an example YAML configuration for Knightsbridge CU9KW

```yaml
substitutions:
  name: knightsbridge-cu9kw
  friendly_name: Knightsbridge-CU9KW

esphome:
  name: $name

esp8266:
  board: esp01_1m

# Enable logging
logger:
improv_serial:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

output:
  - platform: gpio
    id: relay_1
    pin: GPIO15
  - platform: gpio
    id: relay_2
    pin: GPIO4
  - platform: gpio
    id: led_1
    pin:
      number: GPIO2
      inverted: true
  - platform: gpio
    id: led_2
    pin:
      number: GPIO0
      inverted: true

switch:
  - platform: output
    output: relay_1
    name: "Outlet 1"
    id: cu9kw_socket_1
    icon: mdi:power-socket-uk
    on_turn_on:
      - output.turn_on: led_1
    on_turn_off:
      - output.turn_off: led_1

  - platform: output
    output: relay_2
    name: "Outlet 2"
    id: cu9kw_socket_2
    icon: mdi:power-socket-uk
    on_turn_on:
      - output.turn_on: led_2
    on_turn_off:
      - output.turn_off: led_2

binary_sensor:
  - platform: gpio
    id: button_1
    pin:
      number: GPIO16
      mode:
        input: true
        pullup: false
      inverted: false
    on_press:
      - switch.toggle: cu9kw_socket_1

  - platform: gpio
    id: button_2
    pin:
      number: GPIO13
      mode:
        input: true
        pullup: true
      inverted: false
    on_press:
      - switch.toggle: cu9kw_socket_2

sensor:
  # Power Monitoring
  - platform: hlw8012
    model: BL0937
    sel_pin:
      number: GPIO12
      inverted: true
    cf_pin: GPIO5
    cf1_pin: GPIO14
    update_interval: 10s
