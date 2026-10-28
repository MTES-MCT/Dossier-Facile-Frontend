import { cleanBrowser, dismissCookies, registerOwner } from "./auth";
import type { PasswordAccount } from "./auth";
import { waitForEmail } from "./mailbox";
import type { DeliveredEmail } from "./types/mail";

export function createVerifiedOwner(account: PasswordAccount): void {
  const sentAfter = Date.now();
  registerOwner(account);
  waitForEmail("owner-confirmation", account.email, sentAfter).then(
    ({ link }) => {
      const alias = Cypress._.uniqueId("confirmOwner");
      cy.intercept("GET", "**/api/register/confirmAccount/*").as(alias);
      cy.visit(link, { log: false });
      cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    },
  );
}

export function requestOwnerRecovery(
  account: PasswordAccount,
): Cypress.Chainable<DeliveredEmail> {
  const sentAfter = Date.now();
  cleanBrowser();
  cy.visit(`${Cypress.env("ownerUrl")}/mot-de-passe-oublie`);
  cy.get('input[type="email"]').type(account.email, { log: false });
  const alias = Cypress._.uniqueId("forgotPassword");
  cy.intercept("POST", "**/api/register/forgotPassword").as(alias);
  dismissCookies();
  cy.get("form").find('button[type="submit"]').click();
  cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
  cy.contains("Un mail vous a été envoyé").should("be.visible");
  return waitForEmail("owner-recovery", account.email, sentAfter);
}
