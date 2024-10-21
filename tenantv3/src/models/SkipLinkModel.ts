import { type SkipLink } from 'df-shared-next/src/models/SkipLink'

export const FOOTER_NAVIGATION = {
  anchor: '#footer-navigation',
  name: 'Navigation'
}

export const FUNNEL_SKIP_LINKS: SkipLink[] = [
  {
    anchor: '#funnel-menu',
    name: "Menu d'ajout des documents"
  },
  {
    anchor: '#step-content',
    name: "Contenu de l'étape"
  },
  FOOTER_NAVIGATION
]
