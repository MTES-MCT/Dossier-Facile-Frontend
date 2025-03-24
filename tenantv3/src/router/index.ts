import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useTenantStore } from '@/stores/tenant-store'
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

const RESIDENCY_COMPONENTS = [
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

const GUARANTOR_RESIDENCY_ROUTES = [
  {
    path: 'tenant',
    component: () => import('@/components/guarantorResidency/GuarantorTenant.vue')
  },
  {
    path: 'owner',
    component: () => import('@/components/guarantorResidency/GuarantorOwner.vue')
  },
  {
    path: 'guest',
    component: () => import('@/components/guarantorResidency/GuarantorGuest.vue')
  },
  {
    path: 'guest/proof',
    component: () => import('@/components/guarantorResidency/GuarantorGuestProof.vue')
  },
  {
    path: 'guest/no-proof',
    component: () => import('@/components/guarantorResidency/GuarantorGuestNoProof.vue')
  },
  {
    path: 'guest-company',
    component: () => import('@/components/guarantorResidency/GuarantorGuestCompany.vue')
  },
  {
    path: 'other',
    component: () => import('@/components/guarantorResidency/GuarantorOther.vue')
  }
]

const FINANCIAL_ROUTES = [
  {
    path: '',
    component: () => import('@/components/financial/ChooseFinancial.vue')
  },
  {
    path: 'travail',
    component: () => import('@/components/financial/job/FinancialJob.vue')
  },
  {
    path: 'travail/salarie',
    component: () => import('@/components/financial/job/JobEmployed.vue')
  },
  {
    path: 'travail/salarie/plus-3-mois',
    component: () => import('@/components/financial/job/EmployedMore3Months.vue')
  },
  {
    path: 'travail/salarie/moins-3-mois',
    component: () => import('@/components/financial/job/EmployedLess3Months.vue')
  },
  {
    path: 'travail/salarie/pas-encore',
    component: () => import('@/components/financial/job/EmployedNotYet.vue')
  },
  {
    path: 'travail/independant',
    component: () => import('@/components/financial/job/JobFreelance.vue')
  },
  {
    path: 'travail/independant/auto-entrepreneur',
    component: () => import('@/components/financial/job/AutoEntrepreneur.vue')
  },
  {
    path: 'travail/independant/autre',
    component: () => import('@/components/financial/job/FreelanceOther.vue')
  },
  {
    path: 'travail/intermittent',
    component: () => import('@/components/financial/job/JobIntermittent.vue')
  },
  {
    path: 'travail/artiste-auteur',
    component: () => import('@/components/financial/job/JobArtist.vue')
  },
  {
    path: 'travail/inconnu',
    component: () => import('@/components/financial/job/JobUnknown.vue')
  },
  {
    path: 'social',
    component: () => import('@/components/financial/social/FinancialSocial.vue')
  },
  {
    path: 'social/caf',
    component: () => import('@/components/financial/social/SocialCAF.vue')
  },
  {
    path: 'social/caf/plus-3-Mois',
    component: () => import('@/components/financial/social/CAFMore3Months.vue')
  },
  {
    path: 'social/caf/moins-3-Mois',
    component: () => import('@/components/financial/social/CAFLess3Months.vue')
  },
  {
    path: 'social/france-travail',
    component: () => import('@/components/financial/social/SocialFranceTravail.vue')
  },
  {
    path: 'social/france-travail/plus-3-mois',
    component: () => import('@/components/financial/social/FranceTravailMore3Months.vue')
  },
  {
    path: 'social/france-travail/moins-3-mois',
    component: () => import('@/components/financial/social/FranceTravailLess3Months.vue')
  },
  {
    path: 'social/france-travail/pas-encore',
    component: () => import('@/components/financial/social/FranceTravailNotYet.vue')
  },
  {
    path: 'social/apl',
    component: () => import('@/components/financial/social/SocialAPL.vue')
  },
  {
    path: 'social/apl/plus-3-mois',
    component: () => import('@/components/financial/social/APLMore3Months.vue')
  },
  {
    path: 'social/apl/moins-3-mois',
    component: () => import('@/components/financial/social/APLLess3Months.vue')
  },
  {
    path: 'social/apl/pas-encore',
    component: () => import('@/components/financial/social/APLNotYet.vue')
  },
  {
    path: 'social/aah',
    component: () => import('@/components/financial/social/SocialAAH.vue')
  },
  {
    path: 'social/aah/plus-3-mois',
    component: () => import('@/components/financial/social/AAHMore3Months.vue')
  },
  {
    path: 'social/aah/moins-3-mois',
    component: () => import('@/components/financial/social/AAHLess3Months.vue')
  },
  {
    path: 'social/aah/pas-encore',
    component: () => import('@/components/financial/social/AAHNotYet.vue')
  },
  {
    path: 'social/autre',
    component: () => import('@/components/financial/social/SocialAutre.vue')
  },
  {
    path: 'pension',
    component: () => import('@/components/financial/pension/FinancialPension.vue')
  },
  {
    path: 'pension/retraite',
    component: () => import('@/components/financial/pension/PensionRetirement.vue')
  },
  {
    path: 'pension/retraite/bulletin',
    component: () => import('@/components/financial/pension/PensionStatement.vue')
  },
  {
    path: 'pension/retraite/pas-de-bulletin',
    component: () => import('@/components/financial/pension/PensionNoStatement.vue')
  },
  {
    path: 'pension/invalidite',
    component: () => import('@/components/financial/pension/PensionDisability.vue')
  },
  {
    path: 'pension/invalidite/plus-3-mois',
    component: () => import('@/components/financial/pension/DisabilityMore3Months.vue')
  },
  {
    path: 'pension/invalidite/moins-3-mois',
    component: () => import('@/components/financial/pension/DisabilityLess3Months.vue')
  },
  {
    path: 'pension/invalidite/pas-encore',
    component: () => import('@/components/financial/pension/DisabilityNotYet.vue')
  },
  {
    path: 'pension/alimentaire',
    component: () => import('@/components/financial/pension/PensionAlimony.vue')
  },
  {
    path: 'pension/inconnu',
    component: () => import('@/components/financial/pension/PensionUnknown.vue')
  },
  {
    path: 'rente',
    component: () => import('@/components/financial/annuity/FinancialAnnuity.vue')
  },
  {
    path: 'rente/revenus-locatifs',
    component: () => import('@/components/financial/annuity/AnnuityRentalIncome.vue')
  },
  {
    path: 'rente/revenus-locatifs/quittance',
    component: () => import('@/components/financial/annuity/AnnuityRentalReceipt.vue')
  },
  {
    path: 'rente/revenus-locatifs/pas-de-quittance',
    component: () => import('@/components/financial/annuity/AnnuityRentalNoReceipt.vue')
  },
  {
    path: 'rente/viagere',
    component: () => import('@/components/financial/annuity/AnnuityLife.vue')
  },
  {
    path: 'rente/autre',
    component: () => import('@/components/financial/annuity/AnnuityOther.vue')
  },
  {
    path: 'bourse',
    component: () => import('@/components/financial/scholarship/HasGrant.vue')
  },
  {
    path: 'pas-de-revenus',
    component: () => import('@/components/financial/noIncome/NoIncome.vue')
  }
]

export const router = createRouter({
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
      beforeEnter: (to) => {
        const store = useTenantStore()

        // If user has been invited to an application we force self identity
        if (store.user.tenantType !== 'CREATE' && to.name !== 'SelfTenantIdentity') {
          return { name: 'SelfTenantIdentity' }
        }

        if (to.name === 'TenantName') {
          const ownerType = store.user.ownerType
          if (ownerType === undefined) {
            return { name: 'ChooseTenantIdentity' }
          }
          if (ownerType === 'SELF') {
            return { name: 'SelfTenantIdentity' }
          }
          if (ownerType === 'THIRD_PARTY') {
            return { name: 'ThirdPartyTenantIdentity' }
          }
        }
      },
      component: () => import('../views/TenantIdentityInformation.vue'),
      children: [
        {
          path: '',
          name: 'ChooseTenantIdentity',
          component: () => import('@/components/identity/ChooseIdentity.vue')
        },
        {
          path: 'pour-moi',
          name: 'SelfTenantIdentity',
          component: () => import('@/components/identity/SelfIdentity.vue')
        },
        {
          path: 'pour-une-autre-personne',
          name: 'ThirdPartyTenantIdentity',
          component: () => import('@/components/identity/ThirdPartyIdentity.vue')
        }
      ]
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
            ...RESIDENCY_COMPONENTS
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
          component: () => import('@/components/financial/FinancialRecap.vue')
        },
        {
          path: '4/ajouter',
          component: () => import('@/components/documents/tenant/TenantFinancial.vue'),
          children: FINANCIAL_ROUTES
        },
        {
          path: '4/:docId',
          component: () => import('@/components/documents/tenant/TenantFinancial.vue'),
          children: FINANCIAL_ROUTES,
          beforeEnter: (to) => {
            const store = useTenantStore()
            const doc = store.financialDocuments.find((d) => d.id === Number(to.params.docId))
            if (!doc) {
              return { name: 'TenantFinancial' }
            }
          }
        },
        {
          path: '5',
          name: 'TenantTax',
          component: () => import('@/components/documents/tenant/TenantTax.vue')
        }
      ]
    },
    {
      path: '/documents-colocataire/:tenantId/:step/:substep',
      meta: {
        title: 'Édition du profil - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/CoTenantDocument.vue'),
      children: [
        {
          path: '',
          name: 'CoTenantDocuments',
          component: () => import('@/components/residency/ChooseResidency.vue')
        },
        ...RESIDENCY_COMPONENTS
      ]
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
      meta: {
        title: 'Mon garant - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      beforeEnter: (to) => {
        const store = useTenantStore()
        const g = store.guarantors.find((g: Guarantor) => {
          return g.id?.toString() == to.params.guarantorId
        })
        if (
          (g === undefined ||
            (g.typeGuarantor === 'NATURAL_PERSON' && (!g?.firstName || !g?.lastName))) &&
          to.params.substep !== '0'
        ) {
          return { name: 'GuarantorDocuments', params: { substep: '0' } }
        }
      },
      component: () => import('../views/GuarantorDocumentsPage.vue'),
      children: [
        {
          path: '',
          name: 'GuarantorDocuments',
          component: () => import('@/components/guarantorResidency/ChooseGuarantorResidency.vue')
        },
        ...GUARANTOR_RESIDENCY_ROUTES
      ]
    },
    {
      path: '/info-garant-locataire/:tenantId/:guarantorId/:step/:substep?',
      meta: {
        title: 'Édition du garant du locataire - DossierFacile',
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/TenantGuarantorDocumentsPage.vue'),
      children: [
        {
          path: '',
          name: 'TenantGuarantorDocuments',
          component: () => import('@/components/guarantorResidency/ChooseGuarantorResidency.vue')
        },
        ...GUARANTOR_RESIDENCY_ROUTES
      ]
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
      beforeEnter: () => {
        const store = useTenantStore()
        if (store.user.status === 'INCOMPLETE') {
          return store.firstProfilePage()
        }
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
  ],
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

function updateKeycloakToken() {
  if (updateTokenInterval === undefined) {
    updateTokenInterval = setInterval(() => {
      keycloak.updateToken(60).catch((err) => {
        console.error(err)
      })
    }, 45000)
  }
}

async function handleProtectedRoute(to: RouteLocationNormalized) {
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
      updateKeycloakToken()
      const store = useTenantStore()
      if (!store.user.id) {
        await store.loadUser()
        await store.loadPartnerAccesses()
        store.updateMessages()
      }
    }
  } else {
    // The page is protected and the user is not authenticated. Force a login.
    await keycloak.login({
      redirectUri: TENANT_URL + to.fullPath
    })
  }
}

router.beforeEach(async (to: RouteLocationNormalized, from, next: NavigationGuardNext) => {
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

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    await handleProtectedRoute(to)
  } else if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (keycloak.authenticated) {
      next({ name: 'Profile' })
      return
    }
  }
  keepGoing(to, next)
})
