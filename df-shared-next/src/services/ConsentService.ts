import Cookies from 'js-cookie'

const aYearFromNow = new Date()
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1)

const OPTIONS: Cookies.CookieAttributes = {
  secure: true,
  expires: aYearFromNow,
  sameSite: 'Strict',
  domain: import.meta.env.VITE_COOKIE_DOMAIN
}

type ConsentData = { crisp: boolean; matomo: boolean }

const setCookie = (data: ConsentData) => Cookies.set('consent', JSON.stringify(data), OPTIONS)

export const acceptAll = () => {
  setCookie({ crisp: true, matomo: true })
}

export const rejectAll = () => {
  setCookie({ crisp: false, matomo: false })
}

export const accept = (services: ConsentData) => {
  setCookie(services)
}

const isConsentData = (data: unknown): data is ConsentData =>
  data != null && typeof data === 'object' && 'crisp' in data && 'matomo' in data

export const getAll = (): ConsentData | null => {
  try {
    const data: unknown = JSON.parse(Cookies.get('consent') || 'null')
    if (data === null || isConsentData(data)) {
      return data
    }
    throw new Error('invalid consent cookie')
  } catch (err) {
    return null
  }
}

export const isConsentRequired = () => getAll() === null;