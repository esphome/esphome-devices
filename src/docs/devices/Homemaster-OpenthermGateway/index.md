---
title: Homemaster-OpenthermGateway
date-published: 2025-08-19
type: relay
standard: global
board: esp32
project-url: (https://github.com/isystemsautomation/HOMEMASTER/tree/main/OpenthermGateway)
difficulty: 1
---

## 🔥 Opentherm Gateway – DIN-Rail Smart Heating Interface for Home Assistant

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
  name: "homemaster-opentherm"           # Internal device name (used by ESPHome & hostname)
  friendly_name: "Homemaster Opentherm Gateway"  # Friendly name (shown in Home Assistant UI)
  room: ""                              # Optional: assign device to a room in HA
  device_description: "Homemaster Opentherm Gateway"  # Description for documentation
  project_name: "Homemaster.Opentherm Gateway"   # Project identifier
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
  package_import_url: github://isystemsautomation/HOMEMASTER/OpenthermGateway/Firmware
/opentherm.yamll@main
  import_full_config: true
  # Allows importing this YAML from GitHub into ESPHome Dashboard


time:
  - platform: homeassistant
    # instead try to synchronize via network repeatedly ...
    on_time_sync:
      then:
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

# OpenTherm hardware pin configuration
opentherm:
  in_pin: 21      # GPIO21 receives OpenTherm signal
  out_pin: 26     # GPIO26 sends OpenTherm signal

# OpenTherm sensors (read-only values from boiler)
sensor:
  - platform: opentherm
    t_dhw: { name: "DHW temperature (°C)" }                      # Domestic hot water temperature
    rel_mod_level: { name: "Relative modulation level (%)" }     # Modulation %
    ch_pressure: { name: "Water pressure in CH circuit (bar)" }  # Heating circuit pressure
    dhw_flow_rate: { name: "Water flow rate in DHW circuit (l/min)" } # DHW flow
    t_boiler: { name: "Boiler water temperature (°C)" }          # Boiler water temp
    t_exhaust: { name: "Boiler exhaust temperature (°C)" }       # Boiler flue gas temp
    t_dhw_set_ub: { name: "Upper bound for DHW setpoint (°C)" }
    t_dhw_set_lb: { name: "Lower bound for DHW setpoint (°C)" }
    max_t_set_ub: { name: "Upper bound for max CH setpoint (°C)" }
    max_t_set_lb: { name: "Lower bound for max CH setpoint (°C)" }
    t_dhw_set: { name: "DHW temperature setpoint (°C)" }
    max_t_set: { name: "Max CH water setpoint (°C)" }

# Binary sensors from OpenTherm protocol
binary_sensor:
  - platform: opentherm
    ch_active: { name: "Boiler Central Heating active" }     # CH mode active
    dhw_active: { name: "Boiler Domestic Hot Water active" } # DHW mode active
    flame_on: { name: "Boiler Flame on" }                    # Flame is on
    fault_indication:
      name: "Boiler Fault indication"                        # Boiler fault status
      entity_category: diagnostic
    diagnostic_indication:
      name: "Boiler Diagnostic event"                        # Diagnostic event
      entity_category: diagnostic

  # GPIO button (hardware input on GPIO35)
  - platform: gpio
    name: "Button #1"
    id: button_1
    pin: GPIO35

# Number entity for writing setpoints to the boiler
number:
  - platform: opentherm
    t_set:
      id: t_set
      min_value: 20        # Min boiler setpoint
      max_value: 65        # Max boiler setpoint
      name: "Boiler Control setpoint"

# Relay and OpenTherm-based switches
switch:
  - platform: gpio
    pin: GPIO32            # Relay control pin
    name: "RELAY"

  - platform: opentherm
    ch_enable:
      name: "Boiler Central Heating enabled"
      restore_mode: RESTORE_DEFAULT_ON  # Retains state after restart

# Optional 1-Wire setup (commented out)
# one_wire:
#   - platform: gpio
#     pin: GPIO04
#     id: hub_1
#   - platform: gpio
#     pin: GPIO02
#     id: hub_2

# Optional Dallas temperature sensors (commented out)
# sensor:
#   - platform: dallas_temp
#     one_wire_id: hub_1
#     address: 0x6f7c86e908646128
#     name: "1-WIRE Dallas temperature BUS1"
#     update_interval: 60s
#   - platform: dallas_temp
#     one_wire_id: hub_2
#     address: 0xbc3c01d075cb5128
#     name: "1-WIRE Dallas temperature BUS2"
#     update_interval: 60s

# Status LED for visual indicator of device status
status_led:
  pin:
     number: GPIO33        # Status LED pin
     inverted: true        # LED is active LOW
```
