const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    },
    sitemap: {
      urls: [
        "https://dossierfacile.fr/",
        "https://dossierfacile.fr/faq",
        "https://dossierfacile.fr/blog",
        "https://dossierfacile.fr/blog/article1",
        "https://dossierfacile.fr/blog/article2",
        "https://dossierfacile.fr/blog/article3",
        "https://dossierfacile.fr/information",
        "https://dossierfacile.fr/securite-des-donnees"
      ]
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== "production") return;

    return {
      plugins: [
        new PrerenderSpaPlugin(
          // Absolute path to compiled SPA
          path.resolve(__dirname, "dist"),
          // List of routes to prerender
          [
            "/",
            "/faq",
            "/blog",
            "/blog/article1",
            "/blog/article2",
            "/blog/article3",
            "/information",
            "/securite-des-donnees"
          ]
        )
      ]
    };
  }
};
