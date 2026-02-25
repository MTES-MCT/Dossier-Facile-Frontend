import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useTenantStore } from '@/stores/tenant-store'
import { CONTENT, type SkipLink } from 'df-shared-next/src/models/SkipLink'
import { keycloak } from '../plugin/keycloak'
import Home from '../views/HomePage.vue'
import { FOOTER_NAVIGATION, FUNNEL_SKIP_LINKS } from '@/models/SkipLinkModel'
import { CookiesService } from 'df-shared-next/src/services/CookiesService'
import { clearAllToasts } from '@/components/toast/toastUtils'
import { i18n } from '@/i18n'

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
    title?: string
    analyticsIgnore?: boolean
  }
}

const TAX_ROUTES = (prefix: string): RouteRecordRaw[] => [
  {
    path: 'avec-avis',
    name: `${prefix}TaxAvecAvis`,
    component: () => import('@/components/tax/TaxCountryChoice.vue')
  },
  {
    path: 'avec-avis/francais',
    name: `${prefix}TaxAvecAvisFrancais`,
    component: () => import('@/components/tax/FrenchTaxForm.vue')
  },
  {
    path: 'avec-avis/etranger',
    name: `${prefix}TaxAvecAvisEtranger`,
    component: () => import('@/components/tax/ForeignTaxForm.vue')
  },
  {
    path: 'sans-avis',
    name: `${prefix}TaxSansAvis`,
    component: () => import('@/components/tax/NoTaxChoice.vue')
  },
  {
    path: 'sans-avis/sans-declaration',
    name: `${prefix}TaxSansAvisSansDeclaration`,
    component: () => import('@/components/tax/NoDeclarationTaxForm.vue')
  },
  {
    path: 'sans-avis/parents',
    name: `${prefix}TaxSansAvisParents`,
    component: () => import('@/components/tax/ParentsTaxForm.vue')
  },
  {
    path: 'sans-avis/pas-recu',
    name: `${prefix}TaxSansAvisPasRecu`,
    component: () => import('@/components/tax/NotReceivedTaxForm.vue')
  },
  {
    path: 'sans-avis/autre',
    name: `${prefix}TaxSansAvisAutre`,
    component: () => import('@/components/tax/OtherSituationTaxForm.vue')
  },
  {
    path: 'non-renseigne',
    name: `${prefix}TaxNonRenseigne`,
    component: () => import('@/components/tax/UnknownTaxStatus.vue')
  }
]

const IDENTIFICATION_ROUTES = (prefix: string): RouteRecordRaw[] => [
  {
    path: 'carte',
    name: `${prefix}IDCard`,
    component: () => import('@/components/identityDocument/IdentityCard.vue')
  },
  {
    path: 'passeport',
    name: `${prefix}IDPasseport`,
    component: () => import('@/components/identityDocument/IdentityPassport.vue')
  },
  {
    path: 'titre-sejour',
    name: `${prefix}IDPermit`,
    component: () => import('@/components/identityDocument/ResidencyPermit.vue')
  },
  {
    path: 'permis-conduire',
    name: `${prefix}IDDrivingLicence`,
    component: () => import('@/components/identityDocument/DriversLicence.vue')
  },
  {
    path: 'france-identite',
    name: `${prefix}IDFranceIdentite`,
    component: () => import('@/components/identityDocument/FranceIdentite.vue')
  },
  {
    path: 'autre',
    name: `${prefix}IDOther`,
    component: () => import('@/components/identityDocument/IdentityOther.vue')
  }
]

const RESIDENCY_COMPONENTS = (prefix: string): RouteRecordRaw[] => [
  {
    path: 'tenant',
    name: `${prefix}ResTenant`,
    component: () => import('@/components/residency/TenantResidency.vue')
  },
  {
    path: 'tenant/receipts',
    name: `${prefix}ResTenantReceipts`,
    component: () => import('@/components/residency/TenantReceipts.vue')
  },
  {
    path: 'tenant/proof',
    name: `${prefix}ResTenantProof`,
    component: () => import('@/components/residency/TenantProof.vue')
  },
  {
    path: 'guest',
    name: `${prefix}ResGuest`,
    component: () => import('@/components/residency/GuestResidency.vue')
  },
  {
    path: 'guest/proof',
    name: `${prefix}ResGuestProof`,
    component: () => import('@/components/residency/GuestProof.vue')
  },
  {
    path: 'guest/no-proof',
    name: `${prefix}ResGuestNoProof`,
    component: () => import('@/components/residency/GuestNoProof.vue')
  },
  {
    path: 'owner',
    name: `${prefix}ResOwner`,
    component: () => import('@/components/residency/OwnerResidency.vue')
  },
  {
    path: 'guest-company',
    name: `${prefix}ResCompany`,
    component: () => import('@/components/residency/GuestCompany.vue')
  },
  {
    path: 'short-term-rental',
    name: `${prefix}ResRental`,
    component: () => import('@/components/residency/ShortTermRental.vue')
  },
  {
    path: 'guest-organism',
    name: `${prefix}ResOrganism`,
    component: () => import('@/components/residency/GuestOrganism.vue')
  },
  {
    path: 'other-residency',
    name: `${prefix}ResOther`,
    component: () => import('@/components/residency/OtherResidency.vue')
  }
]

const GUARANTOR_RESIDENCY_ROUTES = (prefix: string): RouteRecordRaw[] => [
  {
    path: 'tenant',
    name: `${prefix}ResTenant`,
    component: () => import('@/components/guarantorResidency/GuarantorTenant.vue')
  },
  {
    path: 'owner',
    name: `${prefix}ResOwner`,
    component: () => import('@/components/guarantorResidency/GuarantorOwner.vue')
  },
  {
    path: 'guest',
    name: `${prefix}ResGuest`,
    component: () => import('@/components/guarantorResidency/GuarantorGuest.vue')
  },
  {
    path: 'guest/proof',
    name: `${prefix}ResGuestProof`,
    component: () => import('@/components/guarantorResidency/GuarantorGuestProof.vue')
  },
  {
    path: 'guest/no-proof',
    name: `${prefix}ResGuestNoProof`,
    component: () => import('@/components/guarantorResidency/GuarantorGuestNoProof.vue')
  },
  {
    path: 'guest-company',
    name: `${prefix}ResCompany`,
    component: () => import('@/components/guarantorResidency/GuarantorGuestCompany.vue')
  },
  {
    path: 'other',
    name: `${prefix}ResOther`,
    component: () => import('@/components/guarantorResidency/GuarantorOther.vue')
  }
]

const FINANCIAL_ROUTES = (prefix: string): RouteRecordRaw[] => [
  {
    path: '',
    name: `${prefix}RevAdd`,
    component: () => import('@/components/financial/ChooseFinancial.vue')
  },
  {
    path: 'travail',
    name: `${prefix}Travail`,
    component: () => import('@/components/financial/job/FinancialJob.vue')
  },
  {
    path: 'travail/salarie',
    name: `${prefix}TravailSalarie`,
    component: () => import('@/components/financial/job/JobEmployed.vue')
  },
  {
    path: 'travail/salarie/plus-3-mois',
    name: `${prefix}TravailSalarieplus3Mois`,
    component: () => import('@/components/financial/job/EmployedMore3Months.vue')
  },
  {
    path: 'travail/salarie/moins-3-mois',
    name: `${prefix}TravailSalarieMoins3Mois`,
    component: () => import('@/components/financial/job/EmployedLess3Months.vue')
  },
  {
    path: 'travail/salarie/pas-encore',
    name: `${prefix}TravailSalariePasEncore`,
    component: () => import('@/components/financial/job/EmployedNotYet.vue')
  },
  {
    path: 'travail/independant',
    name: `${prefix}TravailIndependant`,
    component: () => import('@/components/financial/job/JobFreelance.vue')
  },
  {
    path: 'travail/independant/auto-entrepreneur',
    name: `${prefix}TravailIndependantAutoEntrepreneur`,
    component: () => import('@/components/financial/job/AutoEntrepreneur.vue')
  },
  {
    path: 'travail/independant/autre',
    name: `${prefix}TravailIndependantAutre`,
    component: () => import('@/components/financial/job/FreelanceOther.vue')
  },
  {
    path: 'travail/intermittent',
    name: `${prefix}TravailIntermittent`,
    component: () => import('@/components/financial/job/JobIntermittent.vue')
  },
  {
    path: 'travail/artiste-auteur',
    name: `${prefix}TravailArtisteAuteur`,
    component: () => import('@/components/financial/job/JobArtist.vue')
  },
  {
    path: 'travail/inconnu',
    name: `${prefix}TravailInconnu`,
    component: () => import('@/components/financial/job/JobUnknown.vue')
  },
  {
    path: 'social',
    name: `${prefix}Social`,
    component: () => import('@/components/financial/social/FinancialSocial.vue')
  },
  {
    path: 'social/caf',
    name: `${prefix}SocialCaf`,
    component: () => import('@/components/financial/social/SocialCAF.vue')
  },
  {
    path: 'social/caf/plus-3-Mois',
    name: `${prefix}SocialCafPlus3Mois`,
    component: () => import('@/components/financial/social/CAFMore3Months.vue')
  },
  {
    path: 'social/caf/moins-3-Mois',
    name: `${prefix}SocialCafMoins3Mois`,
    component: () => import('@/components/financial/social/CAFLess3Months.vue')
  },
  {
    path: 'social/france-travail',
    name: `${prefix}SocialFranceTravail`,
    component: () => import('@/components/financial/social/SocialFranceTravail.vue')
  },
  {
    path: 'social/france-travail/plus-3-mois',
    name: `${prefix}SocialFranceTravailPlus3Mois`,
    component: () => import('@/components/financial/social/FranceTravailMore3Months.vue')
  },
  {
    path: 'social/france-travail/moins-3-mois',
    name: `${prefix}SocialFranceTravailMoins3Mois`,
    component: () => import('@/components/financial/social/FranceTravailLess3Months.vue')
  },
  {
    path: 'social/france-travail/pas-encore',
    name: `${prefix}SocialFranceTravailPasEncore`,
    component: () => import('@/components/financial/social/FranceTravailNotYet.vue')
  },
  {
    path: 'social/apl',
    name: `${prefix}SocialApl`,
    component: () => import('@/components/financial/social/SocialAPL.vue')
  },
  {
    path: 'social/apl/plus-3-mois',
    name: `${prefix}SocialAplPlus3Mois`,
    component: () => import('@/components/financial/social/APLMore3Months.vue')
  },
  {
    path: 'social/apl/moins-3-mois',
    name: `${prefix}SocialAplMoins3Mois`,
    component: () => import('@/components/financial/social/APLLess3Months.vue')
  },
  {
    path: 'social/apl/pas-encore',
    name: `${prefix}SocialAplPasEncore`,
    component: () => import('@/components/financial/social/APLNotYet.vue')
  },
  {
    path: 'social/aah',
    name: `${prefix}SocialAah`,
    component: () => import('@/components/financial/social/SocialAAH.vue')
  },
  {
    path: 'social/aah/plus-3-mois',
    name: `${prefix}SocialAahPlus3Mois`,
    component: () => import('@/components/financial/social/AAHMore3Months.vue')
  },
  {
    path: 'social/aah/moins-3-mois',
    name: `${prefix}SocialAahMoins3Mois`,
    component: () => import('@/components/financial/social/AAHLess3Months.vue')
  },
  {
    path: 'social/aah/pas-encore',
    name: `${prefix}SocialAahPasEncore`,
    component: () => import('@/components/financial/social/AAHNotYet.vue')
  },
  {
    path: 'social/autre',
    name: `${prefix}SocialAutre`,
    component: () => import('@/components/financial/social/SocialAutre.vue')
  },
  {
    path: 'pension',
    name: `${prefix}Pension`,
    component: () => import('@/components/financial/pension/FinancialPension.vue')
  },
  {
    path: 'pension/retraite',
    name: `${prefix}PensionRetraite`,
    component: () => import('@/components/financial/pension/PensionRetirement.vue')
  },
  {
    path: 'pension/retraite/bulletin',
    name: `${prefix}PensionRetraiteBulletin`,
    component: () => import('@/components/financial/pension/PensionStatement.vue')
  },
  {
    path: 'pension/retraite/pas-de-bulletin',
    name: `${prefix}PensionRetraitePasDeBulletin`,
    component: () => import('@/components/financial/pension/PensionNoStatement.vue')
  },
  {
    path: 'pension/invalidite',
    name: `${prefix}PensionInvalidite`,
    component: () => import('@/components/financial/pension/PensionDisability.vue')
  },
  {
    path: 'pension/invalidite/plus-3-mois',
    name: `${prefix}PensionInvaliditePlus3Mois`,
    component: () => import('@/components/financial/pension/DisabilityMore3Months.vue')
  },
  {
    path: 'pension/invalidite/moins-3-mois',
    name: `${prefix}PensionInvaliditeMoins3Mois`,
    component: () => import('@/components/financial/pension/DisabilityLess3Months.vue')
  },
  {
    path: 'pension/invalidite/pas-encore',
    name: `${prefix}PensionInvaliditePasEncore`,
    component: () => import('@/components/financial/pension/DisabilityNotYet.vue')
  },
  {
    path: 'pension/alimentaire',
    name: `${prefix}PensionAlimentaire`,
    component: () => import('@/components/financial/pension/PensionAlimony.vue')
  },
  {
    path: 'pension/inconnu',
    name: `${prefix}PensionInconnu`,
    component: () => import('@/components/financial/pension/PensionUnknown.vue')
  },
  {
    path: 'rente',
    name: `${prefix}Rente`,
    component: () => import('@/components/financial/annuity/FinancialAnnuity.vue')
  },
  {
    path: 'rente/revenus-locatifs',
    name: `${prefix}RenteRevenusLocatifs`,
    component: () => import('@/components/financial/annuity/AnnuityRentalIncome.vue')
  },
  {
    path: 'rente/revenus-locatifs/quittance',
    name: `${prefix}RenteRevenusLocatifsQuittance`,
    component: () => import('@/components/financial/annuity/AnnuityRentalReceipt.vue')
  },
  {
    path: 'rente/revenus-locatifs/pas-de-quittance',
    name: `${prefix}RenteRevenusLocatifsPasDeQuittance`,
    component: () => import('@/components/financial/annuity/AnnuityRentalNoReceipt.vue')
  },
  {
    path: 'rente/viagere',
    name: `${prefix}RenteViagere`,
    component: () => import('@/components/financial/annuity/AnnuityLife.vue')
  },
  {
    path: 'rente/autre',
    name: `${prefix}RenteAutre`,
    component: () => import('@/components/financial/annuity/AnnuityOther.vue')
  },
  {
    path: 'bourse',
    name: `${prefix}Bourse`,
    component: () => import('@/components/financial/scholarship/HasGrant.vue')
  },
  {
    path: 'pas-de-revenus',
    name: `${prefix}PasDeRevenus`,
    component: () => import('@/components/financial/noIncome/NoIncome.vue')
  }
]

const MAIN_ACTIVITY_ROUTES = (prefix: string): RouteRecordRaw[] => [
  {
    path: 'cdi',
    name: `${prefix}ActCdi`,
    component: () => import('@/components/mainActivity/ActivityCDI.vue')
  },
  {
    path: 'cdd',
    name: `${prefix}ActCdd`,
    component: () => import('@/components/mainActivity/ActivityCDD.vue')
  },
  {
    path: 'public',
    name: `${prefix}ActPublic`,
    component: () => import('@/components/mainActivity/ActivityPublic.vue')
  },
  {
    path: 'independant',
    name: `${prefix}ActIndependant`,
    component: () => import('@/components/mainActivity/ActivitySelfEmployed.vue')
  },
  {
    path: 'retraite',
    name: `${prefix}ActRetraite`,
    component: () => import('@/components/mainActivity/ActivityRetired.vue')
  },
  {
    path: 'chomage',
    name: `${prefix}ActChomage`,
    component: () => import('@/components/mainActivity/ActivityUnemployed.vue')
  },
  {
    path: 'etudes',
    name: `${prefix}ActEtudes`,
    component: () => import('@/components/mainActivity/ActivityStudies.vue')
  },
  {
    path: 'alternance',
    name: `${prefix}ActAlternance`,
    component: () => import('@/components/mainActivity/ActivityAlternating.vue')
  },
  {
    path: 'stage',
    name: `${prefix}ActStage`,
    component: () => import('@/components/mainActivity/ActivityStage.vue')
  },
  {
    path: 'interimaire',
    name: `${prefix}ActInterimaire`,
    component: () => import('@/components/mainActivity/ActivityCTT.vue')
  },
  {
    path: 'intermittence',
    name: `${prefix}ActIntermittence`,
    component: () => import('@/components/mainActivity/ActivityIntermittent.vue')
  },
  {
    path: 'artiste-auteur',
    name: `${prefix}ActArtisteAuteur`,
    component: () => import('@/components/mainActivity/ActivityArtistAuthor.vue')
  },
  {
    path: 'parent-au-foyer',
    name: `${prefix}ActParentFoyer`,
    component: () => import('@/components/mainActivity/ActivityStayAtHomeParent.vue')
  },
  {
    path: 'sans-activite',
    name: `${prefix}ActSansActivite`,
    component: () => import('@/components/mainActivity/ActivityNoActivity.vue')
  },
  {
    path: 'autre',
    name: `${prefix}ActOther`,
    component: () => import('@/components/mainActivity/ActivityOther.vue')
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
      redirect: '/nom-locataire'
    },
    {
      path: '/nom-locataire',
      name: 'TenantName',
      meta: {
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
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/TypeInformation.vue')
    },
    {
      path: '/documents-locataire',
      meta: {
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('@/views/TenantDocument.vue'),
      children: [
        {
          path: '1',
          component: () => import('@/components/identityDocument/TenantIdentification.vue'),
          children: [
            {
              path: '',
              name: 'TenantIdentification',
              component: () => import('@/components/identityDocument/ChooseIdentityDocument.vue')
            },
            ...IDENTIFICATION_ROUTES('Tenant')
          ]
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
            ...RESIDENCY_COMPONENTS('Tenant')
          ]
        },
        {
          path: '3',
          component: () => import('@/components/documents/tenant/TenantMainActivity.vue'),
          children: [
            {
              path: '',
              name: 'TenantProfessional',
              component: () => import('@/components/mainActivity/ChooseActivity.vue')
            },
            ...MAIN_ACTIVITY_ROUTES('Tenant')
          ]
        },
        {
          path: '4',
          component: () => import('@/components/financial/TenantFinancialProvider.vue'),
          children: [
            {
              path: '',
              name: 'TenantFinancial',
              component: () => import('@/components/financial/FinancialRecap.vue')
            },
            {
              path: ':docId',
              component: () => import('@/components/documents/tenant/TenantFinancial.vue'),
              children: FINANCIAL_ROUTES('Tenant'),
              beforeEnter: (to) => {
                if (to.params.docId === 'ajouter') {
                  return true
                }
                const store = useTenantStore()
                const doc = store.financialDocuments.find((d) => d.id === Number(to.params.docId))
                if (!doc) {
                  return { name: 'TenantFinancial' }
                }
              }
            }
          ]
        },
        {
          path: '5',
          component: () => import('@/components/tax/TenantTax.vue'),
          children: [
            {
              path: '',
              name: 'TenantTax',
              component: () => import('@/components/tax/HasTaxChoice.vue')
            },
            ...TAX_ROUTES('Tenant')
          ]
        }
      ]
    },
    {
      path: '/documents-colocataire/:tenantId/:step',
      meta: {
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/CoTenantDocument.vue'),
      children: [
        {
          path: '0',
          name: 'CoupleName',
          component: () => import('@/components/documents/cotenant/CoTenantName.vue')
        },
        {
          path: '1',
          component: () =>
            import('@/components/documents/cotenant/CoupleIdentificationProvider.vue'),
          children: [
            {
              path: '',
              name: 'CoupleIdentification',
              component: () => import('@/components/identityDocument/ChooseIdentityDocument.vue')
            },
            ...IDENTIFICATION_ROUTES('Couple')
          ]
        },
        {
          path: '2',
          component: () => import('@/components/documents/cotenant/CoupleResidency.vue'),
          children: [
            {
              path: '',
              name: 'CoupleResidency',
              component: () => import('@/components/residency/ChooseResidency.vue')
            },
            ...RESIDENCY_COMPONENTS('Couple')
          ]
        },
        {
          path: '3',
          component: () => import('@/components/documents/cotenant/CoupleProfessional.vue'),
          children: [
            {
              path: '',
              name: 'CoupleProfessional',
              component: () => import('@/components/mainActivity/ChooseActivity.vue')
            },
            ...MAIN_ACTIVITY_ROUTES('Couple')
          ]
        },
        {
          path: '4',
          component: () => import('@/components/documents/cotenant/CoupleFinancialProvider.vue'),
          children: [
            {
              path: '',
              name: 'CoupleFinancial',
              component: () => import('@/components/financial/FinancialRecap.vue')
            },
            {
              path: ':docId',
              component: () => import('@/components/documents/cotenant/CoupleFinancial.vue'),
              children: FINANCIAL_ROUTES('Couple')
            }
          ]
        },
        {
          path: '5',
          component: () => import('@/components/tax/SpouseTax.vue'),
          children: [
            {
              path: '',
              name: 'CoupleTax',
              component: () => import('@/components/tax/HasTaxChoice.vue')
            },
            ...TAX_ROUTES('Couple')
          ]
        }
      ]
    },
    {
      path: '/choix-garant',
      name: 'GuarantorChoice',
      meta: {
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
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/ValidateFilePage.vue')
    },
    {
      path: '/info-garant',
      meta: {
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/GuarantorDocumentsPage.vue'),
      children: [
        {
          path: '0/:guarantorId',
          name: 'GuarantorName',
          component: () => import('@/components/GuarantorStep0.vue')
        },
        {
          path: '1/:guarantorId',
          component: () => import('@/components/GuarantorStep1.vue'),
          children: [
            {
              path: '',
              name: 'GuarantorIdentification',
              component: () => import('@/components/identityDocument/ChooseIdentityDocument.vue')
            },
            ...IDENTIFICATION_ROUTES('Guarantor')
          ]
        },
        {
          path: '2/:guarantorId',
          component: () => import('@/components/guarantorResidency/GuarantorResidency.vue'),
          children: [
            {
              path: '',
              name: 'GuarantorResidency',
              component: () =>
                import('@/components/guarantorResidency/ChooseGuarantorResidency.vue')
            },
            ...GUARANTOR_RESIDENCY_ROUTES('Guarantor')
          ]
        },
        {
          path: '3/:guarantorId',
          component: () =>
            import('@/components/documents/naturalGuarantor/GuarantorProfessional.vue'),
          children: [
            {
              path: '',
              name: 'GuarantorProfessional',
              component: () => import('@/components/mainActivity/ChooseActivity.vue')
            },
            ...MAIN_ACTIVITY_ROUTES('Guarantor')
          ]
        },
        {
          path: '4/:guarantorId',
          component: () => import('@/components/financial/GuarantorFinancialProvider.vue'),
          children: [
            {
              path: '',
              name: 'GuarantorFinancial',
              component: () => import('@/components/financial/FinancialRecap.vue')
            },
            {
              path: ':docId',
              component: () =>
                import('@/components/documents/naturalGuarantor/GuarantorFinancial.vue'),
              children: FINANCIAL_ROUTES('Guarantor')
            }
          ]
        },
        {
          path: '5/:guarantorId',
          component: () => import('@/components/tax/GuarantorTax.vue'),
          children: [
            {
              path: '',
              name: 'GuarantorTax',
              component: () => import('@/components/tax/HasTaxChoice.vue')
            },
            ...TAX_ROUTES('Guarantor')
          ]
        }
      ]
    },
    {
      path: '/info-garant-locataire/:tenantId/:guarantorId/:step',
      meta: {
        requiresAuth: true,
        hideFooter: true,
        skipLinks: FUNNEL_SKIP_LINKS
      },
      component: () => import('../views/TenantGuarantorDocumentsPage.vue'),
      children: [
        {
          path: '0',
          name: 'TenantGuarantorName',
          component: () =>
            import('@/components/documents/naturalGuarantor/TenantGuarantorStep0.vue')
        },
        {
          path: '1',
          component: () =>
            import('@/components/documents/naturalGuarantor/TenantGuarantorStep1.vue'),
          children: [
            {
              path: '',
              name: 'TenantGuarantorIdentification',
              component: () => import('@/components/identityDocument/ChooseIdentityDocument.vue')
            },
            ...IDENTIFICATION_ROUTES('TenantGuarantor')
          ]
        },
        {
          path: '2',
          component: () =>
            import('@/components/documents/naturalGuarantor/CoupleGuarantorResidency.vue'),
          children: [
            {
              path: '',
              name: 'TenantGuarantorResidency',
              component: () =>
                import('@/components/guarantorResidency/ChooseGuarantorResidency.vue')
            },
            ...GUARANTOR_RESIDENCY_ROUTES('TenantGuarantor')
          ]
        },
        {
          path: '3',
          component: () =>
            import('@/components/documents/naturalGuarantor/TenantGuarantorProfessional.vue'),
          children: [
            {
              path: '',
              name: 'TenantGuarantorProfessional',
              component: () => import('@/components/mainActivity/ChooseActivity.vue')
            },
            ...MAIN_ACTIVITY_ROUTES('TenantGuarantor')
          ]
        },
        {
          path: '4',
          component: () => import('@/components/financial/TenantGuarantorFinancialProvider.vue'),
          children: [
            {
              path: '',
              name: 'TenantGuarantorFinancial',
              component: () => import('@/components/financial/FinancialRecap.vue')
            },
            {
              path: ':docId',
              component: () =>
                import('@/components/documents/naturalGuarantor/GuarantorFinancial.vue'),
              children: FINANCIAL_ROUTES('TenantGuarantor')
            }
          ]
        },
        {
          path: '5',
          component: () => import('@/components/tax/SpouseGuarantorTax.vue'),
          children: [
            {
              path: '',
              name: 'TenantGuarantorTax',
              component: () => import('@/components/tax/HasTaxChoice.vue')
            },
            ...TAX_ROUTES('TenantGuarantor')
          ]
        }
      ]
    },
    {
      path: '/public-file/:token',
      name: 'PublicFile',
      meta: {
        analyticsIgnore: true
      },
      component: () => import('../views/PublicFile.vue')
    },
    {
      path: '/file/:token',
      name: 'File',
      meta: {
        analyticsIgnore: true
      },
      component: () => import('../views/FilePage.vue')
    },
    {
      path: '/mon-dossier',
      name: 'MyFile',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/MyFile.vue')
    },
    {
      path: '/account',
      name: 'Account',
      meta: {
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
      path: '/partages',
      name: 'SharingLinksPage',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/SharingLinksPage.vue')
    },
    {
      path: '/messaging',
      name: 'Messages',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/MessagesPage.vue')
    },
    {
      path: '/ajout-couple/:token',
      name: 'AddCouple',
      meta: {
        analyticsIgnore: true
      },
      component: () => import('../views/JoinCouple.vue')
    },
    {
      path: '/ajout-groupe/:token',
      name: 'AddGroup',
      meta: {
        analyticsIgnore: true
      },
      component: () => import('../views/JoinGroup.vue')
    },
    {
      path: '/confirmAccount/:token',
      name: 'Confirm',
      meta: {
        hideForAuth: true,
        analyticsIgnore: true
      },
      component: () => import('../views/ConfirmAccount.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      meta: {
        requiresAuth: false
      },
      component: () => import('../views/ContactPage.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: 'catchall',
      component: () => import('../views/NotFound404.vue')
    }
  ],
  scrollBehavior() {
    document.getElementById('app')?.scrollIntoView()
  }
})

function setTitlesMeta(to: RouteLocationNormalized) {
  // Set title
  const baseTitle = 'DossierFacile'
  const pageName = to.name?.toString()
  const fullTitle =
    // check name and translation exist
    pageName && i18n.global.te(`common-titles.${pageName}`)
      ? `${i18n.global.t('common-titles.' + pageName)} - ${baseTitle}`
      : baseTitle
  document.title = fullTitle

  // Set meta tags
  if (to.meta?.description) {
    const tag = document.querySelector('meta[name="description"]')
    tag?.setAttribute('content', to.meta.description)

    const prop = document.querySelector('meta[property="og:description"]')
    prop?.setAttribute('content', to.meta.description)

    const title = document.querySelector('meta[property="og:title"]')
    title?.setAttribute('content', fullTitle)
  }
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

async function handleProtectedRoute(to: RouteLocationNormalized): Promise<boolean> {
  if (keycloak.authenticated) {
    if (!keycloak.profile) {
      await keycloak.loadUserProfile()
    }

    if (!keycloak.profile?.emailVerified) {
      // email should be validated before access to the protected page.
      keycloak.logout({
        redirectUri: 'https:' + MAIN_URL + '/#emailNotValidated'
      })
      return false
    } else {
      updateKeycloakToken()
      const store = useTenantStore()
      if (!store.user.id) {
        await store.loadUser()
        store.updateMessages()
      }
    }
    return true
  } else {
    // The page is protected and the user is not authenticated. Force a login.
    await keycloak.login({
      redirectUri: TENANT_URL + to.fullPath
    })
    return false
  }
}

router.beforeEach(async (to: RouteLocationNormalized) => {
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
    const canProceed = await handleProtectedRoute(to)
    if (!canProceed) return false
  }
  if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (keycloak.authenticated) {
      return { name: 'Profile' }
    }
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  setTitlesMeta(to)
  clearAllToasts()
})
