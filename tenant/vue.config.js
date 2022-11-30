const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    },
    sitemap: {
      urls: ["https://locataire.dossierfacile.fr/signup"]
    }
  },
  chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "DossierFacile";
                return args;
            })
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== "production") return;

    return {
      plugins: [
        new PrerenderSpaPlugin(
          // Absolute path to compiled SPA
          path.resolve(__dirname, "dist"),
          // List of routes to prerender
          ["/signup"]
        )
      ]
    };
  }
};
