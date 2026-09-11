import { defineStore } from 'pinia'
import i18n from '../i18n'

export const useWWWStore = defineStore('www', () => {
	function setLang(lang: 'fr' | 'en') {
		i18n.global.locale.value = lang
		i18n.global.fallbackLocale.value = 'fr'
		const html = document.documentElement
		html.setAttribute('lang', i18n.global.locale.value)

		localStorage.setItem("lang", lang)
	}

	return { setLang }
}
)
