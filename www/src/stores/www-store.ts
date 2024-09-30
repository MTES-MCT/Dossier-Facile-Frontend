import { useCookies } from 'vue3-cookies'
import { defineStore } from 'pinia'
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
    setLang(lang: string) {
      i18n.global.locale.value = lang as any
      i18n.global.fallbackLocale = 'fr' as any
      const html = document.documentElement
      html.setAttribute('lang', i18n.global.locale.value)
      const expireTimes = new Date()
      expireTimes.setFullYear(expireTimes.getFullYear() + 1)
      const { cookies } = useCookies()
      cookies.set(
        'lang',
        lang,
        expireTimes,
        '/',
        import.meta.env.COOKIE_DOMAIN || 'localhost',
        true,
        'None'
      )
    }
  }
})

export default useOwnerStore
