import { E2E_PASSWORD, testEmail } from "../../../support/testAccounts";
import {
  waitForEmail,
  RESET_SUBJECT,
  WELCOME_SUBJECT,
} from "../../../support/mailbox";

const TESTEMAIL = testEmail(
  `${Cypress.env("testmailTag")}-${Date.now().toString(36)}`,
);
const PASSWORD = E2E_PASSWORD;
const NEW_PASSWORD = "zyxwvu98765!";

let timestamp: number;

function signup() {
  cy.then(() => {
    timestamp = Date.now();
  });
  cy.signupTenant(TESTEMAIL, PASSWORD);
  cy.contains("Consultez vos e-mails !").should("exist");
}

function login(password = PASSWORD) {
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.get('input[name="username"]').type(TESTEMAIL);
  cy.get('input[name="password"]').type(password);
  cy.get("input[type=submit]").click();
}

describe("Test signup process", () => {
  before(() => {
    signup();
  });

  it("should validate link in email and login", () => {
    // Query the inbox until the email arrives
    waitForEmail("tenant-signup", TESTEMAIL, timestamp).then((email) => {
      // Verify subject
      expect(email.subject).to.equal(WELCOME_SUBJECT);

      // Extract and check email content
      const parser = new DOMParser();
      const doc = parser.parseFromString(email.html, "text/html");

      cy.wrap(doc.getElementsByTagName("h3").length).should(
        "be.greaterThan",
        0,
      ); // There should be at least one h3 tag

      expect(doc.getElementsByTagName("h3")[0].innerText).to.satisfy(
        (text: string) => text.includes("Bienvenue chez DossierFacile !"),
      );

      // Visit the verification link
      cy.visit(email.link);

      // Keycloak asks for the password here when the registration form did not
      cy.setPasswordIfRequested(PASSWORD);

      // Confirm the user is logged in
      cy.location("pathname").should("equal", "/nom-locataire");
      cy.contains("Identité").should("be.visible");
    });
  });

  it("should reset the password", () => {
    // The reset link is only valid within an active Keycloak auth session, so
    // start from the login page rather than visiting the reset URL directly
    cy.visit(Cypress.env("tenantUrl") + "/login");
    cy.contains("Mot de passe oublié").click();

    // Request the reset email
    cy.get("#username").type(TESTEMAIL);
    timestamp = Date.now();
    cy.get("input[type=submit]").click();

    // Query the inbox until the reset email arrives, then open its link
    waitForEmail("tenant-recovery", TESTEMAIL, timestamp).then((email) => {
      expect(email.subject).to.equal(RESET_SUBJECT);

      // Set the new password on the Keycloak update-password page
      cy.visit(email.link);
      cy.get("#password-new").type(NEW_PASSWORD);
      cy.get("#password-confirm").type(NEW_PASSWORD);
      cy.get("#kc-passwd-update-form").submit();

      // Keycloak completes the original login: we land back in the app
      cy.location("pathname").should("equal", "/nom-locataire");

      // Prove the new password works through a clean login
      cy.clearAllCookies();
      cy.clearAllLocalStorage();
      login(NEW_PASSWORD);
      cy.location("pathname").should("not.match", /\/auth$/);
      cy.contains("Identité").should("be.visible");
    });
  });
});
