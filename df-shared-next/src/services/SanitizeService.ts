import DOMPurify from 'dompurify'
import type { App, Directive } from 'vue'

/**
 * Assainit une chaîne de caractères HTML en filtrant les balises et attributs non autorisés
 * afin de prévenir les attaques XSS.
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'br', 'span', 'hr'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style', 'rel']
  })
}

/**
 * Directive Vue `v-safe-html` pour injecter du HTML assaini dans le DOM à la place de `v-html`.
 */
export const vSafeHtml: Directive<HTMLElement, string | undefined | null> = {
  mounted(el, binding) {
    el.innerHTML = sanitizeHtml(binding.value)
  },
  updated(el, binding) {
    el.innerHTML = sanitizeHtml(binding.value)
  }
}

/**
 * Plugin Vue permettant d'enregistrer la directive `v-safe-html` sur l'instance applicative Vue.
 */
export const SafeHtmlPlugin = {
  install(app: App) {
    app.directive('safe-html', vSafeHtml)
  }
}


