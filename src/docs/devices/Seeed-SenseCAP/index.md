---
title: Seeed SenseCap Indicator
date-published: 2025-08-01
type: misc
standard: global
board: esp32, RP2040
difficulty: 0
---

![Product Image](seeed-sensecap.png "US Version")

## Drivers

- Processor: ESP32-S3, RP2040
- Touchscreen: ft5x06`
- Display: ST7701S

[Seeed Link](https://www.seeedstudio.com/SenseCAP-Indicator-D1-p-5643.html)

## GPIO Pinout

### SPI (used for display)

| Pin                                       | Function |
| ----------------------------------------- | -------- |
| GPIO41                                    | clock    |
| GPIO48                                    | mosi     |
| GPIO4                                     | cs       |
| GPIO18                                    | de       |
| GPIO5                                     | reset    |
| GPIO16                                    | hsync    |
| GPIO17                                    | vsync    |
| GPIO21                                    | pclk     |
| GPIO4, GPIO3, GPIO2, GPIO1, GPIO0         | red      |
| GPIO10, GPIO9, GPIO8, GPIO7, GPIO6, GPIO5 | green    |
| GPIO15, GPIO14, GPIO13, GPIO12, GPIO11    | green    |

### I²C (used for touchscreen)

| Pin    | Function |
| ------ | -------- |
| GPIO39 | i2c SDA  |
| GPIO40 | i2c SCL  |

### Backlight

| Pin    | Function  |
| ------ | --------- |
| GPIO45 | backlight |

### Top Button
| Pin    | Function  |
| ------ | --------- |
| GPIO38 | Button    |

## Hardware Configuration

```yaml
# Basic Config
esp32:
  board: esp32-s3-devkitc-1
  variant: esp32s3
  flash_size: 8MB
  framework:
    type: esp-idf
    sdkconfig_options:
      CONFIG_ESPTOOLPY_FLASHSIZE_8MB: y
      CONFIG_ESP32S3_DEFAULT_CPU_FREQ_240: y
      CONFIG_ESP32S3_DATA_CACHE_64KB: y
      CONFIG_SPIRAM_FETCH_INSTRUCTIONS: y
      CONFIG_SPIRAM_RODATA: y

psram:
  mode: octal
  speed: 80MHz

output:
  - platform: ledc
    pin:
      number: GPIO45
      ignore_strapping_warning: true
    id: ledc_gpio45
    frequency: 100Hz

i2c:
  - id: bus_a
    sda: GPIO39
    scl: GPIO40
    scan: false

spi:
  - id: lcd_spi
    clk_pin: GPIO41
    mosi_pin: GPIO48

pca9554:
  - id: pca9554a_device
    address: 0x20
    pin_count: 16

display:
  - platform: st7701s
    id: sensecap_display
    auto_clear_enabled: false
    data_rate: 4MHz
    update_interval: never
    spi_mode: MODE3
    color_order: RGB
    dimensions:
      width: 480
      height: 480
    invert_colors: true
    transform:
      mirror_x: true
      mirror_y: true
    cs_pin:
      pca9554: pca9554a_device
      number: 4
    reset_pin:
      pca9554: pca9554a_device
      number: 5
    de_pin: GPIO18
    hsync_pin: GPIO16
    vsync_pin: GPIO17
    pclk_pin: GPIO21
    init_sequence:
      - 1 # select canned init sequence number 1
      - delay 5ms
      - [0xE0, 0x1F] # Set sunlight readable enhancement
    data_pins:
      red:
        - GPIO4 #r1
        - GPIO3 #r2
        - GPIO2 #r3
        - GPIO1 #r4
        - GPIO0 #r5
      green:
        - GPIO10 #g0
        - GPIO9 #g1
        - GPIO8 #g2
        - GPIO7 #g3
        - GPIO6 #g4
        - GPIO5 #g5
      blue:
        - GPIO15 #b1
        - GPIO14 #b2
        - GPIO13 #b3
        - GPIO12 #b4
        - GPIO11 #b5

light:
  - platform: monochromatic
    name: "Backlight"
    id: backlight
    output: ledc_gpio45
    restore_mode: ALWAYS_ON

touchscreen:
  platform: ft5x06
  id: sensecap_touchscreen
  transform:
    mirror_x: true
    mirror_y: true
  on_release:
    - if:
        condition: lvgl.is_paused
        then:
          - lvgl.resume:
          - lvgl.widget.redraw:
          - light.turn_on: backlight
```

## Example Configuration

```yaml
# Basic Config
esphome:
  name: seeed-sensecap
  friendly_name: Seeed SenseCAP

<hardware configation from above>

image:
  - file: https://esphome.io/favicon-512x512.png
    id: boot_logo
    resize: 200x200
    type: RGB565
    transparency: alpha_channel

lvgl:
  on_idle:
    timeout: !lambda "return 10000;"
    then:
      - light.turn_off: backlight
      - lvgl.pause:

  top_layer:
    widgets:
      - obj:
          id: boot_screen
          x: 0
          y: 0
          width: 100%
          height: 100%
          bg_color: 0xffffff
          bg_opa: COVER
          radius: 0
          pad_all: 0
          border_width: 0
          widgets:
            - image:
                align: CENTER
                src: boot_logo
                y: -40
            - spinner:
                align: CENTER
                y: 95
                height: 50
                width: 50
                spin_time: 1s
                arc_length: 60deg
                arc_width: 8
                indicator:
                  arc_color: 0x18bcf2
                  arc_width: 8
```

## Using CO2 and TVOC Sensors (D1S, D1Pro only)
The air quality sensors in the D1S and D1Pro are unfortunately connected to the RP2040. These can be accessed, however, by flashing ESPHome to the RP2040 as well and using the Packet Transport feature. 

This config exposes the data from the CO2 and TVOC sensors:
```yaml
esphome:
  name: d1-rp2040
  friendly_name: d1-rp2040

rp2040:
  board: rpipico

# Enable logging
logger:

uart:
  - id: esp32s3_serial
    tx_pin: GPIO17
    rx_pin: GPIO16
    baud_rate: 115200

i2c:
  - sda: GPIO20
    scl: GPIO21

sensor:
  - platform: sgp4x
    voc:
      id: voc
      name: "VOC Index"
  - platform: scd4x
    co2:
      id: co2
      name: "CO2"
    temperature:
      id: temp
      name: "Temperature"
    humidity:
      id: humid
      name: "Humidity"

power_supply:
  - id: 'sensor_supply1'
    pin: GPIO18
    enable_on_boot: True

packet_transport:
  - platform: uart
    uart_id: esp32s3_serial
    sensors: 
      - id: voc
      - id: co2
      - id: temp
      - id: humid
```

To flash the RP2040, press the pinhole button on the bottom of the Indicator whilst plugging in a USB cable to reveal the RPI-BOOT drive.

The configuration running on the ESP32-S3 should then also be updated to retrieve data from the RP2040:

> **NOTE:** This configuration includes the temperature and humidity values from the SCD41 sensor for completeness; however, the accuracy of these values is compromised as it is placed directly next to the heat-generating SGP40 inside the Indicator and probably should not be used. This could be fixed by only switching on the sensors intermittently (since IO18 on the RP2040 controls power to the sensors), but this hasn't been tried. 

```yaml
uart:
  - id: rp2040_serial
    tx_pin: GPIO20
    rx_pin: GPIO19
    baud_rate: 115200

packet_transport:
  - platform: uart
    uart_id: rp2040_serial
    providers:
      - name: d1-rp2040    
sensor:
  - platform: packet_transport
    provider: d1-rp2040
    id: voc
    name: VOC Index
    internal: False
    accuracy_decimals: 0
    icon: "mdi:weather-dust"
    device_class: aqi
  - platform: packet_transport
    provider: d1-rp2040
    id: co2
    name: CO2
    internal: False
    accuracy_decimals: 0
    icon: "mdi:molecule-co2"
    unit_of_measurement: "ppm"
    device_class: volatile_organic_compounds_parts
  - platform: packet_transport
    provider: d1-rp2040
    id: temp
    name: Temperature
    internal: False
    accuracy_decimals: 1
    icon: "mdi:thermometer"
    unit_of_measurement: "°C"
    device_class: temperature
  - platform: packet_transport
    provider: d1-rp2040
    id: humid
    name: Humidity
    internal: False
    accuracy_decimals: 1
    icon: "mdi:water-percent"
    unit_of_measurement: "%"
    device_class: humidity
```
