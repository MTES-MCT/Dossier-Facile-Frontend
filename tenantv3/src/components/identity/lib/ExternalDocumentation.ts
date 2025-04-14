export type ExternalDocumentation = {
  title: string
  url: string
}

export type ExternalDocumentationType =
  | 'IDENTITY'
  | 'RESIDENCY'
  | 'PROFESSIONAL'
  | 'FINANCIAL'
  | 'TAX'
  | 'GENERAL_HELP'
  | 'GUARANTOR_HELP'

export const EXTERNAL_DOCUMENTATIONS: Record<ExternalDocumentationType, ExternalDocumentation> = {
  IDENTITY: {
    title: 'identity',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/1-piece-identite-1j6eask/'
  },
  RESIDENCY: {
    title: 'residency',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/2-justificatif-domicile-bon-paiement-loyers-1ftrkb8/'
  },
  PROFESSIONAL: {
    title: 'professional',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/3-justificatifs-de-situation-professionnelle-rpepjc/'
  },
  FINANCIAL: {
    title: 'financial',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/4-justificatifs-ressources-1uyf090/'
  },
  TAX: {
    title: 'tax',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/5-avis-dimposition-eg82wt/'
  },
  GENERAL_HELP: {
    title: 'general-help',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/category/justificatifs-ye12ln/'
  },
  GUARANTOR_HELP: {
    title: 'guarantor-help',
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr/article/6-les-justificatifs-du-ou-des-garants-1nt94gc/'
  }
}
