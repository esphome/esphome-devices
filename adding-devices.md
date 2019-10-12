---
layout: default
title: Adding Devices
permalink: /adding-devices/
---

# Contributing: Adding Devices

1. To add a new device create a new markdown (`.md`) file named after your device under the `_devices` directory in the [GitHub Repository](https://github.com/jonathanadams/esphome-configs). Please avoid using underscores in the filenames and use hypens instead as this makes for easier to understand the URLs generated when the site is built.

2. You will need to create a fork of the repository and create a new branch for your changes.

    <script async defer src="https://buttons.github.io/buttons.js"></script>
    <a class="github-button" href="https://github.com/jonathanadams/esphome-configs/fork" data-icon="octicon-repo-forked" data-size="large" data-show-count="true" aria-label="Fork jonathanadams/esphome-configs on GitHub">Fork</a>

3. Once you have written your file commit your changes and raise a pull request on GitHub. A guide for creating a pull request from a fork can be found [here](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork) if you are unsure.

## YAML Front Matter
Each `.md` file created needs to contain front matter in order for the page to be generated. Details of the front matter required (and optional) is detailed below:

```yaml
---
title: Sonoff S20
date-published: 2019-10-11
type: plug
standard: uk, us
---
```

| Field            | Description                 | Allowable Options                                                                 | Required? |
| ---------------- | --------------------------- | --------------------------------------------------------------------------------- | --------- |
| `title`          | Device Title                |                                                                                   | Yes       |
| `date-published` | Date Published              | Formatting: `YYYY-MM-DD HH:MM:SS +/-TTTT` (Time and Timezone offset are optional) | Yes       |
| `type`           | Type of Device              | `plug`, `light`, `switch`, `dimmer` , `relay`, `sensor`, `misc`                   | Yes       |
| `standard`       | Electrical standard country | `uk`, `us`, `eu`, `au`, `global`                                                  | Yes       |

## Images
To add images to your files do the following:

1. Create a folder with the same name as your device `.md` file in `/assets/images` and add your images to this folder.
2. Add the images to your fold using the appropriate markdown syntax:

  ```md
  ![alt text](/assets/img/your-folder-name/your-image.jpg "Image Hover Text")
  ```

### Image Sizes
Please be considerate over image sizes to help reduce page loading times.
