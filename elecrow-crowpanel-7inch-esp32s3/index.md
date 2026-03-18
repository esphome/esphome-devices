---
title: Elecrow CrowPanel ESP32-S3 7.0" HMI Display (DIS08070H)
date-published: 2026-03-18
type: misc
standard: global
board: esp32
difficulty: 2
---

## Product Specs

| Feature | Spec |
|---------|------|
| Screen | EK9716BD3 driver, 800×480, RGB parallel interface |
| Touch | GT911 capacitive, 5-point multi-touch |
| CPU | ESP32-S3-WROOM-1-N4R8 |
| Flash | 4MB |
| PSRAM | 8MB (Octal) |
| I/O Expander | PCA9557 at I2C 0x18 |
| Backlight | PWM on GPIO 2 |
| USB | USB-C (USB-OTG on GPIO 19/20 shared with I2C — see notes) |
| Power | 5V via USB-C or JST connector |

Product page: [Elecrow CrowPanel 7.0" ESP32-S3 HMI](https://www.elecrow.com/esp32-display-7-inch-hmi-display-rgb-tft-lcd-touch-screen-support-lvgl.html)

## Important Notes

### Flash Size is 4MB, Not 16MB

The ESP32-S3-WROOM-1-**N4**R8 has 4MB flash. The "N4" = 4MB flash, "R8" = 8MB PSRAM. Setting `flash_size: 16MB` causes a `rst:0x3` boot loop with no log output. This is easy to get wrong because many online examples and even some Elecrow documentation reference 16MB.

### Do NOT Touch the PCA9557

The CrowPanel V3.0 has a PCA9557 I/O expander (I2C 0x18) that controls the GT911 RST line (pin 0) and INT line (pin 1). Many people try to use it to reset the GT911 during boot. **This breaks touch every time.**

Here's why it works without PCA9557 manipulation:
1. PCA9557 powers up with all pins as inputs (high-impedance)
2. A pull-up resistor on the GT911 RST line brings it HIGH automatically
3. GT911 exits reset and boots on its own before ESPHome firmware starts
4. By the time ESPHome's GT911 driver calls `setup()`, the GT911 is already ready

### GT911 Address Varies Between Units

The GT911 I2C address is set by the state of GPIO38 during power-on:
- **GPIO38 LOW** → address **0x5D** (most common)
- **GPIO38 HIGH** → address **0x14**

This varies between individual units due to internal pull-up/pull-down differences. If touch doesn't work, try the other address.

### First-Time USB Flash — `firmware.factory.bin` vs `firmware.bin`

ESPHome produces two binary files when it compiles:

| File | Contents | Flash Address |
|------|----------|---------------|
| `firmware.factory.bin` | **Complete image** — bootloader + partition table + application | `0x0` |
| `firmware.bin` | **Application only** — just the ESPHome code | `0x10000` |

The ESP32-S3 flash is laid out in regions: bootloader at `0x0`, partition table at `0x8000`, NVS storage at `0x9000`, and application at `0x10000`. The `firmware.factory.bin` overwrites everything from address `0x0`. The `firmware.bin` only writes the application at `0x10000`, assuming a compatible bootloader and partition table already exist.

**First-time flash: you MUST use `firmware.factory.bin`.** The CrowPanel ships with Elecrow's demo firmware which has an incompatible bootloader and partition table. If you flash `firmware.bin` (app only), the existing Elecrow bootloader tries to load your ESPHome app and fails — resulting in a `rst:0x3` boot loop with no useful log output.

```bash
# Flash the factory image at address 0x0 (overwrites bootloader + partition table + app)
esptool.py --chip esp32s3 --port COM4 write_flash 0x0 firmware.factory.bin
```

Or use the [ESPHome Web Flasher](https://web.esphome.io) — click Install, select the `.factory.bin` file.

**Note:** You do NOT need to erase the flash first. The `firmware.factory.bin` overwrites the bootloader, partition table, and application regions. The ESP32-S3's ROM bootloader is in silicon (not flash), so USB download mode always works regardless of what's on the flash. If you *do* want a completely clean slate, you can run `esptool.py erase_flash` before flashing — this is safe as long as you immediately flash the factory image afterward. A device with erased flash will appear "dead" (no display, no WiFi) but will still accept a new flash over USB.

**After first flash:** Once the device boots ESPHome and connects to WiFi, use OTA for all subsequent updates (ESPHome Dashboard → Install → Wirelessly). OTA uses `firmware.bin` internally and only updates the application partition, preserving the bootloader, partition table, and saved WiFi credentials. If an OTA update fails mid-transfer, the device rolls back to the previous firmware automatically (dual OTA partition scheme).

### I2C Scan Breaks GT911

Setting `scan: true` on the I2C bus can interfere with GT911 communication. Always use `scan: false`.

## Pin Configuration

| Function | Pin(s) |
|----------|--------|
| I2C SDA (Touch) | GPIO 19 |
| I2C SCL (Touch) | GPIO 20 |
| Touch INT | GPIO 38 |
| Backlight PWM | GPIO 2 |
| Display DE | GPIO 41 |
| Display HSYNC | GPIO 39 |
| Display VSYNC | GPIO 40 |
| Display PCLK | GPIO 0 |
| Red data | GPIO 14, 21, 47, 48, 45 |
| Green data | GPIO 9, 46, 3, 8, 16, 1 |
| Blue data | GPIO 15, 7, 6, 5, 4 |

## Common Pitfalls

| Mistake | Symptom | Fix |
|---------|---------|-----|
| `flash_size: 16MB` | Boot loop, no logging | Change to `4MB` |
| `buffer_size: 25%` | Out-of-memory crash | Use `10%` |
| `i2c: scan: true` | GT911 fails | Set `scan: false` |
| Missing `invert_colors: true` | Wrong colors | Add it |
| Missing `pclk_inverted: true` | Garbled display | Add it |
| PCA9557 writes in `on_boot` | Touch stops working | Remove all PCA9557 code |
| Adding `interrupt_pin: 38` | Touch intermittent | Remove it, use polling |
| Adding `calibration:` to touchscreen | "Communication failed" | Remove it |

## Basic Configuration

Minimal working config with display, touch, and backlight — no LVGL:

```yaml
esphome:
  name: crowpanel-7inch
  friendly_name: CrowPanel 7 Inch
  platformio_options:
    board_build.esp-idf.memory_type: qio_opi
    board_build.flash_mode: dio

esp32:
  board: esp32-s3-devkitc-1
  flash_size: 4MB
  framework:
    type: esp-idf
    sdkconfig_options:
      CONFIG_ESP32S3_DEFAULT_CPU_FREQ_240: "y"
      CONFIG_ESP32S3_DATA_CACHE_64KB: "y"
      CONFIG_SPIRAM_FETCH_INSTRUCTIONS: y
      CONFIG_SPIRAM_RODATA: y
      CONFIG_SPIRAM_ALLOW_STACK_EXTERNAL_MEMORY: "y"

psram:
  mode: octal
  speed: 80MHz

logger:
  level: DEBUG
  hardware_uart: UART0

api:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  power_save_mode: none
  ap:
    ssid: "CrowPanel-Fallback"

captive_portal:

i2c:
  - id: touch_i2c
    sda: 19
    scl: 20
    scan: false
    frequency: 400000

touchscreen:
  - platform: gt911
    id: my_touchscreen
    i2c_id: touch_i2c
    address: 0x5D    # Try 0x14 if touch doesn't work
    display: my_display
    update_interval: 50ms

output:
  - platform: ledc
    pin: 2
    id: backlight_pwm
    frequency: 1220

light:
  - platform: monochromatic
    output: backlight_pwm
    name: "Display Backlight"
    id: backlight
    restore_mode: ALWAYS_ON
    default_transition_length: 0s

display:
  - platform: rpi_dpi_rgb
    id: my_display
    invert_colors: true
    dimensions:
      width: 800
      height: 480
    de_pin: 41
    hsync_pin: 39
    vsync_pin: 40
    pclk_pin: 0
    pclk_frequency: 15MHz
    pclk_inverted: true
    hsync_front_porch: 40
    hsync_pulse_width: 48
    hsync_back_porch: 13
    vsync_front_porch: 1
    vsync_pulse_width: 31
    vsync_back_porch: 13
    data_pins:
      red: [14, 21, 47, 48, 45]
      green: [9, 46, 3, 8, 16, 1]
      blue: [15, 7, 6, 5, 4]
    color_order: RGB
    auto_clear_enabled: false
    update_interval: never
```

## LVGL Configuration

Add LVGL with touch, swipe gestures, and styled pages:

```yaml
font:
  - file: "gfonts://Roboto"
    id: roboto_20
    size: 20
    bpp: 4
  - file: "gfonts://Roboto"
    id: roboto_28
    size: 28
    bpp: 4
  - file: "gfonts://Roboto"
    id: roboto_48
    size: 48
    bpp: 4

lvgl:
  displays:
    - my_display
  touchscreens:
    - my_touchscreen
  buffer_size: 10%
  log_level: WARN
  page_wrap: false
  pages:
    - id: page_one
      on_swipe_left:
        - lvgl.page.next:
            animation: MOVE_LEFT
            time: 300ms
      widgets:
        - label:
            align: TOP_MID
            y: 30
            text: "PAGE 1"
            text_font: roboto_48
            text_color: 0xFFFFFF
        - label:
            align: CENTER
            y: -40
            text: "Swipe Left for Page 2"
            text_font: roboto_20
            text_color: 0xAAAAAA
        - button:
            align: CENTER
            y: 60
            width: 300
            height: 80
            bg_color: 0x2196F3
            widgets:
              - label:
                  align: CENTER
                  text: "Next Page >>"
                  text_font: roboto_28
                  text_color: 0xFFFFFF
            on_click:
              then:
                - lvgl.page.next:
                    animation: MOVE_LEFT
                    time: 300ms

    - id: page_two
      on_swipe_right:
        - lvgl.page.previous:
            animation: MOVE_RIGHT
            time: 300ms
      widgets:
        - label:
            align: TOP_MID
            y: 30
            text: "PAGE 2"
            text_font: roboto_48
            text_color: 0xFFFFFF
        - label:
            align: CENTER
            y: -40
            text: "Swipe Right for Page 1"
            text_font: roboto_20
            text_color: 0xAAAAAA
        - button:
            align: CENTER
            y: 60
            width: 300
            height: 80
            bg_color: 0x4CAF50
            widgets:
              - label:
                  align: CENTER
                  text: "<< Previous Page"
                  text_font: roboto_28
                  text_color: 0xFFFFFF
            on_click:
              then:
                - lvgl.page.previous:
                    animation: MOVE_RIGHT
                    time: 300ms
```

## Disclosure

This configuration was developed with the help of Claude (Anthropic's AI). The low-level I2C debugging, GT911 driver analysis, and ESP-IDF internals exceeded the contributor's personal skill level. Results are accurate and tested on two physical units. See [ESPHome Issue #13307](https://github.com/esphome/esphome/issues/13307) for the full discussion.
