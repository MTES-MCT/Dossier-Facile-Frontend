import LandingPage from '../views/LandingPage.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
  },
  {
    path: "/blog",
    name: "Blog",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/BlogView.vue"),
  },
  {
    path: "/blog-dossierfacile",
    name: "Blog",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/BlogView.vue"),
  },
  {
    path: "/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location",
    name: "Article1",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article1.vue"),
  },
  {
    path: "/blog/constituer-votre-dossierFacile",
    name: "Article2",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article2.vue"),
  },
  {
    path: "/blog/pourquoi-dossierfacile-est-il-gratuit",
    name: "Article3",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article3.vue"),
  },
  {
    path: "/blog/locatio-devient-dossier-facile",
    name: "Article0",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article0.vue"),
  },
  {
    path: "/blog/5-astuces-pour-booster-votre-dossier-de-location",
    name: "Article4",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article4.vue"),
  },
  {
    path: "/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne",
    name: "Article5",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article5.vue"),
  },
  {
    path: "/blog/dossierfacile-fait-peau-neuve",
    name: "Article6",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article6.vue"),
  },
  {
    path: "/blog/tout-comprendre-a-la-vie-en-colocation",
    name: "Article7",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article7.vue"),
  },
  {
    path: "/blog/comment-justifier-son-domicile",
    name: "Article8",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article8.vue"),
  },
  {
    path: "/blog/loyer-locataire-ou-bailleur",
    name: "Article9",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article9.vue"),
  },
  {
    path: "/blog/quand-les-journalistes-parlent-de-dossierfacile",
    name: "Article10",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article10.vue"),
  },
  {
    path: "/blog/la-caution-locative-changement-en-vue-pour-2022",
    name: "Article11",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article11.vue"),
  },
  {
    path: "/blog/au-secours-mon-ascenceur-est-en-panne",
    name: "Article12",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article12.vue"),
  },
  {
    path: "/blog/usurpation-d-identite-en-france-comment-prevenir-agir",
    name: "Article13",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article13.vue"),
  },
  {
    path: "/blog/engage-dans-la-protection-de-vos-donnees-personnelles",
    name: "Article14",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article14.vue"),
  },
  {
    path: "/blog/passoires-thermiques-top-depart-du-gel-des-loyers",
    name: "Article15",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article15.vue"),
  },
  {
    path: "/blog/dossierfacile-un-service-numerique-de-letat-sans-gouv-fr",
    name: "Article16",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article16.vue"),
  },
  {
    path: "/blog/que-verifier-lors-de-la-visite-d-un-logement",
    name: "Article17",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article17.vue"),
  },
  {
    path: "/blog/un-garant-qui-comment-pourquoi",
    name: "Article18",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article18.vue"),
  },
  {
    path: "/blog/tout-ce-que-vous-devez-savoir-avant-de-quitter-votre-logement",
    name: "Article19",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article19.vue"),
  },
  {
    path: "/blog/dossierfacile-lance-filigrane-facile",
    name: "Article20",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article20.vue"),
  },
  {
    path: "/blog/guide-aide-etudiant-logement",
    name: "Article21",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article21.vue"),
  },
  {
    path: "/blog/dossierfacile-devient-dossierfacile-logement-gouv-fr",
    name: "Article22",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article22.vue"),
  },
  {
    path: "/information",
    name: "Information",
    component: () =>
      import(/* webpackChunkName: "information" */ "../views/InformationView.vue"),
  },
  {
    path: "/mentions-legales",
    name: "MentionsLegales",
    component: () =>
      import(/* webpackChunkName: "security" */ "../views/MentionsLegales.vue"),
  },
  {
    path: "/accessibilite",
    name: "Accessibility",
    component: () =>
      import(
        /* webpackChunkName: "accessibility" */ "../views/AccessibilityView.vue"
      ),
  },
  {
    path: "/contact",
    name: "Contact",
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/ContactView.vue"),
  },
  {
    path: "/stats",
    name: "Statistiques",
    component: () =>
      import(/* webpackChunkName: "statistics" */ "../views/MainStatistics.vue"),
  },
  {
    path: "/plan-du-site",
    name: "Plan du site",
    component: () => import("../views/SitemapView.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "statistics" */ "../views/NotFound404.vue"),
  },
  {
    path: '/:pathMatch(.*)',
    name: "catchall",
    component: () =>
      import(/* webpackChunkName: "404" */ "../views/NotFound404.vue"),
  },
];

export default routes;
