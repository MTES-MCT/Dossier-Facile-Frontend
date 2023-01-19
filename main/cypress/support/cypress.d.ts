/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    fillContactForm(): Chainable<void>;
    expectLocationContaining(expected: string): Chainable<void>;
    mockStats(): Chainable<void>;
  }
}
