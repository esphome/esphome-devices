---
title: DETA Grid Connect Smart Switch (Single / Double / Triple / Quad)
date-published: 2020-11-23
type: switch
standard: au
---

## General Notes

The DETA [Smart Single Switch (6911HA)](https://www.bunnings.com.au/deta-smart-single-gang-light-switch-touch-activated-with-grid-connect_p0098811) and [Smart Double Switch (6912HA)](https://www.bunnings.com.au/deta-smart-double-gang-light-switch-touch-activated-with-grid-connect_p0098812) are made by Arlec as part of the [Grid Connect ecosystem](https://grid-connect.com.au/), and are sold at Bunnings in Australia and New Zealand. Older models can be flashed without disassembly or soldering [using tuya-convert](#tuya-convert) however recently purchased evices may require serial flashing.

[Triple 6903HA](https://www.bunnings.com.au/deta-smart-touch-activated-triple-gang-light-switch-with-grid-connect_p0161014) and [Quad 6904HA](https://www.bunnings.com.au/deta-smart-touch-activated-quad-gang-light-switch-with-grid-connect_p0161015) The pin outs on the 3 & 4 gang switches are different to the 1 and 2 gang switches.

### Incompatible Wifi Modules

Deta/Bunnings now ship the Single, Double and Triple (tbc on Quad) with WB3S chips, which are _not_ compatible with ESPHome/Tuya/Tasmota/etc. Packaging states a "Series 2" model number, eg "6911HA - Series 2".
It is still possible to convert these switches to ESPHome by replacing the WB3S chip with a ESP-12E or ESP-12F chip and adding a 10k pull-down resister on GPIO15, as WB3S does not require it, and it is omitted from the board in some cases.

## GPIO Pinout

| Pin    | Function                       |
| ------ | ------------------------------ |
| GPIO4  | Status LED _(inverted)_        |
| GPIO12 | Button, Bottom                 |
| GPIO13 | Relay, Top _(includes LED)_    |
| GPIO14 | Relay, Bottom _(includes LED)_ |
| GPIO16 | Button, Top                    |

Note that each relay shares a pin with its associated LED; it's not possible to turn either relay on/off independently of its button LED.
The top/bottom designation here assumes that it is installed vertically, with the status LED (group of 6 dots) on the right-hand side.

### Suggested modification:
Is is possibe to gain control of button LEDs by removing diode(s) D7 / D5 / D9 (3 gang, pcb7395B Rev0.1) which decouples the LED(s) from the relay output(s). You would then solder a small wire from the cathode (-) side of the diode pad to a spare GPIO pin to gain control of the button LED individually. See [this image for an example](https://community-assets.home-assistant.io/optimized/4X/f/9/b/f9b1f8ea23ccc1049ea4eda1765e3f19fb173925_2_666x500.jpeg) (blue wires) [from this forum post](https://community.home-assistant.io/t/australian-light-switch-with-motion-sensor-local-control-show-and-tell/444612)



## Getting it up and running

### Tuya Convert

These switches are Tuya devices, so if you don't want to open them up to flash directly, you can attempt to [use tuya-convert to initially get ESPHome onto them](/guides/tuya-convert/) however recently purchased devices are no longer Tuya-Convert compatible. There's useful guide to disassemble and serial flash these switches [here.](https://blog.mikejmcguire.com/2020/05/22/deta-grid-connect-3-and-4-gang-light-switches-and-home-assistant/) After that, you can use ESPHome's OTA functionality to make any further changes.

- Put the switch into "smartconfig" / "autoconfig" / pairing mode by holding any button for about 5 seconds.
- The status LED (to the side of the button(s)) blinks rapidly to confirm that it has entered pairing mode.

## 1 & 2 Gang Basic Configuration

```yaml
substitutions:
  device_name: deta1-2gangswitch
  friendly_name: "1-2 Gang Switch"

#################################

esphome:
  platform: ESP8266
  board: esp01_1m
  name: ${device_name}
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_pwd
  fast_connect: on

api:
  password: !secret api_password

ota:
  password: !secret ota_password

logger:

# The web_server & sensor components can be removed without affecting core functionaility.
web_server:
  port: 80

sensor:
  - platform: wifi_signal
    name: ${device_name} Wifi Signal Strength
    update_interval: 60s
  - platform: uptime
    name: ${device_name} Uptime

#################################

status_led:
  pin:
    number: GPIO4
    inverted: True

output:
  # Top (or only) button
  - platform: gpio
    pin: GPIO13
    id: relay1

  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: gpio
    pin: GPIO14
    id: relay2

light:
  # Top (or only) button
  - platform: binary
    name: "${friendly_name} Top"
    output: relay1
    id: light1

  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: binary
    name: "${friendly_name} Bottom"
    output: relay2
    id: light2

# Buttons
binary_sensor:
  # Top (or only) button
  - platform: gpio
    pin:
      number: GPIO16
      mode: INPUT
      inverted: True
    name: "${friendly_name} Top Button"
    #toggle relay on push
    on_press:
      - light.toggle: light1

  # Bottom button (for Smart Double Switch - delete for single switch)
  - platform: gpio
    pin:
      number: GPIO12
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} Bottom Button"
    #toggle relay on push
    on_press:
      - light.toggle: light2

switch:
  - platform: restart
    name: "${friendly_name} REBOOT"
```

## 3 Gang Configuration

```yaml
substitutions:
  device_name: deta3gangswitch
  friendly_name: "3 Gang Switch"
  device_ip: 192.168.0.x

#################################

esphome:
  platform: ESP8266
  board: esp01_1m
  name: ${device_name}
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  manual_ip:
    static_ip: ${device_ip}
    gateway: 192.168.0.1
    subnet: 255.255.255.0
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ESPHOME"
    password: "12345678"

api:
  password: !secret api_password

ota:
  password: !secret ota_password

logger:

# The web_server & sensor components can be removed without affecting core functionaility.
web_server:
  port: 80

sensor:
  - platform: wifi_signal
    name: ${device_name} Wifi Signal Strength
    update_interval: 60s
  - platform: uptime
    name: ${device_name} Uptime

#################################

status_led:
  pin:
    number: GPIO0
    inverted: True

output:
  # 1st button
  - platform: gpio
    pin: GPIO5
    id: relay1

  # 2nd button
  - platform: gpio
    pin: GPIO14
    id: relay2

  # 3rd button
  - platform: gpio
    pin: GPIO12
    id: relay3

light:
  # 1st button
  - platform: binary
    name: "${friendly_name} 1st"
    output: relay1
    id: light1

  # 2nd button
  - platform: binary
    name: "${friendly_name} 2nd"
    output: relay2
    id: light2

  # 3rd button
  - platform: binary
    name: "${friendly_name} 3rd"
    output: relay3
    id: light3

# Buttons
binary_sensor:
  # 1st button
  - platform: gpio
    pin:
      number: GPIO16
      mode: INPUT
      inverted: True
    name: "${friendly_name} 1st Button"
    #toggle relay on push
    on_press:
      - light.toggle: light1

  # 2nd button
  - platform: gpio
    pin:
      number: GPIO4
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} 2nd Button"
    #toggle relay on push
    on_press:
      - light.toggle: light2

  # 3rd button
  - platform: gpio
    pin:
      number: GPIO3
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} 3rd Button"
    #toggle relay on push
    on_press:
      - light.toggle: light3

switch:
  - platform: restart
    name: "${friendly_name} REBOOT"
```

## 4 Gang Configuration

```yaml
substitutions:
  device_name: deta4gangswitch
  friendly_name: "4 Gang Switch"
  device_ip: 192.168.0.x

#################################

esphome:
  platform: ESP8266
  board: esp01_1m
  name: ${device_name}
  esp8266_restore_from_flash: true

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  manual_ip:
    static_ip: ${device_ip}
    gateway: 192.168.0.1
    subnet: 255.255.255.0
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "ESPHOME"
    password: "12345678"

api:
  password: !secret api_password

ota:
  password: !secret ota_password

logger:

# The web_server & sensor components can be removed without affecting core functionaility.
web_server:
  port: 80

sensor:
  - platform: wifi_signal
    name: ${device_name} Wifi Signal Strength
    update_interval: 60s
  - platform: uptime
    name: ${device_name} Uptime

#################################

status_led:
  pin:
    number: GPIO0
    inverted: True

output:
  # 1st button
  - platform: gpio
    pin: GPIO5
    id: relay1

  # 2nd button
  - platform: gpio
    pin: GPIO14
    id: relay2

  # 3rd button
  - platform: gpio
    pin: GPIO12
    id: relay3

  # 4th button
  - platform: gpio
    pin: GPIO15
    id: relay4

light:
  # 1st button
  - platform: binary
    name: "${friendly_name} 1st"
    output: relay1
    id: light1

  # 2nd button
  - platform: binary
    name: "${friendly_name} 2nd"
    output: relay2
    id: light2

  # 3rd button
  - platform: binary
    name: "${friendly_name} 3rd"
    output: relay3
    id: light3

  # 4th button
  - platform: binary
    name: "${friendly_name} 4th"
    output: relay4
    id: light4

# Buttons
binary_sensor:
  # 1st button
  - platform: gpio
    pin:
      number: GPIO16
      mode: INPUT
      inverted: True
    name: "${friendly_name} 1st Button"
    #toggle relay on push
    on_press:
      - light.toggle: light1

  # 2nd button
  - platform: gpio
    pin:
      number: GPIO4
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} 2nd Button"
    #toggle relay on push
    on_press:
      - light.toggle: light2

  # 3rd button
  - platform: gpio
    pin:
      number: GPIO3
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} 3rd Button"
    #toggle relay on push
    on_press:
      - light.toggle: light3

  # 4th button
  - platform: gpio
    pin:
      number: GPIO13
      mode: INPUT_PULLUP
      inverted: True
    name: "${friendly_name} 4th Button"
    #toggle relay on push
    on_press:
      - light.toggle: light4

switch:
  - platform: restart
    name: "${friendly_name} REBOOT"
```
