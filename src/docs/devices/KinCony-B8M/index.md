---
title: KinCony-B8M (ESP32-S3 8CH MOSFET)
date-published: 2025-07-01
type: relay
standard: global
board: esp32
---

![Product](B8M_1.jpg "Product Image")
![Product](B8M-diagram.jpg "Product Image")

## Resources

- [ESP32 pin define details](https://www.kincony.com/forum/showthread.php?tid=8209)
- [YouTube video tour](https://youtu.be/hFLZZWhzYuA)

## ESPHome Configuration

Here is an example YAML configuration for the KinCony-B8M board with custom sensor integration.

```yaml
esphome:
  name: b8m
  friendly_name: b8m
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
  product_id: mje1l6yi62hlljcn
  uart_id: tuya_mcu_uart
  wifi_reset_pin: 28
  wifi_led_pin: 16

switch:
  - platform: uart
    uart_id: uart_1
    name: "RS485 Button"
    data: [0x11, 0x22, 0x33, 0x44, 0x55]

  - platform: gpio
    name: "b8m-output01"
    id: "b8m_output01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 0
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output1-tuya
    dp_id: 1
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output01"

  - platform: gpio
    name: "b8m-output02"
    id: "b8m_output02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 1
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output2-tuya
    dp_id: 2
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output02"

  - platform: gpio
    name: "b8m-output03"
    id: "b8m_output03"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 2
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output3-tuya
    dp_id: 3
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output03"

  - platform: gpio
    name: "b8m-output04"
    id: "b8m_output04"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 3
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output4-tuya
    dp_id: 4
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output04"

  - platform: gpio
    name: "b8m-output05"
    id: "b8m_output05"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 4
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output5-tuya
    dp_id: 5
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output05"

  - platform: gpio
    name: "b8m-output06"
    id: "b8m_output06"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 5
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output6-tuya
    dp_id: 6
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output06"

  - platform: gpio
    name: "b8m-output07"
    id: "b8m_output07"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 6
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output7-tuya
    dp_id: 101
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output07"

  - platform: gpio
    name: "b8m-output08"
    id: "b8m_output08"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 7
      mode: OUTPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-output8-tuya
    dp_id: 102
    # hide from homeassistant ui
    internal: true
    # bind other switch, sync state
    bind_switch_id: "b8m_output08"

binary_sensor:
  - platform: gpio
    name: "b8m-input01"
    id: "b8m_input01"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 8
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input1-tuya
    dp_id: 111
    bind_binary_sensor_id: b8m_input01
    internal: true

  - platform: gpio
    name: "b8m-input02"
    id: "b8m_input02"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 9
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input2-tuya
    dp_id: 112
    bind_binary_sensor_id: b8m_input02
    internal: true

  - platform: gpio
    name: "b8m-input03"
    id: "b8m_input03"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 10
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input3-tuya
    dp_id: 113
    bind_binary_sensor_id: b8m_input03
    internal: true

  - platform: gpio
    name: "b8m-input04"
    id: "b8m_input04"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 11
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input4-tuya
    dp_id: 114
    bind_binary_sensor_id: b8m_input04
    internal: true

  - platform: gpio
    name: "b8m-input05"
    id: "b8m_input05"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 12
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input5-tuya
    dp_id: 115
    bind_binary_sensor_id: b8m_input05
    internal: true

  - platform: gpio
    name: "b8m-input06"
    id: "b8m_input06"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 13
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input6-tuya
    dp_id: 116
    bind_binary_sensor_id: b8m_input06
    internal: true

  - platform: gpio
    name: "b8m-input07"
    id: "b8m_input07"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 14
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input7-tuya
    dp_id: 117
    bind_binary_sensor_id: b8m_input07
    internal: true

  - platform: gpio
    name: "b8m-input08"
    id: "b8m_input08"
    pin:
      pcf8574: pcf8574_hub_out_1
      number: 15
      mode: INPUT
      inverted: true
  - platform: tuya_wifi_mcu
    name: b8m-input8-tuya
    dp_id: 118
    bind_binary_sensor_id: b8m_input08
    internal: true

##pull-up resistance on PCB
  - platform: gpio
    name: "b8m-W1-io47"
    pin:
      number: 47
      inverted: true

  - platform: gpio
    name: "b8m-W1-io48"
    pin:
      number: 48
      inverted: true

  - platform: gpio
    name: "b8m-W1-io7"
    pin:
      number: 7
      inverted: true

  - platform: gpio
    name: "b8m-W1-io40"
    pin:
      number: 40
      inverted: true
## without resistance on PCB
  - platform: gpio
    name: "b8m-13"
    pin:
      number: 13
      inverted:  false
  - platform: gpio
    name: "b8m-14"
    pin:
      number: 14
      inverted:  false
  - platform: gpio
    name: "b8m-21"
    pin:
      number: 21
      inverted:  false
  - platform: gpio
    name: "b8m-0"
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
      it.printf(0, 0, id(roboto), "KinCony B8M");
```
