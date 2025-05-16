---
title: KinCony-B16 (ESP32-S3 16CH Mosfet board)
date-published: 2025-05-15
type: relay
standard: global
board: esp32
---

![Product](B16_diagram-1.jpg "Product Image")
![Product](B16_diagram-2.jpg "Product Image")

## Resources

- [ESP32 pin define details](https://www.kincony.com/forum/showthread.php?tid=7673)
- [YouTube video tour](https://youtu.be/nN9BOcp5fiI)

## ESPHome Configuration

Here is an example YAML configuration for the KinCony-B16 board with Tuya integration.

```yaml
esphome:
  name: b16
  friendly_name: b16
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
# logger:
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

  - id: 'pcf8574_hub_in_1'  # for input channel 1-16
    i2c_id: bus_a
    address: 0x24
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
  product_id: byxtsco8rwt4x8km
  uart_id: tuya_mcu_uart
  wifi_reset_pin: 28
  wifi_led_pin: 16

switch:
  - platform: uart
    uart_id: uart_1
    name: "RS485 Button"
    data: [0x11, 0x22, 0x33, 0x44, 0x55]

  - platform: gpio
    name: "b16-output01"
    id: "b16_output01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 0
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output1-tuya
    dp_id: 1
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output01"

  - platform: gpio
    name: "b16-output02"
    id: "b16_output02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 1
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output2-tuya
    dp_id: 2
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output02"

  - platform: gpio
    name: "b16-output03"
    id: "b16_output03"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 2
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output3-tuya
    dp_id: 3
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output03"

  - platform: gpio
    name: "b16-output04"
    id: "b16_output04"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 3
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output4-tuya
    dp_id: 4
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output04"

  - platform: gpio
    name: "b16-output05"
    id: "b16_output05"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 4
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output5-tuya
    dp_id: 5
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output05"

  - platform: gpio
    name: "b16-output06"
    id: "b16_output06"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 5
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output6-tuya
    dp_id: 6
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output06"

  - platform: gpio
    name: "b16-output07"
    id: "b16_output07"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 6
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output7-tuya
    dp_id: 101
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output07"

  - platform: gpio
    name: "b16-output08"
    id: "b16_output08"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 7
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output8-tuya
    dp_id: 102
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output08"

  - platform: gpio
    name: "b16-output09"
    id: "b16_output09"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 8
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output9-tuya
    dp_id: 103
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output09"

  - platform: gpio
    name: "b16-output10"
    id: "b16_output10"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 9
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output10-tuya
    dp_id: 104
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output10"

  - platform: gpio
    name: "b16-output11"
    id: "b16_output11"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 10
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output11-tuya
    dp_id: 105
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output11"

  - platform: gpio
    name: "b16-output12"
    id: "b16_output12"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 11
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output12-tuya
    dp_id: 106
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output12"

  - platform: gpio
    name: "b16-output13"
    id: "b16_output13"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 12
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output13-tuya
    dp_id: 107
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output13"

  - platform: gpio
    name: "b16-output14"
    id: "b16_output14"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 13
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output14-tuya
    dp_id: 108
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output14"

  - platform: gpio
    name: "b16-output15"
    id: "b16_output15"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 14
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output15-tuya
    dp_id: 109
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output15"

  - platform: gpio
    name: "b16-output16"
    id: "b16_output16"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 15
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-output16-tuya
    dp_id: 110
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b16_output16"

binary_sensor:
  - platform: gpio
    name: "b16-input01"
    id: "b16_input01"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 0
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input1-tuya
    dp_id: 111
    bind_binary_sensor_id: b16_input01
    internal: true

  - platform: gpio
    name: "b16-input02"
    id: "b16_input02"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 1
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input2-tuya
    dp_id: 112
    bind_binary_sensor_id: b16_input02
    internal: true

  - platform: gpio
    name: "b16-input03"
    id: "b16_input03"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 2
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input3-tuya
    dp_id: 113
    bind_binary_sensor_id: b16_input03
    internal: true

  - platform: gpio
    name: "b16-input04"
    id: "b16_input04"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 3
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input4-tuya
    dp_id: 114
    bind_binary_sensor_id: b16_input04
    internal: true

  - platform: gpio
    name: "b16-input05"
    id: "b16_input05"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 4
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input5-tuya
    dp_id: 115
    bind_binary_sensor_id: b16_input05
    internal: true

  - platform: gpio
    name: "b16-input06"
    id: "b16_input06"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 5
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input6-tuya
    dp_id: 116
    bind_binary_sensor_id: b16_input06
    internal: true

  - platform: gpio
    name: "b16-input07"
    id: "b16_input07"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 6
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input7-tuya
    dp_id: 117
    bind_binary_sensor_id: b16_input07
    internal: true

  - platform: gpio
    name: "b16-input08"
    id: "b16_input08"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 7
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input8-tuya
    dp_id: 118
    bind_binary_sensor_id: b16_input08
    internal: true

  - platform: gpio
    name: "b16-input09"
    id: "b16_input09"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 8
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input9-tuya
    dp_id: 119
    bind_binary_sensor_id: b16_input09
    internal: true

  - platform: gpio
    name: "b16-input10"
    id: "b16_input10"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 9
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input10-tuya
    dp_id: 120
    bind_binary_sensor_id: b16_input10
    internal: true

  - platform: gpio
    name: "b16-input11"
    id: "b16_input11"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 10
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input11-tuya
    dp_id: 121
    bind_binary_sensor_id: b16_input11
    internal: true

  - platform: gpio
    name: "b16-input12"
    id: "b16_input12"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 11
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input12-tuya
    dp_id: 122
    bind_binary_sensor_id: b16_input12
    internal: true

  - platform: gpio
    name: "b16-input13"
    id: "b16_input13"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 12
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input13-tuya
    dp_id: 123
    bind_binary_sensor_id: b16_input13
    internal: true

  - platform: gpio
    name: "b16-input14"
    id: "b16_input14"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 13
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input14-tuya
    dp_id: 124
    bind_binary_sensor_id: b16_input14
    internal: true

  - platform: gpio
    name: "b16-input15"
    id: "b16_input15"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 14
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input15-tuya
    dp_id: 125
    bind_binary_sensor_id: b16_input15
    internal: true

  - platform: gpio
    name: "b16-input16"
    id: "b16_input16"
    pin:
      pcf8574: pcf8574_hub_in_1
      number: 15
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b16-input16-tuya
    dp_id: 126
    bind_binary_sensor_id: b16_input16
    internal: true

##pull-up resistance on PCB
  - platform: gpio
    name: "b16-W1-io48"
    pin:
      number: 48
      inverted: true

  - platform: gpio
    name: "b16-W1-io47"
    pin:
      number: 47
      inverted: true

  - platform: gpio
    name: "b16-W1-io40"
    pin:
      number: 40
      inverted: true

  - platform: gpio
    name: "b16-W1-io7"
    pin:
      number: 7
      inverted: true
## without resistance on PCB
  - platform: gpio
    name: "b16-io13"
    pin:
      number: 13
      inverted: false

  - platform: gpio
    name: "b16-io14"
    pin:
      number: 14
      inverted:  false

  - platform: gpio
    name: "b16-21"
    pin:
      number: 21
      inverted:  false

  - platform: gpio
    name: "b16-0"
    pin:
      number: 0
      inverted:  false

ads1115:
  - address: 0x48
sensor:
  - platform: ads1115
    multiplexer: 'A0_GND'
    gain: 6.144
    resolution: 16_BITS
    name: "ADS1115 Channel A0-GND"
    update_interval: 5s
  - platform: ads1115
    multiplexer: 'A1_GND'
    gain: 6.144
    name: "ADS1115 Channel A1-GND"
    update_interval: 5s
  - platform: ads1115
    multiplexer: 'A2_GND'
    gain: 6.144
    name: "ADS1115 Channel A2-GND"
    update_interval: 5s
  - platform: ads1115
    multiplexer: 'A3_GND'
    gain: 6.144
    name: "ADS1115 Channel A3-GND"
    update_interval: 5s

web_server:
  port: 80

font:
  - file: "gfonts://Roboto"
    id: roboto
    size: 20

display:
  - platform: ssd1306_i2c
    i2c_id: bus_a
    model: "SSD1306 128x64"
    address: 0x3C
    lambda: |-
      it.printf(0, 0, id(roboto), "KinCony B16");
