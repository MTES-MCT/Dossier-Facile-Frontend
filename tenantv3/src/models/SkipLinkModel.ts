import { type SkipLink } from 'df-shared-next/src/models/SkipLink'

export const FOOTER_NAVIGATION = {
  id: '#footer-navigation',
  text: 'Navigation'
}

export const FUNNEL_SKIP_LINKS: SkipLink[] = [
  {
    id: '#funnel-menu',
    text: "Menu d'ajout des documents"
  },
  {
    id: '#step-content',
    text: "Contenu de l'étape"
  },
  FOOTER_NAVIGATION
]
