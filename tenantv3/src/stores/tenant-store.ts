import { AuthService } from '@/services/AuthService'
import { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { DfMessage } from 'df-shared-next/src/models/DfMessage'
import { FinancialDocument } from 'df-shared-next/src/models/FinancialDocument'
import i18n from '../i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

import { User } from 'df-shared-next/src/models/User'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { defineStore, type StoreActions } from 'pinia'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { keycloak } from '../plugin/keycloak'
import { DocumentTypeConstants } from '@/components/documents/share/DocumentTypeConstants'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { AnalyticsService } from '@/services/AnalyticsService'
import { UtilsService } from '@/services/UtilsService'
import { ProfileService } from '@/services/ProfileService'

import * as Sentry from '@sentry/vue'
import { MessageService } from '@/services/MessageService'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { RegisterService } from '@/services/RegisterService'
import type { PartnerAccess } from 'df-shared-next/src/models/PartnerAccess'
import { PartnerAccessService } from '@/services/PartnerAccessService'
import cookies from 'js-cookie'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { makeGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const FC_LOGOUT_URL = import.meta.env.VITE_FC_LOGOUT_URL || ''

interface State {
  user: User
  selectedGuarantor: Guarantor | undefined
  status: { loggedIn: boolean }
  spouseAuthorize: boolean
  coTenantAuthorize: boolean
  coTenants: User[]
  financialDocumentSelected: FinancialDocument
  editFinancialDocument: boolean
  newMessage: number
  messageList: DfMessage[][]
  guarantorFinancialDocumentSelected: FinancialDocument | undefined
  editGuarantorFinancialDocument: boolean
  apartmentSharingLinks: ApartmentSharingLink[]
  partnerAccesses: PartnerAccess[]
}

type GuarantorType = {
  tenantId?: number | string | undefined
  typeGuarantor: string
}

function defaultState(): State {
  const tenantState: State = {
    user: new User(),
    selectedGuarantor: new Guarantor(),
    status: { loggedIn: false },
    spouseAuthorize: false,
    coTenantAuthorize: false,
    coTenants: [],
    financialDocumentSelected: new FinancialDocument(),
    editFinancialDocument: false,
    newMessage: 0,
    messageList: [],
    guarantorFinancialDocumentSelected: new FinancialDocument(),
    editGuarantorFinancialDocument: false,
    apartmentSharingLinks: [],
    partnerAccesses: []
  }
  return tenantState
}

const initialStore = defaultState()

type ActionNames = keyof StoreActions<ReturnType<typeof useTenantStore>>
const DISPATCH_NAMES = [
  'saveTenantFinancial',
  'saveTenantIdentification',
  'saveTenantProfessional',
  'saveTenantResidency',
  'saveTenantTax'
] satisfies ActionNames[]
export type DispatchNames = (typeof DISPATCH_NAMES)[number]

const useTenantStore = defineStore('tenant', {
  state: (): State => ({ ...initialStore }),
  getters: {
    getUser: (state: State) => state.user,
    getTenantDocuments(state: State): DfDocument[] {
      return state.user.documents || []
    },
    getTenantIdentificationDocument(state: State): DfDocument | undefined {
      return state.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'IDENTIFICATION'
      })
    },
    getTenantResidencyDocument(state: State): DfDocument | undefined {
      return state.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'RESIDENCY'
      })
    },
    getTenantProfessionalDocument(state: State): DfDocument | undefined {
      return state.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'PROFESSIONAL'
      })
    },
    getTenantTaxDocument(state: State): DfDocument | undefined {
      return state.user.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'TAX'
      })
    },
    getGuarantorIdentificationLegalPersonDocument(state): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'IDENTIFICATION_LEGAL_PERSON'
      })
    },
    getGuarantorIdentificationDocument(state: State): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'IDENTIFICATION'
      })
    },
    getGuaranteeProviderCertificateDocument(state: State): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'GUARANTEE_PROVIDER_CERTIFICATE'
      })
    },
    getGuarantorResidencyDocument(state: State): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'RESIDENCY'
      })
    },
    getGuarantorProfessionalDocument(state: State): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'PROFESSIONAL'
      })
    },
    getGuarantorTaxDocument(state: State): DfDocument | undefined {
      return state.selectedGuarantor?.documents?.find((d: DfDocument) => {
        return d.documentCategory === 'TAX'
      })
    },

    getGuarantorDocuments(state: State): DfDocument[] {
      return state.selectedGuarantor?.documents || []
    },
    guarantor(state: State): Guarantor | undefined {
      return state.selectedGuarantor
    },
    isLoggedIn: () => keycloak.authenticated,
    userToEdit(state: State): User | null {
      return state.user
    },
    isFranceConnected(state: State): boolean {
      return state.user.franceConnect || false
    },
    getRoommates(state: State): CoTenant[] {
      if (state.user.apartmentSharing === undefined) {
        return []
      }
      return state.user.apartmentSharing.tenants
        .filter((r) => {
          return r.email !== state.user.email
        })
        .map((u) => ({ ...u }))
    },
    getNewMessage(state: State): number {
      return state.newMessage
    },
    guarantors(state: State): Guarantor[] {
      return state.user.guarantors
    },
    getMessages(state: State): DfMessage[][] {
      return state.messageList
    },
    tenantFinancialDocuments(state: State): FinancialDocument[] {
      const financialDocuments: FinancialDocument[] = []
      if (state.user.documents !== null) {
        const docs = state.user.documents?.filter((d: DfDocument) => {
          return d.documentCategory === 'FINANCIAL'
        })
        if (docs !== undefined && docs.length > 0) {
          docs
            .sort((a: DfDocument, b: DfDocument) => {
              return (a?.id || 0) - (b?.id || 0)
            })
            .forEach((d: DfDocument) => {
              const f = new FinancialDocument()
              f.noDocument = d.noDocument || false
              f.customText = d.customText || ''
              if (f.customText === '-') {
                f.customText = ''
              }
              f.monthlySum = d.monthlySum || 0
              f.id = d.id

              const localDoc = DocumentTypeConstants.FINANCIAL_DOCS.find((d2: DocumentType) => {
                return d2.value === d.documentSubCategory
              })
              if (localDoc !== undefined) {
                f.documentType = localDoc
              }
              financialDocuments.push(f)
            })
        }
      }
      return financialDocuments
    },
    guarantorFinancialDocuments(state: State): FinancialDocument[] {
      const financialdocuments: FinancialDocument[] = []
      if (!state.selectedGuarantor) {
        return financialdocuments
      }
      const g: Guarantor = state.selectedGuarantor
      const dfDocs: DfDocument[] = g.documents || []
      if (dfDocs !== null) {
        const docs = dfDocs?.filter((d: DfDocument) => {
          return d.documentCategory === 'FINANCIAL'
        })
        if (docs !== undefined && docs.length > 0) {
          docs
            .sort((a: DfDocument, b: DfDocument) => {
              return (a?.id || 0) - (b?.id || 0)
            })
            .forEach((d: DfDocument) => {
              const f = new FinancialDocument()
              f.noDocument = d.noDocument || false
              f.customText = d.customText || ''
              f.monthlySum = d.monthlySum || 0
              f.id = d.id

              const localDoc = DocumentTypeConstants.GUARANTOR_FINANCIAL_DOCS.find(
                (d2: DocumentType) => {
                  return d2.value === d.documentSubCategory
                }
              )
              if (localDoc !== undefined) {
                f.documentType = localDoc
              }
              financialdocuments.push(f)
            })
        }
      }
      return financialdocuments
    },
    getEditGuarantorFinancialDocument(state: State): boolean {
      return state.editGuarantorFinancialDocument
    },
    getSpouse(): CoTenant | null {
      if (this.user.apartmentSharing.applicationType === 'COUPLE') {
        return (
          this.user.apartmentSharing.tenants.find((t) => {
            return t.id != this.user.id
          }) ?? null
        )
      }
      return null
    },
    getTenant:
      (state: State) =>
      (id: number): User | CoTenant => {
        if (id === state.user.id) {
          return state.user
        }
        const user = state.user.apartmentSharing.tenants.find((r) => {
          return r.id === id
        })
        if (!user) {
          throw new Error(`Tenant ${id} not found`)
        }
        return user
      },
    allDocumentsPreValidated(state: State): boolean {
      const user = state.user
      const tenantDocumentsPreValidated = (tenant: CoTenant) =>
        this.documentsPreValidated(tenant) &&
        tenant.guarantors?.every((g) => !!this.guarantorDocumentsFilled(g))

      if (user.applicationType === 'COUPLE') {
        const cotenants = user.apartmentSharing?.tenants.filter(
          (cotenant) => user.id !== cotenant.id
        )
        return (
          (tenantDocumentsPreValidated(user) && cotenants.every(tenantDocumentsPreValidated)) ||
          false
        )
      }
      return tenantDocumentsPreValidated(user) || false
    },
    allNamesFilled(state: State): boolean {
      const userNamesFilled = (u: CoTenant) => Boolean(u.firstName && u.lastName)
      const guarantorNamesFilled = (g: Guarantor) =>
        !g ||
        (g.typeGuarantor === 'NATURAL_PERSON' && g.firstName && g.lastName) ||
        (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) ||
        g.typeGuarantor === 'ORGANISM'

      const user = state.user
      if (user.applicationType === 'COUPLE') {
        const couple = user.apartmentSharing?.tenants.find((cotenant) => user.id !== cotenant.id)

        if (!couple || !userNamesFilled(couple) || !couple.guarantors.every(guarantorNamesFilled)) {
          return false
        }
      }
      return userNamesFilled(user) && user.guarantors.every(guarantorNamesFilled)
    },
    hasDoc: (state: State) => (docType: string, user?: User) => {
      const u = user || state.user
      const f = u.documents?.find((d: DfDocument) => {
        return (
          d.documentCategory === docType &&
          (d.documentStatus === 'TO_PROCESS' || d.documentStatus === 'VALIDATED')
        )
      })?.files
      return f && f.length > 0
    },
    isTenantDocumentValid: (state: State) => (docType: string, user?: CoTenant) => {
      const u = user || state.user
      // TODO : handle multiple financial documents
      const document = u.documents?.find((d: DfDocument) => {
        return d.documentCategory === docType
      })
      return UtilsService.isDocumentValid(document)
    },
    documentsPreValidated() {
      return (user?: CoTenant) => {
        for (const category of [
          'IDENTIFICATION',
          'PROFESSIONAL',
          'RESIDENCY',
          'FINANCIAL',
          'TAX'
        ]) {
          if (!this.isTenantDocumentValid(category, user)) {
            return false
          }
        }
        return true
      }
    },
    guarantorDocumentsFilled: () => (g: Guarantor) => {
      return (
        (g.typeGuarantor === 'NATURAL_PERSON' &&
          UtilsService.isGuarantorDocumentValid('IDENTIFICATION', g) &&
          UtilsService.isGuarantorDocumentValid('PROFESSIONAL', g) &&
          UtilsService.isGuarantorDocumentValid('RESIDENCY', g) &&
          UtilsService.isGuarantorDocumentValid('FINANCIAL', g) &&
          UtilsService.isGuarantorDocumentValid('TAX', g)) ||
        (g.typeGuarantor === 'LEGAL_PERSON' &&
          UtilsService.isGuarantorDocumentValid('IDENTIFICATION', g) &&
          UtilsService.isGuarantorDocumentValid('IDENTIFICATION_LEGAL_PERSON', g)) ||
        (g.typeGuarantor === 'ORGANISM' &&
          UtilsService.isGuarantorDocumentValid('GUARANTEE_PROVIDER_CERTIFICATE', g))
      )
    },
    getApartmentSharingLinks(state: State): ApartmentSharingLink[] {
      return state.apartmentSharingLinks
    }
  },
  actions: {
    initState() {
      Object.assign(this, defaultState())
    },
    logoutCommit() {
      this.status.loggedIn = false
      this.user = new User()
    },
    unlinkFCSuccess() {
      this.user.franceConnect = false
      AnalyticsService.unlinkFCSuccess()
    },
    loadUserCommit(user: User) {
      Object.assign(this.user, user)
      Object.assign(this.status.loggedIn, true)

      const applicationType = user?.apartmentSharing.applicationType
      Object.assign(this.user, { applicationType: applicationType })

      if (applicationType === 'COUPLE') {
        Object.assign(this.spouseAuthorize, true)
      }
      if (applicationType === 'GROUP') {
        Object.assign(this.coTenantAuthorize, true)
      }
      // load CoTenants - basic information inside tenant
      if (applicationType === 'COUPLE') {
        Object.assign(
          this.coTenants,
          this.user.apartmentSharing?.tenants.filter((t) => t.id != this.user?.id)
        )
      }
      if (this.selectedGuarantor?.id) {
        let guarantor = user.guarantors.find((g: Guarantor) => {
          return g.id === this.selectedGuarantor?.id
        })

        if (!guarantor) {
          this.coTenants.forEach((t: User) => {
            const tmpGuarantor = t.guarantors?.find((g: Guarantor) => {
              return g.id === this.selectedGuarantor?.id
            })
            if (tmpGuarantor !== undefined) {
              guarantor = tmpGuarantor
            }
          })
        }
        if (guarantor !== undefined) {
          Object.assign(this.selectedGuarantor, guarantor)
          return
        }
      }
      if (!this.selectedGuarantor) {
        return
      }
      this.selectedGuarantor = new Guarantor()
      Sentry.setContext('user', {
        id: this.user.id
      })
    },
    setSelectedGuarantor(guarantor: Guarantor | undefined) {
      this.selectedGuarantor = guarantor
    },
    createCoTenant(mail: string) {
      const u = new User()
      u.email = mail
      u.firstName = ''
      u.lastName = ''
      this.user.apartmentSharing.tenants.push(u)
    },
    updateMessagesCommit(tenantId: number, messageList: DfMessage[]) {
      this.messageList[tenantId] = messageList

      const unreadMessages = this.messageList
        .flat()
        .filter((message) => message.typeMessage === 'TO_TENANT')
        .filter((message) => message.status === 'UNREAD')
      this.newMessage = unreadMessages.length
    },
    deleteRoommates(email: string) {
      const tenants = this.user.apartmentSharing.tenants.filter((t) => {
        return t.email !== email
      })
      this.user.applicationType = 'ALONE'
      this.user.apartmentSharing.tenants = tenants
    },
    updateCoupleAuthorize(authorize: boolean) {
      this.spouseAuthorize = authorize
    },
    updateCoTenantAuthorize(authorize: boolean) {
      this.coTenantAuthorize = authorize
    },
    updateUserFirstname(firstname: string) {
      this.user.firstName = firstname
    },
    updateUserLastname(lastname: string) {
      this.user.lastName = lastname
    },
    updateUserPreferredname(preferredname: string) {
      this.user.preferredName = preferredname
    },
    updateUserZipcode(zipcode: string) {
      this.user.zipCode = zipcode
    },
    updateUserAbroad(abroad: boolean) {
      this.user.abroad = abroad
    },
    selectDocumentFinancial(d: FinancialDocument | undefined) {
      this.financialDocumentSelected = Object.assign({}, d)
      this.editFinancialDocument = d !== undefined
    },
    createDocumentFinancial() {
      this.financialDocumentSelected = Object.assign({}, new FinancialDocument())
      this.editFinancialDocument = true
    },
    selectGuarantorDocumentFinancial(d: FinancialDocument | undefined) {
      this.guarantorFinancialDocumentSelected = d
      this.editGuarantorFinancialDocument = d !== undefined
    },
    createGuarantorDocumentFinancial() {
      this.guarantorFinancialDocumentSelected = new FinancialDocument()
      this.editGuarantorFinancialDocument = true
    },
    setPartnerAccesses(accesses: PartnerAccess[]) {
      this.partnerAccesses = accesses
    },
    setApartmentSharingLinks(links: ApartmentSharingLink[]) {
      const sortedLinks = links.sort((a: ApartmentSharingLink, b: ApartmentSharingLink) =>
        (a.lastVisit || '') > (b.lastVisit || '') ? -1 : 1
      )
      this.apartmentSharingLinks = sortedLinks
    },
    logout(redirect: boolean = true) {
      const isFC = this.user.franceConnect
      return AuthService.logout()
        .then(async () => {
          this.logoutCommit()
          this.initState()
          if (isFC) {
            window.location.replace(FC_LOGOUT_URL)
            return
          } else if (redirect) {
            window.location.replace(MAIN_URL)
            return
          }
          location.reload()
        })
        .catch(async () => {
          console.log('Fail to logout - logout keycloak - force redirect')
          await keycloak.logout()
          this.logoutCommit()
          this.initState()
          window.location.replace(MAIN_URL)
        })
    },
    deleteAccount() {
      const isFC = this.user.franceConnect
      return AuthService.deleteAccount().then(
        (response) => {
          this.logoutCommit()
          this.initState()
          if (isFC) {
            window.location.replace('https://fcp.integ01.dev-franceconnect.fr/api/v1/logout')
            return
          } else {
            window.location.replace(MAIN_URL)
          }
          return Promise.resolve(response)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    unlinkFranceConnect(user: User) {
      if (!user.franceConnect) {
        return Promise.reject(new Error('Account is not a FranceConnect Account'))
      }
      return ProfileService.unlinkFranceConnect().then(
        () => {
          // token should be stay alive for allowing the reset password on KC
          return this.unlinkFCSuccess()
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    loadUser() {
      return AuthService.loadUser().then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    setNames(user: CoTenant) {
      if (user.firstName && !user.franceConnect) {
        user.firstName = UtilsService.capitalize(user.firstName)
      }
      if (user.lastName && !user.franceConnect) {
        user.lastName = UtilsService.capitalize(user.lastName)
      }
      if (user.preferredName && !user.franceConnect) {
        user.preferredName = UtilsService.capitalize(user.preferredName)
      }
      return ProfileService.saveNames(user).then(
        (response) => {
          return this.loadUserCommit(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    setCoTenants(data: Parameters<typeof ProfileService.saveCoTenants>[number]) {
      return ProfileService.saveCoTenants(data).then(
        (response) => {
          return this.loadUserCommit(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    setLang(lang: 'fr' | 'en') {
      i18n.global.locale.value = lang
      i18n.global.fallbackLocale.value = 'fr'
      dayjs.locale(lang)
      const html = document.documentElement
      html.setAttribute('lang', i18n.global.locale.value)
      const expireTimes = new Date()
      expireTimes.setFullYear(expireTimes.getFullYear() + 1)
      cookies.set('lang', lang, {
        expires: expireTimes,
        path: '/',
        domain: import.meta.env.VITE_COOKIE_DOMAIN || 'localhost',
        secure: true,
        sameSite: 'None'
      })
    },
    validateFile(data: { honorDeclaration: boolean; clarification: string | undefined }) {
      return ProfileService.validateFile(data.honorDeclaration, data.clarification).then(
        () => {
          AnalyticsService.validateFile()
          return Promise.resolve()
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    addNaturalGuarantor() {
      return ProfileService.setGuarantorType({
        typeGuarantor: 'NATURAL_PERSON'
      }).then(
        (response) => {
          this.loadUserCommit(response.data)
          if (this.user.guarantors === undefined) {
            return Promise.reject(new Error('No guarantors found'))
          }
          const pageData = this.setGuarantorPage(
            this.user.guarantors[this.user.guarantors.length - 1],
            0
          )
          return Promise.resolve(pageData)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    async deleteAllGuarantors() {
      if (this.user.guarantors === undefined) {
        return Promise.resolve()
      }
      const promises = this.user.guarantors.map(async (g: Guarantor) => {
        await ProfileService.deleteGuarantor(g)
      })
      return Promise.all(promises).then(
        () => {
          return this.loadUser()
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    deleteGuarantor(g: Guarantor) {
      return ProfileService.deleteGuarantor(g).then(
        async (response) => {
          await this.loadUser()
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    setGuarantorType(guarantorType: GuarantorType) {
      return ProfileService.setGuarantorType(guarantorType).then(
        async (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    createPasswordCouple({ token, password }: { token: string; password: string }) {
      return AuthService.createPasswordCouple({ token, password }).then(
        (response) => {
          this.loadUserCommit(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    createPasswordGroup({ token, password }: { token: string; password: string }) {
      return AuthService.createPasswordGroup({ token, password }).then(
        (response) => {
          this.loadUserCommit(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    deleteDocument(docId: number) {
      return ProfileService.deleteDocument(docId).then(
        () => {
          return this.loadUser()
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    updateMessages() {
      if (keycloak.authenticated) {
        MessageService.updateMessages().then((data) => {
          this.updateMessagesCommit(this.user.id, data?.data || [])
        })
        const spouse = this.getSpouse
        if (spouse) {
          MessageService.updateMessages(spouse.id).then((data) => {
            this.updateMessagesCommit(spouse.id, data?.data || [])
          })
        }
      }
    },
    sendMessage(message: string, tenantId: number) {
      return MessageService.postMessage({
        tenantId: tenantId,
        messageBody: message
      }).then(() => {
        this.updateMessages()
      })
    },
    deleteCoTenant(tenant: CoTenant) {
      if (tenant.id && tenant.id > 0) {
        ProfileService.deleteCoTenant(tenant.id)
      }
      this.deleteRoommates(tenant.email)
    },
    async setGuarantorPage(
      guarantor: Guarantor,
      substep: number,
      tenantId: number | undefined = undefined
    ) {
      this.setSelectedGuarantor(guarantor)
      if (tenantId && tenantId != this.user.id) {
        return {
          name: 'TenantGuarantorDocuments',
          params: {
            step: '5',
            substep: substep,
            tenantId: tenantId,
            guarantorId: guarantor.id
          }
        }
      } else {
        if (substep === 2) {
          return makeGuarantorResidencyLink(guarantor)
        }
        return {
          name: 'GuarantorDocuments',
          params: { substep, guarantorId: guarantor.id }
        }
      }
    },
    saveTenantIdentification(formData: FormData) {
      return RegisterService.saveTenantIdentification(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorName(formData: FormData) {
      return RegisterService.saveGuarantorName(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorIdentification(formData: FormData) {
      return RegisterService.saveGuarantorIdentification(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveTenantResidency(formData: FormData) {
      return RegisterService.saveTenantResidency(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorResidency(formData: FormData) {
      return RegisterService.saveGuarantorResidency(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveTenantProfessional(formData: FormData) {
      return RegisterService.saveTenantProfessional(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorProfessional(formData: FormData) {
      return RegisterService.saveGuarantorProfessional(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveTenantFinancial(formData: FormData) {
      return RegisterService.saveTenantFinancial(formData).then(
        async (response) => {
          this.loadUserCommit(response.data)
          const fd = this.tenantFinancialDocuments
          if (fd === undefined) {
            return Promise.resolve(response.data)
          }
          if (formData.has('id')) {
            const s = fd.find((f) => {
              return f.id?.toString() === formData.get('id')
            })
            if (s !== undefined) {
              this.selectDocumentFinancial(s)
            } else {
              this.selectDocumentFinancial(fd[fd.length - 1])
            }
          } else {
            this.selectDocumentFinancial(fd[fd.length - 1])
          }
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorFinancial(formData: FormData) {
      return RegisterService.saveGuarantorFinancial(formData)
        .then(async (response) => {
          this.loadUserCommit(response.data)
          const fd = this.guarantorFinancialDocuments
          if (fd === undefined) {
            return Promise.resolve(response.data)
          }
          if (formData.has('id')) {
            const s = fd.find((f) => {
              return f.id?.toString() === formData.get('id')
            })
            if (s === undefined) {
              return Promise.reject(new Error('Document not found'))
            }
            this.selectGuarantorDocumentFinancial(s)
          } else {
            this.selectGuarantorDocumentFinancial(fd[fd.length - 1])
          }
          return Promise.resolve(response.data)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    saveTenantTax(formData: FormData) {
      return RegisterService.saveTenantTax(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorTax(formData: FormData) {
      return RegisterService.saveGuarantorTax(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    firstProfilePage() {
      if (this.user.documents === undefined) {
        return
      }
      if (
        !this.user.firstName ||
        !this.user.lastName ||
        (!this.user.zipCode && this.user.documents.length == 0)
      ) {
        return { name: 'TenantName' }
      }
      if (!this.user.applicationType) {
        return { name: 'TenantType' }
      }
      if (!this.hasDoc('IDENTIFICATION')) {
        return { name: 'TenantIdentification' }
      }
      if (!this.isTenantDocumentValid('RESIDENCY')) {
        return makeResidencyLink(this.user)
      }
      if (!this.hasDoc('PROFESSIONAL')) {
        return { name: 'TenantProfessional' }
      }
      if (!this.isTenantDocumentValid('FINANCIAL')) {
        return { name: 'TenantFinancial' }
      }
      if (!this.isTenantDocumentValid('TAX')) {
        return { name: 'TenantTax' }
      }
      if (this.user.guarantors) {
        for (const g of this.user.guarantors) {
          if (!UtilsService.guarantorHasDoc('IDENTIFICATION', g)) {
            return this.setGuarantorPage(g, 1)
          }
          if (!UtilsService.isGuarantorDocumentValid('RESIDENCY', g)) {
            return this.setGuarantorPage(g, 2)
          }
          if (!UtilsService.guarantorHasDoc('PROFESSIONAL', g)) {
            return this.setGuarantorPage(g, 3)
          }
          if (!UtilsService.isGuarantorDocumentValid('FINANCIAL', g)) {
            return this.setGuarantorPage(g, 4)
          }
          if (!UtilsService.isGuarantorDocumentValid('TAX', g)) {
            return this.setGuarantorPage(g, 5)
          }
        }
      }

      if (!this.user.honorDeclaration) {
        return { name: 'ValidateFile' }
      }

      return { name: 'TenantName' }
    },
    updateSelectedGuarantor(tenantId: number) {
      let guarantors
      if (this.user.id === tenantId) {
        guarantors = this.user.guarantors
      } else {
        const coTenant = this.coTenants.find((r: User) => {
          return r.id === tenantId
        })
        guarantors = coTenant?.guarantors
      }

      if (guarantors && guarantors.length > 0) {
        this.setSelectedGuarantor(guarantors[guarantors.length - 1])
        return
      }
      this.setSelectedGuarantor(new Guarantor())
    },
    readMessages(tenantId?: number) {
      if (tenantId === undefined) {
        return
      }
      return MessageService.markMessagesAsRead(tenantId)
    },
    loadApartmentSharingLinks() {
      return ApartmentSharingLinkService.getLinks().then(
        (response) => {
          const links = response.data.links || []
          this.setApartmentSharingLinks(links)
          return Promise.resolve(links)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    deleteApartmentSharingLink(linkToDelete: ApartmentSharingLink) {
      ApartmentSharingLinkService.deleteLink(linkToDelete).then(() => {
        const newLinks = this.apartmentSharingLinks.filter((link) => link.id !== linkToDelete.id)
        this.setApartmentSharingLinks(newLinks)
      })
    },
    async resendApartmentSharingLink(linkToResend: ApartmentSharingLink) {
      await ApartmentSharingLinkService.resendLink(linkToResend).then(
        (response) => {
          return Promise.resolve(response)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },

    async updateApartmentSharingLinkStatus(linkToUpdate: ApartmentSharingLink, enabled: boolean) {
      await ApartmentSharingLinkService.updateLinkStatus(linkToUpdate, enabled)
      const updatedLinks = this.apartmentSharingLinks.map((link) => {
        if (link.id === linkToUpdate.id) {
          link.enabled = enabled
        }
        return link
      })
      this.setApartmentSharingLinks(updatedLinks)
    },
    loadPartnerAccesses() {
      return PartnerAccessService.getPartners().then(
        (response) => {
          const accesses = response.data || []
          this.setPartnerAccesses(accesses)
          return Promise.resolve(accesses)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    revokePartnerAccess(accessToRevoke: PartnerAccess) {
      PartnerAccessService.revokeAccess(accessToRevoke).then(() => {
        const newList = this.partnerAccesses.filter((access) => access.id !== accessToRevoke.id)
        this.setPartnerAccesses(newList)
      })
    },
    dispatchByName<Name extends DispatchNames>(name: Name, formData: FormData) {
      const func = this[name]
      if (func) {
        return func(formData)
      }
      throw new Error('Invalid method name: ' + name)
    },
    commentAnalysis(formData: unknown) {
      return RegisterService.commentAnalysis(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    }
  }
})

export default useTenantStore
