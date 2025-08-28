export const DocumentTypeConstants = {
  GUARANTOR_ORGANISM_DOCS: [
    {
      key: 'visale',
      value: 'VISALE',
      maxFileCount: 5
    },
    {
      key: 'other-guarantee',
      value: 'OTHER_GUARANTEE',
      maxFileCount: 5
    }
  ],

  REPRESENTATIVE_IDENTIFICATION: [
    {
      key: 'identity-card',
      value: 'FRENCH_IDENTITY_CARD'
    },
    {
      key: 'passport',
      value: 'FRENCH_PASSPORT'
    },
    {
      key: 'permit',
      value: 'FRENCH_RESIDENCE_PERMIT'
    },
    {
      key: 'drivers-license',
      value: 'DRIVERS_LICENSE'
    },
    {
      key: 'france-identite',
      value: 'FRANCE_IDENTITE'
    },
    {
      key: 'other',
      value: 'OTHER_IDENTIFICATION'
    }
  ]
}

export type ResidencyCategory =
  | 'TENANT'
  | 'OWNER'
  | 'GUEST_PARENTS'
  | 'GUEST'
  | 'GUEST_COMPANY'
  | 'GUEST_ORGANISM'
  | 'SHORT_TERM_RENTAL'
  | 'OTHER_RESIDENCY'

export type MainActivityCategory =
  | 'CDI'
  | 'CDI_TRIAL'
  | 'CDD'
  | 'ALTERNATION'
  | 'INTERNSHIP'
  | 'STUDENT'
  | 'PUBLIC'
  | 'CTT'
  | 'RETIRED'
  | 'UNEMPLOYED'
  | 'INDEPENDENT'
  | 'INTERMITTENT'
  | 'ARTIST'
  | 'STAY_AT_HOME_PARENT'
  | 'NO_ACTIVITY'
  | 'OTHER'

export type IdentityCategory =
  | 'FRENCH_IDENTITY_CARD'
  | 'FRENCH_PASSPORT'
  | 'FRENCH_RESIDENCE_PERMIT'
  | 'DRIVERS_LICENSE'
  | 'FRANCE_IDENTITE'
  | 'OTHER_IDENTIFICATION'

export type TaxCategory = 'MY_NAME' | 'MY_PARENTS' | 'OTHER_TAX'
