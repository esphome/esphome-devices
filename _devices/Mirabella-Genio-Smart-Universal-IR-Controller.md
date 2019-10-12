---
title: Mirabella Genio Smart Universal IR Controller
date-published: 2019-10-11
type: misc
standard: au
---

1. TOC
{:toc}

## GPIO Pinout

| Pin     | Function                           |
|---------|------------------------------------|
| GPIO4   | Red Status LED                     |
| GPIO14  | Remote Transmitter                 |
| GPIO5   | Remote Reciever                    |

## Basic Configuration
```yaml
# Basic Config
# https://mirabellagenio.net.au/smart-ir-controller
---
esphome:
  name: esphome_ir1
  platform: ESP8266
  board: esp01_1m
  on_boot:
    priority: 100 # Highest priority, ensures light turns on without delay.
    then:
      - light.turn_on: light_red_led
wifi:
  ssid: 'ssid'
  password: 'wifi_password'
  ap:
    ssid: 'apssid'
    password: 'ap_password'
  domain: '.mydomain.com'
  
# Enable logging
logger:

# Enable Home Assistant API
api:
  password: 'api_password'

ota:
  password: 'ota_password'
web_server:

sensor:
  - platform: wifi_signal
    name: "ESPHome_ir1 Wifi"
    update_interval: 60s
    
remote_transmitter:
  pin: GPIO14
  carrier_duty_percent: 33%
  
remote_receiver:
  pin: 
    number: GPIO5
    inverted: True
 #dump: jvc
  
binary_sensor:
  - platform: remote_receiver
    name: "Sony_TV(RF-On)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: sony_tv_power
            state: ON
    sony:
      data: '0x750'
      nbits: 12
  - platform: remote_receiver
    name: "Sony_TV(RF-Off)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: sony_tv_power
            state: OFF
    sony:
      data: '0xF50'
      nbits: 12
      
  - platform: remote_receiver
    name: "WIZ(RF-ON)"
    internal: true
    jvc:
      data: '0xC03F'
    on_press:
      then:
        - switch.template.publish:
            id: wiz_rf_power
            state: ON
            
  - platform: remote_receiver
    name: "WIZ(RF-OFF)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: wiz_rf_power
            state: OFF
    jvc:
      data: '0x40BF'
      
  - platform: remote_receiver
    name: "WIZ(RF-Brightness -)"
    jvc:
      data: '0x906F'
      
  - platform: remote_receiver
    name: "WIZ(RF-Brightness +)"
    jvc:
      data: '0x10EF'
      
  - platform: remote_receiver
    name: "WIZ(RF-1)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: wiz_rf_1
            state: ON
        - switch.template.publish:
            id: wiz_rf_2
            state: OFF
        - switch.template.publish:
            id: wiz_rf_3
            state: OFF
        - switch.template.publish:
            id: wiz_rf_4
            state: OFF
    jvc:
      data: '0x20DF'
      
  - platform: remote_receiver
    name: "WIZ(RF-2)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: wiz_rf_1
            state: OFF
        - switch.template.publish:
            id: wiz_rf_2
            state: ON
        - switch.template.publish:
            id: wiz_rf_3
            state: OFF
        - switch.template.publish:
            id: wiz_rf_4
            state: OFF
    jvc:
      data: '0xA05F'

  - platform: remote_receiver
    name: "WIZ(RF-3)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: wiz_rf_1
            state: OFF
        - switch.template.publish:
            id: wiz_rf_2
            state: OFF
        - switch.template.publish:
            id: wiz_rf_3
            state: ON
        - switch.template.publish:
            id: wiz_rf_4
            state: OFF
    jvc:
      data: '0xE01F'

  - platform: remote_receiver
    name: "WIZ(RF-4)"
    internal: true
    on_press:
      then:
        - switch.template.publish:
            id: wiz_rf_1
            state: OFF
        - switch.template.publish:
            id: wiz_rf_2
            state: OFF
        - switch.template.publish:
            id: wiz_rf_3
            state: OFF
        - switch.template.publish:
            id: wiz_rf_4
            state: ON
    jvc:
      data: '0x609F'

switch:
  - platform: restart
    name: "ESPHome_ir1 restart"
  - platform: template
    name: Sony TV Power
    id: sony_tv_power
    optimistic: true
    restore_state: true
    turn_on_action:
      - remote_transmitter.transmit_sony:
          data: '0x750'
          nbits: 12
          repeat:
            times: 3
            wait_time: 40ms
    turn_off_action:
      - remote_transmitter.transmit_sony:
          data: '0xF50'
          nbits: 12
          repeat:
            times: 3
            wait_time: 40ms

  - platform: template
    name: WIZ mode 1
    id: wiz_rf_1
    optimistic: true
    restore_state: true

  - platform: template
    name: WIZ mode 2
    id: wiz_rf_2
    optimistic: true
    restore_state: true
    
  - platform: template
    name: WIZ mode 3
    id: wiz_rf_3
    optimistic: true

  - platform: template
    name: WIZ mode 4
    id: wiz_rf_4
    optimistic: true
    restore_state: true  
   
  - platform: template
    name: WIZ Remote Power
    id: wiz_rf_power
    optimistic: true
    restore_state: true
    turn_on_action:
      - remote_transmitter.transmit_jvc:
          data: '0xC03F'
    turn_off_action:
      - remote_transmitter.transmit_jvc:
          data: '0x40BF'
  
    
output:
  - platform: esp8266_pwm
    id: esphome_ir1_red_led
    pin:
      number: GPIO4
      inverted: True

light:
  - platform: monochromatic
    name: "esphome_ir1 Red LED"
    output: esphome_ir1_red_led
    id: light_red_led
```
