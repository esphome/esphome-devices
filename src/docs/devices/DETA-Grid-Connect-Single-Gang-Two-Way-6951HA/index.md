---
title: DETA Grid Connect Smart Switch Single Gang Two-Way 6951HA
date-published: 2024-05-21
type: switch
standard: au
board: bk72xx
---

## General Notes

The DETA [Smart Single Gang Two Way (6951HA)](https://www.bunnings.com.au/deta-grid-connect-smart-single-gang-2-way-touch-light-switch_p0346910) is made by Arlec as part of the [Grid Connect ecosystem](https://grid-connect.com.au/), and is sold at Bunnings in Australia (unfortunantly at time of writing it isn't sold in New Zealand).

### Series 1

Not labeled as Series 1 as there is no Series 2 at this time.
These devices are using the Beken BK7231T microcontroller and can be OTA flashed using using Cloudcutter.

The known Tuya firmware on these switches is 1.1.5 and you can use the “Lonsonho” brand “X801A 1-Gang Switch” option in Cloudcutter.

## Getting it up and running

### Cloudcutter

[Cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter) is a tool designed to simplify the process of flashing Tuya-based devices. It allows you to bypass the need for physically opening the device and swapping out chips. By leveraging the cloud APIs, Cloudcutter enables you to flash the firmware remotely, making it a convenient and less intrusive option. Follow the instructions on the [Cloudcutter GitHub repository](https://github.com/tuya-cloudcutter/tuya-cloudcutter) to use this method for flashing your device.

### Disassembly

If you can't or don't wish to use Cloudcutter, you can flash directly to the outlet with USB to serial adapter.

## Overview

This guide covers the DETA Smart One Gang / Two-Way Switch, specifically the [Smart Single Switch Two Way (6951HA)]([https://www.bunnings.com.au/deta-smart-single-gang-light-switch-touch-activated-with-grid-connect_p0098811]), which is part of the [Grid Connect ecosystem](https://grid-connect.com.au/). These switches are available at Bunnings stores in Australia (at time of writing, not available in New Zealand).

## Series Information

### Series 1 - Flashing

- **Microcontroller**: Beken BK7231T
- **Flashing Method**: OTA via Cloudcutter

## Setup Guide

### Using Cloudcutter

[Cloudcutter](https://github.com/tuya-cloudcutter/tuya-cloudcutter) is a tool designed to simplify the flashing process. Follow the [official guide](https://github.com/tuya-cloudcutter/tuya-cloudcutter) for instructions.

### Manual Flashing

Manual Flashing has not been tested on this specific model, but other models with the same chip have been tested and these manual steps work, you'll need a USB to serial adapter. Follow the disassembly steps below:

1. Remove the front plastic face.
2. Unscrew the two exposed screws.
3. Remove the clear panel and the small PCB underneath.

> **Tip**: You can convert these switches to ESPHome by replacing the WB3S chip with an ESP-12E or ESP-12F chip and adding a 10k pull-down resistor on GPIO15.

## GPIO Pinouts

### BK72XX-Based Models

| Pin    | Function                                                                          |
| ------ | --------------------------------------------------------------------------------- |
| P8     | Power Status of actual light, taking into account both switches  _(inverted)_     |
| P9     | Other members have stated this is the Remote Switch status, but unable to confirm |
| P14    | Relay,  _(includes LED)_                                                     |
| P24    | Status LED  _(inverted)_                                                           |
| P26    | Button  _(inverted)_

> **Note**: Each relay shares a pin with its associated LED.

## Advanced Modifications

To gain individual control of button LEDs, remove specific diodes and solder a wire from the cathode side of the diode pad to a spare GPIO pin. [See this example](https://community-assets.home-assistant.io/optimized/4X/f/9/b/f9b1f8ea23ccc1049ea4eda1765e3f19fb173925_2_666x500.jpeg).

## Configuration Examples

### 1 Gang Configuration for the BK72XX device

```yaml
substitutions:
  devicename: "deta-2way-single-gang"
  friendlyname: Deta 2-way Single Gang Switch
  deviceid: deta_single_gang_two_way
  deviceicon: "mdi:light-recessed"
  devicemodel: Deta Grid Connect Single Gang Two-Way 6951HA

#################################
esphome:
  name: ${devicename}

bk72xx:
  board: generic-bk7231t-qfn32-tuya

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: ${devicename}
    password: !secret fallback_password

# Enable logging
logger:

captive_portal:

# Enable Home Assistant API
api:
  encryption:
     key: !secret esphome_api_encryption_key

ota:
  password: !secret esphome_ota_password

web_server:
  port: 80
  auth:
    username: !secret esphome_web_username
    password: !secret esphome_web_password



#################################

## ---------------- ##
##    Status LED    ##
## ---------------- ##
status_led:
  pin:
    number: P24
    inverted: true

## ---------------- ##
##      Relays      ##
## ---------------- ##
output:
  # Relay
  - platform: gpio
    id: relay
    pin: P14

## ------------ ##
##     Light    ##
## ------------ ##
light:
  # Light - keeping as internal as I found it worked but if you used the other switch 2-way switch, that HA would say the light was off when the light was actually on.
  # Using the Switch at the bottom of the config to keep everything in order. But then in HA you have to set the Switch that shows up to show up as a Light.
  - platform: binary
    icon: ${deviceicon}
    output: relay
    id: light
    internal: true

## ----------------- ##
##      Buttons      ##
## ----------------- ##
binary_sensor:
  # Button
  - platform: gpio
    id: button
    pin:
      number: P26
      inverted: true
      mode: INPUT_PULLUP
    on_press:
      then:
        - light.toggle: light
    internal: True
  
  - platform: gpio
    id: remote_switch
    pin:
      number: P8
      mode: INPUT_PULLUP
      inverted: true  
    name: "Status from both Switches"


## ---------------- ##
##     Switches     ##
## ---------------- ##
switch:
# Keep the light in HA in sync when using 2nd phyiscal switch
  - platform: template
    name: ${friendlyname}
    id: lounge_deta_2way_single_gang_template
    icon: ${deviceicon}
    lambda: |-
      if (id(remote_switch).state) {
        return true;
      } else {
        return false;
      }
    turn_on_action:
    - if:
        condition:
          - binary_sensor.is_off: remote_switch
        then:
          - light.toggle: light
    turn_off_action:
    - if:
        condition:
          - binary_sensor.is_on: remote_switch
        then:
          - light.toggle: light
```

### Add Reboot button to HA

```yaml
switch:
  - platform: restart
    name: ${friendlyname} REBOOT
```
