const ENDPOINT = `${Cypress.env("testmailEndpoint")}?apikey=${Cypress.env("TESTMAIL_API_KEY")}&namespace=${Cypress.env("TESTMAIL_NAMESPACE")}&tag=${Cypress.env("testmailTag")}`;
const TESTEMAIL = `${Cypress.env("TESTMAIL_NAMESPACE")}.${Cypress.env("testmailTag")}@inbox.testmail.app`;
const PASSWORD = "abcdef12345!";
const MAIL_SUBJECT = "Bienvenue sur DossierFacile !";

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

function login() {
  cy.wrap(Cypress.env("TESTMAIL_API_KEY")).should("exist");
  cy.visit(Cypress.env("tenantUrl") + "/login");
  cy.get('input[name="username"]').type(TESTEMAIL);
  cy.get('input[name="password"]').type(PASSWORD);
  cy.get("input[type=submit]").click();
}

// We need to check emails again in the case the "deleted account" email was
// received but the "welcome" one was not yet received
function getEmail() {
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
        inbox.emails?.[0]?.subject === MAIL_SUBJECT
      ) {
        cy.wrap(response);
        return;
      }
      if (retries++ > 10) {
        throw new Error("Email not found");
      }
      // No matching email found, wait then try again
      cy.wait(2000);
      getEmail();
    });
}

describe("Test signup process", () => {
  before(() => {
    // Try to login. Delete account if it exists. Then register
    login();
    cy.location("pathname").should("not.match", /\/auth$/);
    cy.location("pathname").then((pathname) => {
      if (pathname.endsWith("/required-action")) {
        cy.log("Account already exists but is not verified");
        cy.contains("Cliquez ici").click(); // resend validation email
        timestamp = Date.now();
      } else if (pathname.endsWith("/authenticate")) {
        cy.log("Account does not exists");
        signup();
      } else {
        cy.log("Verified account exists, delete it");
        cy.contains("Mon compte").click();
        cy.contains("Supprimer mon compte").click();
        cy.contains(".fr-modal--opened button", "Supprimer mon compte").click();
        cy.url().should("contain", Cypress.env("mainUrl"));

        signup();
      }
    });
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
        0
      ); // There should be at least one h3 tag

      expect(doc.getElementsByTagName("h3")[0].innerText).to.satisfy(
        (text: string) => text.includes("Bienvenue chez DossierFacile !")
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
      // cy.contains("Cliquez ici").click();
      // cy.contains("Revenir à l'application").click();
      // login();

      // Confirm the user is logged in
      cy.location("pathname").should("equal", "/nom-locataire");
      cy.contains("Identité").should("be.visible");
    });
  });
});
