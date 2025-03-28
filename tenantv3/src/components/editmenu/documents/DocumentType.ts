export enum DocumentType {
  IDENTITY = 'IDENTITY',
  RESIDENCY = 'RESIDENCY',
  PROFESSIONAL = 'PROFESSIONAL',
  FINANCIAL = 'FINANCIAL',
  TAX = 'TAX',
  IDENTIFICATION_LEGAL_PERSON = 'IDENTIFICATION_LEGAL_PERSON',
  IDENTIFICATION = 'IDENTIFICATION',
  GUARANTEE_PROVIDER_CERTIFICATE = 'GUARANTEE_PROVIDER_CERTIFICATE'
}

export const DocumentTypeTranslations = {
  IDENTITY: 'identification',
  RESIDENCY: 'residency',
  PROFESSIONAL: 'professional',
  FINANCIAL: 'financial',
  TAX: 'tax',
  IDENTIFICATION_LEGAL_PERSON: 'identification-legal-person',
  IDENTIFICATION: 'identity-represent',
  GUARANTEE_PROVIDER_CERTIFICATE: 'guarantee-provider-certificate'
} as const satisfies { [type in DocumentType]: string }

export const TENANT_COMPONENTS: { [type in DocumentType]?: string } = {
  IDENTITY: 'TenantIdentification',
  RESIDENCY: 'TenantResidency',
  PROFESSIONAL: 'TenantProfessional',
  FINANCIAL: 'TenantFinancial',
  TAX: 'TenantTax'
}

export const GUARANTOR_COMPONENTS: { [type in DocumentType]: string } = {
  IDENTITY: 'GuarantorIdentification',
  RESIDENCY: 'GuarantorResidency',
  PROFESSIONAL: 'GuarantorProfessional',
  FINANCIAL: 'GuarantorFinancial',
  TAX: 'GuarantorTax',
  IDENTIFICATION: 'GuarantorIdentification',
  IDENTIFICATION_LEGAL_PERSON: 'GuarantorName',
  GUARANTEE_PROVIDER_CERTIFICATE: 'GuarantorName'
}

export const COUPLE_COMPONENTS: { [type in DocumentType]?: string } = {
  IDENTITY: 'CoupleIdentification',
  RESIDENCY: 'CoupleResidency',
  PROFESSIONAL: 'CoupleProfessional',
  FINANCIAL: 'CoupleFinancial',
  TAX: 'CoupleTax'
}
