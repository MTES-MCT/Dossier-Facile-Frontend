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
        "https://dossierfacile.fr/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location",
        "https://dossierfacile.fr/blog/article2",
        "https://dossierfacile.fr/blog/article3",
        "https://dossierfacile.fr/blog/locatio-devient-dossier-facile",
        "https://dossierfacile.fr/blog/5-astuces-pour-booster-votre-dossier-de-location",
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
            "/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location",
            "/blog/article2",
            "/blog/article3",
            "/blog/locatio-devient-dossier-facile",
            "/blog/5-astuces-pour-booster-votre-dossier-de-location",
            "/information",
            "/securite-des-donnees"
          ]
        )
      ]
    };
  }
};
