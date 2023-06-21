/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    tenantLogin(username: string): Chainable<void>;

    ownerLogin(username: string): Chainable<void>;

    loginWithFC(username: string): Chainable<void>;

    deleteAccount(username: string, type: number): Chainable<void>;

    uploadDocument(numberOfFiles?: number): Chainable<void>;

    clickOnNext(): Chainable<void>;

    expectPath(path: string): Chainable<void>;

    acceptCookies(): Chainable<void>;

    testAccessibility(): Chainable<void>;

    disableTaxVerification(): Chainable<void>;

    simpleUploadDocumentStep(buttonToSelect: string, numberOfFiles?: number): Chainable<void>;

    selectProfessionalStatusStep(professionalStatus: string): Chainable<void>;

    addFinancialResource(
      resourceType: string,
      monthlySum: string
    ): Chainable<void>;

    validationStep(): Chainable<void>;
  }
}
