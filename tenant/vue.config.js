const PrerendererWebpackPlugin = require("@prerenderer/webpack-plugin");
const path = require("path");

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      localeDir: "locales",
      enableInSFC: true,
    },
    sitemap: {
      urls: ["https://locataire.dossierfacile.fr/signup"],
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
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
          postProcess (renderedRoute) {
            renderedRoute.route = renderedRoute.originalRoute;

            renderedRoute.html = renderedRoute.html.replace(
              /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
              (match) => {
                const hasSrcAttribute = /src\s*=\s*["'](.*?)["']/.test(match);
                if (hasSrcAttribute) {
                  const srcAttribute = match.match(/src\s*=\s*["'](.*?)["']/);
                  if (srcAttribute && srcAttribute[1].endsWith("matomo.js")) {
                    return "";
                  }
                  return match;
                }
                return "";
              }
            );

            return renderedRoute;
          },
        }),
      ],
    };
  },
};
