import * as VueRouter from 'vue-router';
import { useCookies } from 'vue3-cookies';
import Account from '../components/account/Account.vue';
import Dashboard from '../components/Dashboard.vue';
import PropertyName from '../components/property/PropertyName.vue';
import PropertyType from '../components/property/PropertyType.vue';
import PropertyFurniture from '../components/property/PropertyFurniture.vue';
import PropertyRent from '../components/property/PropertyRent.vue';
import ConsultProperty from '../components/property/ConsultProperty.vue';
import ValidateProperty from '../components/property/ValidateProperty.vue';
import SignupPage from '../components/SignupPage.vue';
import store from '../store';
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
      if (store.getters.isLoggedIn
        && (!store.getters.getUser?.firstName || !store.getters.getUser?.lastName)) {
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
    component: SignupPage,
  },
  {
    path: '/proprietaire',
    name: 'AccountName',
    meta: {
      title: 'Édition de compte propriétaire - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: Account,
  },
  {
    path: '/consulte-propriete/:id',
    name: 'ConsultProperty',
    meta: {
      title: 'Propriété - DossierFacile',
      requiresAuth: true,
      hasFooter: true,
    },
    component: ConsultProperty,
  },
  {
    path: '/nom-propriete/:id?',
    name: 'PropertyName',
    meta: {
      title: 'Édition du nom - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: PropertyName,
  },
  {
    path: '/type-propriete/:id?',
    name: 'PropertyType',
    meta: {
      title: 'Édition du type - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: PropertyType,
  },
  {
    path: '/amenagement-propriete/:id?',
    name: 'PropertyFurniture',
    meta: {
      title: 'Édition de l\'aménagement - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: PropertyFurniture,
  },
  {
    path: '/loyer-propriete/:id?',
    name: 'PropertyRent',
    meta: {
      title: 'Édition du loyer - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: PropertyRent,
  },
  {
    path: '/valider-propriete/:id?',
    name: 'ValidateProperty',
    meta: {
      title: 'Validation de la propriété - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
    },
    component: ValidateProperty,
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
  if (to.matched.some((record) => record.meta.hideFooter)) {
    store.dispatch('setHasFooter', true);
  } else {
    store.dispatch('setHasFooter', false);
  }

  const { cookies } = useCookies();
  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr';
  store.dispatch('setLang', lang);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (keycloak.authenticated) {
      await store.dispatch('loadUser');
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
