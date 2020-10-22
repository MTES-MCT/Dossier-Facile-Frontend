import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import LoginPage from "@/views/LoginPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Accueil - DossierFacile"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Connexion - DossierFacile"
    }
  },
  {
    path: "/blog",
    name: "Blog",
    meta: {
      title: "Blog - DossierFacile"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/blog/Blog.vue")
  },
  {
    path: "/blog/article1",
    name: "Blog",
    meta: {
      title: "Article 1 - Blog - DossierFacile"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/blog/Article1.vue")
  },
  {
    path: "/blog/article2",
    name: "Blog",
    meta: {
      title: "Article 2 - Blog - DossierFacile"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/blog/Article2.vue")
  },
  {
    path: "/blog/article3",
    name: "Blog",
    meta: {
      title: "Article 3 - Blog - DossierFacile"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/blog/Article3.vue")
  },
  {
    path: "/information",
    name: "Information",
    meta: {
      title: "Information - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Information.vue")
  },
  {
    path: "/securite-des-donnees",
    name: "SecuriteDesDonnees",
    meta: {
      title: "Sécurité des données - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SecuriteDesDonnees.vue")
  },
  {
    path: "/faq",
    name: "Faq",
    meta: {
      title: "FAQ - DossierFacile"
    },
    component: () => import(/* webpackChunkName: "about" */ "../views/Faq.vue")
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
  next();
});

export default router;
