import Cookies from 'js-cookie'
import type { App, Plugin } from 'vue'
import { CrispPlugin } from '../plugin/crisp'

const aYearFromNow = new Date()
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1)

const OPTIONS: Cookies.CookieAttributes = {
  secure: true,
  expires: aYearFromNow,
  sameSite: 'Strict',
  domain: import.meta.env.VITE_COOKIE_DOMAIN
}

type ConsentServices = { crisp: boolean; matomo: boolean }

const setCookie = (data: ConsentServices) => Cookies.set('consent', JSON.stringify(data), OPTIONS)

let app: App | null = null
let servicesEnabled: ConsentServices | null = null

const useServicesIfEnabled = async (services: ConsentServices) => {
  if (!app || !servicesEnabled) {
    console.warn('ConsentService was not registered')
    return
  }
  if (servicesEnabled.crisp && services.crisp) {
    app.use(CrispPlugin, { websiteId: import.meta.env.VITE_CRISP_WEBSITE_ID })
  }
  if (servicesEnabled.matomo && services.matomo) {
    const { MatomoPlugin } = await import('../plugin/matomo')
    app.use(MatomoPlugin)
  }
}

export const ConsentPlugin: Plugin<ConsentServices> = {
  install(vueApp, services) {
    app = vueApp
    servicesEnabled = services
    const servicesChoices = getAll()
    if (servicesChoices) {
      useServicesIfEnabled(servicesChoices)
    }
  }
}

export const accept = (services: ConsentServices) => {
  setCookie(services)
  useServicesIfEnabled(services)
}

export const acceptAll = () => {
  accept({ crisp: true, matomo: true })
}

export const rejectAll = () => {
  accept({ crisp: false, matomo: false })
}

const isConsentData = (data: unknown): data is ConsentServices =>
  data != null && typeof data === 'object' && 'crisp' in data && 'matomo' in data

export const getAll = (): ConsentServices | null => {
  try {
    const data: unknown = JSON.parse(Cookies.get('consent') || 'null')
    if (data === null || isConsentData(data)) {
      return data
    }
    throw new Error('invalid consent cookie')
  } catch (err) {
    console.error(err)
    return null
  }
}

export const isConsentRequired = () => getAll() === null
