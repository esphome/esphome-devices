---
title: ESP32 Battery Powered Temperature/Humidity/AtmosphericPressure
date-published: 2019-11-01
type: generic ESP32 with battery connection and charger.
standard: global
---
Example how to use Deep Sleep. No GPIOs need to be linked on ESP32 to enable deep sleep like they do on ESP8266. You can safely set the run time to zero and the sleep time the same as the update interval. 

The device wakes up reads the values from the bme280 and sends them via MQTT. I used MQTT rather than API because this will be in a remote location and I was not sure API would work with the Home Assistant server behind one NAT firewall and the ESP32 behind another with the internet in the middle. Yes I know its a security risk, thats why MQTT is on a non standard port to reduce likelyhood of people constantly hitting my Mosquitto server.

I use **`fast_connect`** and reduced logging to **INFO** rather than the default **DEBUG**  in the hope of shaving off a second or so from the wake time. Boot to Sleep time is around two seconds, most of which is connecting to wifi, this could be shortened by setting a static IP. My battery should last a long time. None of my multimeters was able to measure the current drawn by the ESP32 in deep sleep mode. 

Setting the MQTT Birth and Will message to blank stops the device from going *Unavailable* while it is asleep which messes with history graphs, you get lots of dots/broken lines

oversampling on BME280 is set to 1X to speed up reads. The i2c address for bme280 and bmp280 have to be set to 0x76, the default of 0x77 does not work with either of the devices I have. BME280 tend to read temperatures slightly hotter than reality, I offset the temperature by 3C, I have not done exhaustive calibration YMMV.

## Log Output

```
[16:13:53]ets Jun  8 2016 00:22:57
[16:13:53]
[16:13:53]rst:0x5 (DEEPSLEEP_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
[16:13:53]configsip: 0, SPIWP:0xee
[16:13:53]clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00
[16:13:53]mode:DIO, clock div:2
[16:13:53]load:0x3fff0018,len:4
[16:13:53]load:0x3fff001c,len:928
[16:13:53]ho 0 tail 12 room 4
[16:13:53]load:0x40078000,len:9280
[16:13:53]load:0x40080400,len:5860
[16:13:53]entry 0x40080698
[16:13:53][I][logger:116]: Log initialized
[16:13:53][I][app:028]: Running through setup()...
[16:13:53][I][wifi:164]: WiFi Connecting to 'home'...
[16:13:55][I][wifi:380]: WiFi connected!
[16:13:55][I][mqtt:162]: Connecting to MQTT...
[16:13:55][I][mqtt:202]: MQTT Connected!
[16:13:55][I][app:060]: setup() finished successfully!
[16:13:55][I][deep_sleep:067]: Beginning Deep Sleep
```

## Basic Configuration
```yaml
esphome:
  name: bedford
  platform: ESP32
  board: esp32dev

wifi:
  ssid: 'home'
  password: 'fileybay'
  fast_connect: true

mqtt:
  broker: *redacted*.co.uk
  port: 23046
  username: *redacted*
  password: *redacted*
  birth_message:
  will_message:

logger:
  level: INFO

ota:
  password: *redacted*

i2c:
  sda: 16
  scl: 17


sensor:
  - platform: bme280
    temperature:
      name: "bford temp"
      oversampling: 1x
      filters:
        - offset: -3
    pressure:
      name: "bford pres"
      oversampling: 1x
    humidity:
      name: "bford humi"
      oversampling: 1x
    address: 0x76
    update_interval: 20min

deep_sleep:
  run_duration: 0s
  sleep_duration: 20min

```
