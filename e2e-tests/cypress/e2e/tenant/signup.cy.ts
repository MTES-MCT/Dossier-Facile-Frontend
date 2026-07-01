import { E2E_PASSWORD, testEmail } from "../../support/testAccounts";

const ENDPOINT = `${Cypress.env("testmailEndpoint")}?apikey=${Cypress.env("TESTMAIL_API_KEY")}&namespace=${Cypress.env("TESTMAIL_NAMESPACE")}&tag=${Cypress.env("testmailTag")}`;
const TESTEMAIL = testEmail(Cypress.env("testmailTag"));
const PASSWORD = E2E_PASSWORD;
const NEW_PASSWORD = "zyxwvu98765!";
const MAIL_SUBJECT = "Bienvenue sur DossierFacile !";
const RESET_SUBJECT = "Réinitialiser le mot de passe";

let timestamp: number;

function signup() {
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.contains("S'inscrire").click();
  cy.expectPath("/registration");
  cy.get('input[name="email"]').type(TESTEMAIL);
  cy.get('input[name="password"]').type(PASSWORD);
  cy.get("#acceptCgu").check({ force: true });
  cy.get("input[type=submit]").click();
  timestamp = Date.now();
  cy.contains("Consultez vos e-mails !").should("exist");
}

function login(password = PASSWORD) {
  cy.wrap(Cypress.env("TESTMAIL_API_KEY")).should("exist");
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.get('input[name="username"]').type(TESTEMAIL);
  cy.get('input[name="password"]').type(password);
  cy.get("input[type=submit]").click();
}

// We need to check emails again in the case the "deleted account" email was
// received but the "welcome" one was not yet received
function getEmail(subject = MAIL_SUBJECT) {
  let retries = 0;
  return cy
    .request("GET", `${ENDPOINT}&timestamp_from=${timestamp}&livequery=true`)
    .then((response) => {
      const inbox = response.body;
      cy.wrap(response.status)
        .should("be.oneOf", [200, 307])
        .then((status) => {
          if (status === 307) {
            cy.wait(5000); // Wait for 5 seconds before rechecking
          }
        });
      if (
        inbox.result === "success" &&
        inbox.emails?.[0]?.subject === subject
      ) {
        cy.wrap(response);
        return;
      }
      if (retries++ > 10) {
        throw new Error("Email not found");
      }
      // No matching email found, wait then try again
      cy.wait(2000);
      getEmail(subject);
    });
}

describe("Test signup process", () => {
  before(() => {
    cy.resetTestAccount(TESTEMAIL);
    signup();
  });

  it("should validate link in email and login", () => {
    // Query the inbox until the email arrives
    getEmail().then((response) => {
      // Verify subject
      const email = response.body.emails[0];
      expect(email.subject).to.equal(MAIL_SUBJECT);

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

      const linkElement = doc.querySelector("a.default-button");

      // Ensure the verification link exists
      expect(linkElement, "Verification link exists in the email").to.not.be
        .null;

      const link = linkElement.getAttribute("href");

      // Verify the link is valid before visiting
      expect(link, "Verification link URL").to.match(/^https?:\/\//);

      // Visit the verification link
      cy.visit(link);

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
    getEmail(RESET_SUBJECT).then((response) => {
      const email = response.body.emails[0];
      expect(email.subject).to.equal(RESET_SUBJECT);

      const parser = new DOMParser();
      const doc = parser.parseFromString(email.html, "text/html");

      const linkElement = doc.querySelector("a.default-button");
      expect(linkElement, "Reset link exists in the email").to.not.be.null;

      const link = linkElement.getAttribute("href");
      expect(link, "Reset link URL").to.match(/^https?:\/\//);

      // Set the new password on the Keycloak update-password page
      cy.visit(link);
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
