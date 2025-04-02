export type ExternalDocumentation = {
  title: string
  url: string
}

export enum EXTERNAL_DOCUMENTATION_TYPE {
  IDENTITY = 'IDENTITY',
  RESIDENCY = 'RESIDENCY',
  PROFESSIONAL = 'PROFESSIONAL',
  FINANCIAL = 'FINANCIAL',
  TAX = 'TAX',
  GENERAL_HELP = 'GENERAL_HELP',
  GUARANTOR_HELP = 'GUARANTOR_HELP'
}

export const EXTERNAL_DOCUMENTATIONS: Record<EXTERNAL_DOCUMENTATION_TYPE, ExternalDocumentation> = {
  [EXTERNAL_DOCUMENTATION_TYPE.IDENTITY]: {
    title: 'identity',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/1-piece-identite-1j6eask/'
  },
  [EXTERNAL_DOCUMENTATION_TYPE.RESIDENCY]: {
    title: 'redidency',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/2-justificatif-domicile-bon-paiement-loyers-1ftrkb8/'
  },
  [EXTERNAL_DOCUMENTATION_TYPE.PROFESSIONAL]: {
    title: 'professional',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/3-justificatifs-de-situation-professionnelle-rpepjc/'
  },
  [EXTERNAL_DOCUMENTATION_TYPE.FINANCIAL]: {
    title: 'financial',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/4-justificatifs-ressources-1uyf090/'
  },
  [EXTERNAL_DOCUMENTATION_TYPE.TAX]: {
    title: 'tax',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/5-avis-dimposition-eg82wt/'
  },
  [EXTERNAL_DOCUMENTATION_TYPE.GENERAL_HELP]: {
    title: 'general-help',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/category/justificatifs-ye12ln/'
  },
  [EXTERNAL_DOCUMENTATION_TYPE.GUARANTOR_HELP]: {
    title: 'guarantor-help',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/6-les-justificatifs-du-ou-des-garants-1nt94gc/'
  }
}
