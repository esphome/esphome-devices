---
title: Rowi 2 ESP32-based Smart Plug AU, NZ, EU
date-published: 2026-01-19
type: plug
standard: au, uk, eu
board: esp32
---

# Vaiotech KW 600 Rowi2

This project is the home of the [ESPHome][esphome] firmware for the [Vaiotech KW600][vaiotech].

<img src="./docs/rowi2.png" alt="Vaiotech KW600" width="400">

> **Note:**
> If you intend to integrate your device with Home Assistant, please ensure you order the **ESPHome firmware** version of Rowi2. The default firmware does **not** support Home Assistant integration.

Rowi2 is available in two different versions:
- **Default Rowi firmware:** Local REST API & MQTT integration
- **ESPHome firmware:** For Home Assistant and custom automation

There are two external sensors available:
- Temperature and Humidity
- Temperature, Humidity, and Air Quality

Details and technical specs: [Rowi2 Specifications][vaiotech-tech].
Where to buy in [AU/NZ][vaiotech-shop], [Global version request here][vaiotech-contact]

---

## ESPHome Firmware Features

- Onboard device to Home Assistant using [Improv-BLE][onboarding]
- **Bluetooth proxy:** Acts as a BLE proxy to relay Bluetooth Low Energy devices to Home Assistant
- Temperature and humidity offset
- Option to calibrate voltage, current, power, and energy
- Factory reset device by pressing button for over 10 seconds
- **Automatic firmware updates:** The ESPHome factory firmware supports auto-update for new releases

---

## LED Status & Light Modes

The RGB LED on the Rowi2 device indicates the current state:

| State                                  | Color / Effect           | Description                                      |
|----------------------------------------|--------------------------|--------------------------------------------------|
| **Improv BLE (Onboarding)**            | Aqua, Fast Pulse         | Device is in onboarding mode                     |
| **Initialization (WiFi connected)**    | Solid White              | Device is initializing, WiFi connected           |
| **Initialization (WiFi not connected)**| Magenta, Slow Pulse      | Device is initializing, WiFi not connected       |
| **No Home Assistant Connection**       | Red, Asymmetrical Pulse  | Lost connection to Home Assistant                |
| **Relay ON**                           | Solid Orange             | Output relay is ON                               |
| **Relay OFF**                          | Solid Green              | Output relay is OFF                              |
| **Factory Reset Requested**            | Solid Blue, Fast Pulse   | Hold button >10s, factory reset pending          |
| **Overcurrent Detected**               | Solid Red, Fast Pulse    | Current exceeded configured limit, power cut     |

**Notes:**
- The LED updates automatically based on device state.
- Factory reset is triggered by holding the button for more than 10 seconds.

---

## Getting Started

- [Onboarding Guide (Improv-BLE)][onboarding]
- [Calibration Guide][calibrating]
- [Developer Guide: Building & Installing ESPHome Firmware][building]

---

## Troubleshooting

- If your device is not discovered during onboarding, ensure Bluetooth is enabled and the device is in onboarding mode (after power-up or factory reset).
- For manual firmware installation or advanced usage, see the [Developer Guide][building].

---

## Links

- [Rowi2 Specifications][vaiotech-tech]
- [Buy Rowi2 in AU/NZ][vaiotech-shop]
- [Request global version][vaiotech-contact]
- [Calibration Guide][calibrating]
- [Build it yourself: Developer Guide][building]

---

<!-- URL references -->
[esphome]: https://esphome.io

[vaiotech]: https://www.vaiotech.co.nz/kiwi-warmer-series/
[vaiotech-tech]: https://www.kiwi-warmer.co.nz/for-developers/
[vaiotech-shop]: https://www.kiwi-warmer.co.nz/shop/product/866878/rowi-2-smart-plug-for-home-assistant/
[vaiotech-contact]: https://www.vaiotech.co.nz/contact-us/

[onboarding]: https://github.com/vt-vaio/rowi2/blob/main/docs/ONBOARDING.md
[building]: https://github.com/vt-vaio/rowi2/blob/main/docs/BUILDING.md
[calibrating]: https://github.com/vt-vaio/rowi2/blob/main/docs/CALIBRATING.md

## Standard Configuration

```yaml
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! #
# !!!  After adopting the device, update the WiFi configuration accordingly. !!! #
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! #
substitutions:
  name: rowi2-plug                # Device name used in ESPHome and on the network
  friendly_name: "Rowi2 Plug"     # Human-friendly device name for Home Assistant
  climate_update_interval: 10s    # Update interval for climate sensors (temperature, humidity, etc.)
  sensor_timeout_interval: 30s    # Timeout for climate sensors to return a valid reading
  energy_update_interval: 1s      # Update interval for energy sensors and overcurrent checks
  overcurrent_cutoff: '3'         # Number of consecutive energy_update_intervals the current must exceed the limit before overload cutoff

packages:

  remote_package:
    url: https://github.com/vt-vaio/rowi2
    ref: main
    files:
      - packages/core.yml
      - packages/climate.yml
      - packages/energy.yml
      - packages/ble-proxy.yml
      - packages/diagnostics.yml

esphome:
  name: ${name}
  friendly_name: ${friendly_name}
  name_add_mac_suffix: true
  min_version: '2025.10.0'
  on_boot:
    priority: 375
    then:
      # Run the script to refresh the LED status
      - script.execute: control_leds

      # If after 10 minutes, the device is still initializing (It did not yet connect to Home Assistant),
      # turn off the init_in_progress variable and run the script to refresh the LED status
      - delay: 10min
      - if:
          condition:
            lambda: return id(init_in_progress);
          then:
            - lambda: id(init_in_progress) = false;
            - script.execute: control_leds

esp32:
  board: nodemcu-32s
  framework:
    type: esp-idf

# Enable logging
logger:
  level: INFO

# Enable Home Assistant API
api:
  id: api_id
  on_client_connected:
    - lambda: id(init_in_progress) = false;
    - script.execute: control_leds
  on_client_disconnected:
    - script.execute: control_leds

ota:
  - platform: esphome
    id: ota_esphome

wifi:
  id: wifi_id

  # Uncomment ssid and password and add values to your secrets.yaml
  # ssid: !secret wifi_ssid
  # password: !secret wifi_password

  on_connect:
    - lambda: id(init_in_progress) = false;
    - script.execute: control_leds
  on_disconnect:
    - script.execute: control_leds

globals:
  # Global initialization variable. Initialized to true and set to false once everything is connected. Only used to have a smooth "plugging" experience
  - id: init_in_progress
    type: bool
    restore_value: no
    initial_value: 'true'
  # Global variable storing the state of ImprovBLE. Used to draw different LED animations
  - id: improv_ble_in_progress
    type: bool
    restore_value: no
    initial_value: 'false'
  # Global variable storing if a factory reset was requested. If it is set to true, the device will factory reset once the center button is released
  - id: factory_reset_requested
    type: bool
    restore_value: no
    initial_value: 'false'
  # Global variable storing the state of the overcurrent cutoff detection
  - id: overcurrent_cutoff_detected
    type: bool
    restore_value: no
    initial_value: 'false'
```

## Factory Configuration

```yaml
packages:
  rowi2-plug: !include rowi2-plug.yaml
  factory-ota: !include packages/factory-ota.yml

esphome:
  project:
    name: Kiwi Warmer.Rowi2 Plug
    version: dev

dashboard_import:
  package_import_url: github://vt-vaio/rowi2/rowi2-plug.yaml@main
  import_full_config: true

wifi:
  # Uncomment the following lines to upload a new firmware to a already connected device
  # manual_ip:
  #   # Set this to the IP of the ESP
  #   static_ip: 192.168.x.x
  #   # Set this to the IP address of the router. Often ends with .1
  #   gateway: 192.168.x.1
  #   # The subnet of the network. 255.255.255.0 works for most home networks.
  #   subnet: 255.255.255.0
  on_connect:
    - delay: 5s
    - lambda: id(improv_ble_in_progress) = false;

esp32_ble:
  name: rowi2-plug

esp32_improv:
  authorizer: center_button
  on_start:
    - lambda: id(improv_ble_in_progress) = true;
    - script.execute: control_leds
  on_provisioned:
    - lambda: id(improv_ble_in_progress) = false;
    - script.execute: control_leds
  on_stop:
    - lambda: id(improv_ble_in_progress) = false;
    - script.execute: control_leds
```

