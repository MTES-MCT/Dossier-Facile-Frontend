import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import store from "../store";

Vue.use(VueRouter);

const TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
const OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
    meta: {
      title: "DossierFacile, le dossier de location numérique de l’État",
      description:
        "Avec DossierFacile, créez un dossier de location en ligne complet et vérifié par l'Etat pour trouver votre appartement ou votre logement",
      image: require("../assets/icons/justif.jpg")
    }
  },
  {
    path: "/blog",
    name: "Blog",
    meta: {
      title: "Le blog de DossierFacile",
      description:
        "Venez découvrir nos articles de blog pour vous éclairer sur les points d’éventuelle difficulté que vous rencontrez en créant votre dossier de location"
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Blog.vue")
  },
  {
    path:
      "/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location",
    name: "Article1",
    meta: {
      title:
        "Quelles pièces justificatives fournir pour mon dossier de location - Blog - DossierFacile",
      description:
        "A cause de l’augmentation de la demande immobilière, il devient de plus en plus difficile de trouver un bon appartement à louer."
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article1.vue")
  },
  {
    path: "/blog/constituer-votre-dossierFacile",
    name: "Article2",
    meta: {
      title: "Constituer votre DossierFacile - Blog - DossierFacile",
      description:
        "Mais comment constituer un dossier de location qui regroupe tous les documents nécessaires sans tomber dans le désordre d’un pdf de cinquante pages ? Existe-t-il un outil facile et gratuit ?",
      image: require("../assets/images/blog-article2.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article2.vue")
  },
  {
    path: "/blog/pourquoi-dossierfacile-est-il-gratuit",
    name: "Article3",
    meta: {
      title: "Pourquoi Dossier Facile est-il gratuit - Blog - DossierFacile",
      description:
        "DossierFacile propose une solution numérique simple et gratuite pour remettre la confiance au cœur du processus de location",
      image: require("../assets/images/blog-article3.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article3.vue")
  },
  {
    path: "/blog/locatio-devient-dossier-facile",
    name: "Article0",
    meta: {
      title: "Locatio devient DossierFacile",
      description:
        "Locatio, le service d’Etat permettant de monter un dossier de location en ligne certifié clair, complet et cohérent,change de nom et devient DossierFacile.fr"
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article0.vue")
  },
  {
    path: "/blog/5-astuces-pour-booster-votre-dossier-de-location",
    name: "Article4",
    meta: {
      title: "5 astuces pour booster votre dossier de location - DossierFacile",
      description:
        "Pour se distinguer des autres, un seul moyen : constituer un dossier de location clair, cohérent et complet",
      image: require("../assets/images/blog-article4.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article4.vue")
  },
  {
    path:
      "/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne",
    name: "Article5",
    meta: {
      title:
        "5 conseils pour trouver l’appartement de ses rêves en région parisienne - DossierFacile",
      description:
        "Trouver l’appartement de ses rêves à Paris ou en région parisienne est un vrai défi",
      image: require("../assets/images/blog-article5.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article5.vue")
  },
  {
    path: "/blog/dossierfacile-fait-peau-neuve",
    name: "Article6",
    meta: {
      title: "DossierFacile fait peau neuve ! - DossierFacile",
      description:
        "Afin de mieux répondre aux besoins de nos locataires et propriétaires, le service DossierFacile fait peau neuve avec un nouveau site",
      image: require("../assets/images/blog-article6.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article6.vue")
  },
  {
    path: "/blog/tout-comprendre-a-la-vie-en-colocation",
    name: "Article7",
    meta: {
      title: "Tout comprendre à la vie en colocation - DossierFacile",
      description:
        "Quelles sont les règles à respecter avant de se mettre en colocation ? DossierFacile vous aide à y voir plus clair !",
      image: require("../assets/images/blog-article7.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article7.vue")
  },
  {
    path: "/blog/comment-justifier-son-domicile",
    name: "Article8",
    meta: {
      title: "Comment justifier son domicile - DossierFacile",
      description:
        "On peut distinguer quatre cas classiques de justificatif de domicile mais il en existe en fait bien plus",
      image: require("../assets/images/blog-article8.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article8.vue")
  },
  {
    path: "/blog/loyer-locataire-ou-bailleur",
    name: "Article9",
    meta: {
      title: "Le loyer : locataire ou bailleur - DossierFacile",
      description:
        "Le loyer : tout ce qu’il faut savoir quand on est locataire ou bailleur",
      image: require("../assets/images/blog-article9.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article9.vue")
  },
  {
    path: "/blog/quand-les-journalistes-parlent-de-dossierfacile",
    name: "Article10",
    meta: {
      title: "Quand les journalistes parlent de DossierFacile",
      description:
        "Constituer son dossier de location est une étape indispensable pour trouver le logement de ses rêves et pourtant c’est un parcours semé d’embûches",
      image: require("../assets/images/blog-article10.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article10.vue")
  },
  {
    path: "/blog/la-caution-locative-changement-en-vue-pour-2022",
    name: "Article11",
    meta: {
      title: "La caution locative : changements en vue pour 2022",
      description:
        "La caution est une personne ou un organisme qui s'engage par écrit, à travers un acte de cautionnement, à payer votre loyer si vous ne le faites pas. Il s’agit le plus souvent d’un parent ou d’un proche. Si la caution ne rembourse pas les dettes locatives",
      image: require("../assets/images/blog-article11.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article11.vue")
  },
  {
    path: "/blog/au-secours-mon-ascenceur-est-en-panne",
    name: "Article12",
    meta: {
      title: "Au secours mon ascenceur est en panne !",
      description:
        "Vous vivez au 6e étage de l’immeuble et l’ascenseur est en panne depuis plusieurs mois ?",
      image: require("../assets/images/blog-article12.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article12.vue")
  },
  {
    path: "/blog/usurpation-d-identite-en-france-comment-prevenir-agir",
    name: "Article13",
    meta: {
      title:
        "L’usurpation d’identité en France : comment la prévenir et comment agir ?",
      description:
        "L’usurpation d’identité consiste à utiliser, sans votre accord, des informations permettant de vous identifier.",
      image: require("../assets/images/blog-article13.jpg")
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article13.vue")
  },
  {
    path: "/information",
    name: "Information",
    meta: {
      title: "Qui sommes-nous ? - DossierFacile",
      description:
        "Remettre la confiance au centre de la relation entre propriétaire et locataire grâce à notre outil 100 % en ligne, simple et gratuit."
    },
    component: () =>
      import(/* webpackChunkName: "information" */ "../views/Information.vue")
  },
  {
    path: "/mentions-legales",
    name: "MentionsLegales",
    meta: {
      title: "Mentions légales - DossierFacile",
      description:
        "DossierFacile s’engage à protéger vos données personnelles : créez votre dossier de location en toute sécurité"
    },
    component: () =>
      import(/* webpackChunkName: "security" */ "../views/MentionsLegales.vue")
  },
  {
    path: "/securite-des-donnees",
    redirect: () => {
      window.location.replace("/mentions-legales");
      return "/mentions-legales";
    }
  },
  {
    path: "/faq",
    name: "Faq",
    meta: {
      title: "FAQ - DossierFacile",
      description:
        "Vous rencontrez des difficultés à monter votre dossier de location ? Découvrez toutes nos solutions pour vous aider dans votre démarche"
    },
    component: () => import(/* webpackChunkName: "faq" */ "../views/Faq.vue")
  },
  {
    path: "/info-proprietaire",
    redirect: () => {
      window.location.replace(`${OWNER_URL}`);
      return "/info-proprietaire";
    }
  },
  {
    path: "/accessibilite",
    name: "Accessibility",
    meta: {
      title: "Déclaration accessibilité - DossierFacile",
      description: "Déclaration d'accessibilité de DossierFacile"
    },
    component: () =>
      import(
        /* webpackChunkName: "accessibility" */ "../views/Accessibility.vue"
      )
  },
  {
    path: "/contact",
    name: "Contact",
    meta: {
      title: "Contactez-nous",
      description: "Formulaire de contact"
    },
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/Contact.vue")
  },
  {
    path: "/blog/article1",
    redirect: () => {
      window.location.replace(
        `/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location`
      );
      return "/";
    }
  },
  {
    path: "/blog/article2",
    redirect: () => {
      window.location.replace(`/blog/constituer-votre-dossierFacile`);
      return "/";
    }
  },
  {
    path: "/blog/article3",
    redirect: () => {
      window.location.replace(`/blog/pourquoi-dossierfacile-est-il-gratuit`);
      return "/";
    }
  },
  {
    path: "/login",
    redirect: () => {
      window.location.replace(`${TENANT_URL}/account`);
      return "/";
    }
  },
  {
    path: "/registerTenant/step1",
    redirect: () => {
      window.location.replace(`${TENANT_URL}/signup`);
      return "/";
    }
  },
  {
    path: "/registerOwner/step1",
    redirect: () => {
      window.location.replace(`${OWNER_URL}`);
      return "/";
    }
  },
  {
    path: "/locataire",
    redirect: "/"
  },
  {
    path: "/source/:source",
    redirect: (to: Route) => {
      const source = to.params.source;
      const internalPartnerId = to.query.internalPartnerId?.toString() || "";
      const firstName = to.query.firstName?.toString() || "";
      const lastName = to.query.lastName?.toString() || "";
      const email = to.query.email?.toString() || "";
      window.location.replace(
        `${TENANT_URL}/source/${source}?internalPartnerId=${internalPartnerId}&firstName=${firstName}&lastName=${lastName}&email=${email}`
      );
      return "/source";
    }
  },
  {
    path: "/tenants_files/:path/:token",
    redirect: (to: Route) => {
      const token = to.params.token;
      const path = to.params.path;
      window.location.replace(
        `https://old.dossierfacile.fr/tenants_files/${path}/${token}`
      );
      return `https://old.dossierfacile.fr/tenants_files/${path}/${token}`;
    }
  },
  {
    path: "/dossier-locataire/:token",
    redirect: (to: Route) => {
      const token = to.params.token;
      window.location.replace(
        `https://old.dossierfacile.fr/dossier-locataire/${token}`
      );
      return `https://old.dossierfacile.fr/dossier-locataire/${token}`;
    }
  },
  {
    path: "/visite-locataire/:token",
    redirect: (to: Route) => {
      const token = to.params.token;
      window.location.replace(
        `https://old.dossierfacile.fr/visite-locataire/${token}`
      );
      return `https://old.dossierfacile.fr/visite-locataire/${token}`;
    }
  },
  {
    path: "/stats",
    name: "Statistiques",
    meta: {
      title:
        "Dossier Facile : un service entièrement transparent - DossierFacile",
      description:
        "Consultez nos statistiques sur l’utilisation du service (nombre de dossiers créés, nombre de liens partagés, satisfaction des utilisateurs...)"
    },
    component: () =>
      import(/* webpackChunkName: "statistics" */ "../views/Statistics.vue")
  },
  {
    path: "/plan-du-site",
    name: "Plan du site",
    meta: {
      title: "DossierFacile, le dossier de location numérique de l’État",
    },
    component: () => import("../views/Sitemap.vue")
  },
  {
    path: "/404",
    name: "404",
    meta: {
      title: "404 - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "statistics" */ "../views/404.vue")
  },
  {
    path: "*",
    name: "catchall",
    meta: {
      title: "404 - DossierFacile"
    },
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    document.getElementById("app")?.scrollIntoView();
  }
});

router.beforeEach((to, from, next) => {
  const lang = Vue.$cookies.get("lang") === "en" ? "en" : "fr";
  store.dispatch("setLang", lang);

  document.title = to.meta?.title;
  if (to.meta?.description) {
    const tag = document.querySelector('meta[name="description"]');
    tag?.setAttribute("content", to.meta.description);

    const prop = document.querySelector('meta[property="og:description"]');
    prop?.setAttribute("content", to.meta.description);

    const title = document.querySelector('meta[property="og:title"]');
    title?.setAttribute("content", to.meta.title);

    const image = document.querySelector('meta[property="og:image"]');
    image?.setAttribute(
      "content",
      `https://${process.env.VUE_APP_MAIN_URL}${to.meta.image}`
    );

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    twitterTitle?.setAttribute("content", to.meta.title);

    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    twitterDescription?.setAttribute("content", to.meta.description);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    twitterImage?.setAttribute(
      "content",
      `https://${process.env.VUE_APP_MAIN_URL}${to.meta.image}`
    );
  }
  next();
});

export default router;
