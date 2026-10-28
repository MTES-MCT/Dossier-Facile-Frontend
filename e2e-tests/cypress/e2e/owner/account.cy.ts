import {
  cleanBrowser,
  expectRejectedPassword,
  fillActionPassword,
  loginWithPassword,
  submitActionPassword,
} from "../../support/auth";
import { profile } from "../../support/accounts";
import { createVerifiedOwner, requestOwnerRecovery } from "../../support/owner";
import { testAccount } from "../../support/testAccounts";

describe("Owner registration and password recovery", () => {
  it("registers through the form, follows the confirmation email and logs in", () => {
    const account = testAccount(`owner-signup-${Date.now().toString(36)}`);
    createVerifiedOwner(account);
    loginWithPassword(account, "owner");
    profile({ ...account, realm: "owner" });
  });

  it("uses a delivered recovery link, rejects the old password and prevents replay", () => {
    const account = testAccount(`owner-recovery-${Date.now().toString(36)}`);
    const nextPassword = "Df-Owner-Recovery-2026!";
    createVerifiedOwner(account);
    requestOwnerRecovery(account).then(({ link }) => {
      submitActionPassword(link, nextPassword);
      loginWithPassword({ ...account, password: nextPassword }, "owner");
      profile({ ...account, realm: "owner" });
      expectRejectedPassword(account, "owner");
      const token = new URL(link).pathname.split("/").at(-1);
      cy.request({
        method: "POST",
        url: `${Cypress.env("ownerApiUrl")}/api/register/createPassword/${token}`,
        body: { password: nextPassword },
        failOnStatusCode: false,
        log: false,
      })
        .its("status")
        .should("eq", 404);
    });
  });

  it("can log in after a gateway timeout hides a successful password write", () => {
    const account = testAccount(`owner-timeout-${Date.now().toString(36)}`);
    const nextPassword = "Df-Owner-Timeout-2026!";
    createVerifiedOwner(account);
    requestOwnerRecovery(account).then(({ link }) => {
      cleanBrowser();
      let writes = 0;
      cy.intercept("POST", "**/api/register/createPassword/*", (request) => {
        writes++;
        request.continue((response) => {
          expect(response.statusCode, "real upstream password write").to.eq(
            200,
          );
          // Socket resets make Chromium retry POST. A gateway timeout models
          // a lost acknowledgement without that browser transport retry.
          response.send({ statusCode: 504, body: "Gateway timeout" });
        });
      }).as("lostPasswordResponse");
      cy.visit(link, { log: false });
      fillActionPassword(nextPassword);
      cy.get("form").find('button[type="submit"]').click();
      cy.wait("@lostPasswordResponse")
        .its("response.statusCode")
        .should("eq", 504);
      cy.then(() => expect(writes, "no automatic credential retry").to.eq(1));
      loginWithPassword({ ...account, password: nextPassword }, "owner");
      profile({ ...account, realm: "owner" });
    });
  });
});
