import Vue from "vue";
import VueRouter, { NavigationGuardNext, RawLocation, Route, RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store";

Vue.use(VueRouter);

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
const TENANT_URL = process.env.VUE_APP_FULL_TENANT_URL;

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
    path: "/login",
    redirect: () => {
      window.location.replace(`${TENANT_URL}/account`);
      return "/account";
    }
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
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/NameInformation.vue")
  },
  {
    path: "/nom-locataire",
    name: "TenantName",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/NameInformation.vue")
  },
  {
    path: "/type-locataire",
    name: "TenantType",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/TypeInformation.vue")
  },
  {
    path: "/documents-locataire/:substep",
    name: "TenantDocuments",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/TenantDocument.vue")
  },
  {
    path: "/choix-garant",
    name: "GuarantorChoice",
    meta: {
      title: "Édition du garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "@/views/GuarantorChoicePage.vue"
      )
  },
  {
    path: "/liste-garants",
    name: "GuarantorList",
    meta: {
      title: "Édition du garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/GuarantorListPage.vue")
  },
  {
    path: "/validation-dossier",
    name: "ValidateFile",
    meta: {
      title: "Édition du garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/ValidateFilePage.vue")
  },
  {
    path: "/info-garant/:substep",
    name: "GuarantorDocuments",
    meta: {
      title: "Édition du garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "@/views/GuarantorDocumentsPage.vue"
      )
  },
  {
    path: "/public-file/:token",
    name: "File",
    meta: {
      title: "Dossier - DossierFacile"
    },
    component: () =>
      import(/* webpackChunkName: "file" */ "@/views/PublicFile.vue")
  },
  {
    path: "/file/:token",
    name: "PublicFile",
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
    beforeEnter: (to, from, next) => {
      if ((Vue as any).$keycloak.authenticated) {
        (Vue as any).$keycloak
          .updateToken(70)
          .then(() => {
            store.dispatch("loadUser").then(() => {
              next();
            });
          })
          .catch((err: any) => {
            console.error(err);
          });
      } else {
        next();
      }
    },
    component: () =>
      import(/* webpackChunkName: "source" */ "@/views/Source.vue")
  },
  {
    path: "/account",
    name: "Account",
    meta: {
      title: "Mon compte - DossierFacile",
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "account" */ "@/views/Account.vue")
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
    beforeEnter: (to, from, next) => {
      if ((Vue as any).$keycloak.authenticated) {
        (Vue as any).$keycloak
          .updateToken(70)
          .then(() => {
            store.dispatch("loadUser").then(() => {
              next();
            });
          })
          .catch((err: any) => {
            console.error(err);
          });
      } else {
        next();
      }
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

function keepGoing(to: Route, next: NavigationGuardNext<Vue>) {
  if (
    to.matched.some((record: { path: string }) => {
      return record.path === "/account";
    }) &&
    store.state.user?.status === "INCOMPLETE"
  ) {
    store.dispatch("firstProfilePage");
    return;
  }
  document.title = to.meta?.title;
  if (to.meta?.description) {
    const tag = document.querySelector('meta[name="description"]');
    tag?.setAttribute("content", to.meta.description);

    const prop = document.querySelector('meta[property="og:description"]');
    prop?.setAttribute("content", to.meta.description);

    const title = document.querySelector('meta[property="og:title"]');
    title?.setAttribute("content", to.meta.title);
  }
  next();
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.hideFooter)) {
    store.commit("showFooter", false);
  } else {
    store.commit("showFooter", true);
  }

  const lang = Vue.$cookies.get("lang") === "en" ? "en" : "fr";
  store.dispatch("setLang", lang);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!(Vue as any).$keycloak.authenticated) {
      // The page is protected and the user is not authenticated. Force a login.
      (Vue as any).$keycloak.login({
        redirectUri: TENANT_URL + to.path
      });
    } else {
      // The user was authenticated, and has the app role
      store.dispatch("loadUser").then(() => {
        keepGoing(to, next);
      });
      setInterval(() => {
        (Vue as any).$keycloak.updateToken(60).catch((err: any) => {
            console.error(err);
          });
      }, 45000);
    }
  } else if (to.matched.some(record => record.meta.hideForAuth)) {
    if ((Vue as any).$keycloak.authenticated) {
      next({ name: "Profile" });
    }
  }
  keepGoing(to, next);
});

export default router;
