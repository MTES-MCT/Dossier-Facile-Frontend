import * as VueRouter from 'vue-router';
import { useCookies } from 'vue3-cookies';
import Dashboard from '../components/Dashboard.vue';
import useOwnerStore from '../store/owner-store';
import keycloak from '../plugin/keycloak';

const OWNER_URL = import.meta.env.VITE_OWNER_URL;

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard propriétaire - DossierFacile',
      requiresAuth: true,
      hasFooter: true,
    },
    component: Dashboard,
    beforeEnter: async (_to: any, _from: any, next: any) => {
      const store = useOwnerStore();
      if (store.isLoggedIn
        && (!store.getUser?.firstName || !store.getUser?.lastName)) {
        next({ name: 'AccountName' });
      }
      next();
    },
  },
  {
    path: '/creation',
    name: 'Register',
    meta: {
      title: 'Création de compte propriétaire - DossierFacile',
      requiresAuth: false,
      hasFooter: true,
    },
    component: () => import('../components/SignupPage.vue'),
  },
  {
    path: '/confirmerCompte/:token',
    name: 'ConfirmAccount',
    meta: {
      title: 'Confirmation de compte propriétaire - DossierFacile',
      requiresAuth: false,
      hasFooter: true,
    },
    component: () => import('../components/account/ConfirmAccountPage.vue'),
  },
  {
    path: '/mot-de-passe-oublie',
    name: 'ForgottenPassword',
    meta: {
      title: 'Mot de passe oublié - DossierFacile',
      description:
        'Accédez à la procédure de mot de passe oublié pour votre compte DossierFacile',
      hideForAuth: true,
    },
    component: () => import('../components/account/ForgottenPasswordPage.vue'),
  },
  {
    path: '/modifier-mot-de-passe/:token',
    name: 'ChangePassword',
    meta: {
      title: 'Nouveau mot de passe - DossierFacile',
      hideForAuth: true,
    },
    component: () => import('../components/account/ChangePasswordPage.vue'),
  },
  {
    path: '/proprietaire',
    name: 'AccountName',
    meta: {
      title: 'Édition de compte propriétaire - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: () => import('../components/account/Account.vue'),
  },
  {
    path: '/consulte-propriete/:id',
    name: 'ConsultProperty',
    meta: {
      title: 'Propriété - DossierFacile',
      requiresAuth: true,
      hasFooter: true,
    },
    component: () => import('../components/property/ConsultProperty.vue'),
  },
  {
    path: '/nom-propriete/:id?',
    name: 'PropertyName',
    meta: {
      title: 'Édition du nom - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 0,
    },
    component: () => import('../components/property/PropertyName.vue'),
  },
  {
    path: '/type-propriete/:id?',
    name: 'PropertyType',
    meta: {
      title: 'Édition du type - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 1,
    },
    component: () => import('../components/property/PropertyType.vue'),
  },
  {
    path: '/adresse-propriete/:id?',
    name: 'PropertyAddress',
    meta: {
      title: 'Édition de l\'adresse - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 2,
    },
    component: () => import('../components/property/PropertyAddress.vue'),
  },
  {
    path: '/amenagement-propriete/:id?',
    name: 'PropertyFurniture',
    meta: {
      title: 'Édition de l\'aménagement - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 3,
    },
    component: () => import('../components/property/PropertyFurniture.vue'),
  },
  {
    path: '/loyer-propriete/:id?',
    name: 'PropertyRent',
    meta: {
      title: 'Édition du loyer - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 4,
    },
    component: () => import('../components/property/PropertyRent.vue'),
  },
  {
    path: '/valider-propriete/:id?',
    name: 'ValidateProperty',
    meta: {
      title: 'Validation de la propriété - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: () => import('../components/property/ValidateProperty.vue'),
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

function updateMetaData(to: VueRouter.RouteLocationNormalized) {
  document.title = to.meta?.title as string || '';
  if (to.meta?.description) {
    const tag = document.querySelector('meta[name="description"]');
    tag?.setAttribute('content', to.meta.description as string);

    const prop = document.querySelector('meta[property="og:description"]');
    prop?.setAttribute('content', to.meta.description as string);

    const title = document.querySelector('meta[property="og:title"]');
    title?.setAttribute('content', to.meta.title as string);
  }
}

router.beforeEach(async (to, _, next) => {
  const store = useOwnerStore();
  if (to.matched.some((record) => record.meta.hasFooter)) {
    store.setHasFooter(true);
  } else {
    store.setHasFooter(false);
  }

  const { cookies } = useCookies();
  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr';
  store.setLang(lang);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (keycloak.authenticated) {
      await store.loadUser();
    } else {
      keycloak.login({ redirectUri: OWNER_URL + to.fullPath });
    }
  } else if (keycloak.authenticated) {
    next({ name: 'Dashboard' });
    return;
  }
  updateMetaData(to);
  next();
});

export default router;
