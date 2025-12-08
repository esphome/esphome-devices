---
title: Citilab ED1
date-published: 2025-12-08
type: misc
standard: eu
board: esp32
project-url: https://github.com/glifocat/ed1-hoas
made-for-esphome: false
difficulty: 1
---

The ED1 is an ESP32-based educational development board designed by [Citilab Edutec](https://citilab.eu) in Barcelona, Spain. It integrates multiple peripherals for learning embedded systems and IoT development.

![Citilab ED1 Board](ed1-board.png "Citilab ED1 Educational Board")

## Features

- **1.44" TFT Display** (ST7735, 128x128 pixels)
- **32x8 LED Matrix** (WS2812, 256 LEDs)
- **6 Capacitive Touch Buttons** (Up, Down, Left, Right, OK, X)
- **Light Sensor** (ALS-PT19)
- **Buzzer** with amplifier (PAM8301)
- **IR Receiver** (38kHz, TSOP75438TT)
- **Accelerometer** (MXC6655XA on Rev 2.3, LIS3DH on Rev 1.0)
- **Stepper Motor Support** (2x 28BYJ-48 via MCP23009)
- **Battery Support** (16340/CR123A Li-Ion)
- **USB-C** for power and programming

## GPIO Pinout

| GPIO | Function |
|------|----------|
| 2 | Touch Left |
| 4 | Touch Up |
| 5 | TFT CS |
| 9 | TFT DC |
| 10 | TFT Reset |
| 12 | LED Matrix (WS2812) |
| 13 | Touch Down |
| 14 | Touch X |
| 15 | Touch OK |
| 18 | SPI CLK |
| 19 | SPI MISO |
| 21 | I2C SDA |
| 22 | I2C SCL |
| 23 | SPI MOSI |
| 26 | Buzzer |
| 27 | Touch Right |
| 34 | Light Sensor (ADC) |
| 35 | IR Receiver |

## Basic Configuration

This minimal configuration enables the TFT display, touch buttons, buzzer, and sensors:

```yaml
esphome:
  name: ed1-board
  friendly_name: ED1 Board

esp32:
  board: esp32dev
  framework:
    type: arduino

logger:

api:
  encryption:
    key: !secret api_encryption_key

ota:
  - platform: esphome
    password: !secret ota_password

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: "ED1-Fallback"
    password: !secret fallback_ap_password

captive_portal:

# Hardware buses
spi:
  clk_pin: GPIO18
  mosi_pin: GPIO23
  miso_pin: GPIO19

i2c:
  sda: GPIO21
  scl: GPIO22
  scan: true

# TFT Display (ST7735 128x128)
display:
  - platform: st7735
    id: internal_display
    cs_pin: GPIO5
    dc_pin: GPIO9
    reset_pin: GPIO10
    rotation: 0
    model: "INITR_GREENTAB"
    device_width: 128
    device_height: 128
    col_start: 2
    row_start: 3
    update_interval: 1s
    lambda: |-
      it.fill(Color(0, 0, 0));
      it.print(64, 40, id(font_large), Color(0, 255, 0), TextAlign::CENTER, "ED1");
      it.print(64, 70, id(font_small), Color(255, 255, 255), TextAlign::CENTER, id(wifi_ip).state.c_str());

font:
  - file: "gfonts://Roboto"
    id: font_large
    size: 24
  - file: "gfonts://Roboto"
    id: font_small
    size: 12

# Touch Buttons
esp32_touch:
  setup_mode: false

binary_sensor:
  - platform: esp32_touch
    name: "Button Up"
    pin: GPIO4
    threshold: 500

  - platform: esp32_touch
    name: "Button Down"
    pin: GPIO13
    threshold: 500

  - platform: esp32_touch
    name: "Button Left"
    pin: GPIO2
    threshold: 500

  - platform: esp32_touch
    name: "Button Right"
    pin: GPIO27
    threshold: 500

  - platform: esp32_touch
    name: "Button OK"
    pin: GPIO15
    threshold: 500

  - platform: esp32_touch
    name: "Button X"
    pin: GPIO14
    threshold: 900

# Buzzer
output:
  - platform: ledc
    pin: GPIO26
    id: buzzer_output

rtttl:
  output: buzzer_output

# Sensors
sensor:
  - platform: wifi_signal
    name: "WiFi Signal"
    update_interval: 60s

  - platform: internal_temperature
    name: "CPU Temperature"

  - platform: adc
    pin: GPIO34
    name: "Light Level"
    attenuation: 12db
    update_interval: 5s
    unit_of_measurement: "%"
    filters:
      - multiply: 30.3

text_sensor:
  - platform: wifi_info
    ip_address:
      name: "IP Address"
      id: wifi_ip
```

## LED Matrix Configuration

Add this to enable the 32x8 WS2812 LED matrix:

```yaml
light:
  - platform: esp32_rmt_led_strip
    rgb_order: GRB
    chipset: WS2812
    pin: GPIO12
    num_leds: 256
    name: "LED Matrix"
    id: led_matrix
    default_transition_length: 0s
    color_correct: [40%, 40%, 40%]
```

## Hardware Revisions

| Component | Rev 1.0 | Rev 2.3 |
|-----------|---------|---------|
| Accelerometer | LIS3DH (0x19) | MXC6655XA (0x15) |
| I/O Expander | MCP23017 (0x20) | MCP23009 (0x20) |

Check I2C scan on boot to identify your revision.

## Links

- [Full ESPHome Configuration](https://github.com/glifocat/ed1-hoas) - Modular packages with display themes, MQTT, stepper motors
- [Citilab](https://citilab.eu) - Board manufacturer
- [MicroBlocks](https://microblocks.fun/) - Official programming environment
- [Hardware Documentation](https://github.com/glifocat/ed1-hoas/blob/main/docs/HARDWARE.md)
