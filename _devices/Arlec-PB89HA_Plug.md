---
title: Arlec PCB89HA Power Board
date-published: 2020-01-04
type: plug
standard: au
---
1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO1   | LED (Inverted: true)               |
| GPIO3   | Button (Inverted: true)            |
| GPIO04  | Relay 2                            |
| GPIO05  | Relay 1                            |
| GPIO12  | Relay 4                            |
| GPIO13  | Relay 3                            |

## Basic Configuration

```yaml
# Basic Config
substitutions:
  device_name: "arlec_PCB89HA_1"
  name: "ARLEC PCB89HA"
  
esphome:
  name: ${device_name}
  comment: ${name}
  platform: ESP8266
  board: esp01_1m
  
wifi:
  ssid: 'ssid'
  password: 'password'
  
logger:
  # Important! The status LED and button are on the Pins used by UART0
  hardware_uart: UART1

api:
  password: 'api_password'

ota:
  password: 'ota_password'
  
status_led:
  pin: 
    number: GPIO1
    inverted: True
  
sensor:
  - platform: uptime
    name: ${name} Uptime
    
  - platform: wifi_signal
    name: ${name} Signal
    update_interval: 300s

binary_sensor:
  - platform: gpio
    pin: 
      number: GPIO3
      inverted: True
    name: ${name} button
    internal: True
    on_multi_click:
      # Support a single or double click to switch on each relay
      - timing:
          # Single click
          - ON for at most 1s
          - OFF for at least 0.5s
        then:
          - switch.toggle: relay_a

      - timing:
          # Double click
          - ON for at most 1s
          - OFF for at most 1s
          - ON for at most 1s
          - OFF for at least 0.2s
        then:
          - switch.toggle: relay_b

switch:
  - platform: gpio
    pin: GPIO05
    name: "${name} - A"
    id: relay_a
    restore_mode: always off
    icon: mdi:power-socket-au
          
  - platform: gpio
    pin: GPIO04
    name: "${name} - B"
    id: relay_b
    restore_mode: always off
    icon: mdi:power-socket-au

  - platform: gpio
    pin: GPIO13
    name: "${name} - C"
    id: relay_c
    restore_mode: always off
    icon: mdi:power-socket-au
          
  - platform: gpio
    pin: GPIO12
    name: "${name} - D"
    id: relay_d
    restore_mode: always off
    icon: mdi:power-socket-au
```

An alternate switching behavour.  short press turn on the next socket that is off (from 1 to 4) , once all are on short press will turn all off.   A double press will turn the next socket off (from 1 to 4) , once all are off a double press will turn all on.  A long press with turn alloff if any are on, or will turn all on.
```yaml
binary_sensor:
  - platform: gpio
    name: ${short_name}
    pin:
      number: GPIO3
      inverted: True
    id: button1
    on_multi_click:
    - timing:
        - ON for at most 0.5s
        - OFF for at least 0.5s
      then:
        lambda: |-
          if (! id(relay1).state  ) {
            id(relay1).turn_on();                                                                                                                                                                                                         
          } else if ( ! id(relay2).state ) {                                                                                                                                                                                              
            id(relay2).turn_on();                                                                                                                                                                                                         
          } else if ( ! id(relay3).state ) {                                                                                                                                                                                              
            id(relay3).turn_on();                                                                                                                                                                                                         
          } else if ( ! id(relay4).state ) {                                                                                                                                                                                              
            id(relay4).turn_on();                                                                                                                                                                                                         
          } else {                                                                                                                                                                                                                        
            id(relay1).turn_off();                                                                                                                                                                                                        
            id(relay2).turn_off();                                                                                                                                                                                                        
            id(relay3).turn_off();                                                                                                                                                                                                        
            id(relay4).turn_off();                                                                                                                                                                                                        
          }                                                                                                                                                                                                                               
    - timing:
        - ON for at most 0.5s
        - OFF for at most 0.5s
        - ON for at most 0.5s
        - OFF for at least 0.2s
      then:
        lambda: |-
          if ( id(relay1).state  ) {
            id(relay1).turn_off();                                                                                                                                                                                                        
          } else if (  id(relay2).state ) {                                                                                                                                                                                               
            id(relay2).turn_off();                                                                                                                                                                                                        
          } else if (  id(relay3).state ) {                                                                                                                                                                                               
            id(relay3).turn_off();                                                                                                                                                                                                        
          } else if (  id(relay4).state ) {                                                                                                                                                                                               
            id(relay4).turn_off();                                                                                                                                                                                                        
          } else {                                                                                                                                                                                                                        
            id(relay1).turn_on();                                                                                                                                                                                                         
            id(relay2).turn_on();                                                                                                                                                                                                         
            id(relay3).turn_on();                                                                                                                                                                                                         
            id(relay4).turn_on();                                                                                                                                                                                                         
          }                                                                                                                                                                                                                               
    - timing:
        - ON for at least 0.5s
        - OFF for at least 0.2s
      then:
        lambda: |-
          if (id(relay1).state || 
          id(relay2).state ||                                                                                                                                                                                                             
          id(relay3).state ||                                                                                                                                                                                                             
          id(relay4).state ) {                                                                                                                                                                                                            
            id(relay1).turn_off();                                                                                                                                                                                                        
            id(relay2).turn_off();                                                                                                                                                                                                        
            id(relay3).turn_off();                                                                                                                                                                                                        
            id(relay4).turn_off();                                                                                                                                                                                                        
          } else {                                                                                                                                                                                                                        
            id(relay1).turn_on();                                                                                                                                                                                                         
            id(relay2).turn_on();                                                                                                                                                                                                         
            id(relay3).turn_on();                                                                                                                                                                                                         
            id(relay4).turn_on();                                                                                                                                                                                                         
          }  
```
