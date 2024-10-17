import { Property } from 'df-shared-next/src/models/Property'
import { User } from 'df-shared-next/src/models/User'
import { useCookies } from 'vue3-cookies'
import { defineStore } from 'pinia'
import { OwnerUser } from 'df-shared-next/src/models/OwnerUser'
import UtilsService from '../services/UtilsService'
import i18n from '../i18n'
import AuthService from '../components/auth/AuthService'
import keycloak from '../plugin/keycloak'
import OwnerService from '../components/account/OwnerService'
import PropertyService from '../components/property/PropertyService'

interface State {
  user: User
  status: { loggedIn: boolean }
  footer: boolean
  properties: Property[]
  propertyToEdit: Property
  propertyToConsult: Property
  showDeleteAccountModal: boolean
}

function defaultState(): State {
  const ownerState: State = {
    user: new User(),
    status: { loggedIn: false },
    footer: true,
    properties: [],
    propertyToEdit: new Property(),
    propertyToConsult: new Property(),
    showDeleteAccountModal: false
  }
  return ownerState
}

const initialStore = defaultState()
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL?.toString()}`

const useOwnerStore = defineStore('owner', {
  state: (): State => ({ ...initialStore }),
  getters: {
    getUser: (state: State) => state.user,
    isLoggedIn: () => keycloak.authenticated,
    hasFooter: (state: State) => state.footer,
    getProperties: (state: State) => state.properties,
    getPropertyToEdit: (state: State): Property => state.propertyToEdit,
    getPropertyToConsult: (state: State) => state.propertyToConsult,
    getShowDeleteAccountModal: (state: State) => state.showDeleteAccountModal
  },
  actions: {
    initState() {
      Object.assign(this, defaultState())
    },
    setHasFooter(hasFooter: boolean) {
      this.footer = hasFooter
    },
    loadUserCommit(owner: OwnerUser) {
      Object.assign(this.user, owner)
      this.properties = owner.properties || []
      Object.assign(this.status.loggedIn, true)
    },
    logoutCommit() {
      Object.assign(this.status.loggedIn, false)
      Object.assign(this.user, {})
    },
    setLastName(lastName: string) {
      this.user.lastName = lastName
    },
    setFirstName(firstName: string) {
      this.user.firstName = firstName
    },
    setEmail(email: string) {
      Object.assign(this.user.email, email)
    },
    setName(name: string) {
      this.propertyToEdit.name = name
    },
    setType(type: string) {
      this.propertyToEdit.type = type
    },
    setAddress(address: string) {
      this.propertyToEdit.address = address
    },
    setFurniture(furniture: string) {
      this.propertyToEdit.furniture = furniture
    },
    setRent(rent: number) {
      this.propertyToEdit.rentCost = rent
    },
    setLivingSpace(livingSpace: number) {
      this.propertyToEdit.livingSpace = livingSpace
    },
    setCharges(charges: number) {
      this.propertyToEdit.chargesCost = charges
    },
    setCo2Emission(co2: number) {
      this.propertyToEdit.co2Emission = co2
    },
    setEnergyConsumption(energy: number) {
      this.propertyToEdit.energyConsumption = energy
    },
    setDpeDate(dpeDate: string) {
      this.propertyToEdit.dpeDate = dpeDate
    },
    updatePropertyToEdit(id: number) {
      const prop = this.properties.find((p) => p.id === id)
      if (prop) {
        Object.assign(this.propertyToEdit, { ...prop })
      }
    },
    updatePropertyToConsult(id: number) {
      return PropertyService.loadOwnerProperty(id).then((res) => {
        this.propertyToConsult = { ...res.data }
      })
    },
    async setPropertyToConsult(token: string) {
      try {
        const res = await PropertyService.loadProperty(token)
        if (res.data.name) {
          Object.assign(this.propertyToConsult, { ...res.data })
        } else {
          return Promise.reject()
        }
        return Promise.resolve()
      } catch (e) {
        return Promise.reject()
      }
    },
    setPropertyToEdit(property: Property) {
      this.propertyToEdit = { ...property }
    },
    setPropertyValidated(validated: boolean) {
      this.propertyToEdit.validated = validated
    },
    setLang(lang: 'fr' | 'en') {
      i18n.global.locale.value = lang
      i18n.global.fallbackLocale.value = 'fr'
      const html = document.documentElement
      html.setAttribute('lang', i18n.global.locale.value)
      const { cookies } = useCookies()
      const expireTimes = new Date()
      expireTimes.setFullYear(expireTimes.getFullYear() + 1)
      cookies.set('lang', lang, expireTimes, '/', import.meta.env.COOKIE_DOMAIN || 'localhost')
    },
    registerSuccess() {
      this.status.loggedIn = false
      this.user = new User()
    },
    registerFailure() {
      this.status.loggedIn = false
      this.user = new User()
    },
    register(user: User) {
      return AuthService.register(user).then(
        (response) => {
          this.registerSuccess()
          return Promise.resolve(response.data)
        },
        (error: Error) => {
          this.registerFailure()
          return Promise.reject(error)
        }
      )
    },
    loadUser() {
      return AuthService.loadUser().then(
        async (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        },
        (error: Error) => Promise.reject(error)
      )
    },
    logout(redirect = true) {
      return AuthService.logout()
        .then(async () => {
          this.logoutCommit()
          this.initState()
          if (redirect) {
            window.location.replace(MAIN_URL)
            return
          }
          window.location.reload()
        })
        .catch(async () => {
          this.logoutCommit()
          this.initState()
          window.location.replace(MAIN_URL)
        })
    },
    resetPassword(user: User) {
      return AuthService.resetPassword(user).then(
        (u) => Promise.resolve(u),
        (error: Error) => Promise.reject(error)
      )
    },
    changePassword(user: User) {
      return AuthService.changePassword(user).then(
        async (response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(user)
        },
        (error: Error) => Promise.reject(error)
      )
    },
    saveNames(lastName: string, firstName: string, email: string) {
      return OwnerService.saveNames(
        UtilsService.capitalize(lastName),
        UtilsService.capitalize(firstName),
        email
      )
        .then((response) => {
          this.loadUserCommit(response.data)
          return Promise.resolve(response.data)
        })
        .catch((error: Error) => Promise.reject(error))
    },
    saveProperty() {
      return OwnerService.saveProperty(this.propertyToEdit).then((response) => {
        this.setPropertyToEdit(response.data)
        return Promise.resolve(response.data)
      })
    },
    newProperty() {
      return this.setPropertyToEdit(new Property())
    },
    deleteProperty(id: number) {
      return OwnerService.deleteProperty(id).then(async (response) => {
        this.loadUserCommit(response.data)
        return Promise.resolve(response.data)
      })
    },
    async deleteApplicants(ids: number[]) {
      await OwnerService.deleteApplicants(ids)
      return this.loadUser()
    },
    deleteAccount() {
      return AuthService.deleteAccount()
    },
    setShowDeleteAccountModal(show: boolean) {
      this.showDeleteAccountModal = show
    },
    searchDpe(dpe: string) {
      const property = this.propertyToEdit
      property.ademeNumber = dpe
      return OwnerService.saveProperty(this.propertyToEdit).then((response) => {
        this.setPropertyToEdit(response.data)
        return Promise.resolve(response.data)
      })
    },
    deleteDpe() {
      return OwnerService.deleteDpe(this.propertyToEdit.id).then((response) => {
        this.setPropertyToEdit(response.data)
        return Promise.resolve(response.data)
      })
    },
    setAdemeNumber(ademeNumber: string) {
      this.propertyToEdit.ademeNumber = ademeNumber
    }
  }
})

export default useOwnerStore
