---
title: Tontine Comfortech WiFi Electric Blanket (039-WIFI)
date-published: 2025-05-18
type: misc
standard: au
board: ESP8266
difficulty: 4
---

Tried using Tuya-Convert (OTA), but did not work. Hence, instead opened it up. Needs a small hex screwdriver.

The Tontine Comfortech WiFi Electric Blanket has a TYWE3S Tuya board that uses TuyaMCU.

              ┌─────────────┐               
              │ ┌─┬─┐ ┌─┐ ┌┐│               
              │ │ │ │ │ │ │││               
              │ │ │ └─┘ └─┘││               
              ├─┴─┴────────┴┤               
         RST ─┼─           ─┼─ TX           
              │             │               
         ADC ─┼─           ─┼─ RX           
              │             │               
          EN ─┼─           ─┼─ GPIO5        
              │             │               
      GPIO16 ─┼─           ─┼─ GPIO4        
              │             │               
      GPIO14 ─┼─           ─┼─ GPIO0        
              │             │               
      GPIO12 ─┼─           ─┼─ GPIO2        
              │             │               
      GPIO13 ─┼─           ─┼─ GPIO15       
              │             │               
         VCC ─┼─           ─┼─ GND          
              │             │               
              └─────────────┘       
  
Using a serial to USB adaptor, connect GND, TX, RX, 3.3 to GND, RX, TX, and VCC of the TYWE3S. Also, GND needs to be connected to GPIO0, to ensure it goes in to programming mode.

Since it utilises TuyaMCU, it uses datapoint-IDs. There are four of them:

   dpid Power on/off = 1
   dpid Heat Level = 4
      hot/warm/sleep = 0/1/2
   dpid Timer in hrs: 9
   dpid Timer in mins = 10

All of them can be controlled in ESPHome, except for dpid 10, which seems to be read-only.

## Basic Configuration

```yaml
esphome:
 name: tontine-electric-blanket-01
 friendly_name: Tontine Comfortech Electric Blanket 01

esp8266:
 board: esp01_1m

# Enable logging
logger:
 baud_rate: 0

tuya:

uart:
 tx_pin: TX
 rx_pin: RX
 baud_rate: 9600

ota:
 - platform: esphome
   password: "<whatever password is>"

safe_mode:
 reboot_timeout: 10min
 num_attempts: 5

wifi:
 ssid: !secret wifi_ssid
 password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
 ap:
  ssid: "TontineEB"
  password: "<whatever>"

captive_portal:

mdns:

web_server:
 include_internal: true

switch:
 - platform: "tuya"
   name: "Power"
   switch_datapoint: 1

 - platform: restart
   name: "Restart"
   id: device_restart

 - platform: safe_mode
   name: Use Safe Mode
   id: device_safe_mode

select:
 - platform: "tuya"
   id: heatselection
   name: "Heat selection"
   enum_datapoint: 4
   optimistic: true
   options:
    0: "HOT"
    1: "WARM"
    2: "SLEEP"

 - platform: "tuya"
   name: "Timer selection (hours)"
   enum_datapoint: 9
   optimistic: true
   options:
    0: "1"
    1: "2"
    2: "3"
    3: "4"
    4: "5"
    5: "6"
    6: "7"
    7: "8"
    8: "9"
    9: "10"

sensor:
 - platform: "tuya"
   name: "Timer Remaining (mins)"
   sensor_datapoint: 10
```
