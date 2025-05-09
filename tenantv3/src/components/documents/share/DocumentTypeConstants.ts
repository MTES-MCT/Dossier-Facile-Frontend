export const DocumentTypeConstants = {
  IDENTIFICATION_DOCS: [
    {
      key: 'identity-card',
      value: 'FRENCH_IDENTITY_CARD',
      maxFileCount: 5
    },
    {
      key: 'passport',
      value: 'FRENCH_PASSPORT',
      maxFileCount: 5
    },
    {
      key: 'permit',
      value: 'FRENCH_RESIDENCE_PERMIT',
      maxFileCount: 5
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
      value: 'OTHER_IDENTIFICATION',
      maxFileCount: 5
    }
  ],

  GUARANTOR_IDENTIFICATION_DOCS: [
    {
      key: 'identity-card',
      value: 'FRENCH_IDENTITY_CARD',
      maxFileCount: 5
    },
    {
      key: 'passport',
      value: 'FRENCH_PASSPORT',
      maxFileCount: 5
    },
    {
      key: 'permit',
      value: 'FRENCH_RESIDENCE_PERMIT',
      maxFileCount: 5
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
      value: 'OTHER_IDENTIFICATION',
      maxFileCount: 5
    }
  ],

  TAX_DOCS: [
    {
      key: 'my-name',
      value: 'MY_NAME',
      maxFileCount: 5
    },
    {
      key: 'my-parents',
      value: 'MY_PARENTS',
      maxFileCount: 0
    },
    {
      key: 'less-than-year',
      value: 'LESS_THAN_YEAR',
      maxFileCount: 0
    },
    {
      key: 'other-tax',
      value: 'OTHER_TAX',
      maxFileCount: 0
    }
  ],

  GUARANTOR_TAX_DOCS: [
    {
      key: 'my-name',
      value: 'MY_NAME',
      maxFileCount: 5
    },
    {
      key: 'less-than-year',
      value: 'LESS_THAN_YEAR',
      maxFileCount: 0
    },
    {
      key: 'other-tax',
      value: 'OTHER_TAX',
      maxFileCount: 0
    }
  ],

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
