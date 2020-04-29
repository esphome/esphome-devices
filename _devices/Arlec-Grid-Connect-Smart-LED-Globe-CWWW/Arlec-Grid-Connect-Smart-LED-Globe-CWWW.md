---
title: Arlec Grid Connect Smart LED Globe CWWW (GLD112HA)
date-published: 2020-04-13
type: light
standard: au
---

As per the [Arlec Grid Connect Smart LED Globe RGB](https://esphome-configs.io/devices/arlec-grid-connect-smart-led-globe-rgb/), these globes are sold at Bunnings in Australia and New Zealand and can be converted using tuya-convert.

However unlike the RGB version these appear to use a BP5926 chip to drive the LED's and this chip uses a PWM signal so set the colour temperature rather than a PWM signal for each colour channel.

To get these globes to work I needed to write a Custom Light Component in ESPHome due to the BP5926 chip that they have used to drive the LED's.
The custom component is available at <https://github.com/cdmonk/esphome_ArlecSmartGlobe.>
