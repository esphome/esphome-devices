require("dotenv").config();

let skipAlgoliaPlugin = true;
if (process.env.ALGOLIA_ADMIN_KEY) {
  skipAlgoliaPlugin = false;
}

module.exports = {
  siteMetadata: {
    siteTitle: `ESPHome-Devices`,
    defaultTitle: `ESPHome-Devices`,
    siteTitleShort: `ESPHome-Devices`,
    siteDescription: `This website is a repository of device configuration templates and setup guides for devices running ESPHome firmware.`,
    siteUrl: `https://www.esphome-devices.com`,
    siteAuthor: `@tekmaven`,
    siteImage: `/banner.png`,
    siteLanguage: `en`,
    themeColor: `#8257E6`,
    basePath: `/`,
  },
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-0QG5MYES89", // Google Analytics / GA
        ],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      },
    },
    {
      resolve: `@rocketseat/gatsby-theme-docs`,
      options: {
        configPath: `src/config`,
        docsPath: `src/docs`,
        repositoryUrl: `https://github.com/esphome-devices/esphome-devices`,
        baseDir: ``,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ESPHome-Devices`,
        short_name: `ESPHome-Devices`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `G-0QG5MYES89`,
    //   },
    // },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://www.esphome-devices.com`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: require("./src/utils/algolia-queries"),
        skipIndexing: skipAlgoliaPlugin,
      },
    },
  ],
};
