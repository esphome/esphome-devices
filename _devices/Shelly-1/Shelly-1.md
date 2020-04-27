---
title: Shelly 1
date-published: 2019-10-20
type: switch
standard: uk, us, eu
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO4   | Relay                              |
| GPIO5   | Switch Input                       |

## Basic Configuration
```yaml
# Basic Config
esphome:
  name: shelly_1
  platform: ESP8266
  board: esp01_1m

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
api:
ota:

# Device Specific Config
output:                                
  - platform: gpio                     
    pin: GPIO4                         
    id: shelly_1_relay                         
                                       
light:                                 
  - platform: binary                   
    name: "Shelly 1 Light"              
    output: shelly_1_relay                     
    id: lightid                        
                                       
binary_sensor:                         
  - platform: gpio                     
    pin:                               
      number: GPIO5                    
      #mode: INPUT_PULLUP              
      #inverted: True                  
    name: "Switch Shelly 1"             
    on_state:                          
      then:                            
        - light.toggle: lightid        
    internal: true                     
    id: switchid                       
```