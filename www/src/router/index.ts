import LandingPage from '../views/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/partenaires',
    name: 'Partenaires',
    component: () => import(/* webpackChunkName: "partners" */ '../views/PartnersView.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/BlogView.vue')
  },
  {
    path: '/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location',
    name: 'Article1',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage1.vue')
  },
  {
    path: '/blog/constituer-votre-dossierFacile',
    name: 'Article2',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage2.vue')
  },
  {
    path: '/blog/pourquoi-dossierfacile-est-il-gratuit',
    name: 'Article3',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage3.vue')
  },
  {
    path: '/blog/locatio-devient-dossier-facile',
    name: 'Article0',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage0.vue')
  },
  {
    path: '/blog/5-astuces-pour-booster-votre-dossier-de-location',
    name: 'Article4',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage4.vue')
  },
  {
    path: '/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne',
    name: 'Article5',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage5.vue')
  },
  {
    path: '/blog/dossierfacile-fait-peau-neuve',
    name: 'Article6',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage6.vue')
  },
  {
    path: '/blog/tout-comprendre-a-la-vie-en-colocation',
    name: 'Article7',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage7.vue')
  },
  {
    path: '/blog/comment-justifier-son-domicile',
    name: 'Article8',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage8.vue')
  },
  {
    path: '/blog/loyer-locataire-ou-bailleur',
    name: 'Article9',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage9.vue')
  },
  {
    path: '/blog/quand-les-journalistes-parlent-de-dossierfacile',
    name: 'Article10',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage10.vue')
  },
  {
    path: '/blog/la-caution-locative-changement-en-vue-pour-2022',
    name: 'Article11',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage11.vue')
  },
  {
    path: '/blog/au-secours-mon-ascenceur-est-en-panne',
    name: 'Article12',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage12.vue')
  },
  {
    path: '/blog/usurpation-d-identite-en-france-comment-prevenir-agir',
    name: 'Article13',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage13.vue')
  },
  {
    path: '/blog/engage-dans-la-protection-de-vos-donnees-personnelles',
    name: 'Article14',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage14.vue')
  },
  {
    path: '/blog/passoires-thermiques-top-depart-du-gel-des-loyers',
    name: 'Article15',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage15.vue')
  },
  {
    path: '/blog/dossierfacile-un-service-numerique-de-letat-sans-gouv-fr',
    name: 'Article16',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage16.vue')
  },
  {
    path: '/blog/que-verifier-lors-de-la-visite-d-un-logement',
    name: 'Article17',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage17.vue')
  },
  {
    path: '/blog/un-garant-qui-comment-pourquoi',
    name: 'Article18',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage18.vue')
  },
  {
    path: '/blog/tout-ce-que-vous-devez-savoir-avant-de-quitter-votre-logement',
    name: 'Article19',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage19.vue')
  },
  {
    path: '/blog/dossierfacile-lance-filigrane-facile',
    name: 'Article20',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage20.vue')
  },
  {
    path: '/blog/guide-aide-etudiant-logement',
    name: 'Article21',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage21.vue')
  },
  {
    path: '/blog/dossierfacile-devient-dossierfacile-logement-gouv-fr',
    name: 'Article22',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage22.vue')
  },
  {
    path: '/blog/proprietaire-comment-detecter-fausse-fiche-paie',
    name: 'Article23',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage23.vue')
  },
  {
    path: '/blog/guide-etape-par-etape-pour-trouver-appartement-ideal',
    name: 'Article24',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/ArticlePage24.vue')
  },
  {
    path: '/information',
    name: 'Information',
    component: () => import(/* webpackChunkName: "information" */ '../views/InformationView.vue')
  },
  {
    path: '/mentions-legales',
    name: 'MentionsLegales',
    component: () => import(/* webpackChunkName: "security" */ '../views/MentionsLegales.vue')
  },
  {
    path: '/politique-de-confidentialite',
    name: 'PolitiqueDeConfidentialite',
    component: () =>
      import(/* webpackChunkName: "security" */ '../views/PolitiqueDeConfidentialite.vue')
  },
  {
    path: '/cgu',
    name: 'CGU',
    component: () => import(/* webpackChunkName: "security" */ '../views/CGU.vue')
  },
  {
    path: '/accessibilite',
    name: 'Accessibility',
    component: () =>
      import(/* webpackChunkName: "accessibility" */ '../views/AccessibilityView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue')
  },
  {
    path: '/stats',
    name: 'Statistiques',
    component: () => import(/* webpackChunkName: "statistics" */ '../views/MainStatistics.vue')
  },
  {
    path: '/plan-du-site',
    name: 'Plan du site',
    component: () => import('../views/SitemapView.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "statistics" */ '../views/NotFound404.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: 'catchall',
    component: () => import(/* webpackChunkName: "404" */ '../views/NotFound404.vue')
  }
]

export default routes
