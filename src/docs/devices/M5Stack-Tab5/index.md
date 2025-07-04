---
title: M5Stack Tab5
date-published: 2025-07-05
type: misc
standard: global
board: esp32
project-url: https://docs.m5stack.com/en/core/Tab5
---

## Description

TBD

## Example Configuration

```yaml
esphome:
  name: m5stack-tab5
  friendly_name: M5Stack Tab5

esp32:
  board: esp32-p4-evboard
  flash_size: 16MB
  framework:
    type: esp-idf
    advanced:
      enable_idf_experimental_features: true

esp32_hosted:
  variant: esp32c6
  active_high: true
  clk_pin: GPIO12
  cmd_pin: GPIO13
  d0_pin: GPIO11
  d1_pin: GPIO10
  d2_pin: GPIO9
  d3_pin: GPIO8
  reset_pin: GPIO15
  slot: 1

logger:
  hardware_uart: USB_SERIAL_JTAG

psram:
  mode: hex
  speed: 200MHz

api:

ota:
  platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

i2c:
  - id: bsp_bus
    sda: GPIO31
    scl: GPIO32
    frequency: 400kHz

pi4ioe5v6408:
  - id: pi4ioe1
    address: 0x43
    # 0: O - wifi_antenna_int_ext
    # 1: O - speaker_enable
    # 2: O - external_5v_power
    # 3: NC
    # 4: O - lcd reset
    # 5: O - touch panel reset
    # 6: O - camera reset
    # 7: I - headphone detect
  - id: pi4ioe2
    address: 0x44
    # 0: O - wifi_power
    # 1: NC
    # 2: NC
    # 3: O - usb_5v_power
    # 4: O - poweroff pulse
    # 5: O - quick charge enable (inverted)
    # 6: I - charging status
    # 7: O - charge enable

switch:
  - platform: gpio
    id: wifi_power
    name: "WiFi Power"
    pin:
      pi4ioe5v6408: pi4ioe2
      number: 0
    restore_mode: ALWAYS_ON
  - platform: gpio
    id: usb_5v_power
    name: "USB Power"
    pin:
      pi4ioe5v6408: pi4ioe2
      number: 3
  - platform: gpio
    id: quick_charge
    name: "Quick Charge"
    pin:
      pi4ioe5v6408: pi4ioe2
      number: 5
      inverted: true
  - platform: gpio
    id: charge_enable
    name: "Charge Enable"
    pin:
      pi4ioe5v6408: pi4ioe2
      number: 7

  - platform: gpio
    id: wifi_antenna_int_ext
    pin:
      pi4ioe5v6408: pi4ioe1
      number: 0
  - platform: gpio
    id: speaker_enable
    name: "Speaker Enable"
    pin:
      pi4ioe5v6408: pi4ioe1
      number: 1
    restore_mode: ALWAYS_ON
  - platform: gpio
    id: external_5v_power
    name: "External 5V Power"
    pin:
      pi4ioe5v6408: pi4ioe1
      number: 2

binary_sensor:
  - platform: gpio
    id: charging
    name: "Charging Status"
    pin:
      pi4ioe5v6408: pi4ioe2
      number: 6
      mode: INPUT_PULLDOWN

  - platform: gpio
    id: headphone_detect
    name: "Headphone Detect"
    pin:
      pi4ioe5v6408: pi4ioe1
      number: 7

select:
  - platform: template
    id: wifi_antenna_select
    name: "WiFi Antenna"
    options:
      - "Internal"
      - "External"
    optimistic: true
    on_value:
      - if:
          condition:
            lambda: return i == 0;
          then:
            - switch.turn_off: wifi_antenna_int_ext
          else:
            - switch.turn_on: wifi_antenna_int_ext

  - platform: es8388
    dac_output:
      name: DAC Output
    adc_input_mic:
      name: ADC Input Mic

i2s_audio:
  - id: mic_bus
    i2s_lrclk_pin: GPIO29
    i2s_bclk_pin: GPIO27
    i2s_mclk_pin: GPIO30

audio_adc:
  - platform: es7210
    id: es7210_adc
    bits_per_sample: 16bit
    sample_rate: 16000

microphone:
  - platform: i2s_audio
    id: tab5_microphone
    i2s_din_pin: GPIO28
    sample_rate: 16000
    bits_per_sample: 16bit
    adc_type: external

audio_dac:
  - platform: es8388
    id: es8388_dac

```

## Wake word voice assistant

```yaml
speaker:
  - platform: i2s_audio
    id: tab5_speaker
    i2s_dout_pin: GPIO26
    audio_dac: es8388_dac
    dac_type: external
    channel: mono
    buffer_duration: 100ms
    bits_per_sample: 16bit
    sample_rate: 48000


media_player:
  - platform: speaker
    name: None
    id: speaker_player
    announcement_pipeline:
      speaker: tab5_speaker
      format: FLAC
      sample_rate: 48000
      num_channels: 1
    on_announcement:
      # Stop the wake word (mWW or VA) if the mic is capturing
      - if:
          condition:
            - microphone.is_capturing:
          then:
            - micro_wake_word.stop:
    on_idle:
      # Since VA isn't running, this is the end of user-intiated media playback. Restart the wake word.
      - if:
          condition:
            not:
              voice_assistant.is_running:
          then:
            - micro_wake_word.start:

micro_wake_word:
  id: mww
  models:
    - okay_nabu
    - hey_mycroft
    - hey_jarvis
  on_wake_word_detected:
    - voice_assistant.start:
        wake_word: !lambda return wake_word;

voice_assistant:
  id: va
  microphone: tab5_microphone
  media_player: speaker_player
  micro_wake_word: mww
  on_end:
    # Wait a short amount of time to see if an announcement starts
    - wait_until:
        condition:
          - media_player.is_announcing:
        timeout: 0.5s
    # Announcement is finished and the I2S bus is free
    - wait_until:
        - and:
            - not:
                media_player.is_announcing:
            - not:
                speaker.is_playing:
    - micro_wake_word.start:
  on_client_connected:
    - micro_wake_word.start:
  on_client_disconnected:
    - micro_wake_word.stop:
```
