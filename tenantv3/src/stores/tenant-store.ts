import { AuthService } from 'df-shared-next/src/services/AuthService'
import { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import type { SkipLink } from 'df-shared-next/src/models/SkipLink'
import { DfMessage } from 'df-shared-next/src/models/DfMessage'
import { FinancialDocument } from 'df-shared-next/src/models/FinancialDocument'
import i18n from '../i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'

import { User } from 'df-shared-next/src/models/User'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { defineStore } from 'pinia'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import keycloak from '../plugin/keycloak'
import { DocumentTypeConstants } from '@/components/documents/share/DocumentTypeConstants'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { AnalyticsService } from '@/services/AnalyticsService'
import { UtilsService } from '@/services/UtilsService'
import { ProfileService } from '@/services/ProfileService'

import * as Sentry from '@sentry/vue'
import { MessageService } from '@/services/MessageService'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { RegisterService } from '@/services/RegisterService'
import axios from 'axios'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { useCookies } from 'vue3-cookies'
import type { Composer } from 'vue-i18n'
import type { PartnerAccess } from 'df-shared-next/src/models/PartnerAccess'
import { PartnerAccessService } from '@/services/PartnerAccessService'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const FC_LOGOUT_URL = import.meta.env.VITE_FC_LOGOUT_URL || ''

declare const window: Window

interface State {
  user: User
  selectedGuarantor: Guarantor | undefined
  status: { loggedIn: boolean }
  isFunnel: boolean
  spouseAuthorize: boolean
  coTenantAuthorize: boolean
  coTenants: User[]
  financialDocumentSelected: FinancialDocument
  editFinancialDocument: boolean
  newMessage: number
  messageList: DfMessage[][]
  skipLinks: SkipLink[]
  guarantorFinancialDocumentSelected: FinancialDocument | undefined
  editGuarantorFinancialDocument: boolean
  apartmentSharingLinks: ApartmentSharingLink[]
  partnerAccesses: PartnerAccess[]
}

function defaultState(): State {
  const tenantState: State = {
    user: new User(),
    selectedGuarantor: new Guarantor(),
    status: { loggedIn: false },
    isFunnel: false,
    spouseAuthorize: false,
    coTenantAuthorize: false,
    coTenants: [],
    financialDocumentSelected: new FinancialDocument(),
    editFinancialDocument: false,
    newMessage: 0,
    messageList: [],
    skipLinks: [],
    guarantorFinancialDocumentSelected: new FinancialDocument(),
    editGuarantorFinancialDocument: false,
    apartmentSharingLinks: [],
    partnerAccesses: []
  }
  return tenantState
}

const initialStore = defaultState()

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
    getRoommates(state: State): User[] {
      if (state.user.apartmentSharing === undefined) {
        return []
      }
      return state.user.apartmentSharing.tenants
        .filter((r: User) => {
          return r.email !== state.user.email
        })
        .map((u: User) => ({ ...u }))
    },
    getNewMessage(state: State): number {
      return state.newMessage
    },
    getSpouseAuthorize(state: State): boolean {
      return state.spouseAuthorize
    },
    getCoTenantAuthorize(state: State): boolean {
      return state.coTenantAuthorize
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
    getFinancialDocumentSelected(state: State): FinancialDocument {
      return state.financialDocumentSelected
    },
    getEditFinancialDocument(state: State): boolean {
      return state.editFinancialDocument
    },
    getGuarantorFinancialDocumentSelected(state: State): FinancialDocument | undefined {
      return state.guarantorFinancialDocumentSelected
    },
    getEditGuarantorFinancialDocument(state: State): boolean {
      return state.editGuarantorFinancialDocument
    },
    getCoTenants(state: State): User[] {
      return state.coTenants
    },
    getSpouse(): User | null {
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
      (id: number): User => {
        if (id === state.user.id) {
          return state.user
        }
        return state.user.apartmentSharing.tenants.find((r: User) => {
          return r.id === id
        }) as User
      },
    allDocumentsPreValidated(state: State): boolean {
      const user = state.user
      const tenantDocumentsPreValidated = (tenant: User) =>
        this.documentsPreValidated(tenant) &&
        tenant.guarantors?.every((g) => !!this.guarantorDocumentsFilled(g))

      if (user.applicationType === 'COUPLE') {
        const cotenants = user.apartmentSharing?.tenants.filter(
          (cotenant: User) => user.id !== cotenant.id
        )
        return (
          (tenantDocumentsPreValidated(user) && cotenants.every(tenantDocumentsPreValidated)) ||
          false
        )
      }
      return tenantDocumentsPreValidated(user) || false
    },
    allNamesFilled(state: State): boolean {
      const userNamesFilled = (u: User) => u.firstName && u.lastName
      const guarantorNamesFilled = (g: Guarantor) =>
        !g ||
        (g.typeGuarantor === 'NATURAL_PERSON' && g.firstName && g.lastName) ||
        (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) ||
        g.typeGuarantor === 'ORGANISM'

      const user = state.user
      if (user.applicationType === 'COUPLE') {
        const couple = user.apartmentSharing?.tenants.find(
          (cotenant: User) => user.id !== cotenant.id
        ) as User

        if (!userNamesFilled(couple) || !couple.guarantors.every(guarantorNamesFilled)) {
          return false
        }
      }
      return (userNamesFilled(user) && user.guarantors.every(guarantorNamesFilled)) as boolean
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
    isTenantDocumentValid: (state: State) => (docType: string, user?: User) => {
      const u = user ? user : state.user
      // TODO : handle multiple financial documents
      const document = u.documents?.find((d: DfDocument) => {
        return d.documentCategory === docType
      })
      return UtilsService.isDocumentValid(document, state.user.preValidationActivated)
    },
    documentsPreValidated(state: State) {
      return (user?: User) => {
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
    guarantorDocumentsFilled: (state: State) => (g: Guarantor) => {
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
    loginFailure() {
      this.status.loggedIn = false
      this.user = new User()
      AnalyticsService.loginFail()
    },
    logoutCommit() {
      this.status.loggedIn = false
      this.user = new User()
    },
    registerSuccess() {
      this.status.loggedIn = false
      this.user = new User()
      AnalyticsService.registerSuccess()
    },
    registerFailure() {
      this.status.loggedIn = false
      this.user = new User()
      AnalyticsService.registerFail()
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
          this.user.apartmentSharing?.tenants.filter((t: User) => t.id != this.user?.id)
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
      const tenants = this.user.apartmentSharing.tenants.filter((t: User) => {
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
    updateIsFunnel(isFunnel: boolean) {
      this.isFunnel = isFunnel
    },
    updateSkipLinks(skipLinks: SkipLink[]) {
      this.skipLinks = skipLinks
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
    register(user: User, source: string, internalPartnerId: string) {
      return AuthService.register(user, source, internalPartnerId).then(
        (response) => {
          this.registerSuccess()
          return Promise.resolve(response.data)
        },
        (error) => {
          this.registerFailure()
          return Promise.reject(error)
        }
      )
    },
    resetPassword(user: User) {
      return AuthService.resetPassword(user).then(
        (user) => {
          return Promise.resolve(user)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    unlinkFranceConnect(user: User) {
      if (!user.franceConnect) {
        return Promise.reject('Account is not a FranceConnect Account')
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
    loadCoTenant(coTenant: User) {
      return ProfileService.getCoTenant(coTenant.id).then(
        (response) => {
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    setNames(user: User) {
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
    setCoTenants(data: any) {
      return ProfileService.saveCoTenants(data).then(
        (response) => {
          return this.loadUserCommit(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    setLang(lang: string) {
      ;(i18n.global as unknown as Composer).locale.value = lang
      i18n.global.fallbackLocale = 'fr' as any
      dayjs.locale(lang)
      const html = document.documentElement
      html.setAttribute('lang', (i18n.global as unknown as Composer).locale.value)
      const { cookies } = useCookies()
      const expireTimes = new Date()
      expireTimes.setFullYear(expireTimes.getFullYear() + 1)
      cookies.set(
        'lang',
        lang,
        expireTimes,
        '/',
        import.meta.env.VITE_COOKIE_DOMAIN || 'localhost',
        true,
        'None'
      )
    },
    validateFile(data: { honorDeclaration: boolean; clarification: string }) {
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
            return Promise.reject()
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
    setGuarantorType(guarantorType: any) {
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
    changePassword(user: User) {
      return AuthService.changePassword(user).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(user)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    createPasswordCouple(user: User) {
      return AuthService.createPasswordCouple(user).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(user)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    createPasswordGroup(user: User) {
      return AuthService.createPasswordGroup(user).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(user)
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
    deleteCoTenant(tenant: User) {
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
        return {
          name: 'GuarantorDocuments',
          params: { substep, guarantorId: guarantor.id }
        }
      }
    },
    saveTenantIdentification(formData: any) {
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
    saveCoTenantIdentification(formData: any) {
      return RegisterService.saveCoTenantIdentification(formData).then(
        (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    },
    saveGuarantorName(formData: any) {
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
    saveGuarantorIdentification(formData: any) {
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
    saveTenantResidency(formData: any) {
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
    saveGuarantorResidency(formData: any) {
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
    saveTenantProfessional(formData: any) {
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
    saveGuarantorProfessional(formData: any) {
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
    saveTenantFinancial(formData: any) {
      return RegisterService.saveTenantFinancial(formData).then(
        async (response) => {
          this.loadUserCommit(response.data)
          const fd = this.tenantFinancialDocuments
          if (fd === undefined) {
            return Promise.resolve(response.data)
          }
          if (formData.has('id')) {
            const s = fd.find((f: any) => {
              return f.id.toString() === formData.get('id')
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
    saveGuarantorFinancial(formData: any) {
      return RegisterService.saveGuarantorFinancial(formData)
        .then(async (response) => {
          this.loadUserCommit(response.data)
          const fd = this.guarantorFinancialDocuments
          if (fd === undefined) {
            return Promise.resolve(response.data)
          }
          if (formData.has('id')) {
            const s = fd.find((f: any) => {
              return f.id.toString() === formData.get('id')
            })
            if (s === undefined) {
              return Promise.reject('Document not found')
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
    saveTenantTax(formData: any) {
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
    saveGuarantorTax(formData: any) {
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
        return { name: 'TenantDocuments', params: { substep: '1' } }
      }
      if (!this.isTenantDocumentValid('RESIDENCY')) {
        return { name: 'TenantDocuments', params: { substep: '2' } }
      }
      if (!this.hasDoc('PROFESSIONAL')) {
        return { name: 'TenantDocuments', params: { substep: '3' } }
      }
      if (!this.isTenantDocumentValid('FINANCIAL')) {
        return { name: 'TenantDocuments', params: { substep: '4' } }
      }
      if (!this.isTenantDocumentValid('TAX')) {
        return { name: 'TenantDocuments', params: { substep: '5' } }
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
      ApartmentSharingLinkService.deleteLink(linkToDelete).then((_) => {
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
      PartnerAccessService.revokeAccess(accessToRevoke).then((_) => {
        const newList = this.partnerAccesses.filter((access) => access.id !== accessToRevoke.id)
        this.setPartnerAccesses(newList)
      })
    },
    deleteFile(id: number | string, silent = false) {
      const $loading = useLoading({})
      const loader = $loading.show()
      const url = `${import.meta.env.VITE_API_URL}/api/file/${id}`
      axios
        .delete(url)
        .then(() => {
          if (!silent) {
            ToastService.deleteSuccess()
          }
        })
        .catch(() => {
          ToastService.deleteFailed()
        })
        .finally(() => {
          loader.hide()
          this.loadUser()
        })
    },
    dispatchByName(name: string, formData: any): any {
      const func = this[name]
      if (func) {
        return func(formData)
      }
    },
    commentAnalysis(formData: any) {
      return RegisterService.commentAnalysis(formData).then(
        (response) => {
          this.loadUserCommit(response)
          return Promise.resolve(response)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    }
  }
})

export default useTenantStore
