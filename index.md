---
layout: home
title: Welcome
nav_exclude: true
---

# ESPHome Configs Database

{% assign counter = 0 %}{% for item in site.devices %}{% assign counter=counter | plus:1 %}{% endfor %}{{ counter }} devices currently in the database.

## Recently Added Devices
{% assign devices = site.devices | sort: "date" | reverse %} {% for device in devices limit:10 %}
* [{{ device.title }}]({{ device.url }})
{% endfor %} 