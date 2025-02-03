import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import useTenantStore from '@/stores/tenant-store'
import { CONTENT, type SkipLink } from 'df-shared-next/src/models/SkipLink'
import { keycloak } from '../plugin/keycloak'
import Home from '../views/HomePage.vue'
import { FOOTER_NAVIGATION, FUNNEL_SKIP_LINKS } from '@/models/SkipLinkModel'
import { CookiesService } from 'df-shared-next/src/services/CookiesService'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const TENANT_URL = import.meta.env.VITE_FULL_TENANT_URL
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL

let updateTokenInterval: number

declare module 'vue-router' {
  interface RouteMeta {
    description?: string
    hideFooter?: boolean
    requiresAuth?: boolean
    skipLinks?: SkipLink[]
    title: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'DossierFacile, le dossier de location numérique de l’État',
        description:
          "Créez un dossier de location en ligne complet et vérifié par l'Etat pour trouver votre appartement ou votre logement"
      }
    },
    {
      path: '/login',
      redirect: '/account'
    },
    {
      path: '/signup',
      beforeEnter() {
        location.href = REGISTER_URL
      },
      component: {}
    },
    {
      path: '/profile',
      name: 'Profile',
      meta: {
        title: 'Édition du profil - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: [CONTENT, FOOTER_NAVIGATION]
      },
      component: () => import('../views/NameInformation.vue')
    },
    {
      path: '/nom-locataire',
      name: 'TenantName',
      meta: {
        title: 'Édition du profil - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: [CONTENT, FOOTER_NAVIGATION]
      },
      component: () => import('../views/NameInformation.vue')
    },
    {
      path: '/type-locataire',
      name: 'TenantType',
      meta: {
        title: 'Mes informations - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/TypeInformation.vue')
    },
    {
      path: '/documents-locataire',
      name: 'TenantDocuments',
      meta: {
        title: 'Mes documents - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('@/views/TenantDocument.vue'),
      children: [
        {
          path: '1',
          name: 'TenantIdentification',
          component: () => import('@/components/documents/tenant/TenantIdentification.vue')
        },
        {
          path: '2',
          component: () => import('@/components/documents/tenant/TenantResidency.vue'),
          children: [
            {
              path: '',
              name: 'TenantResidency',
              component: () => import('@/components/residency/ChooseResidency.vue')
            },
            {
              path: 'tenant',
              component: () => import('@/components/residency/TenantResidency.vue')
            },
            {
              path: 'tenant/receipts',
              component: () => import('@/components/residency/TenantReceipts.vue')
            },
            {
              path: 'tenant/proof',
              component: () => import('@/components/residency/TenantProof.vue')
            },
            {
              path: 'guest',
              component: () => import('@/components/residency/GuestResidency.vue')
            },
            {
              path: 'guest/proof',
              component: () => import('@/components/residency/GuestProof.vue')
            },
            {
              path: 'guest/no-proof',
              component: () => import('@/components/residency/GuestNoProof.vue')
            },
            {
              path: 'owner',
              component: () => import('@/components/residency/OwnerResidency.vue')
            },
            {
              path: 'guest-company',
              component: () => import('@/components/residency/GuestCompany.vue')
            },
            {
              path: 'guest-organism',
              component: () => import('@/components/residency/GuestOrganism.vue')
            },
            {
              path: 'short-term-rental',
              component: () => import('@/components/residency/ShortTermRental.vue')
            },
            {
              path: 'other-residency',
              component: () => import('@/components/residency/OtherResidency.vue')
            }
          ]
        },
        {
          path: '3',
          name: 'TenantProfessional',
          component: () => import('@/components/documents/tenant/TenantProfessional.vue')
        },
        {
          path: '4',
          name: 'TenantFinancial',
          component: () => import('@/components/documents/tenant/TenantFinancial.vue')
        },
        {
          path: '5',
          name: 'TenantTax',
          component: () => import('@/components/documents/tenant/TenantTax.vue')
        }
      ]
    },
    {
      path: '/documents-colocataire/:tenantId/:step/:substep/',
      name: 'CoTenantDocuments',
      meta: {
        title: 'Édition du profil - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/CoTenantDocument.vue')
    },
    {
      path: '/choix-garant',
      name: 'GuarantorChoice',
      meta: {
        title: 'Mon garant - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/GuarantorChoicePage.vue')
    },
    {
      path: '/liste-garants',
      name: 'GuarantorList',
      meta: {
        title: 'Mon garant - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/GuarantorListPage.vue')
    },
    {
      path: '/garants-locataire/:tenantId/:step',
      name: 'TenantGuarantors',
      meta: {
        title: 'Édition du garant du locataire - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/TenantGuarantorsPage.vue')
    },
    {
      path: '/validation-dossier',
      name: 'ValidateFile',
      meta: {
        title: 'Validation du dossier locataire - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/ValidateFilePage.vue')
    },
    {
      path: '/validation-dossier/:step',
      name: 'ValidateFileStep',
      meta: {
        title: 'Validation du dossier locataire - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/ValidateFilePage.vue')
    },
    {
      path: '/info-garant/:substep/:guarantorId?',
      name: 'GuarantorDocuments',
      meta: {
        title: 'Mon garant - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      beforeEnter: async (to, from, next) => {
        const store = useTenantStore()
        const g = store.guarantors.find((g: Guarantor) => {
          return g.id?.toString() == to.params.guarantorId
        })
        if (
          (g === undefined ||
            (g.typeGuarantor === 'NATURAL_PERSON' && (!g?.firstName || !g?.lastName))) &&
          to.params.substep !== '0'
        ) {
          next({ name: 'GuarantorDocuments', params: { substep: '0' } })
        }
        next()
      },
      component: () => import('../views/GuarantorDocumentsPage.vue')
    },
    {
      path: '/info-garant-locataire/:tenantId/:guarantorId/:step/:substep?',
      name: 'TenantGuarantorDocuments',
      meta: {
        title: 'Édition du garant du locataire - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/TenantGuarantorDocumentsPage.vue')
    },
    {
      path: '/public-file/:token',
      name: 'File',
      meta: {
        title: 'Dossier - DossierFacile'
      },
      component: () => import('../views/PublicFile.vue')
    },
    {
      path: '/file/:token',
      name: 'PublicFile',
      meta: {
        title: 'Dossier - DossierFacile'
      },
      component: () => import('../views/FilePage.vue')
    },
    {
      path: '/account',
      name: 'Account',
      meta: {
        title: 'Mon dossier - DossierFacile',
        requiresAuth: true
      },
      beforeEnter: async (to, from, next) => {
        const store = useTenantStore()
        if (store.user.status === 'INCOMPLETE') {
          const d = await store.firstProfilePage()
          if (d) {
            next(d)
            return
          }
        }
        next()
      },
      component: () => import('../views/AccountPage.vue')
    },
    {
      path: '/applications',
      name: 'SharingPage',
      meta: {
        title: 'Vos candidatures - DossierFacile',
        requiresAuth: true
      },
      component: () => import('../views/SharingPage.vue')
    },
    {
      path: '/partners',
      name: 'PartnerAccessPage',
      meta: {
        title: 'Vos partages - DossierFacile',
        requiresAuth: true
      },
      component: () => import('../views/PartnerAccessPage.vue')
    },
    {
      path: '/messaging',
      name: 'Messages',
      meta: {
        title: 'Messages - DossierFacile',
        requiresAuth: true
      },
      component: () => import('../views/MessagesPage.vue')
    },
    {
      path: '/ajout-couple/:token',
      name: 'Couple',
      meta: {
        title: 'Confirmation de compte - DossierFacile'
      },
      component: () => import('../views/JoinCouple.vue')
    },
    {
      path: '/ajout-groupe/:token',
      name: 'Group',
      meta: {
        title: 'Confirmation de compte - DossierFacile'
      },
      component: () => import('../views/JoinGroup.vue')
    },
    {
      path: '/confirmAccount/:token',
      name: 'Confirm',
      meta: {
        title: 'Conserver ses documents - DossierFacile',
        hideForAuth: true
      },
      component: () => import('../views/ConfirmAccount.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      meta: {
        title: 'Contact - DossierFacile',
        requiresAuth: false
      },
      component: () => import('../views/ContactPage.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: 'catchall',
      meta: {
        title: '404 - DossierFacile'
      },
      component: () => import('../views/NotFound404.vue')
    }
  ] satisfies RouteRecordRaw[],
  scrollBehavior() {
    document.getElementById('app')?.scrollIntoView()
  }
})

async function keepGoing(to: RouteLocationNormalized, next: NavigationGuardNext) {
  document.title = to.meta?.title
  if (to.meta?.description) {
    const tag = document.querySelector('meta[name="description"]')
    tag?.setAttribute('content', to.meta.description)

    const prop = document.querySelector('meta[property="og:description"]')
    prop?.setAttribute('content', to.meta.description)

    const title = document.querySelector('meta[property="og:title"]')
    title?.setAttribute('content', to.meta.title)
  }
  next()
}

function registerFunnel(to: RouteLocationNormalized) {
  const store = useTenantStore()
  if (to.matched.some((record) => record.meta.hideFooter)) {
    store.updateIsFunnel(true)
  } else {
    store.updateIsFunnel(false)
  }
}

function updateKeycloakTokenAndMessages() {
  if (updateTokenInterval === undefined) {
    updateTokenInterval = setInterval(() => {
      keycloak.updateToken(60).catch((err) => {
        console.error(err)
      })
    }, 45000)
    const store = useTenantStore()
    store.updateMessages()
  }
}

router.beforeEach(async (to: RouteLocationNormalized, from, next: NavigationGuardNext) => {
  registerFunnel(to)
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

  to.matched.some((record) => {
    const store = useTenantStore()
    store.updateSkipLinks(record.meta.skipLinks || [])
  })

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (keycloak.authenticated) {
      if (!keycloak.profile) {
        await keycloak.loadUserProfile()
      }
      if (!keycloak.profile?.emailVerified) {
        // email should be validated before access to the protected page.
        keycloak.logout({
          redirectUri: 'https:' + MAIN_URL + '/#emailNotValidated'
        })
      } else {
        updateKeycloakTokenAndMessages()
      }
    } else {
      // The page is protected and the user is not authenticated. Force a login.
      await keycloak.login({
        redirectUri: TENANT_URL + to.fullPath
      })
    }
  } else if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (keycloak.authenticated) {
      next({ name: 'Profile' })
      return
    }
  }
  keepGoing(to, next)
})

export default router
