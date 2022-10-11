const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;

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
  "/information",
  "/accessibilite",
  "/mentions-legales",
  "/plan-du-site",
  "/404"
];

const getSitemapUrls = () => {
  return routes
    .filter(route => route !== "/404")
    .map(route => `https://dossierfacile.fr${route}`);
};

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    },
    sitemap: {
      urls: getSitemapUrls()
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== "production") return;

    return {
      plugins: [
        new PrerenderSpaPlugin({
          // args for puppeteer
          renderer: new Renderer({
            args: ["--no-sandbox"]
          }),
          staticDir: path.resolve(__dirname, "dist"),
          routes: routes
        })
      ]
    };
  }
};
