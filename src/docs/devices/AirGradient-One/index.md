---
title: AirGradient-One
date-published: 2023-12-25
type: sensor
standard: us
board: esp32
---

The AirGradient ONE monitor measures PM, CO2, TVOC, NOx, temperature and relative humidity from [AirGradient](https://www.airgradient.com/open-airgradient/instructions/one-v9/).

If you have multiple of these devices, you will likely need to make each sensor name unique across the boards
(e.g. "AirGradient Temperature 1"), so there aren't naming conflicts.

## Basic Configuration

```yaml
# AirGradient ONE - Board v9
# https://www.airgradient.com/open-airgradient/instructions/overview/
#
# This configuration was blatantly yoinked from:
# https://github.com/MallocArray/airgradient_esphome/blob/main/airgradient-one.yaml

# Needs ESPHome 2023.7.0 or later

# Reference for substitutions: https://github.com/ajfriesen/ESPHome-AirGradient/blob/main/air-gradient-pro-diy.yaml
substitutions:
  devicename: !secret name
  ag_esphome_config_version: 0.1.0
  led_strip_brightness: "25%"

esphome:
  name: "${devicename}"

esp32:
  board: esp32-c3-devkitm-1

# Disable logging
# https://esphome.io/components/logger.html
logger:
  baud_rate: 0  # Must disable serial logging as ESP32-C3 only has 2 hardware UART and both are in use
    
# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enable Home Assistant API
api:

# Enable the captive portal
captive_portal:

web_server:
  port: 9926
  version: 1

# Create a switch for safe_mode in order to flash the device
# Solution from this thread:
# https://community.home-assistant.io/t/esphome-flashing-over-wifi-does-not-work/357352/1
switch:
  - platform: safe_mode
    name: "Flash Mode (Safe Mode)"
    icon: "mdi:cellphone-arrow-down"
  - platform: template
    name: "Display Temperature in °F"
    icon: "mdi:thermometer"
    id: display_in_f
    restore_mode: RESTORE_DEFAULT_ON
    optimistic: True


uart:
  # https://esphome.io/components/uart.html#uart
  - rx_pin: GPIO0  # Pin 12
    tx_pin: GPIO1  # Pin 13
    baud_rate: 9600
    id: senseair_s8_uart

  - rx_pin: GPIO20  # Pin 30 or RX
    tx_pin: GPIO21  # Pin 31, or TX
    baud_rate: 9600
    id: pms5003_uart

i2c:
  # https://esphome.io/components/i2c.html
  sda: GPIO7
  scl: GPIO6
  frequency: 400kHz  # 400kHz eliminates warnings about components taking a long time other than SGP40 component: https://github.com/esphome/issues/issues/4717

sensor:
  - platform: pmsx003
    # PMS5003 https://esphome.io/components/sensor/pmsx003.html
    type: PMSX003
    uart_id: pms5003_uart
    pm_2_5:
      name: "PM 2.5"
      id: pm_2_5
      on_value:
        lambda: |-
          // https://en.wikipedia.org/wiki/Air_quality_index#Computing_the_AQI
          // Borrowed from https://github.com/kylemanna/sniffer/blob/master/esphome/sniffer_common.yaml
          if (id(pm_2_5).state <= 12.0) {
            // good
            id(pm_2_5_aqi).publish_state((50.0 - 0.0) / (12.0 - 0.0) * (id(pm_2_5).state - 0.0) + 0.0);
          } else if (id(pm_2_5).state <= 35.4) {
            // moderate
            id(pm_2_5_aqi).publish_state((100.0 - 51.0) / (35.4 - 12.1) * (id(pm_2_5).state - 12.1) + 51.0);
          } else if (id(pm_2_5).state <= 55.4) {
            // usg
            id(pm_2_5_aqi).publish_state((150.0 - 101.0) / (55.4 - 35.5) * (id(pm_2_5).state - 35.5) + 101.0);
          } else if (id(pm_2_5).state <= 150.4) {
            // unhealthy
            id(pm_2_5_aqi).publish_state((200.0 - 151.0) / (150.4 - 55.5) * (id(pm_2_5).state - 55.5) + 151.0);
          } else if (id(pm_2_5).state <= 250.4) {
            // very unhealthy
            id(pm_2_5_aqi).publish_state((300.0 - 201.0) / (250.4 - 150.5) * (id(pm_2_5).state - 150.5) + 201.0);
          } else if (id(pm_2_5).state <= 350.4) {
            // hazardous
            id(pm_2_5_aqi).publish_state((400.0 - 301.0) / (350.4 - 250.5) * (id(pm_2_5).state - 250.5) + 301.0);
          } else if (id(pm_2_5).state <= 500.4) {
            // hazardous 2
            id(pm_2_5_aqi).publish_state((500.0 - 401.0) / (500.4 - 350.5) * (id(pm_2_5).state - 350.5) + 401.0);
          } else {
            id(pm_2_5_aqi).publish_state(500);
          }
    pm_1_0:
      name: "PM 1.0"
      id: pm_1_0
    pm_10_0:
      name: "PM 10.0"
      id: pm_10_0
    pm_0_3um:
      name: "PM 0.3"
      id: pm_0_3um
    update_interval: 2min

  - platform: template
    name: "PM 2.5 AQI"
    unit_of_measurement: "AQI"
    icon: "mdi:air-filter"
    accuracy_decimals: 0
    id: pm_2_5_aqi

  - platform: senseair
    # SenseAir S8 https://esphome.io/components/sensor/senseair.html
    # https://senseair.com/products/size-counts/s8-lp/
    co2:
      name: "SenseAir S8 CO2"
      id: co2
      filters:
        - skip_initial: 2
        - clamp:
            min_value: 400  # 419 as of 2023-06 https://gml.noaa.gov/ccgg/trends/global.html
      on_value:
        - if:
            condition:
                lambda: 'return id(co2).state < 800;'
            then:
              - light.turn_on:
                  id: led_strip
                  brightness: "${led_strip_brightness}"
                  red: 0%
                  green: 100%
                  blue: 0%
        - if:
            condition:
                lambda: 'return id(co2).state >= 800 && id(co2).state < 1000;'
            then:
              - light.turn_on:
                  id: led_strip
                  brightness: "${led_strip_brightness}"
                  red: 100%
                  green: 100%
                  blue: 0%
        - if:
            condition:
                lambda: 'return id(co2).state >= 1000 && id(co2).state < 1500;'
            then:
              - light.turn_on:
                  id: led_strip
                  brightness: "${led_strip_brightness}"
                  red: 100%
                  green: 50%
                  blue: 0%
        - if:
            condition:
                lambda: 'return id(co2).state >= 1500 && id(co2).state < 2000;'
            then:
              - light.turn_on:
                  id: led_strip
                  brightness: "${led_strip_brightness}"
                  red: 100%
                  green: 0%
                  blue: 0%
        - if:
            condition:
                lambda: 'return id(co2).state >= 2000 && id(co2).state < 3000;'
            then:
              - light.turn_on:
                  id: led_strip
                  brightness: "${led_strip_brightness}"
                  red: 60%
                  green: 0%
                  blue: 60%
        - if:
            condition:
                lambda: 'return id(co2).state >= 3000 && id(co2).state < 10000;'
            then:
              - light.turn_on:
                  id: led_strip
                  brightness: "${led_strip_brightness}"
                  red: 40%
                  green: 0%
                  blue: 0%
    id: senseair_s8
    uart_id: senseair_s8_uart


  - platform: sht4x
    # SHT40 https://esphome.io/components/sensor/sht4x.html
    temperature:
      name: "Temperature"
      id: temp
    humidity:
      name: "Humidity"
      id: humidity
    address: 0x44

  - platform: wifi_signal
    name: "WiFi Signal"
    id: wifi_dbm
    update_interval: 60s

  - platform: uptime
    name: "Uptime"
    id: device_uptime
    update_interval: 10s

  - platform: sgp4x
    # SGP41 https://esphome.io/components/sensor/sgp4x.html
    voc:
      name: "VOC Index"
      id: voc
    nox:
      name: "NOx Index"
      id: nox
    compensation:  # Remove this block if no temp/humidity sensor present for compensation
      temperature_source: temp
      humidity_source: humidity


font:
    # Font to use on the display
    # Open Source font Liberation Sans by Red Hat
    # https://www.dafont.com/liberation-sans.font
  # - file: "./fonts/liberation_sans/LiberationSans-Regular.ttf"
  - file:
      type: gfonts
      family: Poppins
      weight: light
    id: poppins_light
    size: 14
    glyphs: '!"%()+=,-_.:°0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz/µ³'
  - file:
      type: gfonts
      family: Poppins
      weight: light
    id: poppins_light_12
    size: 12
    glyphs: '!"%()+=,-_.:°0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz/µ³'
  - file: "gfonts://Ubuntu Mono"
    id: ubuntu
    size: 22
    glyphs: '!"%()+=,-_.:°0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz/µ³'

display:
  # https://esphome.io/components/display/ssd1306.html
  # Formatting reference: https://www.tutorialspoint.com/c_standard_library/c_function_printf.htm
  - platform: ssd1306_i2c
    model: "SH1106 128x64"
    id: oled_display
    address: 0x3C
    # rotation: 180°
    pages:
      - id: summary1
        lambda: |-
          it.printf(0, 0, id(poppins_light), "CO2:");
          it.printf(128, 0, id(poppins_light), TextAlign::TOP_RIGHT, "%.0f ppm", id(co2).state);
          it.printf(0, 16, id(poppins_light), "PM2.5:");
          it.printf(128, 16, id(poppins_light), TextAlign::TOP_RIGHT, "%.0f µg/m³", id(pm_2_5).state);
          it.printf(0, 32, id(poppins_light), "Temp:");
          if (id(display_in_f).state) {
            it.printf(128, 32, id(poppins_light), TextAlign::TOP_RIGHT, "%.1f°F", id(temp).state*9/5+32);
          } else {
            it.printf(128, 32, id(poppins_light), TextAlign::TOP_RIGHT, "%.1f°C", id(temp).state);
          }
          it.printf(0, 48, id(poppins_light), "Humidity:");
          it.printf(128, 48, id(poppins_light), TextAlign::TOP_RIGHT, "%.1f%%", id(humidity).state);
      - id: summary2
        lambda: |-
          it.printf(0, 0, id(poppins_light), "CO2:");
          it.printf(128, 0, id(poppins_light), TextAlign::TOP_RIGHT, "%.0f ppm", id(co2).state);
          it.printf(0, 16, id(poppins_light), "PM2.5:");
          it.printf(128, 16, id(poppins_light), TextAlign::TOP_RIGHT, "%.0f µg/m³", id(pm_2_5).state);
          it.printf(0, 32, id(poppins_light), "VOC:");
          it.printf(128, 32, id(poppins_light), TextAlign::TOP_RIGHT, "%.0f", id(voc).state);
          it.printf(0, 48, id(poppins_light), "NOx:");
          it.printf(128, 48, id(poppins_light), TextAlign::TOP_RIGHT, "%.0f", id(nox).state);
      - id: boot
        lambda: |-
          it.printf(0, 0, id(poppins_light), "ID:");
          it.printf(128, 0, id(poppins_light), TextAlign::TOP_RIGHT, "%s", get_mac_address().c_str());
          it.printf(0, 21, id(poppins_light), "Config Ver: $ag_esphome_config_version");
          it.printf(0, 42, id(poppins_light), "$devicename");

    on_page_change:
      to: boot
      then:
        - if:
            # Skip the boot page after initial boot
            condition:
                lambda: 'return id(device_uptime).state > 30;'
            then:
              - display.page.show_next: oled_display
              - component.update: oled_display

button:
  # https://github.com/esphome/issues/issues/2444
  - platform: template
    name: SenseAir S8 Calibration
    id: senseair_s8_calibrate_button
    on_press:
      then:
        - senseair.background_calibration: senseair_s8
        - delay: 70s
        - senseair.background_calibration_result: senseair_s8
  - platform: template
    name: SenseAir S8 Enable Automatic Calibration
    id: senseair_s8_enable_calibrate_button
    on_press:
      then:
        - senseair.abc_enable: senseair_s8
  - platform: template
    name: SenseAir S8 Disable Automatic Calibration
    id: senseair_s8_disable_calibrate_button
    on_press:
      then:
        - senseair.abc_disable: senseair_s8

output:
  - platform: gpio
    # Watchdog to reboot if no activity
    id: watchdog
    pin: GPIO2

light:
  # https://esphome.io/components/light/esp32_rmt_led_strip.html
  - platform: esp32_rmt_led_strip
    color_correct: [50%,50%,50%]
    rgb_order: GRB
    pin: GPIO10  # Pin 16
    num_leds: 11
    rmt_channel: 0
    chipset: ws2812
    name: "LED Strip"
    id: led_strip


interval:
  - interval: 30s
    # Notify watchdog device is still alive
    then:
      - output.turn_on: watchdog
      - delay: 20ms
      - output.turn_off: watchdog

  - interval: 5s
    # Automatically switch to the next page every five seconds
    then:
      - if:
          # Show boot screen for first 10 seconds with serial number and config version
          condition:
              lambda: 'return id(device_uptime).state < 10;'
          then:
            - display.page.show: boot
            - lambda: id(device_uptime).set_update_interval(1);
          else:
            # Change page on display
            - display.page.show_next: oled_display
            - component.update: oled_display
```
