---
title: Droplet smart Irrigation system
date-published: 2024-07-04
type: misc
standard: global
board: esp32
difficulty: 1
project-url: https://github.com/PricelessToolkit/Droplet
---

![Product image](./droplet.jpg "Droplet with 3D Case")
![Product image](./droplet2.jpg "Droplet without cover")

## Product description

The Droplet Smart Irrigation System is a practical solution for efficient water management in gardens and agricultural spaces. It provides precise control over watering schedules, ensuring plants get the right amount of water while conserving resources. Additionally, it can measure soil moisture, air humidity, control lights, and much more.

You can buy an assembled PCB from the official store https://www.pricelesstoolkit.com

# Main Board

| Feature                           | Description                                                       | Notes                                                                                 |
|-----------------------------------|-------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| Micro Pump Outputs                | 5x Micro Pump outputs                                             | 5V each                                                                               |
| Soil Moisture Sensor Inputs       | 5x inputs (ADC-5V-GND)                                            | Data line pulled down with 1M ohm resistor (Data line MAX 3.3V)                       |
| Onboard Temperature Sensor        | DS18B20                                                           | [DS18B20 Documentation](https://esphome.io/components/sensor/dallas.html)             |
| Onboard Buzzer                    | Buzzer port can be freed up with jumper                           | [Buzzer Documentation](https://esphome.io/components/rtttl.html?highlight=buzzer)     |
| Breakout Pins                     | For connecting i2c OLED Display                                   | [OLED Display Documentation](https://esphome.io/components/display/ssd1306.html?highlight=display) |
| Manual Pump Control               | 5x Buttons for manual pump control                                | -                                                                                     |
| Wake-Up/OLED Control Button       | Short press: wake-up OLED, Long press: general purpose            | 2x Binary sensors available for HA                                                    |
| Fuses                             | All pump outputs and moisture sensor inputs have fuses            | -                                                                                     |
| Usable GPIO Pins                  | GPIO 19, 5, 26, 2, 15, 27, 14, 12                                 | -                                                                                     |
| i2c Pins                          | GPIO 21, 22                                                       | 1x i2c                                                                                |
| UART                              | 1x UART                                                           | -                                                                                     |
| External Port for DS18B20         | GPIO 25                                                           | -                                                                                     |

# Expansion Board v3

| Feature                           | Description                                                       | Notes                                                                                 |
|-----------------------------------|-------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| Relay Outputs                     | 1x JST 10-pin connector for 8 relays                              | Uses MCP23017 Expander [MCP23017 Documentation](https://esphome.io/components/mcp230xx.html) |
| i2c Connectors                    | 2x XH 4-pin i2c (V, GPIO 21, GPIO 22, GND)                        | -                                                                                     |
| GPIO Pins                         | 7x XH 3-pin (GPIO 19, 5, 26, 2, 15, 27, 14)                       | -                                                                                     |
| DS18B20 TMP Sensor Connector      | 1x XH 3-pin for DS18B20 TMP Sensors (3.3V, GPIO 25, GND)          | -                                                                                     |
| Buzzer Control                    | 1x 1-pin header GPIO23 connected to buzzer                        | Buzzer port can be freed up by removing jumper JP                                     |

![home assistant entities](./ha.jpg "Ha entities")

## Basic Config

```yaml
substitutions:
  name: droplet

esphome:
  name: ${name}
  name_add_mac_suffix: true
  project:
    name: pricelesstoolkit.droplet
    version: "1.0"
    
  platform: ESP32
  board: esp32dev
  on_boot:
    priority: -100
    then:
      - lambda: id(oled).turn_off();


dashboard_import:
  package_import_url: github://PricelessToolkit/Droplet/Config/ESPHome/droplet.yaml@main
  import_full_config: true


# Enable logging
logger:

ota:
- platform: esphome
  password: "bfec11234xsfea57e1b5d3b985cfe06c"

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: true

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "${name} Fallback Hotspot"
    password: "password"

captive_portal:

one_wire: #https://esphome.io/components/one_wire
  - platform: gpio
    pin: GPIO25

i2c: # i2c Pins
  sda: 21
  scl: 22
  scan: true

mcp23017: # Expansion Board  https://esphome.io/components/mcp230xx.html
  - id: 'mcp23017_hub'
    address: 0x20

font: # Fonts for Display
  - file: 'arial.ttf'
    id: font1
    size: 8
  - file: 'arial.ttf'
    id: font2
    size: 10
  - file: 'arial.ttf'
    id: font3
    size: 14

display: # More info https://esphome.io/components/display/ssd1306.html?highlight=1306         
  - platform: ssd1306_i2c
    id: oled
    model: "SSD1306 128x64"
    address: 0x3C # Oled Display Address
    lambda: |-
      it.printf(2, 0, id(font2), TextAlign::TOP_LEFT, "DROPLET");
      it.printf(61, 0, id(font2) ,"%.1f", id(dbm).state);
      it.line(0, 12, 98, 12);
      it.line(98, 0, 98, 64);
      it.printf(5, 30, id(font3) ,"%.1fH", id(dhthumidity).state);
      it.printf(5, 45, id(font3) ,"%.1fP", id(pressure).state);
      it.printf(102, 0, id(font2) ,"%.1f", id(Soil1).state);
      it.printf(102, 12, id(font2) ,"%.1f", id(Soil2).state);
      it.printf(102, 24, id(font2) ,"%.1f", id(Soil3).state);
      it.printf(102, 36, id(font2) ,"%.1f", id(Soil4).state);
      it.printf(102, 48, id(font2) ,"%.1f", id(Soil5).state);



  # Integrated BUZZER # If you using pin23 for something else, delete this and remove jumper 1

rtttl:
  output: rtttl_out
  on_finished_playback:
    - logger.log: 'Song ended!'

api:
  services:
    - service: play_rtttl
      variables:
        song_str: string
      then:
        - rtttl.play:
            rtttl: !lambda 'return song_str;'
            
            # https://esphome.io/components/rtttl.html
            # In the developer tools. E.g. for calling rtttl.play select the service droplet_play_rtttl and in service data enter    siren:d=8,o=5,b=100:d,e,d,e,d,e,d,e   or  scale_up:d=32,o=5,b=100:c,c#,d#,e,f#,g#,a#,b  


sensor:
  # MOISTUR LEVEL SENSORS #   https://esphome.io/components/sensor/adc.html?highlight=adc
  - platform: adc
    pin: 34
    id: "Soil1"
    name: "${name} SoilM Sens 1"
    icon: "mdi:water-percent"
    update_interval: 2s
    unit_of_measurement: "%"
    attenuation: 11db
    filters:
    - calibrate_linear:
        - 2.520 -> 0.00  # Calibrate Min in dry soil
        - 0.99 -> 100.00 # Calibrate MAX in 100% wet soil 
    - lambda: |
        if (x < 0) return 0; 
        else if (x > 100) return 100;
        else return (x);
    accuracy_decimals: 0

  - platform: adc
    pin: 35
    id: "Soil2"
    name: "${name} SoilM Sens 2"
    icon: "mdi:water-percent"
    update_interval: 2s
    unit_of_measurement: "%"
    attenuation: 11db
    filters:
    - calibrate_linear:
        - 2.520 -> 0.00  # Calibrate Min in dry soil
        - 0.99 -> 100.00 # Calibrate MAX in 100% wet soil 
    - lambda: |
        if (x < 0) return 0; 
        else if (x > 100) return 100;
        else return (x);
    accuracy_decimals: 0

  - platform: adc
    pin: 32
    id: "Soil3"
    name: "${name} SoilM Sens 3"
    icon: "mdi:water-percent"
    update_interval: 2s
    unit_of_measurement: "%"
    attenuation: 11db
    filters:
    - calibrate_linear:
        - 2.520 -> 0.00  # Calibrate Min in dry soil
        - 0.99 -> 100.00 # Calibrate MAX in 100% wet soil 
    - lambda: |
        if (x < 0) return 0;
        else if (x > 100) return 100;
        else return (x);
    accuracy_decimals: 0

  - platform: adc
    pin: 33
    id: "Soil4"
    name: "${name} SoilM Sens 4"
    icon: "mdi:water-percent"
    update_interval: 2s
    unit_of_measurement: "%"
    attenuation: 11db
    filters:
    - calibrate_linear:
        - 2.520 -> 0.00  # Calibrate Min in dry soil
        - 0.99 -> 100.00 # Calibrate MAX in 100% wet soil 
    - lambda: |
        if (x < 0) return 0;
        else if (x > 100) return 100;
        else return (x);
    accuracy_decimals: 0

  - platform: adc
    pin: 39
    id: "Soil5"
    name: "${name} SoilM Sens 5"
    icon: "mdi:water-percent"
    update_interval: 2s
    unit_of_measurement: "%"
    attenuation: 11db
    filters:
    - calibrate_linear:
        - 2.520 -> 0.00  # Calibrate Min in dry soil
        - 0.99 -> 100.00 # Calibrate MAX in 100% wet soil 
    - lambda: |
        if (x < 0) return 0;
        else if (x > 100) return 100;
        else return (x);
    accuracy_decimals: 0

  # HOME ASSISTANT DESIRED MOISTURE LEVELS #  https://esphome.io/components/sensor/homeassistant.html
  - platform: homeassistant
    name: "Desired Moisture level 1"
    id: "desired_mois_value_1"
    internal: true
    entity_id: input_number.moisture_level_for_pump1
    
  - platform: homeassistant
    name: "Desired Moisture level 2"
    id: "desired_mois_value_2"
    internal: true
    entity_id: input_number.moisture_level_for_pump2
    
  - platform: homeassistant
    name: "Desired Moisture level 3"
    id: "desired_mois_value_3"
    internal: true
    entity_id: input_number.moisture_level_for_pump3
    
  - platform: homeassistant
    name: "Desired Moisture level 4"
    id: "desired_mois_value_4"
    internal: true
    entity_id: input_number.moisture_level_for_pump4
    
  - platform: homeassistant
    name: "Desired Moisture level 5"
    id: "desired_mois_value_5"
    internal: true
    entity_id: input_number.moisture_level_for_pump5

  # KEEPS MOISTURE LEVEL # Comment out or delete these 5 sensors "Comparison Sens 1,2,3,4,5" if you want to automate the Soil Moisture level with Home Assistant "Automation".
  - platform: template
    name: "Comparison Sens1"
    internal: true
    update_interval: 2s # Seconds to pump water then stops pumping and starts comparing sensors data, if needed it will pump again
    lambda: |-
      if (id(Soil1).state < id(desired_mois_value_1).state) {
        id(pump1).toggle();
      } else {
        id(pump1).turn_off();
      }
      return {};

  - platform: template
    name: "Comparison Sens2"
    internal: true
    update_interval: 2s # Seconds to pump water then stops pumping and starts comparing sensors data, if needed it will pump again
    lambda: |-
      if (id(Soil2).state < id(desired_mois_value_2).state) {
        id(pump2).toggle();
      } else {
        id(pump2).turn_off();
      }
      return {};

  - platform: template
    name: "Comparison Sens3"
    internal: true
    update_interval: 2s # Seconds to pump water then stops pumping and starts comparing sensors data, if needed it will pump again
    lambda: |-
      if (id(Soil3).state < id(desired_mois_value_3).state) {
        id(pump3).toggle();
      } else {
        id(pump3).turn_off();
      }
      return {};

  - platform: template
    name: "Comparison Sens4"
    internal: true
    update_interval: 2s # Seconds to pump water then stops pumping and starts comparing sensors data, if needed it will pump again
    lambda: |-
      if (id(Soil4).state < id(desired_mois_value_4).state) {
        id(pump4).toggle();
      } else {
        id(pump4).turn_off();
      }
      return {};

  - platform: template
    name: "Comparison Sens5"
    internal: true
    update_interval: 2s # Seconds to pump water then stops pumping and starts comparing sensors data, if needed it will pump again
    lambda: |-
      if (id(Soil5).state < id(desired_mois_value_5).state) {
        id(pump5).toggle();
      } else {
        id(pump5).turn_off();
      }
      return {};

  # DHT TMP and HUMIDITY SENSOR  #  https://esphome.io/components/sensor/dht.html    Delet if not used
  - platform: dht
    pin: 5
    temperature:
      name: "${name} DHT Temperature"
      id: "dhttemperature"
    humidity:
      name: "${name} DHT Humidity"
      id: "dhthumidity"
    update_interval: 5s

  # DISTANCE SENSOR #     # You can measure the height of the plant and plot the growth reight #  https://esphome.io/components/sensor/vl53l0x.html?highlight=vl53l0  Delet if not used
  - platform: vl53l0x
    name: "${name} VL53L0x Distance"
    id: "distance"
    address: 0x29
    update_interval: 2s
    long_range: true

  # BMP280 TMP and HUMIDITY SENSOR #  https://esphome.io/components/sensor/bmp280.html?highlight=bmp280   Delet if not used
  - platform: bmp280
    temperature:
      name: "${name} bmp280 Temperature"
      oversampling: 16x
    pressure:
      name: "${name} bmp280 Pressure"
      id: "pressure"
    address: 0x76
    update_interval: 5s

# https://esphome.io/components/sensor/dallas_temp.html
  #- platform: dallas_temp  
  #  address: 0xcd062180e9a6f228
  #  name: "${name} Integrated TMP"
  #  id: "intergratedtmp"

  # TMP SENSOR "18b20" Change Adress foy your sensor #  External Temperature Sensor. Comment this section, then search your sensor address in a log output https://esphome.io/components/sensor/dallas.html
  #- platform: dallas
  #  address: 0x30062180EFF26828
  #  name: "${name} External TMP"
  #  id: "externaltmp"
    
  # WIFI #
  - platform: wifi_signal
    name: "${name} WiFi Signal Sensor"
    id: "dbm"
    update_interval: 5s
  
  # Uptime sensor #
  - platform: uptime
    name: "${name} Uptime"
    update_interval: 3600s
    

switch:

  # PUMPS GPIOs #  https://esphome.io/components/switch/gpio.html?highlight=switch
  - platform: gpio
    pin: 13
    id: 'pump1'
    name: "${name} Pump 1"
    icon: "mdi:water-pump"
    restore_mode: ALWAYS_OFF

  - platform: gpio
    pin: 4
    id: 'pump2'
    name: "${name} Pump 2"
    icon: "mdi:water-pump"
    restore_mode: ALWAYS_OFF
    
  - platform: gpio
    pin: 16
    id: 'pump3'
    name: "${name} Pump 3"
    icon: "mdi:water-pump"
    restore_mode: ALWAYS_OFF

  - platform: gpio
    pin: 17
    id: 'pump4'
    name: "${name} Pump 4"
    icon: "mdi:water-pump"
    restore_mode: ALWAYS_OFF

  - platform: gpio
    pin: 18
    id: 'pump5'
    name: "${name} Pump 5"
    icon: "mdi:water-pump"
    restore_mode: ALWAYS_OFF

  # MCP230017 FOR EXPANSION BOARD # Uncomment when using expansion board  https://esphome.io/components/mcp230xx.html
  - platform: gpio
    name: "${name} MCP23017 Pin #0"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 0
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #1"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 1
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #2"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 2
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #3"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 3
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #4"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 4
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #5"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 5
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #6"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 6
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #7"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 7
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #8"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 8
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #9"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 9
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #10"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 10
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #11"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 11
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #12"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 12
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #13"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 13
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #14"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 14
      mode:
        output: true
      inverted: true

  - platform: gpio
    name: "${name} MCP23017 Pin #15"
    restore_mode: ALWAYS_OFF
    pin:
      mcp23xxx: mcp23017_hub
      # Use pin number 0
      number: 15
      mode:
        output: true
      inverted: true

  - platform: restart
    name: "${name} Restart"

output:

  # Integrated BUZZER # If you using pin23 for something else, delete this and remove jumper 1  https://esphome.io/components/output/ledc.html?highlight=buzzer
  - platform: ledc
    pin: GPIO23
    id: rtttl_out

binary_sensor:

  # BUTTON SHORT and LONG PRES AVALIABLE IN HOME ASSISTANT #  https://esphome.io/components/binary_sensor/index.html?highlight=binary_sensor
  - platform: gpio
    name: "${name} Button"
    pin:
      number: 36
      # Short press activates OLED for 20s
    on_click:
    - min_length: 10ms
      max_length: 350ms
      then:
      - lambda: id(oled).turn_on();
      - delay: 20s
      - lambda: id(oled).turn_off();
      # Long press Do whatever you want
    - min_length: 500ms
      max_length: 1500ms
      then:
#        - switch.turn_on: relay_1

  # Status (connection) sensor#
  - platform: status
    name: "${name} Status"
```