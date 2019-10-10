---
layout: home
title: Welcome
---

# ESPHome Device Configuration Repository

This website is a repository of device configuration templates and setup guides for devices running [ESPHome](https://esphome.io) firmware.

{% assign counter = 0 %}{% for item in site.devices %}{% assign counter=counter | plus:1 %}{% endfor %}
There are currently **{{ counter }} devices** documented in the repository.

## Recently Added Devices
{% assign devices = site.devices | sort: "date" | reverse %}
{% for device in devices limit:10 %}
* [{{ device.title }}]({{ device.url }})
{% endfor %} 