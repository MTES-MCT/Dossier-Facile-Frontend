const PrerendererWebpackPlugin = require("@prerenderer/webpack-plugin");
const path = require("path");

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      localeDir: "locales",
      enableInSFC: true
    },
    sitemap: {
      urls: ["https://locataire.dossierfacile.fr/signup"]
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "DossierFacile";
      return args;
    });
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV !== "production") return;

    return {
      plugins: [
        new PrerendererWebpackPlugin({
          // Absolute path to compiled SPA
          staticDir: path.resolve(__dirname, "dist"),
          // List of routes to prerender
          routes: ["/signup"],
          rendererOptions: {
            timeout: 120000,
          },
        })
      ]
    };
  }
};
