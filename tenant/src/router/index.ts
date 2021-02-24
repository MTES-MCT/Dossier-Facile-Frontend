import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import LoginPage from "@/views/LoginPage.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "DossierFacile",
      hideForAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Connexion - DossierFacile",
      hideForAuth: true
    }
  },
  {
    path: "/signup",
    name: "Signup",
    meta: {
      title: "Création compte - DossierFacile",
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
      hideForAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "forgottenPassword" */ "@/views/ForgottenPasswordPage.vue"
      )
  },
  {
    path: "/join-roommate",
    name: "JoinRommate",
    meta: {
      title: "Rejoindre un colocataire - DossierFacile",
      hideForAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/JoinRoommate.vue")
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
    path: "/file/:token",
    name: "Dossier",
    meta: {
      title: "Dossier - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "file" */ "@/views/File.vue")
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
    path: "/status",
    name: "Status",
    meta: {
      title: "Statut du dossier - DossierFacile",
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/FileStatus.vue")
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
    path: "/changePassword/:token",
    name: "Password",
    meta: {
      title: "Nouveau mot de passe - DossierFacile",
      hideForAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "changePassword" */ "@/views/ChangePasswordPage.vue"
      )
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
      next({ name: "Login" });
    }
  } else if (to.matched.some(record => record.meta.hideForAuth)) {
    if (store.getters.isLoggedIn) {
      next({ name: "Profile" });
    }
  }
  document.title = to.meta.title;
  next();
});

export default router;
