---
title: KinCony-TA (ESP32 Smart Tiny Alarm System)
date-published: 2025-05-15
type: sensor
standard: global
board: esp32
---

![Product](TA1.jpg "Product Image")
![Product](TA2.jpg "Product Image")
![Product](TA3.jpg "Product Image")

## Resources

- [ESP32 pin define details](https://www.kincony.com/forum/showthread.php?tid=7896)
- [YouTube video tour](https://youtu.be/zdLj-lA1DWY)

## ESPHome Configuration

Here is an example YAML configuration for the KinCony-TA board with Tuya integration.

```yaml
esphome:
  name: ta
  friendly_name: TA
  platformio_options:
    board_build.extra_flags:
      # WIFI_CONTROL_SELF_MODE = 0
      # WIFI_CONTROL_SELF_MODE = 1
      - "-DWIFI_CONTROL_SELF_MODE=1"
esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: arduino

external_components:
  - source:
      type: git
      url: https://github.com/hzkincony/esphome-tuya-wifi-mcu
      ref: v1.1.0

# Enable logging
#logger:
#  level: DEBUG
#   hardware_uart: USB_SERIAL_JTAG
# Enable Home Assistant API
api:

 ethernet:
   type: W5500
   clk_pin: GPIO1
   mosi_pin: GPIO2
   miso_pin: GPIO41
   cs_pin: GPIO42
   interrupt_pin: GPIO43
   reset_pin: GPIO44

i2c:
   - id: bus_a
     sda: 8
     scl: 18
     scan: true
     frequency: 400kHz

pcf8574:
  - id: 'pcf8574_hub_out_1'  # for output channel 1-16
    i2c_id: bus_a
    address: 0x22
    pcf8575: true

uart:
  - id: uart_1    #RS485
    baud_rate: 9600
    debug:
      direction: BOTH
      dummy_receiver: true
      after:
        timeout: 10ms
    tx_pin: 39
    rx_pin: 38

  - id: tuya_mcu_uart
    tx_pin: GPIO16
    rx_pin: GPIO17
    baud_rate: 9600

tuya_wifi_mcu:
  # tuya mcu product id
  product_id: asowcylz7am5cbtp
  uart_id: tuya_mcu_uart
  wifi_reset_pin: 28
  wifi_led_pin: 16

switch:
  - platform: uart
    uart_id: uart_1
    name: "RS485 Button"
    data: [0x11, 0x22, 0x33, 0x44, 0x55]

  - platform: gpio
    name: "ta-output01"
    id: "ta_output01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 14
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-output1-tuya
    dp_id: 1
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "ta_output01"

  - platform: gpio
    name: "ta-output02"
    id: "ta_output02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 15
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-output2-tuya
    dp_id: 2
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "ta_output02"


binary_sensor:
  - platform: gpio
    name: "ta-input01"
    id: "ta_input01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 0
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input1-tuya
    dp_id: 111
    bind_binary_sensor_id: ta_input01
    internal: true

  - platform: gpio
    name: "ta-input02"
    id: "ta_input02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 1
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input2-tuya
    dp_id: 112
    bind_binary_sensor_id: ta_input02
    internal: true

  - platform: gpio
    name: "ta-input03"
    id: "ta_input03"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 2
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input3-tuya
    dp_id: 113
    bind_binary_sensor_id: ta_input03
    internal: true

  - platform: gpio
    name: "ta-input04"
    id: "ta_input04"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 3
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input4-tuya
    dp_id: 114
    bind_binary_sensor_id: ta_input04
    internal: true

  - platform: gpio
    name: "ta-input05"
    id: "ta_input05"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 4
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input5-tuya
    dp_id: 115
    bind_binary_sensor_id: ta_input05
    internal: true

  - platform: gpio
    name: "ta-input06"
    id: "ta_input06"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 5
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input6-tuya
    dp_id: 116
    bind_binary_sensor_id: ta_input06
    internal: true

  - platform: gpio
    name: "ta-input07"
    id: "ta_input07"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 6
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input7-tuya
    dp_id: 117
    bind_binary_sensor_id: ta_input07
    internal: true

  - platform: gpio
    name: "ta-input08"
    id: "ta_input08"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 7
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input8-tuya
    dp_id: 118
    bind_binary_sensor_id: ta_input08
    internal: true

  - platform: gpio
    name: "ta-input09"
    id: "ta_input09"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 8
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input9-tuya
    dp_id: 119
    bind_binary_sensor_id: ta_input09
    internal: true

  - platform: gpio
    name: "ta-input10"
    id: "ta_input10"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 9
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input10-tuya
    dp_id: 120
    bind_binary_sensor_id: ta_input10
    internal: true

  - platform: gpio
    name: "ta-input11"
    id: "ta_input11"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 10
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input11-tuya
    dp_id: 121
    bind_binary_sensor_id: ta_input11
    internal: true

  - platform: gpio
    name: "ta-input12"
    id: "ta_input12"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 11
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: ta-input12-tuya
    dp_id: 122
    bind_binary_sensor_id: ta_input12
    internal: true


##pull-up resistance on PCB
  - platform: gpio
    name: "ta-io09"
    pin:
      number: 9
      inverted: true

  - platform: gpio
    name: "ta-io11"
    pin:
      number: 11
      inverted: true

  - platform: gpio
    name: "ta-io05"
    pin:
      number: 5
      inverted: true

  - platform: gpio
    name: "ta-io04"
    pin:
      number: 4
      inverted: true

  - platform: gpio
    name: "ta-io07"
    pin:
      number: 7
      inverted: false

  - platform: gpio
    name: "ta-io06"
    pin:
      number: 6
      inverted:  false

  - platform: gpio
    name: "ta-io13"
    pin:
      number: 13
      inverted:  false

  - platform: gpio
    name: "ta-io40"
    pin:
      number: 40
      inverted:  false

  - platform: gpio
    name: "ta-io14"
    pin:
      number: 14
      inverted:  false

  - platform: gpio
    name: "ta-io48"
    pin:
      number: 48
      inverted:  false

  - platform: gpio
    name: "ta-io21"
    pin:
      number: 21
      inverted:  false

  - platform: gpio
    name: "ta-io47"
    pin:
      number: 47
      inverted:  false

  - platform: gpio
    name: "ta-io0"
    pin:
      number: 0
      inverted:  false

  - platform: gpio
    name: "ta-433M-R"
    pin:
      number: 12
      inverted:  false

web_server:
  port: 80
```
