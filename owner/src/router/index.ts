import * as VueRouter from 'vue-router'
import { CookiesService } from 'df-shared-next/src/services/CookiesService'
import Dashboard from '../components/DashboardPage.vue'
import LandingPage from '../components/LandingPage.vue'
import useOwnerStore from '../store/owner-store'
import keycloak from '../plugin/keycloak'
import cookies from 'js-cookie'

const OWNER_URL = import.meta.env.VITE_OWNER_URL

declare module 'vue-router' {
  interface RouteMeta {
    anonymous?: boolean
    description?: string
    hasFooter?: boolean
    position?: number
    requireAuth?: boolean
    requiresComplete?: boolean
    title: string
    analyticsIgnore?: boolean
  }
}

const routes = [
  {
    path: '/',
    name: 'landing',
    meta: {
      title: 'DossierFacile propriétaire',
      requiresAuth: false,
      requiresGuest: true,
      hasFooter: true
    },
    component: LandingPage
  },
  {
    path: '/home',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard propriétaire - DossierFacile',
      requiresAuth: true,
      requiresComplete: true,
      hasFooter: true
    },
    component: Dashboard
  },
  {
    path: '/creation',
    name: 'Register',
    meta: {
      title: 'Création de compte propriétaire - DossierFacile',
      requiresAuth: false,
      hasFooter: true
    },
    component: () => import('../components/SignupPage.vue')
  },
  {
    path: '/confirmerCompte/:token',
    name: 'ConfirmAccount',
    meta: {
      title: 'Confirmation de compte propriétaire - DossierFacile',
      requiresAuth: false,
      hasFooter: true,
      analyticsIgnore: true
    },
    component: () => import('../components/account/ConfirmAccountPage.vue')
  },
  {
    path: '/mot-de-passe-oublie',
    name: 'ForgottenPassword',
    meta: {
      title: 'Mot de passe oublié - DossierFacile',
      description: 'Accédez à la procédure de mot de passe oublié pour votre compte DossierFacile',
      hideForAuth: true
    },
    component: () => import('../components/account/ForgottenPasswordPage.vue')
  },
  {
    path: '/modifier-mot-de-passe/:token',
    name: 'ChangePassword',
    meta: {
      title: 'Nouveau mot de passe - DossierFacile',
      hideForAuth: true,
      analyticsIgnore: true
    },
    component: () => import('../components/account/ChangePasswordPage.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    meta: {
      title: 'Contact - DossierFacile',
      requiresAuth: false,
      hasFooter: true
    },
    component: () => import('../components/ContactPage.vue')
  },
  {
    path: '/proprietaire',
    name: 'AccountName',
    meta: {
      title: 'Édition de compte propriétaire - DossierFacile',
      requiresAuth: true,
      hasFooter: false
    },
    component: () => import('../components/account/AccountPage.vue')
  },
  {
    path: '/consulte-propriete/:id',
    name: 'ConsultProperty',
    meta: {
      title: 'Propriété - DossierFacile',
      requiresAuth: true,
      hasFooter: true
    },
    component: () => import('../components/property/ConsultProperty.vue')
  },
  {
    path: '/candidater/:token',
    name: 'ConnectProperty',
    meta: {
      title: 'Candidater - DossierFacile',
      requiresAuth: false,
      anonymous: true,
      hasFooter: true,
      analyticsIgnore: true
    },
    component: () => import('../components/property/ConnectProperty.vue')
  },
  {
    path: '/validConnexion/:token',
    name: 'ValidConnectProperty',
    meta: {
      title: 'Candidater - DossierFacile',
      requiresAuth: false,
      anonymous: true,
      hasFooter: true,
      analyticsIgnore: true
    },
    component: () => import('../components/property/ConnectPropertyValidate.vue')
  },
  {
    path: '/nom-propriete/:id?',
    name: 'PropertyName',
    meta: {
      title: 'Édition du nom - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 0
    },
    component: () => import('../components/property/PropertyName.vue')
  },
  {
    path: '/type-propriete/:id?',
    name: 'PropertyType',
    meta: {
      title: 'Édition du type - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 1
    },
    component: () => import('../components/property/PropertyType.vue')
  },
  {
    path: '/adresse-propriete/:id?',
    name: 'PropertyAddress',
    meta: {
      title: "Édition de l'adresse - DossierFacile",
      requiresAuth: true,
      hasFooter: false,
      position: 2
    },
    component: () => import('../components/property/PropertyAddress.vue')
  },
  {
    path: '/amenagement-propriete/:id?',
    name: 'PropertyFurniture',
    meta: {
      title: "Édition de l'aménagement - DossierFacile",
      requiresAuth: true,
      hasFooter: false,
      position: 3
    },
    component: () => import('../components/property/PropertyFurniture.vue')
  },
  {
    path: '/surface/:id?',
    name: 'PropertyLivingSpace',
    meta: {
      title: 'Édition de la surface - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 4
    },
    component: () => import('../components/property/PropertyLivingSpace.vue')
  },
  {
    path: '/loyer-propriete/:id?',
    name: 'PropertyRent',
    meta: {
      title: 'Édition du loyer - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 5
    },
    component: () => import('../components/property/PropertyRent.vue')
  },
  {
    path: '/diagnostic-propriete/:id?',
    name: 'PropertyDiagnostic',
    meta: {
      title: 'Édition du diagnostic énergétique - DossierFacile',
      requiresAuth: true,
      hasFooter: false,
      position: 6
    },
    component: () => import('../components/property/PropertyDiagnosticAdeme.vue')
  },
  {
    path: '/valider-propriete/:id?',
    name: 'ValidateProperty',
    meta: {
      title: 'Validation de la propriété - DossierFacile',
      requiresAuth: true,
      hasFooter: false
    },
    component: () => import('../components/property/ValidateProperty.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      title: '404 - DossierFacile',
      requiresAuth: false,
      hasFooter: true
    },
    component: () => import('../components/NotFound404.vue')
  }
] satisfies VueRouter.RouteRecordRaw[]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

function updateMetaData(to: VueRouter.RouteLocationNormalized) {
  document.title = to.meta?.title || ''
  if (to.meta?.description) {
    const tag = document.querySelector('meta[name="description"]')
    tag?.setAttribute('content', to.meta.description)

    const prop = document.querySelector('meta[property="og:description"]')
    prop?.setAttribute('content', to.meta.description)

    const title = document.querySelector('meta[property="og:title"]')
    title?.setAttribute('content', to.meta.title)
  }
}

router.beforeEach(async (to, _, next) => {
  if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (keycloak.authenticated) {
      next({ name: 'Dashboard' })
      return
    }
  }
  const store = useOwnerStore()
  if (to.matched.some((record) => record.meta.hasFooter)) {
    store.setHasFooter(true)
  } else {
    store.setHasFooter(false)
  }

  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr'
  store.setLang(lang)

  if (
    to.query.mtm_campaign !== undefined ||
    to.query.mtm_source !== undefined ||
    to.query.mtm_medium !== undefined
  ) {
    CookiesService.setJsonCookie(
      'acquisition',
      {
        campaign: to.query.mtm_campaign,
        source: to.query.mtm_source,
        medium: to.query.mtm_medium
      },
      CookiesService.datePlusDaysFromNow(1)
    )
  }

  if (to.matched.some((record) => record.meta.anonymous)) {
    updateMetaData(to)
    next()
    return
  }
  if (keycloak.authenticated) {
    await store.loadUser()
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!keycloak.authenticated) {
      await keycloak.login({ redirectUri: OWNER_URL + to.fullPath })
    }
  }
  if (to.matched.some((record) => record.meta.requiresComplete)) {
    if (store.isLoggedIn && (!store.getUser?.firstName || !store.getUser?.lastName)) {
      next({ name: 'AccountName' })
      return
    }
  }
  updateMetaData(to)
  next()
})

export default router
