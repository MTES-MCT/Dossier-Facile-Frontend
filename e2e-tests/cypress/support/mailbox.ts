/// <reference types="cypress" />

// Subject of the Keycloak email sent when an account is created
export const WELCOME_SUBJECT = "Bienvenue sur DossierFacile !";

// Subject of the Keycloak email sent when a password reset is requested
export const RESET_SUBJECT = "Réinitialiser le mot de passe";

// Queries the inbox until an email with the expected subject arrives.
// `sentAfter` is an epoch timestamp taken right before the email is triggered,
// so earlier emails sent to the same address are ignored.
// We need to check emails again in the case another email (the "deleted
// account" one for instance) was received but the expected one was not yet
export function getEmail(subject: string, tag: string, sentAfter: number) {
  return cy.env(["TESTMAIL_API_KEY"]).then(({ TESTMAIL_API_KEY: apiKey }) => {
    if (!apiKey) {
      throw new Error(
        "Missing TESTMAIL_API_KEY: run with CYPRESS_TESTMAIL_API_KEY=<key>.",
      );
    }
    const endpoint = `${Cypress.expose("testmailEndpoint")}?apikey=${encodeURIComponent(apiKey)}&namespace=${encodeURIComponent(Cypress.expose("TESTMAIL_NAMESPACE"))}&tag=${encodeURIComponent(tag)}`;
    let retries = 0;
    const query = () =>
      cy
        .request({
          method: "GET",
          url: `${endpoint}&timestamp_from=${sentAfter}&livequery=true`,
          log: false,
        })
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
            throw new Error(`Email not found: ${subject}`);
          }
          // No matching email found, wait then try again
          cy.wait(2000);
          query();
        });
    return query();
  });
}

// Extracts the action link from a DossierFacile email
export function linkFromEmail(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const linkElement = doc.querySelector("a.default-button");

  expect(linkElement, "Action link exists in the email").to.not.be.null;

  const link = linkElement.getAttribute("href");
  expect(link, "Action link URL").to.match(/^https?:\/\//);

  return link;
}
