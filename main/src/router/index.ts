import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
    meta: {
      title: "Accueil - DossierFacile",
      description:
        "Montez un dossier de location en béton pour trouver le logement de vos rêves. DossierFacile vous aide à constituer un dossier de location numérique de qualité"
    }
  },
  {
    path: "/blog",
    name: "Blog",
    meta: {
      title: "Blog - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Blog.vue")
  },
  {
    path: "/blog/article1",
    name: "Article1",
    meta: {
      title: "Article 1 - Blog - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article1.vue")
  },
  {
    path: "/blog/article2",
    name: "Article2",
    meta: {
      title: "Article 2 - Blog - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article2.vue")
  },
  {
    path: "/blog/article3",
    name: "Article3",
    meta: {
      title: "Article 3 - Blog - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/blog/Article3.vue")
  },
  {
    path: "/information",
    name: "Information",
    meta: {
      title: "Information - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "information" */ "../views/Information.vue")
  },
  {
    path: "/securite-des-donnees",
    name: "SecuriteDesDonnees",
    meta: {
      title: "Sécurité des données - DossierFacile"
    },
    component: () =>
      import(
        /* webpackChunkName: "security" */ "../views/SecuriteDesDonnees.vue"
      )
  },
  {
    path: "/faq",
    name: "Faq",
    meta: {
      title: "FAQ - DossierFacile"
    },
    component: () => import(/* webpackChunkName: "faq" */ "../views/Faq.vue")
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
  document.title = to.meta.title;
  if (to.meta.description) {
    const tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    tag.setAttribute("content", to.meta.description);
    document.head.appendChild(tag);

    const prop = document.createElement("meta");
    prop.setAttribute("property", "og:description");
    prop.setAttribute("content", to.meta.description);
    document.head.appendChild(prop);
  }
  next();
});

export default router;
