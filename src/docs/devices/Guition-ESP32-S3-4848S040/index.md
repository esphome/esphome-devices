---
title: Guition ESP32-S3-4848S040 480*480 Smart Screen
date-published: 2024-06-04
type: misc
standard: global
board: esp32
difficulty: 2
---

![Product image](./guition-esp32-s3-4848s040.jpg "Product image")

## Product specs

| Feature      | Spec                    |
| ------------ | ----------------------- |
| Screen       | st7701s driver 480\*480 |
| Touch screen | gt911                   |
| CPU          | ESP32-S3                |
| Flash        | 16MB                    |
| PSRAM        | 8MB                     |

## Product description

Nice little integrated screen, touch screen, power supply and case with built in relay (or three) and 120v/220v power supply.

Avalible on [AliExpress](https://www.aliexpress.com/item/3256806115962222.html) for ~$24.

## Basic Config

```yaml
substitutions:
  name: "guition-esp32-s3-4848s040"
  friendly_name: "Guition480-basic"
  device_description: "Guition ESP32-S3-4848S040 480*480 Smart Screen"
  project_name: "Guition.ESP32_S3_4848S040"
  project_version: "1.0.1"

  lightbulb: "\U000F0335"
  ceiling_light: "\U000F0769"
  lamp: "\U000F06B5"
  floor_lamp: "\U000F08DD"
  string_lights: "\U000F12BA"

esphome:
  name: "${name}"
  friendly_name: "${friendly_name}"
  #name_add_mac_suffix: true
  project:
    name: "${project_name}"
    version: "${project_version}"
  platformio_options:
    board_build.flash_mode: dio

esp32:
  board: esp32-s3-devkitc-1
  variant: esp32s3
  flash_size: 16MB
  framework:
    type: esp-idf
    sdkconfig_options:
      COMPILER_OPTIMIZATION_SIZE: y
      CONFIG_ESP32S3_DEFAULT_CPU_FREQ_240: "y"
      CONFIG_ESP32S3_DATA_CACHE_64KB: "y"
      CONFIG_ESP32S3_DATA_CACHE_LINE_64B: "y"
      CONFIG_SPIRAM_FETCH_INSTRUCTIONS: y
      CONFIG_SPIRAM_RODATA: y

psram:
  mode: octal
  speed: 80MHz

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: !secret encryption_key

ota:
  - platform: esphome
    id: my_ota
    password: !secret ota_password
    # display the banner
    on_begin:
      then:
        - logger.log: "OTA start a"
        - light.turn_on: backlight
        - lambda: "id(backlight).loop();"
        - lvgl.resume:
        - lvgl.widget.redraw:
        #- lvgl.widget.hide: root
        - lvgl.widget.show: popup_obj
        - lvgl.resume:
        - lvgl.widget.redraw:
        - lambda: "id(lvgl_comp).loop();"
        - lambda: "id(lvgl_comp).loop();"
        - logger.log: "OTA start b"
    on_progress:
        then:
          - lvgl.bar.update:
              id: popup_pb_percentage
              value: !lambda "return (int)x;"
          - lvgl.label.update:
              id: popup_lbl_percentage
              text:
                format: "OTA progress %0.1f%%"
                args: ["x"]
          - lambda: "id(lvgl_comp).loop();"  

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "Guitionv1 Fallback Hotspot"
    password: !secret wifi_fallback_password

time:
  - platform: homeassistant
    id: time_comp
    on_time_sync:
      - script.execute: time_update
    on_time:
      - minutes: '*'
        seconds: 0
        then:
          - script.execute: time_update

script:
  - id: time_update
    # update the clock display
    then:
      - lvgl.indicator.update:
          id: minute_hand
          value: !lambda |-
            return id(time_comp).now().minute;
      - lvgl.indicator.update:
          id: hour_hand
          value: !lambda |-
            auto now = id(time_comp).now();
            return std::fmod(now.hour, 12) * 60 + now.minute;
      - lvgl.label.update:
          id: date_label
          text: !lambda |-
            static const char * const mon_names[] = {"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"};
            static char date_buf[8];
            auto now = id(time_comp).now();
            snprintf(date_buf, sizeof(date_buf), "%s %2d", mon_names[now.month-1], now.day_of_month);
            return date_buf;
      - lvgl.label.update:
          id: day_label
          text: !lambda |-
            static const char * const day_names[] = {"SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"};
            return day_names[id(time_comp).now().day_of_week - 1];  

web_server:
  port: 80

captive_portal:

sensor:
  - platform: wifi_signal
    name: "WiFi Signal"
    id: wifi_signal_db
    update_interval: 60s
    entity_category: diagnostic
    internal: true

  # Reports the WiFi signal strength in %
  - platform: copy
    source_id: wifi_signal_db
    name: "WiFi Strength"
    filters:
      - lambda: return min(max(2 * (x + 100.0), 0.0), 100.0);
    unit_of_measurement: "%"
    entity_category: diagnostic

text_sensor:
  - platform: wifi_info
    ip_address:
      name: "IP Address"
      id: ip_address
      entity_category: diagnostic
      on_value:
        then:
          - lvgl.label.update:
              id: ip_address_label
              text:
                format: "%s"
                args: [ 'id(ip_address).get_state().c_str()' ]
    ssid:
      name: "Connected SSID"
      entity_category: diagnostic
    mac_address:
      name: "Mac Address"
      entity_category: diagnostic

color:
  # Create a Home Assistant blue color
  - id: ha_blue
    hex: 51c0f2

#-------------------------------------------
# LVGL Buttons
#-------------------------------------------
lvgl:
  id: lvgl_comp
  displays:
    - my_display
  touchscreens:
    - touchscreen_id: my_touchscreen
  on_idle:
    - timeout: 10s
      then:
        - logger.log: idle timeout
        - if:
            condition:
              lvgl.is_idle:
                timeout: 5s
            then:
              - logger.log: LVGL is idle
    - timeout: 15s
      then:
        - logger.log: idle 15s timeout
        - light.turn_off:
            id: backlight
            transition_length: 5s
        - lvgl.pause:
            show_snow: true
      #- lvgl.pause:
      #- light.turn_off:
      #    id: display_backlight
      #    transition_length: 5s

  style_definitions:
    - id: style_line
      line_color: 0x0000FF
      line_width: 8
      line_rounded: true
    - id: date_style
      text_font: roboto24
      align: center
      text_color: 0x333333
      bg_opa: cover
      radius: 4
      pad_all: 2

  theme:
    button:
      text_font: roboto24
      scroll_on_focus: true
      #group: general
      radius: 25
      width: 150
      height: 109
      pad_left: 10px
      pad_top: 10px
      pad_bottom: 10px
      pad_right: 10px
      shadow_width: 0
      bg_color: 0x313131
      text_color: 0xB6B6B6
      checked:
        bg_color: 0xCC5E14
        text_color: 0xB6B6B6

  page_wrap: true
  pages:
    - id: main_page
      skip: false
      layout:
        type: flex
        flex_flow: column_wrap
      width: 100%
      bg_color: 0x000000
      bg_opa: cover
      pad_all: 5
      widgets:
        - button:
            height: 223
            checkable: true
            id: lv_button_1
            widgets:
              - label:
                  text_font: light40
                  align: top_left
                  text: $lightbulb
                  id: lv_button_1_icon
              - label:
                  align: bottom_left
                  text: "Center Light"
                  long_mode: dot
            on_click:
              light.toggle: internal_light
        - obj:
            widgets:
            - label:
                id: ip_address_label
                align: CENTER
                text: 'Not connected'
                text_color: ha_blue
                y: +10
        - meter:
            height: 200
            width: 200
            align: center
            widgets:
            bg_opa: TRANSP
            text_color: 0xFFFFFF
            scales:
              - ticks:
                  width: 1
                  count: 61
                  length: 10
                  color: 0xFFFFFF
                range_from: 0
                range_to: 60
                angle_range: 360
                rotation: 270
                indicators:
                  - line:
                      id: minute_hand
                      value: !lambda |-
                        return id(time_comp).now().minute;
                      width: 3
                      color: 0xE0E0E0
                      r_mod: -1
              -
                angle_range: 330
                rotation: 300
                range_from: 1
                range_to: 12
                ticks:
                  width: 1
                  count: 12
                  length: 1
                  major:
                    stride: 1
                    width: 4
                    length: 8
                    color: 0xC0C0C0
                    label_gap: 6

              - angle_range: 360
                rotation: 270
                range_from: 0
                range_to: 720
                indicators:
                  - line:
                      id: hour_hand
                      value: !lambda |-
                        auto now = id(time_comp).now();
                        return std::fmod(now.hour, 12) * 60 + now.minute;
                      width: 4
                      color: 0xA0A0A0
                      r_mod: -20
        - obj:
            widgets:
            - label:
                styles: date_style
                id: day_label
                y: -20
                text: !lambda |-
                  static const char * const day_names[] = {"SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"};
                  return day_names[id(time_comp).now().day_of_week-1];
            - label:
                styles: date_style
                id: date_label
                y: +20
                text: !lambda |-
                  static const char * const mon_names[] = {"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"};
                  static char date_buf[8];
                  auto now = id(time_comp).now();
                  snprintf(date_buf, sizeof(date_buf), "%s %2d", mon_names[now.month-1], now.day_of_month);
                  return date_buf;
        - obj:
            id: popup_obj
            hidden: true
            clickable: false
            x: 0
            y: 0
            width: 100%
            height: 100%
            pad_all: 10
            bg_opa: cover
            widgets:
              - label:
                  id: lbl_popup_title
                  x: 2
                  y: 2
                  text: "OTA in progress"
              - label:
                  id: popup_lbl_percentage
                  x: 2
                  y: 30
                  width: 100%
                  text: "0 %"
              - bar:
                  id: popup_pb_percentage
                  x: 2
                  y: 60
                  width: 100%
                  height: 10
                  max_value: 100
                  min_value: 0
                  value: 0


#-------------------------------------------
# Internal outputs
#-------------------------------------------
output:
  # Backlight LED
  - platform: ledc
    pin: GPIO38
    id: GPIO38
    frequency: 100Hz

    # Built in 240v relay
  - id: internal_relay_1
    platform: gpio
    pin: 40

    # Additional relays (3 relay model)
  - id: internal_relay_2
    platform: gpio
    pin: 2
  - id: internal_relay_3
    platform: gpio
    pin: 1

#-------------------------------------------
# Internal lights
#-------------------------------------------
light:
  - platform: monochromatic
    output: GPIO38
    name: Backlight
    id: backlight
    restore_mode: ALWAYS_ON

  - platform: binary
    output: internal_relay_1
    name: Internal Light
    id: internal_light
    on_turn_on:
      then:
        - lvgl.widget.update:
            id: lv_button_1_icon
            text_color: 0xFFFF00
        - lvgl.widget.update:
            id: lv_button_1
            state:
              checked: true
    on_turn_off:
      then:
        - lvgl.widget.update:
            id: lv_button_1_icon
            text_color: 0xB6B6B6
        - lvgl.widget.update:
            id: lv_button_1
            state:
              checked: false

#-------------------------------------------
# Graphics and Fonts
#-------------------------------------------
font:
  - file: "gfonts://Roboto"
    id: roboto24
    size: 24
    bpp: 4
    extras:
      # https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.4.47/fonts/materialdesignicons-webfont.ttf
      - file: "fonts/materialdesignicons-webfont.ttf" # http://materialdesignicons.com/cdn/7.4.47/
        glyphs:
          [
            "\U000F004B",
            #"\U0000f0ed",
            "\U000F006E",
            "\U000F012C",
            "\U000F179B",
            "\U000F0748",
            "\U000F1A1B",
            "\U000F02DC",
            "\U000F0A02",
            "\U000F035F",
            "\U000F0156",
            "\U000F0C5F",
            "\U000f0084",
            "\U000f0091",
          ]

  - file: "fonts/materialdesignicons-webfont.ttf" # http://materialdesignicons.com/cdn/7.4.47/
    id: light40
    size: 40
    bpp: 4
    glyphs: [
        "\U000F0335", # mdi-lightbulb
        "\U000F0769", # mdi-ceiling-light
        "\U000F06B5", # mdi-lamp
        "\U000F08DD", # mdi-floor-lamp
        "\U000F12BA", # mdi-string-lights
      ]

#-------------------------------------------
# Touchscreen gt911 i2c
#-------------------------------------------
i2c:
  - id: bus_a
    sda: GPIO19
    scl: GPIO45
    #frequency: 100kHz

touchscreen:
  platform: gt911
  transform:
    mirror_x: false
    mirror_y: false
  id: my_touchscreen
  display: my_display

  on_touch:
    - logger.log:
        format: Touch at (%d, %d)
        args: [touch.x, touch.y]
    - lambda: |-
        ESP_LOGI("cal", "x=%d, y=%d, x_raw=%d, y_raw=%0d",
            touch.x,
            touch.y,
            touch.x_raw,
            touch.y_raw
            );
  on_release:
    then:
      - if:
          condition: lvgl.is_paused
          then:
            - light.turn_on: backlight
            - lvgl.resume:
            - lvgl.widget.redraw:
#-------------------------------------------
# Display st7701s spi
#-------------------------------------------
spi:
  - id: lcd_spi
    clk_pin: GPIO48
    mosi_pin: GPIO47

display:
  - platform: st7701s
    id: my_display
    update_interval: never
    auto_clear_enabled: False
    spi_mode: MODE3
    data_rate: 2MHz
    color_order: RGB
    invert_colors: False
    dimensions:
      width: 480
      height: 480
    cs_pin: 39
    de_pin: 18
    hsync_pin: 16
    vsync_pin: 17
    pclk_pin: 21
    pclk_frequency: 12MHz
    pclk_inverted: False
    hsync_pulse_width: 8
    hsync_front_porch: 10
    hsync_back_porch: 20
    vsync_pulse_width: 8
    vsync_front_porch: 10
    vsync_back_porch: 10
    init_sequence:
      - 1
      # Custom sequences are an array, first byte is command, the rest are data.
      - [0xFF, 0x77, 0x01, 0x00, 0x00, 0x10] # CMD2_BKSEL_BK0
      - [0xCD, 0x00] # disable MDT flag
    data_pins:
      red:
        - 11 #r1
        - 12 #r2
        - 13 #r3
        - 14 #r4
        - 0 #r5
      green:
        - 8 #g0
        - 20 #g1
        - 3 #g2
        - 46 #g3
        - 9 #g4
        - 10 #g5
      blue:
        - 4 #b1
        - 5 #b2
        - 6 #b3
        - 7 #b4
        - 15 #b5
```
