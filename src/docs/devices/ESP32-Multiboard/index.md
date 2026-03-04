---
title: ESP32 Multiboard
date-published: 2026-03-04
type: misc
standard: global
board: esp32
project-url: https://github.com/thebeaverdam/ESP32_MultiBoard
difficulty: 1
---




# ESP32 MultiBoard

The ESP32 MultiBoard is a custom board that helps makers to connect an ESP32 with all kind of sensors and actuators, using most common connectors such as Qwiic and Grove. 

A serial adapter is needed for programming the board for the first time. Once configured, you can update the new code via OTA in ESPHome or Arduino IDE.


<br></br>


![MultiBoard](MultiBoard.png "MultiBoard")


---

## 🧩 Specifications

- **Power Supply:** 5V DC input  
- **Qwiic Connector:** For I²C peripherals (3,3V)  
- **Grove Connectors:**
  - UART type (TX/RX communication)
  - Analog type
  - Digital type
  - I²C (5V compatible)  
- **Pin Header:** For expansion modules or shields  
- **SPI Connector**
- **ESPHome Compatible:** Designed to easily integrate with ESPHome-based devices and automation platforms.  




---

## Pinout

![Pinout](Multiboard_Pinout.png "Pinout")

---
 
 ```YAML

 esphome:
  name: esp32-multiboard

esp32:
  board: esp32dev

# I2C Configuration (Qwiic Connector)
i2c:
  sda: 21
  scl: 22
  scan: true
  id: bus_a

# UART Configuration (Grove UART)
uart:
  id: uart_bus
  tx_pin: 17
  rx_pin: 16
  baud_rate: 9600

# SPI Configuration
spi:
    clk_pin: GPIO18
    mosi_pin: GPIO23
    miso_pin: GPIO19
    interface: hardware

# Grove Digital Connector Configuration Examples
binary_sensor:
  - platform: gpio
    pin: 
      number: 26
      inverted: false
      mode:
        input: true
        pullup: true
    name: "Grove Digital Input (IO_1)"


switch:
  - platform: gpio
    pin: 25
    name: "Grove Digital Output (IO_0)"

# Grove Analog Connector Configuration Examples

sensor:
  # Analog Sensor 1 (e.g., Light Sensor or Potentiometer)
  - platform: adc
    pin: 35
    name: "Grove Analog AN1"
    id: analog_sensor_a1
    update_interval: 5s
    unit_of_measurement: "V"
    accuracy_decimals: 2
    attenuation: 11db  # Essential for 0-3.3V range
    filters:
      - multiply: 1.0  # Optional: Calibration factor

  # Analog Sensor 2 (e.g., Soil Moisture Sensor)
  - platform: adc
    pin: 34
    name: "Grove Analog AN0"
    id: analog_sensor_a0
    update_interval: 5s
    attenuation: 11db
    # Example: Converting voltage to percentage (0.5V = 0%, 2.5V = 100%)
    filters:
      - calibrate_linear:
          - 0.5 -> 0.0
          - 2.5 -> 100.0
    unit_of_measurement: "%"


```

---
