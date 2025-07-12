---
title: KinCony KC868-A8v3 (ESP32-S3 Relay)
date-published: 2025-07-01
type: relay
standard: global
board: esp32
---

![Product](A8v3-3.jpg "Product Image")
![Product](A8v3_diagram-1.jpg "Product Image")
![Product](A8v3_diagram-2.jpg "Product Image")

## Resources

- [ESP32 pin define details](https://www.kincony.com/forum/showthread.php?tid=7970)
- [YouTube video tour](https://youtu.be/aM0hhjnLKbM)

## ESPHome Configuration

Here is an example YAML configuration for the KinCony KC868-A8v3 relay board.

```yaml
esphome:
  name: a8v3
  friendly_name: a8v3
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

api:

ota:
  platform: esphome

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
  - id: 'pcf8574_hub_out_1'  # for output channel 0-7| input channel 8-15
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
  product_id: qlvsreramxcldwek
  uart_id: tuya_mcu_uart
  wifi_reset_pin: 28
  wifi_led_pin: 16

switch:
  - platform: uart
    uart_id: uart_1
    name: "RS485 Button"
    data: [0x11, 0x22, 0x33, 0x44, 0x55]

  - platform: gpio
    name: "a8v3-output01"
    id: "a8v3_output01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 0
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output1-tuya
    dp_id: 1
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output01"

  - platform: gpio
    name: "a8v3-output02"
    id: "a8v3_output02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 1
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output2-tuya
    dp_id: 2
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output02"

  - platform: gpio
    name: "a8v3-output03"
    id: "a8v3_output03"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 2
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output3-tuya
    dp_id: 3
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output03"

  - platform: gpio
    name: "a8v3-output04"
    id: "a8v3_output04"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 3
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output4-tuya
    dp_id: 4
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output04"

  - platform: gpio
    name: "a8v3-output05"
    id: "a8v3_output05"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 4
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output5-tuya
    dp_id: 5
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output05"

  - platform: gpio
    name: "a8v3-output06"
    id: "a8v3_output06"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 5
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output6-tuya
    dp_id: 6
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output06"

  - platform: gpio
    name: "a8v3-output07"
    id: "a8v3_output07"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 6
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output7-tuya
    dp_id: 101
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output07"

  - platform: gpio
    name: "a8v3-output08"
    id: "a8v3_output08"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 7
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-output8-tuya
    dp_id: 102
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "a8v3_output08"

binary_sensor:
  - platform: gpio
    name: "a8v3-input01"
    id: "a8v3_input01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 8
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input1-tuya
    dp_id: 111
    bind_binary_sensor_id: a8v3_input01
    internal: true

  - platform: gpio
    name: "a8v3-input02"
    id: "a8v3_input02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 9
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input2-tuya
    dp_id: 112
    bind_binary_sensor_id: a8v3_input02
    internal: true

  - platform: gpio
    name: "a8v3-input03"
    id: "a8v3_input03"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 10
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input3-tuya
    dp_id: 113
    bind_binary_sensor_id: a8v3_input03
    internal: true

  - platform: gpio
    name: "a8v3-input04"
    id: "a8v3_input04"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 11
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input4-tuya
    dp_id: 114
    bind_binary_sensor_id: a8v3_input04
    internal: true

  - platform: gpio
    name: "a8v3-input05"
    id: "a8v3_input05"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 12
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input5-tuya
    dp_id: 115
    bind_binary_sensor_id: a8v3_input05
    internal: true

  - platform: gpio
    name: "a8v3-input06"
    id: "a8v3_input06"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 13
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input6-tuya
    dp_id: 116
    bind_binary_sensor_id: a8v3_input06
    internal: true

  - platform: gpio
    name: "a8v3-input07"
    id: "a8v3_input07"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 14
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input7-tuya
    dp_id: 117
    bind_binary_sensor_id: a8v3_input07
    internal: true

  - platform: gpio
    name: "a8v3-input08"
    id: "a8v3_input08"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 15
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: a8v3-input8-tuya
    dp_id: 118
    bind_binary_sensor_id: a8v3_input08
    internal: true

## pull-up resistance on PCB
  - platform: gpio
    name: "a8v3-W1-io13"
    pin:
      number: 13
      inverted: true

  - platform: gpio
    name: "a8v3-W1-io40"
    pin:
      number: 40
      inverted: true

  - platform: gpio
    name: "a8v3-W1-io14"
    pin:
      number: 14
      inverted: true

  - platform: gpio
    name: "a8v3-W1-io48"
    pin:
      number: 48
      inverted: true
## without resistance on PCB
  - platform: gpio
    name: "a8v3-5"
    pin:
      number: 5
      inverted:  false

  - platform: gpio
    name: "a8v3-0"
    pin:
      number: 0
      inverted:  false

sensor:
  - platform: adc
    pin: 7
    name: "A8v3 A1 Voltage"
    update_interval: 5s
    attenuation: 11db
    filters:
      - lambda:
          if (x >= 3.11) {
            return x * 1.60256;
          } else if (x <= 0.15) {
            return 0;
          } else {
            return x * 1.51;
          }
  - platform: adc
    pin: 6
    name: "A8v3 A2 Voltage"
    update_interval: 5s
    attenuation: 11db
    filters:
      # - multiply: 1.51515
      - lambda:
          if (x >= 3.11) {
            return x * 1.60256;
          } else if (x <= 0.15) {
            return 0;
          } else {
            return x * 1.51;
          }

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
      it.printf(0, 0, id(roboto), "KinCony a8v3");
```
