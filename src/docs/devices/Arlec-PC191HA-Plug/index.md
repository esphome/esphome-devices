---
title: Arlec Grid Connect Smart Plug In Socket With Energy Meter (PC191HA or PC191BKHA)
date-published: 2023-11-23
type: plug
standard: au
board: bk72xx
---

![Product Image](Arlec-PC191HA-Plug.jpg "Product Image")

The Arlec PC191HA power plug is part of the [Grid Connect ecosystem](https://grid-connect.com.au/) and is sold at Bunnings in Australia and New Zealand.  
These are available in White (PC191HA) or Black (PC191BKHA), and in 4-packs of White and Black - which are identical.  
It is compact, easily fitting side-by-side in double wall sockets.  

The Arlec Grid Connect Smart Plug In Socket With Energy Meter uses a WB2S module with BK7231T chip (a variant of bk72xx) and is supplied with Tuya firmware.  
As at the time of writing, they can be flashed without disassembly or soldering [using cloudcutter](#Using-Cloudcutter).  

NOTE: apparently from approx. May 2023 Bunning is now selling "series 2" units, which use a CB2S module.  These are clearly labelled as series 2 in bottom right corner of the box, and on the unit.  

Bunnings also have similar-looking Arlec Grid Connect variations:
     - PC192HA with USB,
     - PCTH01HA with Temperature And Humidity Sensor,
     - PC287HA Twin Socket with Energy Meter and Surge Protection,
     - PC193HA Multi-Function Socket With USB
I have NOT looked at any of these variations to find out if they are similar to PC191HA.  

## GPIO Pinout

| Pin | Function                             |
| --- | ------------------------------------ |
| P6  | (PWM0) Relay                         |
| P7  | (PWM1) BL0937 CF pin                 |
| P8  | (PWM2) BL0937 CF1 pin                |
| P24 | (PWM4) BL0937 SEL pin                |
| P26 | (PWM5) LED                           |
| P10 | (RXD1) Wifi LED (hidden inside unit) |
| P11 | (TXD1) Button                        |

## Getting it up and running

### Using Cloudcutter

Cloudcutter is a tool that simplifies flashing Tuya-based devices. It allows you to flash the firmware over Wi-fi, eliminating the need to physically open the device.  
Follow [these instructions](https://github.com/tuya-cloudcutter/tuya-cloudcutter) to flash your Arlec PC1914HA device using Cloudcutter.  
After that, you can use ESPHome's OTA functionality to make any further changes.  

### Note on Power Monitoring

Power measurement uses the BL0937 chip, which is similar to HLW8012 except CF and CF1 are inverted.  
I found that setting current_resistor to give an accurate Amperage does NOT also give the correct Wattage, so instead I calculate current from power and voltage.  

### After firmware update

After a firmware update the device will reboot, but using the OLD firmware.  
To activate the new firmware you will have to disconnect the device from power for a while.  
When you reconnect the device it may activate the new firmware (which could take a couple of minutes) before connecting to Wi-fi.  If it does not, simply power it off for a longer time (I have waited >6 hours powered off for one of these pesky devices to activate firmware).  

## Basic Configuration

```yaml
# Basic Config
substitutions:
  device_name: "arlec_PC191HA_1"
  name: "ARLEC PC191HA 1"

esphome:
  name: ${device_name}
  comment: ${name}

bk72xx:
  board: wb2s
  framework:
    version: dev

# OTA flashing
ota:
  - platform: esphome

wifi: # Your Wifi network details
  
# Enable fallback hotspot in case wifi connection fails  
  ap:

# Enabling the logging component
logger:

# Enable Home Assistant API
api:

#
# PC191HA basic switch operation - button, relay and LED
#
    # button is momentary on - shows "on" in HA except for the moment the button is being pressed
    # LED should have same on/off state as the relay.  
    # there is also a wifi_LED, but it is not seen from outside the case

binary_sensor:    # the button
  - platform: gpio
    pin: P11
    name: ${device_name} button
    id: button
    device_class: window
    # when button is pressed, toggle the switch on/off
    on_press:
      then:
        - switch.toggle: relay

switch:          # the relay
  - platform: gpio
    pin: P6
    name: ${name}
    id: relay
    restore_mode: always off   # default when power is turned on
    icon: mdi:power-socket-au
    # synchronise the LED with the relay
    on_turn_on:
      then:
        - output.turn_on: button_led
    on_turn_off:
      then:
        - output.turn_off: button_led

output:        # the light in the button
  - platform: gpio
    id: button_led
    pin: P26
#    restore_mode: always off   # default when power is turned on

#
# PC191HA sensors - power monitoring and wifi signal
#
sensor:
  - platform: wifi_signal         # report wi-fi signal strength from this end
    name: $name WiFi Signal
    id:   ${device_name}_wifi_signal
    update_interval: 30s    # how often to report wifi signal strength

    # PC191HA includes a BL0937 chip for measuring power consumption
    #     and BL0937 is a variation of hlw8012, but using inverted SEL pin functionality
  - platform: hlw8012
    model: BL0937     # note that the model must be specified to use special calculation parameters
    sel_pin:          # I believe that cf_pin reports either Voltage or Current depending on this select pin
      inverted: true  # determine whether true reports Voltage
      number: P24
    cf_pin:           # current or voltage (ele_pin: 7)
      inverted: true  # the logic of BL0937 is opposite from HLW8012
      number: P7
    cf1_pin:          #  Power (vi_pin: 8)
      inverted: true  # the logic of BL0937 is opposite from HLW8012
      number: P8

    update_interval: 15s      # How often to measure and report values

    # PC191HA measures and returns Voltage OR Current according to the value of sel_pin,
    #   but it can change the value of sel_pin periodically  
    initial_mode: "VOLTAGE"       # reports VOLTAGE or CURRENT
    change_mode_every: 4          # how many times to report before swapping between
        #   reporting Voltage or Current. Note that the first value reported should be ignored as inaccurate

    # Adjust according to the actual resistor values on board to calibrate the specific unit
    voltage_divider:  775     # LOWER VALUE GIVES LOWER VOLTAGE
    current_resistor: 0.0009  # HIGHER VALUE GIVES LOWER WATTAGE

    #
    # how the power monitoring values are returned to ESPHome
    #

    voltage:
      name: $name Voltage
      id:   ${device_name}_voltage
      unit_of_measurement: V
      accuracy_decimals: 1
      filters:
        - skip_initial: 2
    power:
      name: $name Power
      id:   ${device_name}_power
      unit_of_measurement: W
      accuracy_decimals: 2
      filters:
        - skip_initial: 2

    # power should simply be current x voltage -- except that the pc191ha doesn't follow that formula.  
    # Setting current_resistor to give an accurate Amperage does NOT also give the correct Wattage
    # so here I calculate current from power and voltage

  - platform: template  
    name: $name Current
    id:   ${device_name}_current
    unit_of_measurement: A
    accuracy_decimals: 2
    update_interval: "30s"
    lambda: |-
      return (id(${device_name}_power).state / id(${device_name}_voltage).state);
    filters:  
      - skip_initial: 2

  - platform: uptime
    name: $name Uptime
    id:   ${device_name}_uptime
    update_interval: "30s"

```

## References

https://www.elektroda.com/rtvforum/topic3944452.html - breakdown of PC191HA and discussion, including about series 2
https://templates.blakadder.com/arlec_PC191HA.html   - TASMOTA definition, which advises to replace the WB2S module
https://community.home-assistant.io/t/energy-consumption-and-arlec-grid-connect-tuya-smart-plug/335508/55
