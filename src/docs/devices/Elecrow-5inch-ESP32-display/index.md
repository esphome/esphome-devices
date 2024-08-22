---
title: CrowPanel 5.0" HMI ESP32 display (by Elecrow)
date-published: 2024-08-17
type: misc
standard: global
project-url: https://www.elecrow.com/wiki/esp32-display-502727-intelligent-touch-screen-wi-fi26ble-800480-hmi-display.html
board: esp32
---

![Product Image](elecrow-5-inch-esp32-display.jpg "Product Image")

## Drivers

* Processor: ESP32-S3-WROOM-1-N4R8 (using `esp32s3box` board)
* Touchscreen: `gt911`
* Display: ILI6122 & ILI5960 (using `rpi_dpi_rgb` plaform)

## GPIO Pinout

### i2c (used for touchscreen)

| Pin    | Function      |
| ------ | ------------- |
| GPIO19 | i2c SDA     |
| GPIO20 | i2c SCL     |

### backlight

| Pin    | Function      |
| ------ | ------------- |
| GPIO2  | backlight   |

### display

| Pin    | Function      |
| ------ | ------------- |
| GPIO40 | de_pin      |
| GPIO39 | hsync_pin   |
| GPIO41 | vsync_pin   |
| GPIO0  | pclk_pin    |

### data pins

```yaml
      red:
        - 45        #r1
        - 48        #r2
        - 47        #r3
        - 21        #r4
        - 14        #r5
      green:
        - 5         #g0
        - 6         #g1
        - 7         #g2
        - 15        #g3
        - 16        #g4
        - 4         #g5
      blue:
        - 8         #b1
        - 3         #b2
        - 46        #b3
        - 9         #b4
        - 1         #b5
```

## Simle configuration

```yaml
esphome:
  name: display
  platformio_options:
    build_flags: "-DBOARD_HAS_PSRAM"
    board_build.esp-idf.memory_type: qio_opi
    board_build.flash_mode: dio
  
esp32:
  board: esp32s3box
  framework:
    type: esp-idf
    sdkconfig_options:
      CONFIG_ESP32S3_DEFAULT_CPU_FREQ_240: y
      CONFIG_ESP32S3_DATA_CACHE_64KB: y
      CONFIG_SPIRAM_FETCH_INSTRUCTIONS: y
      CONFIG_SPIRAM_RODATA: y

psram:
  mode: octal
  speed: 80MHz

output:
  - platform: ledc
    pin: 2
    frequency: 1220
    id: gpio_backlight_pwm

light:
  - platform: monochromatic
    output: gpio_backlight_pwm
    name: ${devicename} Display Backlight
    id: back_light
    restore_mode: ALWAYS_ON

i2c:
  sda: GPIO19
  scl: GPIO20
  scan: true

touchscreen:
  platform: gt911

display:
  - platform: rpi_dpi_rgb
    id: main_display
    color_order: RGB
    invert_colors: True
    update_interval: 5s
    auto_clear_enabled: false
    dimensions:
      width: 800
      height: 480
    de_pin: 40
    hsync_pin: 39
    vsync_pin: 41
    pclk_pin: 0
    pclk_frequency: 12MHz
    data_pins:
      red:
        - 45        #r1
        - 48        #r2
        - 47        #r3
        - 21        #r4
        - 14        #r5
      green:
        - 5         #g0
        - 6         #g1
        - 7         #g2
        - 15        #g3
        - 16        #g4
        - 4         #g5
      blue:
        - 8         #b1
        - 3         #b2
        - 46        #b3
        - 9         #b4
        - 1         #b5
    lambda: |-
      auto black = Color(0, 0, 0);
      auto red = Color(255, 0, 0);
      auto green = Color(0, 255, 0);
      auto blue = Color(0, 0, 255);
      auto white = Color(255, 255, 255);
      id(main_display).filled_circle(20, 32, 15, black);
      id(main_display).filled_circle(40, 32, 15, red);
      id(main_display).filled_circle(60, 32, 15, green);
      id(main_display).filled_circle(80, 32, 15, blue);
      id(main_display).filled_circle(100, 32, 15, white);

# example button
binary_sensor:
  - platform: touchscreen
    name: Top Left Touch Button
    x_min: 0
    x_max: 239
    y_min: 0
    y_max: 239
    on_press:
      - lambda: |-
            ESP_LOGI("btn", "Button pressed");
```

## Example (using LGVL graphics library)

```yaml
esphome:
  name: ${device_name}
  platformio_options:
    build_flags: "-DBOARD_HAS_PSRAM"
    board_build.esp-idf.memory_type: qio_opi
    board_build.flash_mode: dio
  
esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: esp-idf
    sdkconfig_options:
      CONFIG_ESP32S3_DEFAULT_CPU_FREQ_240: y
      CONFIG_ESP32S3_DATA_CACHE_64KB: y
      CONFIG_SPIRAM_FETCH_INSTRUCTIONS: y
      CONFIG_SPIRAM_RODATA: y

psram:
  mode: octal
  speed: 80MHz

logger:

api:
  encryption:
    key: !secret api_key

ota:
  - platform: esphome
    password: !secret ota_password

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

# Define a PWM output on the ESP32
output:
  - platform: ledc
    pin: 2
    frequency: 1220
    id: gpio_backlight_pwm

light:
  - platform: monochromatic # Define a monochromatic, dimmable light for the backlight
    output: gpio_backlight_pwm
    name: ${device_name} Display Backlight
    id: back_light
    restore_mode: ALWAYS_ON

binary_sensor:
  - platform: status
    name: "Node Status"
    id: system_status

text_sensor:
  - platform: template
    id: uptime_human
    icon: mdi:clock-start
    internal: True

  - platform: wifi_info
    ip_address:
      id: ip_address

display:
  - platform: rpi_dpi_rgb
    id: main_display
    color_order: RGB
    invert_colors: True
    update_interval: never
    auto_clear_enabled: false # takes 2.8 seconds to clear the display
    dimensions:
      width: 800
      height: 480
    de_pin: 40
    hsync_pin: 39
    vsync_pin: 41
    pclk_pin: 0
    pclk_frequency: 12MHz
    data_pins:
      red:
        - 45        #r1
        - 48        #r2
        - 47        #r3
        - 21        #r4
        - 14        #r5
      green:
        - 5         #g0
        - 6         #g1
        - 7         #g2
        - 15        #g3
        - 16        #g4
        - 4         #g5
      blue:
        - 8         #b1
        - 3         #b2
        - 46        #b3
        - 9         #b4
        - 1         #b5

time:
  - platform: sntp
    id: time_comp

number:
  - platform: template
    initial_value: 0
    id: counting_number
    internal: True
    min_value: -10
    max_value: 10
    step: 1
    optimistic: True

debug:
  update_interval: 5s

sensor:
  - platform: wifi_signal
    internal: True
    id: wifi_signal_sensor
    update_interval: 1s
  - platform: uptime
    id: uptime_counter
    update_interval: 1s
    accuracy_decimals: 0
    on_raw_value:
      then:
        - light.turn_on:
            id: back_light
            brightness: 90%
        - number.increment:
            id: counting_number
            cycle: True
        - script.execute: update_display
  - platform: debug
    free:
      name: "Heap Free"
    block:
      name: "Heap Max Block"
    loop_time:
      name: "Loop Time"
    psram:
      name: "Free PSRAM"
  - platform: uptime
    internal: True
    id: uptime_sensor
    update_interval: 1s
    on_raw_value:
      then:
        - text_sensor.template.publish:
            id: uptime_human
            state: !lambda |-
              int seconds = round(id(uptime_sensor).raw_state);
              int days = seconds / (24 * 3600);
              seconds = seconds % (24 * 3600);
              int hours = seconds / 3600;
              seconds = seconds % 3600;
              int minutes = seconds /  60;
              seconds = seconds % 60;
              return (
                ("Uptime ") +
                (days ? to_string(days) + "d " : "") +
                (hours ? to_string(hours) + "h " : "") +
                (minutes ? to_string(minutes) + "m " : "") +
                (to_string(seconds) + "s")
              ).c_str();

  - platform: homeassistant
    name: "Processor Use"
    entity_id: sensor.processor_use
    id: ha_processor_use

script:
  - id: update_display
    then:
      - lvgl.indicator.update:
          id: power_meter_input
          value: !lambda return id(counting_number).state;
      - lvgl.label.update:
          id: battery_kw
          text: !lambda |-
            static char buf[8];
            snprintf(buf, sizeof(buf), "%.1fkW", id(counting_number).state);
            return buf;
      - lvgl.label.update:
          id: battery_status
          text_color: 0xFF0000
          text: "discharging"
      - lvgl.label.update:
          id: battery_soc
          text: !lambda |-
            static char buf[8];
            snprintf(buf, sizeof(buf), "%.1f%%", id(counting_number).state);
            return buf;
      - lvgl.label.update:
          id: solar_kw
          text: !lambda |-
            static char buf[8];
            snprintf(buf, sizeof(buf), "%.1fkW", id(counting_number).state);
            return buf;
      - lvgl.image.update:
          id: img_solar_power
          src: solar_power_icon
          image_recolor: 0xFFF000
      - lvgl.indicator.update:
          id: power_meter_input2
          value: !lambda return id(counting_number).state;
      - lvgl.label.update:
          id: battery_kw2
          text: !lambda |-
            static char buf[8];
            snprintf(buf, sizeof(buf), "%.1fkW", id(counting_number).state);
            return buf;
      - lvgl.label.update:
          id: battery_status2
          text_color: 0xFF0000
          text: "discharging"
      - lvgl.label.update:
          id: battery_soc2
          text: !lambda |-
            static char buf[8];
            snprintf(buf, sizeof(buf), "%.1f%%", id(counting_number).state);
            return buf;
      - lvgl.label.update:
          id: solar_kw2
          text: !lambda |-
            static char buf[8];
            snprintf(buf, sizeof(buf), "%.1fkW", id(counting_number).state);
            return buf;
      - lvgl.image.update:
          id: img_solar_power2
          src: solar_power_icon
          image_recolor: 0xFFF000

image:
  - file: mdi:sun-wireless-outline
    id: solar_power_icon
    resize: 50x50

  - file: mdi:battery-arrow-down-outline
    id: home_battery_icon
    resize: 30x30

lvgl:
  log_level: INFO
  color_depth: 16
  bg_color: 0
  border_width: 0
  outline_width: 0
  shadow_width: 0
  text_font: unscii_16
  align: center
  style_definitions:
    - id: meter_style
      text_font: unscii_8
    - id: font_style
      text_font: MONTSERRAT_24
      align: center
      text_color: 0xFFFFFF
      bg_opa: TRANSP
      bg_color: 0
      radius: 4
      pad_all: 2
    - id: details_style
      text_font: MONTSERRAT_18
      align: center
      text_color: 0xFFFFFF
      bg_opa: TRANSP
      bg_color: 0
      radius: 4
      pad_all: 2
  widgets:
    - obj: # Meter
        height: 240
        width: 240
        bg_color: 0
        border_width: 0
        outline_width: 0
        shadow_width: 0
        pad_all: 4
        align: TOP_LEFT
        widgets:
          - meter: # Gradient color  arc
              height: 100%
              width: 100%
              border_width: 0
              outline_width: 0
              align: center
              bg_color: 0
              styles: meter_style
              scales:
                angle_range: 180
                range_to: 10
                range_from: -10
                ticks:
                  count: 0
                indicators:
                  - line:
                      id: power_meter_input
                      width: 8
                      color: 0xFFFFFF
                      r_mod: 12
                      value: 50
                  - arc:
                      color: 0xFF3000
                      r_mod: 10
                      width: 20
                      start_value: -10
                      end_value: 0
                  - arc:
                      color: 0x00FF00
                      r_mod: 10
                      width: 20
                      start_value: 0
                      end_value: 10
          #- canvas:
          - arc: # black arc to erase middle part of meter indicator line
              height: 160
              width: 160
              align: center
              arc_color: 0x000000
              arc_width: 150
              start_angle: 0
              end_angle: 360
              indicator:
                arc_width: 150
                arc_color: 0x000000
          - label: # gauge lower and higher range indicators
              styles: font_style
              text_font: MONTSERRAT_18
              y: 8
              x: -99
              text: "-10"
          - label:
              styles: font_style
              text_font: MONTSERRAT_18
              y: 8
              x: 99
              text: "+10"
          - label:
              styles: font_style
              id: battery_status
              y: -35
          - label:
              styles: font_style
              id: battery_kw
              y: -60
          - label:
              styles: font_style
              text_font: MONTSERRAT_40
              id: battery_soc
              y: 0
          - label:
              styles: font_style
              id: solar_kw
              text_color: 0xFFFF00
              y: 90
          - image:
              src: solar_power_icon
              id: img_solar_power
              align: center
              image_recolor: 0xFFFF00
              image_recolor_opa: 100%
              y: 50
    - obj: # Meter
        height: 240
        width: 240
        bg_color: 0
        border_width: 0
        outline_width: 0
        shadow_width: 0
        pad_all: 4
        align: TOP_MID
        widgets:
          - meter: # Gradient color  arc
              height: 100%
              width: 100%
              border_width: 0
              outline_width: 0
              align: center
              bg_color: 0
              styles: meter_style
              scales:
                angle_range: 180
                range_to: 10
                range_from: -10
                ticks:
                  count: 0
                indicators:
                  - line:
                      id: power_meter_input2
                      width: 8
                      color: 0xFFFFFF
                      r_mod: 12
                      value: 50
                  - arc:
                      color: 0xFF3000
                      r_mod: 10
                      width: 20
                      start_value: -10
                      end_value: 0
                  - arc:
                      color: 0x00FF00
                      r_mod: 10
                      width: 20
                      start_value: 0
                      end_value: 10
          #- canvas:
          - arc: # black arc to erase middle part of meter indicator line
              height: 160
              width: 160
              align: center
              arc_color: 0x000000
              arc_width: 150
              start_angle: 0
              end_angle: 360
              indicator:
                arc_width: 150
                arc_color: 0x000000
          - label: # gauge lower and higher range indicators
              styles: font_style
              text_font: MONTSERRAT_18
              y: 8
              x: -99
              text: "-10"
          - label:
              styles: font_style
              text_font: MONTSERRAT_18
              y: 8
              x: 99
              text: "+10"
          - label:
              styles: font_style
              id: battery_status2
              y: -35
          - label:
              styles: font_style
              id: battery_kw2
              y: -60
          - label:
              styles: font_style
              text_font: MONTSERRAT_40
              id: battery_soc2
              y: 0
          - label:
              styles: font_style
              id: solar_kw2
              text_color: 0xFFFF00
              y: 90
          - image:
              src: solar_power_icon
              id: img_solar_power2
              align: center
              image_recolor: 0xFFFF00
              image_recolor_opa: 100%
              y: 50
    - obj: # Meter
        height: 240
        width: 240
        bg_color: 0
        border_width: 0
        outline_width: 0
        shadow_width: 0
        pad_all: 4
        align: BOTTOM_LEFT
        widgets:
          - meter: # Gradient color  arc
              height: 100%
              width: 100%
              border_width: 0
              outline_width: 0
              align: center
              bg_color: 0
              styles: meter_style
              scales:
                angle_range: 180
                range_to: 10
                range_from: -10
                ticks:
                  count: 0
                indicators:
                  - line:
                      id: power_meter_input3
                      width: 8
                      color: 0xFFFFFF
                      r_mod: 12
                      value: 50
                  - arc:
                      color: 0xFF3000
                      r_mod: 10
                      width: 20
                      start_value: -10
                      end_value: 0
                  - arc:
                      color: 0x00FF00
                      r_mod: 10
                      width: 20
                      start_value: 0
                      end_value: 10
          #- canvas:
          - arc: # black arc to erase middle part of meter indicator line
              height: 160
              width: 160
              align: center
              arc_color: 0x000000
              arc_width: 150
              start_angle: 0
              end_angle: 360
              indicator:
                arc_width: 150
                arc_color: 0x000000
          - label: # gauge lower and higher range indicators
              styles: font_style
              text_font: MONTSERRAT_18
              y: 8
              x: -99
              text: "-10"
          - label:
              styles: font_style
              text_font: MONTSERRAT_18
              y: 8
              x: 99
              text: "+10"
          - label:
              styles: font_style
              id: battery_status3
              y: -35
          - label:
              styles: font_style
              id: battery_kw3
              y: -60
          - label:
              styles: font_style
              text_font: MONTSERRAT_40
              id: battery_soc3
              y: 0
          - label:
              styles: font_style
              id: solar_kw3
              text_color: 0xFFFF00
              y: 90
          - image:
              src: solar_power_icon
              id: img_solar_power3
              align: center
              image_recolor: 0xFFFF00
              image_recolor_opa: 100%
              y: 50
```
