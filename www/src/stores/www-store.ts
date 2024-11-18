import { defineStore } from 'pinia'
import cookies from 'js-cookie'
import i18n from '../i18n'

interface State {
  lang: string
}

function defaultState(): State {
  const wwwState: State = {
    lang: 'fr'
  }
  return wwwState
}

const initialStore = defaultState()

const useOwnerStore = defineStore('www', {
  state: (): State => ({ ...initialStore }),
  getters: {},
  actions: {
    setLang(lang: 'fr' | 'en') {
      i18n.global.locale.value = lang
      i18n.global.fallbackLocale.value = 'fr'
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
    }
  }
})

export default useOwnerStore
