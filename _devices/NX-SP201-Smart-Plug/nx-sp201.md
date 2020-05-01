---
title: NX-SP201
date-published: 2020-05-01
type: plug
standard: us
---

![alt text](/assets/images/NX-SP201-Smart-Plug/IMG_0642.jpg "Closed Front View")
![alt text](/assets/images/NX-SP201-Smart-Plug/IMG_0643.jpg "Opened Full View")
![alt text](/assets/images/NX-SP201-Smart-Plug/IMG_0644.jpg "Opened Top 8266 Chip")
![alt text](/assets/images/NX-SP201-Smart-Plug/IMG_0645.jpg "Opened Bottom 8266 Chip")

```yaml
substitutions:
  # Higher value gives lower watt readout
  current_res: "0.002452"
  # Lower value gives lower voltage readout
  voltage_div: "814"

# Basic Config
esphome:
  name: nx-sp201
  platform: ESP8266
  board: esp01_1m

# Enter you WIFI credentials
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

# Enable Logging.
logger:

# Enable Home Assistant API.
api:

# Enable over-the-air updates.
ota:

# Enable WEB server for status and updates.
web_server:
  port: 80

captive_portal:

binary_sensor:
  - platform: gpio
    pin:
      number: GPIO14
      inverted: False
    name: "nx-sp201_button1"
    on_press:
        - switch.toggle: "nx-sp201_Relay1"

  - platform: gpio
    pin:
      number: GPIO12
      inverted: False
    name: "nx-sp201_button2"
    on_press:
        - switch.toggle: "nx-sp201_Relay2"

# Status LED for blue light
status_led:
    pin:
      number: GPIO09
      inverted: true

switch:
# Main relays
  - platform: gpio
    name: "nx-sp201_Relay1"
    id: "nx-sp201_Relay1"
    pin: GPIO10

  - platform: gpio
    name: "nx-sp201_Relay2"
    id: "nx-sp201_Relay2"
    pin: GPIO13
  
sensor:
# Energy Monitoring
  - platform: hlw8012
    sel_pin:
      number: GPIO02
      inverted: True
    cf_pin: GPIO04
    cf1_pin: GPIO05
    #current_resistor: ${current_res}
    voltage_divider: ${voltage_div}
    change_mode_every: 3
    update_interval: 3s 
    current:
      name: "nx-sp201_Amperage"
      unit_of_measurement: A
      accuracy_decimals: 3
      filters:
      - calibrate_linear:
          - 0.000 -> 0.0
          - 5.069 -> 6.69   
      # Make everything below 0.01A appear as just 0A.
      # Furthermore it corrects 0.013A for the power usage of the plug.
      - lambda: if (x < (0.01 - 0.013)) return 0; else return (x - 0.013);
    voltage:
      name: "nx-sp201_Voltage"
      unit_of_measurement: V
      accuracy_decimals: 1
    power:
      name: "nx-sp201_Wattage"
      unit_of_measurement: W
      id: "nx-sp201_Wattage"
      accuracy_decimals: 0
```
