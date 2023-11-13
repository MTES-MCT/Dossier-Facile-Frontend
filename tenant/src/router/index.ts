import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";
import { CONTENT } from "df-shared/src/models/SkipLink";
import {
  FUNNEL_SKIP_LINKS,
  FOOTER_NAVIGATION,
} from "../components/TenantSkipLinks.vue";

Vue.use(VueRouter);

const MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
const TENANT_URL = process.env.VUE_APP_FULL_TENANT_URL;

let updateTokenInterval: NodeJS.Timer;

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "DossierFacile, le dossier de location numérique de l’État",
      description:
        "Créez un dossier de location en ligne complet et vérifié par l'Etat pour trouver votre appartement ou votre logement",
    },
  },
  {
    path: "/signup",
    name: "Signup",
    meta: {
      title: "Création de compte - DossierFacile",
      description: "Créez votre compte en quelques clics sur DossierFacile",
      hideForAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "signup" */
        /* webpackPrefetch: true */
        "../views/SignupPage.vue"
      ),
  },
  {
    path: "/login",
    redirect: () => {
      window.location.replace(`${TENANT_URL}/account`);
      return "/account";
    },
  },
  {
    path: "/forgotten-password",
    name: "ForgottenPassword",
    meta: {
      title: "Mot de passe oublié - DossierFacile",
      description:
        "Accédez à la procédure de mot de passe oublié pour votre compte DossierFacile",
      hideForAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "forgottenPassword" */ "../views/ForgottenPasswordPage.vue"
      ),
  },
  {
    path: "/profile",
    name: "Profile",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: [CONTENT, FOOTER_NAVIGATION],
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/NameInformation.vue"),
  },
  {
    path: "/nom-locataire",
    name: "TenantName",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: [CONTENT, FOOTER_NAVIGATION],
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/NameInformation.vue"),
  },
  {
    path: "/type-locataire",
    name: "TenantType",
    meta: {
      title: "Mes informations - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/TypeInformation.vue"),
  },
  {
    path: "/documents-locataire/:substep",
    name: "TenantDocuments",
    meta: {
      title: "Mes documents - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/TenantDocument.vue"),
  },
  {
    path: "/documents-colocataire/:tenantId/:step/:substep/",
    name: "CoTenantDocuments",
    meta: {
      title: "Édition du profil - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/CoTenantDocument.vue"),
  },
  {
    path: "/choix-garant",
    name: "GuarantorChoice",
    meta: {
      title: "Mon garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "../views/GuarantorChoicePage.vue"
      ),
  },
  {
    path: "/liste-garants",
    name: "GuarantorList",
    meta: {
      title: "Mon garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "../views/GuarantorListPage.vue"
      ),
  },
  {
    path: "/garants-locataire/:tenantId/:step",
    name: "TenantGuarantors",
    meta: {
      title: "Édition du garant du locataire - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "../views/TenantGuarantorsPage.vue"
      ),
  },
  {
    path: "/validation-dossier",
    name: "ValidateFile",
    meta: {
      title: "Validation du dossier locataire - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ValidateFilePage.vue"),
  },
  {
    path: "/validation-dossier/:step",
    name: "ValidateFileStep",
    meta: {
      title: "Validation du dossier locataire - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ValidateFilePage.vue"),
  },
  {
    path: "/info-garant/:substep/:guarantorId?",
    name: "GuarantorDocuments",
    meta: {
      title: "Mon garant - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    beforeEnter: async (to, from, next) => {
      if (
        (!store.state.selectedGuarantor.firstName ||
          !store.state.selectedGuarantor.lastName) &&
        to.params.substep !== "0"
      ) {
        next({ name: "GuarantorDocuments", params: { substep: "0" } });
      }
      next();
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "../views/GuarantorDocumentsPage.vue"
      ),
  },
  {
    path: "/info-garant-locataire/:tenantId/:guarantorId/:step/:substep?",
    name: "TenantGuarantorDocuments",
    meta: {
      title: "Édition du garant du locataire - DossierFacile",
      requiresAuth: true,
      hideFooter: true,
      skipLinks: FUNNEL_SKIP_LINKS,
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "../views/TenantGuarantorDocumentsPage.vue"
      ),
  },
  {
    path: "/public-file/:token",
    name: "File",
    meta: {
      title: "Dossier - DossierFacile",
    },
    component: () =>
      import(/* webpackChunkName: "file" */ "../views/PublicFile.vue"),
  },
  {
    path: "/file/:token",
    name: "PublicFile",
    meta: {
      title: "Dossier - DossierFacile",
    },
    component: () => import(/* webpackChunkName: "file" */ "../views/File.vue"),
  },
  {
    path: "/account",
    name: "Account",
    meta: {
      title: "Mon dossier - DossierFacile",
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "account" */ "../views/Account.vue"),
  },
  {
    path: "/applications",
    name: "SharingPage",
    meta: {
      title: "Mes candidatures - DossierFacile",
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "account" */ "../views/SharingPage.vue"),
  },
  {
    path: "/messaging",
    name: "Messages",
    meta: {
      title: "Messages - DossierFacile",
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "messages" */ "../views/Messages.vue"),
  },
  {
    path: "/confirmAccount/:token",
    name: "Confirm",
    meta: {
      title: "Confirmation de compte - DossierFacile",
      hideForAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "confirmAccount" */ "../views/ConfirmAccount.vue"
      ),
  },
  {
    path: "/ajout-couple/:token",
    name: "Couple",
    meta: {
      title: "Confirmation de compte - DossierFacile",
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/JoinCouple.vue"),
  },
  {
    path: "/ajout-groupe/:token",
    name: "Group",
    meta: {
      title: "Confirmation de compte - DossierFacile",
    },
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/JoinGroup.vue"),
  },
  {
    path: "/reset-password/:token",
    name: "Password",
    meta: {
      title: "Nouveau mot de passe - DossierFacile",
      hideForAuth: false,
    },
    component: () =>
      import(
        /* webpackChunkName: "changePassword" */ "../views/ChangePasswordPage.vue"
      ),
  },
  {
    path: "/inscription-locataire/:token",
    name: "Inscription",
    meta: {
      title: "Inscription locataire - DossierFacile",
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
        /* webpackChunkName: "inscriptionLocataire" */ "../views/OwnerShare.vue"
      ),
  },
  {
    path: "/locataire",
    redirect: () => {
      window.location.replace(`${MAIN_URL}`);
      return "/info-proprietaire";
    },
  },
  {
    path: "/contact",
    name: "Contact",
    meta: {
      title: "Contact - DossierFacile",
      requiresAuth: false,
    },
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/Contact.vue"),
  },
  {
    path: "*",
    name: "404",
    meta: {
      title: "404 - DossierFacile",
    },
    component: () =>
      import(/* webpackChunkName: "404" */ "../views/NotFound404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    document.getElementById("app")?.scrollIntoView();
  },
});

function keepGoing(to: Route, next: NavigationGuardNext<Vue>) {
  if (
    to.matched.some((record: { path: string }) => {
      return record.path === "/account";
    }) &&
    store.state.user.status === "INCOMPLETE"
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

function registerFunnel(to: Route) {
  if (to.matched.some((record) => record.meta.hideFooter)) {
    store.commit("updateIsFunnel", true);
  } else {
    store.commit("updateIsFunnel", false);
  }
}

async function loadUserIfAuthenticated(next: NavigationGuardNext<Vue>) {
  if (!(Vue as any).$keycloak.authenticated) {
    return;
  }
  await (Vue as any).$keycloak.loadUserProfile();
  await store.dispatch("loadUser").catch(() => {
    next({ name: "404" });
  });
}

function updateKeycloakTokenAndMessages() {
  if (updateTokenInterval === undefined) {
    updateTokenInterval = setInterval(() => {
      (Vue as any).$keycloak.updateToken(60).catch((err: any) => {
        console.error(err);
      });
    }, 45000);
    store.dispatch("updateMessages");
  }
}

router.beforeEach(async (to, from, next) => {
  registerFunnel(to);

  to.matched.some((record) => {
    store.commit("updateSkipLinks", record.meta.skipLinks);
  });

  const lang = Vue.$cookies.get("lang") === "en" ? "en" : "fr";
  store.dispatch("setLang", lang);

  await loadUserIfAuthenticated(next);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!(Vue as any).$keycloak.authenticated) {
      // The page is protected and the user is not authenticated. Force a login.
      (Vue as any).$keycloak.login({
        redirectUri: TENANT_URL + to.fullPath,
      });
    } else {
      if ((Vue as any).$keycloak.profile?.emailVerified != true) {
        // email should be validated before access to the protected page.
        (Vue as any).$keycloak.logout({
          redirectUri: "https:" + MAIN_URL + "/#emailNotValidated",
        });
      } else {
        updateKeycloakTokenAndMessages();
        keepGoing(to, next);
        return;
      }
    }
  } else if (to.matched.some((record) => record.meta.hideForAuth)) {
    if ((Vue as any).$keycloak.authenticated) {
      next({ name: "Profile" });
    }
  }
  keepGoing(to, next);
});

export default router;
