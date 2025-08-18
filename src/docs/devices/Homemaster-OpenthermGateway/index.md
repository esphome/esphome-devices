---
title: Homemaster-OpenthermGateway
date-published: 2025-08-18
type: relay
standard: global
board: esp32
project-url: (https://github.com/isystemsautomation/HOMEMASTER/tree/main/OpenthermGateway)
difficulty: 1
---

# 🔥 Opentherm Gateway – DIN-Rail Smart Heating Interface for Home Assistant

![alt text](./opentherm.png "HOMAMASTER MicroPLC")

## Product description

## 🌡️ Description

The Opentherm Gateway enables full bidirectional OpenTherm communication for intelligent climate control. It supports monitoring and control of key heating parameters such as burner status, flame modulation, setpoint temperatures, and system diagnostics.

A built-in high-voltage relay allows local control of zone valves or backup heaters, while two independent **1-Wire interfaces** support digital temperature sensors (e.g., DS18B20) for detailed room or system temperature monitoring.

Maker: https://www.home-master.eu/

Product page: https://www.home-master.eu/shop/esp32-opentherm-gateway-59

Schematics: https://github.com/isystemsautomation/HOMEMASTER/tree/main/OpenthermGateway/Schematic

## Features

## ⚙️ Key Features

- **OpenTherm Interface**: Full OpenTherm communication with compatible boilers for temperature control and diagnostics
- **ESP32-WROOM-32U**: Wi-Fi/Bluetooth-enabled microcontroller with ESPHome pre-installed
- **Relay Output**: One high-voltage relay for local switching (e.g., heaters, zone valves)
- **Dual 1-Wire Interfaces**: Two isolated 1-Wire buses for temperature sensors like DS18B20
- **Power Options**: Operates on 24 VDC or 220 VAC/220VDC for flexible installation
- **USB Type-C**: For firmware updates, serial configuration, and power
- **OTA Updates**: Supported via ESPHome for wireless firmware management
- **Improv**: Wi-Fi Configuration 
- **DIN-Rail Mountable**: Standardized enclosure for electrical cabinets
- **Status LEDs**: Visual indicators for power, relay, OpenTherm, and Wi-Fi status
- **Open Source**: Both hardware and firmware are open for community contribution

## Networking

Wi-Fi Connectivity – Integrated Wi-Fi for wireless access and Home Assistant integration.

## Pinout

![alt text](./pinout.png "pinout")

## OpenTherm Gateway Functional Block Diagram

![alt text](./diagram.png "System Block Diagram")

## Programming

The OpenTherm Gateway comes with ESPHome pre-installed and can be confgured via:

### Improve

Wi-Fi Configuration with Improv

1. Power on your HomeMaster OpenTherm Gateway.
2. Go to 👉 improv-wifi.com (works in Chrome/Edge on desktop or mobile).
3. Connect via USB (Serial) or Bluetooth LE.
4. Enter your Wi-Fi SSID and password, then press Connect.
5. The device joins your Wi-Fi and is now ready.

You can then access it via its local address (e.g., http://opentherm.local) or directly in Home Assistant.

### One-Click Import (ESPHome Dashboard Import)

Once connected to Wi-Fi, the OpenTherm Gateway will be automatically discovered in ESPHome Dashboard.
When the device appears in ESPHome Dashboard, click “Take Control”.
The OpenTherm Gateway supports dashboard import, automatically pulling its official configuration from GitHub

### USB Type-C: Use the ESPHome Dashboard to upload the configuration

1. Connect the OpenTherm Gateway to your computer with a USB Type-C cable.
2. Download the YAML configuration file from our GitHub repository.
3. Open the ESPHome Dashboard, import the YAML file, and update it with your Wi-Fi SSID and password.
4. Flash the device directly from ESPHome Dashboard.
5. The OpenTherm Gateway supports automatic reset and boot control — there is no need to press reset or boot buttons during programming.
6. After flashing, the device will reboot automatically and run the updated firmware.


## Specifications

| Feature              | Details                              |
|----------------------|--------------------------------------|
| Microcontroller      | ESP32-WROOM-32U                      |
| Power Supply         | 5V via USB-C for programming, 24V via terminal or 220VAC/DC via terminal      |
| Relay Output         | 1x 16A (optically isolated)     |
| Communication        | RS-485, Wi-Fi, Bluetooth, USB-C      |
| 1-Wire               | 2 channels (ESD/OVP protected)        |
| Mounting             | DIN-rail                             |
| Firmware             | ESPHome (pre-installed), Arduino |

## 🏠 Integration with Home Assistant

When flashed with ESPHome, the Opentherm Gateway exposes the following entities in Home Assistant:

- Boiler on/off
- Burner status
- Flame modulation level (%)
- CH/DHW setpoint temperatures
- Boiler water temperature
- System pressure (if supported)
- Relay output status
- Temperature readings from connected 1-Wire sensors
- etc.

## Basic Config

```yaml
substitutions:
  name: "homemaster-microplc"           # Internal device name (used by ESPHome & hostname)
  friendly_name: "Homemaster MicroPLC"  # Friendly name (shown in Home Assistant UI)
  room: ""                              # Optional: assign device to a room in HA
  device_description: "Homemaster MicroPLC"  # Description for documentation
  project_name: "Homemaster.MicroPLC"   # Project identifier
  project_version: "v1.0.0"             # Firmware version
  update_interval: 60s                  # Default sensor update interval
  dns_domain: ".local"                  # mDNS domain suffix for network discovery
  timezone: ""                          # Timezone (can be set if device runs in different region)
  sntp_update_interval: 6h              # Sync interval for time updates from NTP servers
  sntp_server_1: "0.pool.ntp.org"       # Primary NTP server
  sntp_server_2: "1.pool.ntp.org"       # Secondary NTP server
  sntp_server_3: "2.pool.ntp.org"       # Tertiary NTP server
  wifi_fast_connect: "false"            # If true, reconnects faster (skips Wi-Fi scans)
  log_level: "DEBUG"                    # Logging level (NONE, ERROR, WARN, INFO, DEBUG, VERBOSE)
  ipv6_enable: "false"                  # Enable IPv6 if supported

esphome:
  name: "${name}"                       # Uses substitution for device name
  friendly_name: "${friendly_name}"     # Uses substitution for friendly name
  comment: "${device_description}"      # Metadata comment
  area: "${room}"                       # Assign device to a room
  name_add_mac_suffix: true             # Appends MAC suffix to avoid duplicate hostnames
  min_version: 2025.7.0                 # Minimum ESPHome version required
  project:
    name: "${project_name}"             # Project name
    version: "${project_version}"       # Project version

esp32:
  board: esp32dev                       # Target board type (generic ESP32 DevKit)
  framework:
    type: esp-idf                       # Use ESP-IDF (official Espressif framework)
    version: recommended                # Recommended stable version

preferences:
  flash_write_interval: 5min            # How often preferences are written to flash

logger:
  baud_rate: 115200                     # Serial logging baud rate
  level: ${log_level}                   # Logging level from substitutions

mdns:
  disabled: false                       # Enable mDNS for auto-discovery on the network

web_server:
  port: 80                              # Enables local web server on port 80

api:                                    # Enable ESPHome API for Home Assistant integration

ota:
  - platform: esphome

network:
  enable_ipv6: ${ipv6_enable}

wifi:
  ap: {}
  fast_connect: "${wifi_fast_connect}"  
  domain: "${dns_domain}"

captive_portal:                         # Captive portal for fallback hotspot

improv_serial:                          # Allows setup via Improv over Serial

esp32_improv:
  authorizer: none                      # No additional authorization required for Improv

dashboard_import:
  package_import_url: github://isystemsautomation/HOMEMASTER/MicroPLC/Firmware/microplc.yaml@main
  import_full_config: true
  # Allows importing this YAML from GitHub into ESPHome Dashboard

uart:
  tx_pin: 17                            # UART TX pin
  rx_pin: 16                            # UART RX pin
  baud_rate: 115200                     # UART baud rate
  id: mod_uart                          # Identifier for UART bus

time:
  - platform: pcf8563                   # Real-time clock (RTC) module via I2C
    id: pcf8563_time
    address: 0x51                       # I2C address of PCF8563
  - platform: homeassistant
    # instead try to synchronize via network repeatedly ...
    on_time_sync:
      then:
              # ... and update the RTC when the synchronization was successful
        - pcf8563.write_time
        # Update last restart time, but only once.
        - if:
            condition:
              lambda: 'return id(device_last_restart).state == "";'
            then:
              - text_sensor.template.publish:
                  id: device_last_restart
                  state: !lambda 'return id(pcf8563_time).now().strftime("%a %d %b %Y - %I:%M:%S %p");'

sensor:
  - platform: uptime
    name: "Uptime Sensor"
    id: uptime_sensor
    type:
      timestamp
    entity_category: "diagnostic"

  - platform: wifi_signal # Reports the WiFi signal strength/RSSI in dB
    name: "WiFi Signal dB"
    id: wifi_signal_db
    update_interval: "${update_interval}"
    entity_category: "diagnostic"

  - platform: copy # Reports the WiFi signal strength in %
    source_id: wifi_signal_db
    name: "WiFi Signal Percent"
    filters:
      - lambda: return min(max(2 * (x + 100.0), 0.0), 100.0);
    unit_of_measurement: "Signal %"
    entity_category: "diagnostic"
    device_class: ""
text_sensor:
  - platform: wifi_info
    ip_address:
      name: "IP Address"
      entity_category: "diagnostic"
    ssid:
      name: "Connected SSID"
      entity_category: "diagnostic"
    mac_address:
      name: "Mac Address"
      entity_category: "diagnostic"
  - platform: template
    name: 'Last Restart'
    id: device_last_restart
    icon: mdi:clock
    entity_category: "diagnostic"
#    device_class: timestamp
i2c:
  - id: bus_a
    sda: 32                             # I2C SDA pin
    scl: 33                             # I2C SCL pin
    scan: true                          # Scan for devices at startup

one_wire:
  - platform: gpio
    pin: GPIO04                         # Pin for 1-Wire devices (e.g., DS18B20 sensors)
    id: hub_1

switch:
  - platform: gpio
    name: "Relay"                       # Relay switch exposed to Home Assistant
    pin: 26                             # GPIO pin controlling the relay

status_led:
  pin:
    number: GPIO25                      # Pin for status LED
    inverted: true                      # Inverted logic (LED ON when pin LOW)

```
