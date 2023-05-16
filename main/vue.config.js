const PrerendererWebpackPlugin = require("@prerenderer/webpack-plugin");
const path = require("path");

const routes = [
  "/",
  "/faq",
  "/blog",
  "/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location",
  "/blog/constituer-votre-dossierFacile",
  "/blog/pourquoi-dossierfacile-est-il-gratuit",
  "/blog/locatio-devient-dossier-facile",
  "/blog/5-astuces-pour-booster-votre-dossier-de-location",
  "/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne",
  "/blog/dossierfacile-fait-peau-neuve",
  "/stats",
  "/blog/un-garant-qui-comment-pourquoi",
  "/blog/tout-comprendre-a-la-vie-en-colocation",
  "/blog/comment-justifier-son-domicile",
  "/blog/loyer-locataire-ou-bailleur",
  "/blog/quand-les-journalistes-parlent-de-dossierfacile",
  "/blog/la-caution-locative-changement-en-vue-pour-2022",
  "/blog/au-secours-mon-ascenceur-est-en-panne",
  "/blog/usurpation-d-identite-en-france-comment-prevenir-agir",
  "/blog/passoires-thermiques-top-depart-du-gel-des-loyers",
  "/blog/dossierfacile-un-service-numerique-de-letat-sans-gouv-fr",
  "/blog/que-verifier-lors-de-la-visite-d-un-logement",
  "/blog/un-garant-qui-comment-pourquoi",
  "/information",
  "/accessibilite",
  "/mentions-legales",
  "/plan-du-site",
  "/404",
];

const getSitemapUrls = () => {
  return routes
    .filter((route) => route !== "/404")
    .map((route) => `https://dossierfacile.fr${route}`);
};

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
    sitemap: {
      urls: getSitemapUrls(),
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
          staticDir: path.resolve(__dirname, "dist"),
          routes: routes,
          rendererOptions: {
            maxConcurrentRoutes: 10,
          },
        }),
      ],
    };
  },
};
