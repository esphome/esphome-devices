---
title: Shelly Plus 2PM
date-published: 2022-05-07
type: switch
standard: eu
---

## GPIO Pinout

| Pin    | Function                    |
| ------ | --------------------------- |
| GPIO0  | LED (Inverted)              |
| GPIO2  | Switch 1 Input              |
| GPIO12 | Relay 2                     |
| GPIO13 | Relay 1                     |
| GPIO18 | Switch 2 Input              |
| GPIO25 | I2c SCL                     |
| GPIO26 | Output High                 |
| GPIO27 | Button (Inverted, Pull-up)  |
| GPIO33 | I2c SDA                     |
| GPIO36 | ADE7953_IRQ (power meter)   |
| GPIO37 | Internal Temperature        |

The Shelly Plus 2PM is based on the ESP32-U4WDH (Single core, 160MHz, 4MB embedded flash)

Please calibrate the NTC and the voltage / power measurements, the values below are just a rough estimate!

Credit to:
- https://templates.blakadder.com/shelly_plus_2PM.html

## Configuration for detached switch mode and toggle light switch. 
Includes overpower and overtemperature protection. 
Will toggle a smart bulb in home assistant and has fallback to local power switching when connecion to home assitant is down.

```yaml
esphome:
  name: shelly-plus-2pm
  platformio_options:
    board_build.f_cpu: 160000000L
    
substitutions:
  device_name_1: "Shelly Plus 2PM Switch 1"
  device_name_2: "Shelly Plus 2PM Switch 2"
  #Home Assistant light bulb to toggle
  bulb_name_1: "light.smart_bulb_1"
  bulb_name_2: "light.smart_bulb_2"
  
  max_power: "3600.0"
  max_temp: "80.0"

esp32:
  board: esp32doit-devkit-v1
  framework:
    type: esp-idf
    sdkconfig_options:
      CONFIG_FREERTOS_UNICORE: y
      CONFIG_ESP32_DEFAULT_CPU_FREQ_160: y
      CONFIG_ESP32_DEFAULT_CPU_FREQ_MHZ: "160"

# Enable logging
logger:

# Enable Home Assistant API
api:

ota:
  password: !secret ota_password

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  fast_connect: true

time:
  - platform: homeassistant

i2c:
  sda: GPIO33
  scl: GPIO25
  
output:
  - platform: gpio
    id: "relay_output_1"
    pin: GPIO13
    
  - platform: gpio
    id: "relay_output_2"
    pin: GPIO12

#Shelly Switch Output
switch:
  - platform: output
    id: "relay_1"
    name: "${device_name_1} Output"
    output: "relay_output_1"
    restore_mode: RESTORE_DEFAULT_OFF
    
  - platform: output
    id: "relay_2"
    name: "${device_name_2} Output"
    output: "relay_output_2"
    restore_mode: RESTORE_DEFAULT_OFF

# Restart Button
button:
  - platform: restart
    id: "restart_device"
    name: "${device_name_1} Restart"
    entity_category: 'diagnostic'
    
#home assistant bulb to switch
text_sensor:
  - platform: homeassistant
    id: 'ha_bulb_1'
    entity_id: "${bulb_name_1}"
    internal: true
  - platform: homeassistant
    id: 'ha_bulb_2'
    entity_id: "${bulb_name_2}"
    internal: true
    
binary_sensor:
  #Shelly Switch Input 1
  - platform: gpio
    name: "${device_name_1} Input"
    pin: GPIO2
    #small delay to prevent debouncing
    filters:
      - delayed_on_off: 50ms
    # config for state change of input button
    on_state:
        then:
          - if:
              condition:
                and:
                  - wifi.connected:
                  - api.connected:
                  - switch.is_on: "relay_1"
                  - lambda: 'return (id(ha_bulb_1).state == "on" || id(ha_bulb_1).state == "off");'
              # toggle smart light if wifi and api are connected and relay is on
              then:
                - homeassistant.service:
                    service: light.toggle
                    data:
                      entity_id: "${bulb_name_1}"
              else:
                - switch.toggle: "relay_1"
                
  #Shelly Switch Input 2          
  - platform: gpio
    name: "${device_name_2} Input"
    pin: GPIO18
    #small delay to prevent debouncing
    filters:
      - delayed_on_off: 50ms
    # config for state change of input button
    on_state:
        then:
          - if:
              condition:
                and:
                  - wifi.connected:
                  - api.connected:
                  - switch.is_on: "relay_2"
                  - lambda: 'return (id(ha_bulb_2).state == "on" || id(ha_bulb_2).state == "off");'
              # toggle smart light if wifi and api are connected and relay is on
              then:
                - homeassistant.service:
                    service: light.toggle
                    data:
                      entity_id: "${bulb_name_2}"
              else:
                - switch.toggle: "relay_2"
                
  #reset button on device    
  - platform: gpio
    name: "${device_name_1} Button"
    pin:
      number: GPIO27
      inverted: yes
      mode:
        input: true
        pullup: true
    on_press:
      then:
        - button.press: "restart_device"
    filters:
      - delayed_on_off: 5ms
    internal: true

sensor:
  # Uptime sensor.
  - platform: uptime
    name: ${device_name_1} Uptime
    entity_category: 'diagnostic'
    update_interval: 300s

  # WiFi Signal sensor.
  - platform: wifi_signal
    name: ${device_name_1} WiFi Signal
    update_interval: 60s
    entity_category: 'diagnostic'
  
  #temperature sensor
  - platform: ntc
    sensor: temp_resistance_reading
    name: "${device_name_1} Temperature"
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    icon: "mdi:thermometer"
    entity_category: 'diagnostic'
    calibration:
      #These default values don't seem accurate
      b_constant: 3350
      reference_resistance: 10kOhm
      reference_temperature: 298.15K
      #Alternative calibration values based on IR thermometer reading with case removed
      #- 2.284kOhm -> 48°C
      #- 10.19kOhm -> 17°C
      #- 5.856kOhm -> 25°C
    on_value_range:
      - above: ${max_temp}
        then:
          - switch.turn_off: "relay_1"
          - switch.turn_off: "relay_2"
          - homeassistant.service:
                service: persistent_notification.create
                data:
                  title: "Message from ${device_name_1}, ${device_name_2}"
                data_template:
                  message: "Switch turned off because temperature exceeded ${max_temp}°C"

  - platform: resistance
    id: temp_resistance_reading
    sensor: temp_analog_reading
    configuration: DOWNSTREAM
    resistor: 6kOhm
    
  - platform: adc
    id: temp_analog_reading
    pin: GPIO37
    attenuation: 11db
    update_interval: 60s

  #power monitoring
  - platform: ade7953
    irq_pin: GPIO36 # Prevent overheating by setting this
    voltage:
      name: ${device_name_1} voltage
      entity_category: 'diagnostic'
    # On the Shelly 2.5 channels are mixed ch1=B ch2=A
    current_a:
      name: ${device_name_2} current
      entity_category: 'diagnostic'
    current_b:
      name: ${device_name_1} current
      entity_category: 'diagnostic'
    active_power_a:
      name: ${device_name_2} power
      id: power_channel_2
      entity_category: 'diagnostic'
      # active_power_a is normal, so don't multiply by -1
      on_value_range:
        - above: ${max_power}
          then:
            - switch.turn_off: "relay_2"
            - homeassistant.service:
                service: persistent_notification.create
                data:
                  title: "Message from ${device_name_2}"
                data_template:
                  message: "Switch turned off because power exceeded ${max_power}W" 
    active_power_b:
      name: ${device_name_1} power
      id: power_channel_1
      entity_category: 'diagnostic'
      # active_power_b is inverted, so multiply by -1
      filters:
        - multiply: -1
      on_value_range:
        - above: ${max_power}
          then:
            - switch.turn_off: "relay_1"
            - homeassistant.service:
                service: persistent_notification.create
                data:
                  title: "Message from ${device_name_1}"
                data_template:
                  message: "Switch turned off because power exceeded ${max_power}W" 
    update_interval: 30s

status_led:
  pin:
    number: GPIO0
    inverted: true
 ```
