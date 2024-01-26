export enum DocumentType {
  IDENTITY = "IDENTITY",
  RESIDENCY = "RESIDENCY",
  PROFESSIONAL = "PROFESSIONAL",
  FINANCIAL = "FINANCIAL",
  TAX = "TAX",
  IDENTIFICATION_LEGAL_PERSON = "IDENTIFICATION_LEGAL_PERSON",
  IDENTIFICATION = "IDENTIFICATION",
  GUARANTEE_PROVIDER_CERTIFICATE = "GUARANTEE_PROVIDER_CERTIFICATE",
}

export const DocumentTypeTranslations: { [type in DocumentType]: string } = {
  IDENTITY: "identification",
  RESIDENCY: "residency",
  PROFESSIONAL: "professional",
  FINANCIAL: "financial",
  TAX: "tax",
  IDENTIFICATION_LEGAL_PERSON: "identification-legal-person",
  IDENTIFICATION: "identity-represent",
  GUARANTEE_PROVIDER_CERTIFICATE: "guarantee-provider-certificate",
};
