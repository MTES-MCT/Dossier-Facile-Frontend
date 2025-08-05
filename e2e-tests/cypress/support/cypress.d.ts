/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    tenantLoginWithFC(username: string, password: string): Chainable<void>;

    ownerLoginWithFC(username: string, password: string): Chainable<void>;

    loginWithFC(username: string, password: string): Chainable<void>;

    verifyTenantIdentity(firstname: string, lastname: string): Chainable<void>;

    loginWithFCAndDeleteAccount(
      username: string,
      passowrd: string,
      type: number
    ): Chainable<void>;

    uploadDocument(numberOfFiles?: number): Chainable<void>;

    waitUntilModalIsGone(): Chainable<void>;

    waitUntilLoaderIsGone(): Chainable<void>;

    clickOnNext(): Chainable<void>;

    expectPath(path: string): Chainable<void>;

    testAccessibility(): Chainable<void>;

    simpleUploadDocumentStep(
      buttonToSelect: string,
      numberOfFiles?: number
    ): Chainable<void>;

    selectResidencyStep(
      residencyType: string,
      step2Label?: string,
      numberOfFiles?: number
    ): Chainable<void>;

    verifyErrorToastMessage(message: string): Chainable<void>;

    selectProfessionalStatusStep(professionalStatus: string): Chainable<void>;

    addFinancialResource(steps: string[], monthlySum: string): Chainable<void>;

    validationStep(): Chainable<void>;
    rejectCookies(): Chainable<void>;
  }
}
