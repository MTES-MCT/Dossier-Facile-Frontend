import type { DsfrSkipLinksProps } from '@gouvminint/vue-dsfr'

export interface SkipLink {
  id: string
  text: string
}

export const CONTENT: SkipLink = {
  id: 'content',
  text: 'Contenu'
}
export const FOOTER: SkipLink = {
  id: 'footer',
  text: 'Pied de page'
}

export const MAIN_NAV: SkipLink = {
  id: 'main-nav',
  text: 'Navigation principale'
}

export const FOOTER_NAVIGATION: SkipLink = {
  id: 'footer-navigation',
  text: "Navigation de l'étape"
}

export const FUNNEL_SKIP_LINKS: DsfrSkipLinksProps = {
  links: [
    MAIN_NAV,
    {
      id: 'funnel-menu',
      text: "Menu d'ajout des documents"
    },
    { id: 'step-content', text: "Contenu de l'étape" },
    FOOTER_NAVIGATION
  ]
}
