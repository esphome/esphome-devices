---
title: Zemismart Moonlamp
date-published: 2020-12-316
type: lamp
standard: eu (USB cable)
---
  ![Product image](./Moonlamp.JPG "Product Image")
  ![Bottom view](./BottomView.JPG "Bottom View")
  ![LED Layout](./LedLayout.JPG "Bottom View")
  ![Soldering points](./SolderingPoints.png "Soldering Points")

Model reference: Moonlamp

The moonlamp has both RGB and Cold / Warm white handled by three groups of three leds.

Manufacturer: [Zemismart](https://www.zemismart.com/products/christmas-gift-led-remote-control-light-compatible-with-alexa-google-home-3d-printing-children-bedroom-colorful-moon-lamp-app-121)

## How to flash

1. Open

   There are 3 screws.
  ![Product outside](./BlitzWolf-BW-SHP9-Power-strip-outside.jpg "Product outside")
  
2. Unmount circuit from the box

   5 more screws
  ![Product Inside](./BlitzWolf-BW-SHP9-Power-strip-inside.jpg "Product Inside")

3. Pins

   There are pads for RX, TX, 3.3v, GND and I00 nicely marked on the board.
  ![Product Inside Pins](./BlitzWolf-BW-SHP9-Power-strip-connector.jpg "Product Inside")

There is only 1 MB on the onboard esp8266, so the code has every thing 'extra' removed to keep it small, and being able to do OTA.
The WW and CW temperature values are unknown, so purely guesses.
