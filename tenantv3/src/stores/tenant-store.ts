import { AuthService } from '@/services/AuthService'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'
import { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { DfMessage } from 'df-shared-next/src/models/DfMessage'
import { i18n } from '../i18n'

import { AnalyticsService } from '@/services/AnalyticsService'
import { ProfileService } from '@/services/ProfileService'
import { UtilsService } from '@/services/UtilsService'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { User } from 'df-shared-next/src/models/User'
import { defineStore } from 'pinia'
import { keycloak } from '../plugin/keycloak'

import {
  GUARANTOR_ROUTES,
  TENANT_GUARANTOR_ROUTES
} from '@/components/documents/naturalGuarantor/guarantorRoutes'
import {
  makeCotenantGuarantorResidencyLink,
  makeGuarantorResidencyLink
} from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import {
  makeGuarantorActivityLink,
  makeGuarantorCoupleActivityLink
} from '@/components/mainActivity/lib/useMainActivityLink'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { MessageService } from '@/services/MessageService'
import { PartnerAccessService } from '@/services/PartnerAccessService'
import { RegisterService } from '@/services/RegisterService'
import * as Sentry from '@sentry/vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import type { PartnerAccess } from 'df-shared-next/src/models/PartnerAccess'
import cookies from 'js-cookie'
import {
  makeGuarantorIdentityDocumentLink,
  makeIdentityDocumentLink,
  makeSpouseGuarantorIdDocLink
} from '@/components/identityDocument/lib/identityDocumentLink'
import { makeGuarantorTaxLink, makeSpouseGuarantorTaxLink } from '@/components/tax/lib/taxLink'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const LOGOUT_REDIRECT_URL = import.meta.env.VITE_LOGOUT_REDIRECT_URL

interface State {
  user: User
  selectedGuarantor: Guarantor | undefined
  status: { loggedIn: boolean }
  spouseAuthorize: boolean
  coTenantAuthorize: boolean
  coTenants: User[]
  newMessage: number
  messageList: DfMessage[][]
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
    newMessage: 0,
    messageList: [],
    apartmentSharingLinks: [],
    partnerAccesses: []
  }
  return tenantState
}

const initialStore = defaultState()

export const useTenantStore = defineStore('tenant', {
  state: (): State => ({ ...initialStore }),
  getters: {
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
    guarantors(state: State): Guarantor[] {
      return state.user.guarantors
    },
    financialDocuments(state) {
      return state.user.documents?.filter((d) => d.documentCategory === 'FINANCIAL') ?? []
    },
    guarantorFinancialDocuments(state) {
      return (
        state.selectedGuarantor?.documents?.filter((d) => d.documentCategory === 'FINANCIAL') ?? []
      )
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
      Sentry.setUser({ id: this.user.id })
      window._paq?.push(['setUserId', this.user.id])
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
    updateCoTenantAuthorize(authorize: boolean) {
      this.coTenantAuthorize = authorize
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
    logout() {
      return keycloak.logout({ redirectUri: LOGOUT_REDIRECT_URL }).then(() => {
        this.logoutCommit()
        this.initState()
      })
    },
    async deleteAccount() {
      const isFC = this.user.franceConnect
      await AuthService.deleteAccount()
      this.logoutCommit()
      this.initState()
      const url = isFC ? 'https://fcp.integ01.dev-franceconnect.fr/api/v1/logout' : MAIN_URL
      window.location.replace(url)
    },
    async unlinkFranceConnect(user: User) {
      if (!user.franceConnect) {
        throw new Error('Account is not a FranceConnect Account')
      }
      await ProfileService.unlinkFranceConnect()
      return this.unlinkFCSuccess()
    },
    async loadUser() {
      const response = await AuthService.loadUser()
      this.loadUserCommit(response.data)
      return response.data
    },
    async setNames(user: CoTenant) {
      // If the user is franceconnected we can not modify the names, so we don't capitalize them
      if (user.firstName && !this.isFranceConnected) {
        user.firstName = UtilsService.capitalize(user.firstName)
      }
      if (user.lastName && !this.isFranceConnected) {
        user.lastName = UtilsService.capitalize(user.lastName)
      }
      if (user.preferredName && !this.isFranceConnected) {
        user.preferredName = UtilsService.capitalize(user.preferredName)
      }
      const response = await ProfileService.saveNames(user)
      this.loadUserCommit(response.data)
    },
    async setCoTenants(data: Parameters<typeof ProfileService.saveCoTenants>[number]) {
      return ProfileService.saveCoTenants(data).then((response) => {
        this.loadUserCommit(response.data)
      })
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
    async validateFile(data: { honorDeclaration: boolean; clarification: string | undefined }) {
      await ProfileService.validateFile(data.honorDeclaration, data.clarification)
      AnalyticsService.validateFile()
    },
    async addNaturalGuarantor() {
      const response = await ProfileService.setGuarantorType({
        typeGuarantor: 'NATURAL_PERSON'
      })
      this.loadUserCommit(response.data)
      if (this.user.guarantors === undefined) {
        throw new Error('No guarantors found')
      }
      const pageData = this.setGuarantorPage(
        this.user.guarantors[this.user.guarantors.length - 1],
        0
      )
      return pageData
    },
    async deleteAllGuarantors() {
      if (this.user.guarantors === undefined) {
        return
      }
      const promises = this.user.guarantors.map(async (g: Guarantor) => {
        await ProfileService.deleteGuarantor(g)
      })
      await Promise.all(promises)
      return await this.loadUser()
    },
    async deleteGuarantor(g: Guarantor) {
      const response = await ProfileService.deleteGuarantor(g)
      await this.loadUser()
      return response.data
    },
    async setGuarantorType(guarantorType: GuarantorType) {
      const response = await ProfileService.setGuarantorType(guarantorType)
      this.loadUserCommit(response.data)
      return response.data
    },
    async createPasswordCouple({ token, password }: { token: string; password: string }) {
      const response = await AuthService.createPasswordCouple({ token, password })
      this.loadUserCommit(response.data)
    },
    async createPasswordGroup({ token, password }: { token: string; password: string }) {
      const response = await AuthService.createPasswordGroup({ token, password })
      this.loadUserCommit(response.data)
    },
    async deleteDocument(docId: number) {
      await ProfileService.deleteDocument(docId)
      return await this.loadUser()
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
    async sendMessage(message: string, tenantId: number) {
      await MessageService.postMessage({
        tenantId: tenantId,
        messageBody: message
      })
      this.updateMessages()
    },
    deleteCoTenant(tenant: CoTenant) {
      if (tenant.id && tenant.id > 0) {
        ProfileService.deleteCoTenant(tenant.id)
      }
      this.deleteRoommates(tenant.email)
    },
    setGuarantorPage(
      guarantor: Guarantor,
      substep: number,
      tenantId: number | undefined = undefined
    ) {
      this.setSelectedGuarantor(guarantor)
      if (tenantId && tenantId != this.user.id) {
        return getSpouseGuarantorLink(guarantor, tenantId, substep)
      }
      return getGuarantorLink(guarantor, substep)
    },
    async saveTenantIdentification(formData: FormData) {
      const response = await RegisterService.saveTenantIdentification(formData)
      if (hasMatchingDoc('IDENTIFICATION', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveGuarantorName(formData: FormData) {
      const response = await RegisterService.saveGuarantorName(formData)
      this.loadUserCommit(response.data)
      return response.data
    },
    async saveGuarantorIdentification(formData: FormData) {
      const response = await RegisterService.saveGuarantorIdentification(formData)
      if (hasMatchingDoc('IDENTIFICATION', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveTenantResidency(formData: FormData) {
      const response = await RegisterService.saveTenantResidency(formData)
      if (hasMatchingDoc('RESIDENCY', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveGuarantorResidency(formData: FormData) {
      const response = await RegisterService.saveGuarantorResidency(formData)
      if (hasMatchingDoc('RESIDENCY', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveTenantProfessional(formData: FormData) {
      const response = await RegisterService.saveTenantProfessional(formData)
      if (hasMatchingDoc('PROFESSIONAL', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveGuarantorProfessional(formData: FormData) {
      const response = await RegisterService.saveGuarantorProfessional(formData)
      if (hasMatchingDoc('PROFESSIONAL', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveTenantFinancial(formData: FormData) {
      const response = await RegisterService.saveTenantFinancial(formData)
      if (hasMatchingDoc('FINANCIAL', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        // workaround for bad transaction handling in backend: refetch data
        return await this.loadUser()
      }
    },
    async saveGuarantorFinancial(formData: FormData) {
      const response = await RegisterService.saveGuarantorFinancial(formData)
      if (hasMatchingDoc('FINANCIAL', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        // workaround for bad transaction handling in backend: refetch data
        return await this.loadUser()
      }
    },
    async saveTenantTax(formData: FormData) {
      const response = await RegisterService.saveTenantTax(formData)
      if (hasMatchingDoc('TAX', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    async saveGuarantorTax(formData: FormData) {
      const response = await RegisterService.saveGuarantorTax(formData)
      if (hasMatchingDoc('TAX', response.data, formData)) {
        this.loadUserCommit(response.data)
        return response.data
      } else {
        return await this.loadUser()
      }
    },
    getTenantNameRoute() {
      const ownerType = this.user.ownerType

      if (ownerType === undefined) {
        return { name: 'ChooseTenantIdentity' }
      }
      if (ownerType === 'SELF') {
        return { name: 'SelfTenantIdentity' }
      }
      if (ownerType === 'THIRD_PARTY') {
        return { name: 'ThirdPartyTenantIdentity' }
      }
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
        return this.getTenantNameRoute()
      }
      if (!this.user.applicationType) {
        return { name: 'TenantType' }
      }
      if (!this.hasDoc('IDENTIFICATION')) {
        return makeIdentityDocumentLink(this.getTenantIdentificationDocument)
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
          if (g.typeGuarantor === 'NATURAL_PERSON' && (!g.firstName || !g.lastName)) {
            return this.setGuarantorPage(g, 0)
          }
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

      return this.getTenantNameRoute()
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
    async loadApartmentSharingLinks() {
      const response = await ApartmentSharingLinkService.getLinks()
      const links = response.data.links || []
      this.setApartmentSharingLinks(links)
      return links
    },
    deleteApartmentSharingLink(linkToDelete: ApartmentSharingLink) {
      ApartmentSharingLinkService.deleteLink(linkToDelete).then(() => {
        const newLinks = this.apartmentSharingLinks.filter((link) => link.id !== linkToDelete.id)
        this.setApartmentSharingLinks(newLinks)
      })
    },
    async resendApartmentSharingLink(linkToResend: ApartmentSharingLink) {
      await ApartmentSharingLinkService.resendLink(linkToResend)
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
    async loadPartnerAccesses() {
      const response = await PartnerAccessService.getPartners()
      const accesses = response.data || []
      this.setPartnerAccesses(accesses)
      return accesses
    },
    revokePartnerAccess(accessToRevoke: PartnerAccess) {
      PartnerAccessService.revokeAccess(accessToRevoke).then(() => {
        const newList = this.partnerAccesses.filter((access) => access.id !== accessToRevoke.id)
        this.setPartnerAccesses(newList)
      })
    },
    async commentAnalysis(formData: unknown) {
      const response = await RegisterService.commentAnalysis(formData)
      this.loadUserCommit(response.data)
      return response.data
    }
  }
})

// TODO: remove after proper fix on backend
function hasMatchingDoc(
  category: 'IDENTIFICATION' | 'FINANCIAL' | 'PROFESSIONAL' | 'RESIDENCY' | 'TAX',
  userData: User,
  formData: FormData
) {
  const tenantData = formData.has('tenantId')
    ? userData.apartmentSharing.tenants.find((t) => t.id === Number(formData.get('tenantId')))
    : userData
  let documents = tenantData?.documents
  if (formData.has('guarantorId')) {
    const guarantor = tenantData?.guarantors.find(
      (g) => g.id === Number(formData.get('guarantorId'))
    )
    documents = guarantor?.documents
  }
  const docs = documents?.filter((d) => d.documentCategory === category) ?? []
  const id = formData.has('id') ? Number(formData.get('id')) : null
  const subCategory = `typeDocument${category[0]}${category.slice(1).toLowerCase()}`
  const hasStep = ['FINANCIAL', 'RESIDENCY'].includes(category)
  const doc = docs.find(
    (d: DfDocument) =>
      d.documentSubCategory === formData.get(subCategory) &&
      (!hasStep || d.documentCategoryStep === formData.get('categoryStep')) &&
      (!id || d.id === id)
  )
  return doc !== undefined
}

function getSpouseGuarantorLink(guarantor: Guarantor, tenantId: number, substep: number) {
  if (substep === 1 && guarantor.id) {
    return makeSpouseGuarantorIdDocLink(guarantor, tenantId)
  }
  if (substep === 2 && guarantor.id) {
    const doc = guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
    return makeCotenantGuarantorResidencyLink(tenantId, guarantor.id, doc)
  }
  if (substep === 3 && guarantor.id) {
    return makeGuarantorCoupleActivityLink(guarantor, tenantId)
  }
  if (substep === 5 && guarantor.id) {
    return makeSpouseGuarantorTaxLink(guarantor, tenantId)
  }
  return {
    name: TENANT_GUARANTOR_ROUTES[substep],
    params: {
      step: '5',
      tenantId: tenantId,
      guarantorId: guarantor.id
    }
  }
}

function getGuarantorLink(guarantor: Guarantor, substep: number) {
  if (substep === 1) {
    return makeGuarantorIdentityDocumentLink(guarantor)
  }
  if (substep === 2) {
    return makeGuarantorResidencyLink(guarantor)
  }
  if (substep === 3) {
    return makeGuarantorActivityLink(guarantor)
  }
  if (substep === 5) {
    return makeGuarantorTaxLink(guarantor)
  }
  return {
    name: GUARANTOR_ROUTES[substep],
    params: { guarantorId: guarantor.id }
  }
}
