---
layout: default
title: Devices
permalink: /devices/
---

{% assign devices = site.devices | sort: "title" %}
{% for device in devices %}
* [{{ device.title }}]({{ device.url }})
{% endfor %}
