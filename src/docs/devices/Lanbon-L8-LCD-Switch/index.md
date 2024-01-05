---
title: Lanbon L8 LCD Switch
date-published: 2023-01-05
type: switch
standard: global
board: esp32
difficulty: 3
---

## Product Images

![Lanbon L8 models](lanbon-l8-models.png "Lanbon L8 models")
![Lanbon L8 box](lanbon-l8-contents.png "Lanbon L8 box contents")

## Description

 - L8-HS: 3 Relays - load up to 200W/gang
 - L8-HD: 1 Dimmer - load up to 200W/gang
 - L8-HB: Boiler switch - load up to 16A
 - L8-HT: Thermostat switch - not tested!

Choose a model that works with Apple HomeKit (has this sticker on) because those are WiFi versions with the internal antenna connected to the ESP-WROOVER-B module. Do NOT buy a version that is powered by Tuya Smart Life because the internal antenna is connected to the Tuya chip. Those devices will have very bad WiFi reception of the ESP32!

All models are rated at AC 100-250V ~50-60Hz, the form factor can be a design choice regardless of the continental area.

### Features:

- Input voltage 110-250V ~ 50-60Hz AC
- ESP32-WROVER-B
- Capacitive touch screen
- Energy counter

| Pros           | Cons
|:-----          |:----
| 8 MB flash     | Mood LEDS not uniform
| 8 MB PSram     | 
| Capactitive touch |
| Built-in PSU |
| Energy monitor |
| Standard wallmount form factor both EU and US |

![Lanbon L8 dimensions](lanbon-l8-dimensions.png "Lanbon L8 dimensions")

The models have the same recessed housing sliding into the wall, sized 50x50mm, with rounded corners creating a diameter of about 59mm. This makes them suitable for both EU and US wall fixtures. The EU model fits in a properly deployed, standard 60mm round wall box and can be fixed with two side screws (use the screws which belong to the box instead of the ones shipped with the device), the US model fits in the standard rectangular box and can be fixed through the oval holes located 3 1/4" apart. The depth of the wall box has to be at least 35-40mm because some room is needed for the wires coming out straight of the device.

Although the moodlight goes nicely around the case, coloring is not uniform, and this is not a software issue.

## GPIO Pinout

| Pin    | Function                  |
|--------|---------------------------|
| GPIO5  | Backlight (PWM out)       |
| GPIO22 | Display CS                |
| GPIO21 | Display DC                |
| GPIO18 | Display Reset             |
| GPIO19 | Display CLS               |
| GPIO23 | Display MOSI              |
| GPIO25 | Display MISO              |
| GPIO4  | Touchscreen SDA           |
| GPIO0  | Touchscreen SCL           |
| GPIO26 | Moodlight Red (PWM out)   |
| GPIO32 | Moodlight Green (PWM out) |
| GPIO33 | Moodlight Blue (PWM out)  |

### 3-gang version L8-HS

| Pin    | Function   |
|--------|------------|
| GPIO12 | Relay (K3) |
| GPIO14 | Relay      |
| GPIO27 | Relay      |

### Boiler version L8-HB

| Pin    | Function       |
|--------|----------------|
| GPIO27 | Relay 16A (K3) |

### Dimmer version L8-HD

| Pin    | Function       |
|--------|----------------|
| GPIO12 | Dimmer TX (K3) |


## Flashing

Steps:

1. Disengage the high-voltage power.
2. Detach the panel from the PSU power supply.
3. Connect `RX`, `TX`, `IO0`, `GND` and `5V` pins to the female pinheader.
4. Because there is no `RESET` pin, you need to powercycle the board while `IO0` is connected to `GND` to activate flash mode.

![Lanbon L8 pcb](lanbon-l8-pcb.png "Lanbon L8 PCB")

Make sure you have a USB to TTL serial adapter than can provide sufficient power **on the 5V pin**.
Once the serial connections are made, you can erase flash, power-cycle the board and then flash the ESPHome modern format binary (`*-factory.bin`) using `esptool`.

You can follow this [flashing guide](https://blakadder.com/lanbon-L8-custom-firmware/) on [blakadder.com](https://blakadder.com) or [this discussion post](https://github.com/HASwitchPlate/openHASP/discussions/76) with instructions and photos to flash the firmware without having to open the device.

## Example Configuration for 3-gang version L8-HS

```yml
esphome:
  ...
  platformio_options:
    build_unflags: -Werror=all

esp32:
  board: esp-wrover-kit
  framework:
    type: esp-idf

psram:
  mode: octal
  speed: 80MHz

spi:
  clk_pin: GPIO19
  mosi_pin: GPIO23
  interface: hardware

i2c:
  sda: GPIO4
  scl: 
    number: GPIO0
    ignore_strapping_warning: true

output:
  - platform: ledc
    id: backlight_output
    frequency: 1220Hz
    pin:
      number: GPIO5
      ignore_strapping_warning: true
  - platform: ledc
    id: mood_red
    frequency: 1220Hz
    pin:
      number: GPIO26
  - platform: ledc
    id: mood_green
    frequency: 1220Hz
    pin:
      number: GPIO32
  - platform: ledc
    id: mood_blue
    frequency: 1220Hz
    pin:
      number: GPIO33

  - id: relay_1
    platform: gpio
    pin: 
      number: GPIO12
      ignore_strapping_warning: true
  - id: relay_2
    platform: gpio
    pin: GPIO14
  - id: relay_3
    platform: gpio
    pin: GPIO27


light:
  - platform: monochromatic
    output: backlight_output
    name: LCD Backlight
    id: display_backlight
    restore_mode: ALWAYS_ON
    default_transition_length: 1s

  - platform: rgb
    name: Moodlight
    red: mood_red
    green: mood_green
    blue: mood_blue

  - platform: binary
    name: Relay 1
    output: relay_1
  - platform: binary
    name: Relay 2
    output: relay_2
  - platform: binary
    name: Relay 3
    output: relay_3

touchscreen:
  - platform: ft63x6
    on_touch:
      - logger.log:
          format: Touch %d detected at (%d, %d)
          args: [touch.id, touch.x, touch.y]
    on_update:
      - logger.log:
          format: Touch updated
    on_release:
      - logger.log:
          format: Touch released
font:
  - file: "gfonts://Roboto"
    id: roboto
    size: 20

display:
  - platform: ili9xxx
    model: st7789v
    dimensions:
      width: 240
      height: 320
    transform:
      swap_xy: false
      mirror_x: true
      mirror_y: true
    data_rate: 80MHz
    cs_pin: GPIO22
    dc_pin: GPIO21
    reset_pin: GPIO18
    update_interval: never
    auto_clear_enabled: false
    invert_colors: false
    lambda: |-
      it.print(80, 0, id(roboto), Color(255, 255, 255), TextAlign::TOP_CENTER, "Lanbon L8 Test");
      
```
