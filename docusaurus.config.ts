import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "ESPHome Devices",
  tagline:
    "This website is a repository of device configuration templates and setup guides for devices running ESPHome firmware.",
  favicon: "img/favicon.png",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://devices.esphome.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "esphome", // Usually your GitHub org/user name.
  projectName: "esphome-devices", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/devices",
          path: "src/docs/devices",

          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/esphome/esphome-devices/tree/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: 'G-0QG5MYES89',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    ["@getcanary/docusaurus-theme-search-pagefind",
      {
        styles: { 
          "--canary-color-primary-c": 0.15, 
          "--canary-color-primary-h": 150,
        },
        includeRoutes: ["/devices/**/*"]
      }
    ]
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownImages: "throw",
    },
  },

  themeConfig: {
    // Replace with your project's social card
    image: "img/social-card.svg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "ESPHome Devices",
      logo: {
        alt: "ESPHome Devices Logo",
        src: "img/logo.svg",
      },
      items: [],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Built by the ESPHome community.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
    plugins: [
      [
        "@docusaurus/plugin-ideal-image",
        {
          quality: 70,
          max: 1030, // max resized image's size.
          min: 640, // min resized image's size. if original is lower, use that size.
          steps: 2, // the max number of images generated between min and max (inclusive)
          disableInDev: true,
        },
      ],
      [
        "@docusaurus/plugin-sitemap",
        {
          lastmod: null,
          changefreq: "weekly",
          priority: 0.5,
          // ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
          // createSitemapItems: async (params) => {
          //   const { defaultCreateSitemapItems, ...rest } = params;
          //   const items = await defaultCreateSitemapItems(rest);
          //   return items.filter((item) => !item.url.includes("/page/"));
          // },
        },
      ],
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
