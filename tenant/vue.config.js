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
        "https://locataire.dossierfacile.fr/",
        "https://locataire.dossierfacile.fr/login",
        "https://locataire.dossierfacile.fr/signup"
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
          ["/login", "/signup"]
        )
      ]
    };
  }
};
