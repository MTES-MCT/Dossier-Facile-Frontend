import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Account from "@/views/Account.vue";
import store from "@/store";

Vue.use(VueRouter);

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "DossierFacile, le dossier de location numérique de l’État",
      description:
        "Créez un dossier de location en ligne complet et vérifié par l'Etat pour trouver votre appartement ou votre logement",
      hideForAuth: true
    }
  },
  {
    path: "/auth/callback",
    name: "Auth",
    component: Account,
    beforeEnter: (to, from, next) => {
      if (to.query.code) {
        const token = to.query.code;
        store.dispatch("setToken", token);
      }
    }
  },
  {
    path: "/signup",
    name: "Signup",
    meta: {
      title: "Création de compte - DossierFacile",
      description: "Créez votre compte en quelques clics sur DossierFacile",
      hideForAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "signup" */ "@/views/SignupPage.vue")
  },
  {
    path: "/forgotten-password",
    name: "ForgottenPassword",
    meta: {
      title: "Mot de passe oublié - DossierFacile",
      description:
        "Accédez à la procédure de mot de passe oublié pour votre compte DossierFacile",
      hideForAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "forgottenPassword" */ "@/views/ForgottenPasswordPage.vue"
      )
  },
  {
    path: "/profile",
    name: "Profile",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/Profile.vue")
  },
  {
    path: "/public-file/:token",
    name: "Dossier",
    meta: {
      title: "Dossier - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "file" */ "@/views/PublicFile.vue")
  },
  {
    path: "/file/:token",
    name: "Dossier",
    meta: {
      title: "Dossier - DossierFacile"
    },
    component: () => import(/* webpackChunkName: "file" */ "@/views/File.vue")
  },
  {
    path: "/source/:source",
    name: "Source",
    meta: {
      title: "Source - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "source" */ "@/views/Source.vue")
  },
  {
    path: "/account",
    name: "Compte",
    meta: {
      title: "Mon compte - DossierFacile",
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      if (store.state.user.status === "INCOMPLETE") {
        next({ name: "Profile" });
      }
      next();
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/Account.vue")
  },
  {
    path: "/messaging",
    name: "Messages",
    meta: {
      title: "Messages - DossierFacile",
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "messages" */ "@/views/Messages.vue")
  },
  {
    path: "/confirmAccount/:token",
    name: "Confirm",
    meta: {
      title: "Confirmation de compte - DossierFacile",
      hideForAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "confirmAccount" */ "@/views/ConfirmAccount.vue"
      )
  },
  {
    path: "/ajout-couple/:token",
    name: "Couple",
    meta: {
      title: "Confirmation de compte - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/JoinCouple.vue")
  },
  {
    path: "/ajout-groupe/:token",
    name: "Group",
    meta: {
      title: "Confirmation de compte - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/JoinGroup.vue")
  },
  {
    path: "/reset-password/:token",
    name: "Password",
    meta: {
      title: "Nouveau mot de passe - DossierFacile",
      hideForAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "changePassword" */ "@/views/ChangePasswordPage.vue"
      )
  },
  {
    path: "/inscription-locataire/:token",
    name: "Inscription",
    meta: {
      title: "Inscription locataire - DossierFacile"
    },
    component: () =>
      import(
        /* webpackChunkName: "inscriptionLocataire" */ "@/views/OwnerShare.vue"
      )
  },
  {
    path: "/locataire",
    redirect: () => {
      window.location.replace(`${MAIN_URL}`);
      return "/info-proprietaire";
    }
  },
  {
    path: "*",
    name: "404",
    meta: {
      title: "404 - DossierFacile"
    },
    component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue")
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
  if (to.query.lang) {
    const locale = to.query.lang === "en" ? "en" : "fr";
    store.dispatch("setLang", locale);
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({
        name: "Login",
        query: {
          nextUrl: to.fullPath
        }
      });
    }
  } else if (to.matched.some(record => record.meta.hideForAuth)) {
    if (store.getters.isLoggedIn) {
      next({ name: "Profile" });
    }
  }
  document.title = to.meta.title;
  if (to.meta.description) {
    const tag = document.querySelector('meta[name="description"]');
    tag?.setAttribute("content", to.meta.description);

    const prop = document.querySelector('meta[property="og:description"]');
    prop?.setAttribute("content", to.meta.description);

    const title = document.querySelector('meta[property="og:title"]');
    title?.setAttribute("content", to.meta.title);
  }
  next();
});

export default router;
