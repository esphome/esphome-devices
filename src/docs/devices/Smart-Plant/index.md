---
title: Smart Plant
date-published: 2024-06-01
type: sensor
standard: global
board: esp32
project-url: https://smart-plant.readthedocs.io
difficulty: 2
made-for-esphome: True
---

![Smart Plant](Smart-Plant.png)

## Pinout

| ESP32-S2 | Sensor        | e-Paper | Other           |
| -------- | ------------- | ------- | --------------- |
| GPIO 00  | Flash button  |         |                 |
| GPIO 01  | Soil moisture |         |                 |
| GPIO 02  | Battery volts |         |                 |
| GPIO 03  | Solar charge  |         |                 |
| GPIO 04  |               |         | Sensor powering |
| GPIO 10  |               | CS      |                 |
| GPIO 11  |               | MOSI    |                 |
| GPIO 12  |               | CLK     |                 |
| GPIO 13  |               | DC/MISO |                 |
| GPIO 14  |               | BUSY    |                 |
| GPIO 15  |               | RST     |                 |
| GPIO 33  | SDA           |         |                 |
| GPIO 34  | SCL           |         |                 |

## Basic Configuration

```yaml
substitutions:
  device_name: smart-plant
  friendly_name: Smart Plant
  project_name: smart.plant
  project_version: '2.2'
  ap_pwd: smartplant
esphome:
  name: ${device_name}
  name_add_mac_suffix: true
  project:
    name: ${project_name}
    version: ${project_version}
  on_boot:
    priority: 600
    then:
    - lambda: 'Wire.begin();

        delay(100);'
    - script.execute: consider_deep_sleep
esp32:
  board: esp32-s2-saola-1
  framework:
    type: arduino
logger: null
api: null
ota:
  platform: esphome
dashboard_import:
  package_import_url: github://JGAguado/Smart_Plant/docs/source/files/configuration.yaml@V2R1
  import_full_config: false
improv_serial: null
wifi:
  ap:
    password: ${ap_pwd}
i2c:
  scl: GPIO34
  sda: GPIO33
  scan: false
  id: bus_a
spi:
  clk_pin: GPIO12
  mosi_pin: GPIO11
image:
- file: https://smart-plant.readthedocs.io/en/v2r1/_images/Lemon_tree_label_page_1.png
  id: page_1_background
font:
- file: gfonts://Audiowide
  id: font_title
  size: 20
- file: gfonts://Audiowide
  id: font_subtitle
  size: 15
- file: gfonts://Audiowide
  id: font_parameters
  size: 15
- file: gfonts://Material+Symbols+Outlined
  id: font_icon
  size: 20
  glyphs:
  - 
  - 
  - 
  - 
  - 
  - 
  - 
  - 
time:
- platform: homeassistant
  id: esptime
switch:
- platform: gpio
  pin: GPIO4
  id: exc
  name: Excitation switch
  icon: mdi:power
  restore_mode: ALWAYS_ON
sensor:
- platform: adc
  name: Battery Voltage
  id: batvolt
  pin: GPIO2
  accuracy_decimals: 2
  update_interval: 1s
  unit_of_measurement: V
  attenuation: 12db
  icon: mdi:battery-medium
  filters:
  - multiply: 2.15
  - median:
      window_size: 7
      send_every: 7
      send_first_at: 7
  on_value:
    then:
    - component.update: batpercent
- platform: template
  name: Battery %
  id: batpercent
  lambda: return id(batvolt).state;
  accuracy_decimals: 0
  unit_of_measurement: '%'
  icon: mdi:battery-medium
  filters:
  - calibrate_linear:
      method: exact
      datapoints:
      - 0.00 -> 0.0
      - 3.30 -> 1.0
      - 3.39 -> 10.0
      - 3.75 -> 50.0
      - 4.11 -> 90.0
      - 4.20 -> 100.0
  - lambda: "if (x <= 100) {\n  return x;\n} else {\n  return 100;\n}\nif (x <0) {\n  return 0;\n}"
- platform: aht10
  variant: AHT20
  i2c_id: bus_a
  temperature:
    name: Temperature
    id: temp
    icon: mdi:thermometer
  humidity:
    name: Air Humidity
    id: hum
    icon: mdi:water-percent
  update_interval: 3s
- platform: veml7700
  address: 16
  update_interval: 1s
  ambient_light:
    name: Ambient light
    id: light
    icon: mdi:white-balance-sunny
  actual_gain:
    name: Actual gain
- platform: adc
  pin: GPIO1
  name: Soil Moisture
  id: soil
  icon: mdi:cup-water
  update_interval: 1s
  unit_of_measurement: '%'
  attenuation: 12db
  filters:
  - median:
      window_size: 5
      send_every: 5
  - calibrate_linear:
    - 1.25 -> 100.00
    - 2.8 -> 0.00
  - lambda: if (x < 1) return 0; else if (x > 100) return 100; return (x);
  accuracy_decimals: 0
display:
- platform: waveshare_epaper
  cs_pin: GPIO10
  dc_pin: GPIO13
  busy_pin: GPIO14
  reset_pin: GPIO15
  rotation: 270
  model: 2.90inv2
  id: my_display
  update_interval: never
  full_update_every: 1
  pages:
  - id: page1
    lambda: "#define H_LEFT_MARGIN 4\n#define H_RIGHT_MARGIN 280\n#define H_CENTER 128\n#define V_WEATHER 0\n#define V_CLOCK 1\n#define V_WIFI 30\n#define V_VOLTAGE 60\n#define V_BATTERY  90\n\nit.image(0, 0, id(page_1_background));\n\n// // Battery\nfloat battery_perc = id(batpercent).state;\nint battery_range = battery_perc / 16 ;\nbattery_range = (battery_range > 6) ? 6 : battery_range;\nbattery_range = (battery_range < 0)  ?  0 : battery_range;\n\nconst char* battery_icon_map[] = {\n  \"\\U0000ebdc\", // battery empty\n  \"\\U0000ebd9\", // battery 1 bar\n  \"\\U0000ebe0\", // battery 2 bar\n  \"\\U0000ebdd\", // battery 3 bar\n  \"\\U0000ebe2\", // battery 4 bar\n  \"\\U0000ebd4\", // battery 5 bar\n  \"\\U0000e1a4\"  // battery full\n};\n\nit.printf(278, 1, id(font_icon), TextAlign::TOP_LEFT, battery_icon_map[battery_range]);\nit.printf(278, 1, id(font_subtitle), TextAlign::TOP_RIGHT,\n\"%3.0f%%\", battery_perc);\n\n// Date\nit.strftime(278, 18, id(font_subtitle), TextAlign::TOP_RIGHT,\n\"%H:%M %d/%m\", id(esptime).now());\nit.printf(278, 18, id(font_icon), TextAlign::TOP_LEFT, \"\\U0000e627\");  \n\n\n// Parameters\n// Drawing the marker over the gauge\nfloat pi = 3.141592653589793;\nfloat alpha = 4.71238898038469; // Defined as the gauge angle in radians (270deg)\nfloat beta = 2*pi - alpha;\nint radius = 22;              // Radius of the gauge in pixels\nint thick = 7;                // Size of the marker\n\n// *** Moisture ***\nint min_range = 0;\nint max_range = 100;\nint xc = 80;\nint yc = 50;\n\nfloat measured = id(soil).state;\n\nif (measured < min_range) {\n  measured = min_range;\n}\nif (measured > max_range) {\n  measured = max_range;\n}\n\nfloat val = (measured - min_range) / abs(max_range - min_range) * alpha;\n\nint x0 = static_cast<int>(xc + radius + radius * cos(pi / 2 + beta / 2 + val));\nint y0 = static_cast<int>(yc + radius + radius * sin(pi / 2 + beta / 2 + val));\nint x1 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val + 0.1));\nint y1 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val + 0.1));\nint x2 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val - 0.1));\nint y2 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val - 0.1));\nit.line(x0, y0, x1, y1);\nit.line(x1, y1, x2, y2);\nit.line(x2, y2, x0, y0);\n\nit.printf(xc + radius, yc + 1.7*radius, id(font_parameters), TextAlign::TOP_CENTER,\n\"%.0f%%\", id(soil).state);\n\n// *** Light ***\nmin_range = 0;\nmax_range = 3775;\nxc = 134;\nyc = 70;\n\nmeasured = id(light).state;\n\nif (measured < min_range) {\n  measured = min_range;\n}\nif (measured > max_range) {\n  measured = max_range;\n}\n\nval = (measured - min_range) / abs(max_range - min_range) * alpha;\nx0 = static_cast<int>(xc + radius + radius * cos(pi / 2 + beta / 2 + val));\ny0 = static_cast<int>(yc + radius + radius * sin(pi / 2 + beta / 2 + val));\nx1 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val + 0.1));\ny1 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val + 0.1));\nx2 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val - 0.1));\ny2 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val - 0.1));\nit.line(x0, y0, x1, y1);\nit.line(x1, y1, x2, y2);\nit.line(x2, y2, x0, y0);\n\nit.printf(xc + radius, yc + 1.7*radius, id(font_parameters), TextAlign::TOP_CENTER,\n\"%.0flx\", id(light).state);  \n\n\n// *** Temperature ***\nmin_range = -10;\nmax_range = 50;\nxc = 188;\nyc = 50;\n\nmeasured = id(temp).state;\n\nif (measured < min_range) {\n  measured = min_range;\n}\nif (measured > max_range) {\n  measured = max_range;\n}\n\nval = (measured - min_range) / abs(max_range - min_range) * alpha;\nx0 = static_cast<int>(xc + radius + radius * cos(pi / 2 + beta / 2 + val));\ny0 = static_cast<int>(yc + radius + radius * sin(pi / 2 + beta / 2 + val));\nx1 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val + 0.1));\ny1 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val + 0.1));\nx2 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val - 0.1));\ny2 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val - 0.1));\nit.line(x0, y0, x1, y1);\nit.line(x1, y1, x2, y2);\nit.line(x2, y2, x0, y0);\n\nit.printf(xc + radius, yc + 1.7*radius, id(font_parameters), TextAlign::TOP_CENTER,\n\"%.0f°C\", id(temp).state);\n\n\n// *** Humidity ***\nmin_range = 20;\nmax_range = 80;\nxc = 242;\nyc = 70;\n\nmeasured = id(hum).state;\n\nif (measured < min_range) {\n  measured = min_range;\n}\nif (measured > max_range) {\n  measured = max_range;\n}\n\nval = (measured - min_range) / abs(max_range - min_range) * alpha;\nx0 = static_cast<int>(xc + radius + radius * cos(pi / 2 + beta / 2 + val));\ny0 = static_cast<int>(yc + radius + radius * sin(pi / 2 + beta / 2 + val));\nx1 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val + 0.1));\ny1 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val + 0.1));\nx2 = static_cast<int>(xc + radius + (radius+thick) * cos(pi / 2 + beta / 2 + val - 0.1));\ny2 = static_cast<int>(yc + radius + (radius+thick) * sin(pi / 2 + beta / 2 + val - 0.1));\nit.line(x0, y0, x1, y1);\nit.line(x1, y1, x2, y2);\nit.line(x2, y2, x0, y0);\n\nit.printf(xc + radius, yc + 1.7*radius, id(font_parameters), TextAlign::TOP_CENTER,\n\"%.0f%%\", id(hum).state);"
deep_sleep:
  id: deep_sleep_control
  sleep_duration: 1h
script:
- id: consider_deep_sleep
  mode: queued
  then:
  - delay: 5s
  - component.update: my_display
  - delay: 5s
  - if:
      condition:
        sensor.in_range:
          id: batpercent
          above: 95
      then:
      - deep_sleep.prevent: deep_sleep_control
      else:
      - deep_sleep.enter: deep_sleep_control
  - delay: 25s
  - script.execute: consider_deep_sleep
```
