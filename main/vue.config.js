const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;

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
        "https://dossierfacile.fr/blog/constituer-votre-dossierFacile",
        "https://dossierfacile.fr/blog/pourquoi-dossierfacile-est-il-gratuit",
        "https://dossierfacile.fr/blog/locatio-devient-dossier-facile",
        "https://dossierfacile.fr/blog/5-astuces-pour-booster-votre-dossier-de-location",
        "https://dossierfacile.fr/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne",
        "https://dossierfacile.fr/blog/dossierfacile-fait-peau-neuve",
        "https://dossierfacile.fr/stats",
        "https://dossierfacile.fr/blog/un-garant-qui-comment-pourquoi",
        "https://dossierfacile.fr/blog/tout-comprendre-a-la-vie-en-colocation",
        "https://dossierfacile.fr/blog/comment-justifier-son-domicile",
        "https://dossierfacile.fr/blog/loyer-locataire-ou-bailleur",
        "https://dossierfacile.fr/blog/quand-les-journalistes-parlent-de-dossierfacile",
        "https://dossierfacile.fr/information",
        "https://dossierfacile.fr/accessibilite",
        "https://dossierfacile.fr/mentions-legales"
      ]
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
          routes: [
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
            "/information",
            "/accessibilite",
            "/mentions-legales",
            "/404"
          ]
        })
      ]
    };
  }
};
