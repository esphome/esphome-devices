---
layout: default
title: Adding Devices
permalink: /adding-devices/
---

# Contributing: Adding Devices

To add a new device a new `.md` file needs to be added under the `_devices` directory in the [GitHub Repository](https://github.com/jonathanadams/esphome-configs).

You will need to create a fork of the repository, create a new branch for your changes and then raise a pull request.

<script async defer src="https://buttons.github.io/buttons.js"></script>
<a class="github-button" href="https://github.com/jonathanadams/esphome-configs/fork" data-icon="octicon-repo-forked" data-size="large" data-show-count="true" aria-label="Fork jonathanadams/esphome-configs on GitHub">Fork</a>

## YAML Front Matter
Each `.md` file created needs to contain front matter in order for the page to be generated. Details of the front matter required (and optional) is detailed below:

```yaml
---
title: Sonoff S20
type: plug
standard: uk, us
---
```

| Field      | Description                 | Allowable Options                                    |
|------------|-----------------------------|------------------------------------------------------|
| `title`    | Device Title                |                                                      |
| `type`     | Type of Device              | `plug`, `light`, `switch`, `relay`, `sensor`, `misc` |
| `standard` | Electrical standard country | `uk`, `us`                                           |

## Images
To add images to your files do the following:

1. Create a folder with the same name as your device `.md` file in `/assets/images` and add your images to this folder.
2. Add the images to your fold using the appropriate markdown syntax:

  ```md
  ![alt text](/assets/img/your-folder-name/your-image.jpg "Image Hover Text")
  ```

### Image Sizes
Please be considerate over image sizes to help reduce page loading times.
