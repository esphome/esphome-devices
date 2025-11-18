---
title: Homemaster-MicroPLC
date-published: 2025-09-12
type: relay
standard: global
board: esp32
project-url: https://github.com/isystemsautomation/HOMEMASTER/tree/main/MicroPLC
made-for-esphome: False
difficulty: 1
---

![alt text](./MicroPLC.png "HOMAMASTER MicroPLC")

## Product description

The HOMAMASTER MicroPLC is a compact and powerful open-source automation controller based on the ESP32-WROOM-32U.
Designed for seamless integration with Home Assistant using ESPHome, it enables control of smart home devices, sensors,
actuators, and industrial systems through RS-485 Modbus and wireless communication.

Maker: [https://www.home-master.eu/](https://www.home-master.eu/)

Product page: [https://www.home-master.eu/shop/esp32-microplc-56](https://www.home-master.eu/shop/esp32-microplc-56)
Schematics:
[https://github.com/isystemsautomation/HOMEMASTER/tree/main/MicroPLC/Schematic](https://github.com/isystemsautomation/HOMEMASTER/tree/main/MicroPLC/Schematic)

## Features

- **ESP32-WROOM-32U** microcontroller with Wi-Fi and Bluetooth
- **ESPHome compatible firmware** for seamless Home Assistant integration
- **RS-485 Modbus RTU** interface for extension module communication
- **USB Type-C port** for programming, debugging, and power
- **1-Wire interface** with ESD and overvoltage protection
- **PCF8563 RTC** for accurate time-based automation
- **One industrial-grade relay** with varistor and opto-isolation
- **One 24V digital input** with surge protection (ISO1212)
- **Four front-panel buttons** and **status LEDs** for local control and diagnostics
- **DIN-rail mountable** for standard electrical enclosures

## Networking

Wi-Fi Connectivity – Integrated Wi-Fi for wireless access and Home Assistant integration.

## Pinout

![alt text](./pinout_MicroPLC.png "pinout")

## MicroPLC Functional Block Diagram

![alt text](./diagram.png "System Block Diagram")

## Programming

The MicroPLC comes with ESPHome pre-installed and can be configured via:

### Improv

Wi-Fi Configuration with Improv

1. Power on your HomeMaster MicroPLC.
2. Go to 👉 improv-wifi.com (works in Chrome/Edge on desktop or mobile).
3. Connect via USB (Serial) or Bluetooth LE.
4. Enter your Wi-Fi SSID and password, then press Connect.
5. The device joins your Wi-Fi and is now ready.

You can then access it via its local address (e.g.,
[http://homemaster-microplc.local](http://homemaster-microplc.local)) or directly in Home Assistant.

### One-Click Import (ESPHome Dashboard Import)

Once connected to Wi-Fi, the MicroPLC will be automatically discovered in ESPHome Dashboard.

When the device appears in ESPHome Dashboard, click “Take Control”.

The MicroPLC supports dashboard import, automatically pulling its official configuration from GitHub

### USB Type-C: Use the ESPHome Dashboard to upload the configuration

1. Connect the MicroPLC to your computer with a USB Type-C cable.
2. Download the YAML configuration file from our GitHub
  
repository.([https://github.com/isystemsautomation/HOMEMASTER/blob/main/MicroPLC/Firmware/microplc.yaml](https://github.com/isystemsautomation/HOMEMASTER/blob/main/MicroPLC/Firmware/microplc.yaml))
3. Open the ESPHome Dashboard, import the YAML file, and update it with your Wi-Fi SSID and password.
4. Flash the device directly from ESPHome Dashboard.
5. The MicroPLC supports automatic reset and boot control — there is no need to press reset or boot buttons during
   programming.
6. After flashing, the device will reboot automatically and run the updated firmware.

## Bus system configuration

### I2C

|     | PIN    |
| --- | ------ |
| SDA | GPIO32 |
| SCL | GPIO33 |

### I2C addresses

|         | address |
| ------- | ------- |
| pcf8563 | 0x51    |

## Specifications

| Feature         | Details                                          |
| --------------- | ------------------------------------------------ |
| Microcontroller | ESP32-WROOM-32U                                  |
| Power Supply    | 5V via USB-C for programming or 24V via terminal |
| Relay Output    | 1x 16A (optically isolated)                      |
| Digital Input   | 1x 24V DI (ISO1212-based)                        |
| Communication   | RS-485, Wi-Fi, Bluetooth, USB-C                  |
| RTC             | PCF8563                                          |
| 1-Wire          | 1 channel (ESD/OVP protected)                    |
| Mounting        | DIN-rail                                         |
| Firmware        | ESPHome (pre-installed), Arduino                 |

## Basic Config

```yaml
substitutions:
  name: homemaster-microplc
  friendly_name: Homemaster MicroPLC
  room: ''
  device_description: Homemaster MicroPLC
  project_name: Homemaster.MicroPLC
  project_version: v1.0.0
  update_interval: 60s
  dns_domain: .local
  timezone: ''
  wifi_fast_connect: 'false'
  log_level: DEBUG
  ipv6_enable: 'false'
esphome:
  name: ${name}
  friendly_name: ${friendly_name}
  comment: ${device_description}
  area: ${room}
  name_add_mac_suffix: true
  min_version: 2025.7.0
  project:
    name: ${project_name}
    version: ${project_version}
esp32:
  board: esp32dev
  framework:
    type: esp-idf
    version: recommended
logger:
  baud_rate: 115200
  level: ${log_level}
mdns:
  disabled: false
api: null
ota:
- platform: esphome
network:
  enable_ipv6: ${ipv6_enable}
wifi:
  ap: {}
  fast_connect: ${wifi_fast_connect}
  domain: ${dns_domain}
improv_serial: null
esp32_improv:
  authorizer: none
dashboard_import:
  package_import_url: github://isystemsautomation/HOMEMASTER/MicroPLC/Firmware/microplc.yaml@main
  import_full_config: true
uart:
  tx_pin: 17
  rx_pin: 16
  baud_rate: 115200
  id: mod_uart
time:
- platform: pcf8563
  id: pcf8563_time
  address: 81
- platform: homeassistant
  id: ha_time
  on_time_sync:
    then:
    - pcf8563.write_time
i2c:
- id: bus_a
  sda: 32
  scl: 33
  scan: true
one_wire:
- platform: gpio
  pin: GPIO04
  id: hub_1
switch:
- platform: gpio
  name: Relay
  pin: 26
  id: relay1
status_led:
  pin:
    number: GPIO25
    inverted: true
    id: st_led
```
