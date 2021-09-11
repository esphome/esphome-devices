---
layout: default
title: "Contributing: Adding Devices"
permalink: /adding-devices/
---

## Create device folder and markdown file

1. To add a new device create a new folder named after your device under the `src/docs/devices` directory in the [GitHub Repository](https://github.com/esphome-devices/esphome-devices). In that folder, create a markdown (`.md`) file named `index.md` with the content. Please avoid using underscores in the filenames and use hypens instead as this makes for easier to understand the URLs generated when the site is built. When using the _Add file_ -> _Create new file_ button in the `Devices` folder or by following [this link](https://github.com/esphome-devices/esphome-devices/new/main/src/docs/devices), Github will automatically create a fork of the repository and a new branch for your changes. Just type the device name for the folder followed by a slash (`/`) and the device name (again) as the filename plus the `.md` suffix.

   <script async defer src="https://buttons.github.io/buttons.js"></script>

   <a class="github-button" href="https://github.com/esphome-devices/esphome-devices/fork" data-icon="octicon-repo-forked" data-size="large" data-show-count="true" aria-label="Fork esphome-devices/esphome-devices on GitHub">Fork</a>

2. Once you have written your file commit your changes and raise a pull request on GitHub. A guide for creating a pull request from a fork can be found [here](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork) if you are unsure.

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

1. Add the images to your newly created device folder in `/src/docs/devices`
2. Add the images to your folder using the appropriate markdown syntax:

```md
![alt text](your-image.jpg "Image Hover Text")
```
