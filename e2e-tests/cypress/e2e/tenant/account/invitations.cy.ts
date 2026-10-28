import { acceptInvitation } from "../../../support/accounts";
import { waitForEmail } from "../../../support/mailbox";
import { testAccount } from "../../../support/testAccounts";
import type { TenantProfile } from "../../../support/types/accounts";

describe("Invited tenant activation", () => {
  for (const kind of ["GROUP", "COUPLE"] as const) {
    it(`accepts a delivered ${kind} invitation and joins the original dossier`, () => {
      const main = testAccount(`inviter-${kind.toLowerCase()}`);
      const guest = testAccount(
        `invitee-${kind.toLowerCase()}-${Date.now().toString(36)}`,
      );
      const nextPassword = "Df-Invitation-2026!";
      cy.createFreshTenant(main);
      cy.fillTenantIdentity(main.firstname, main.lastname);
      cy.contains(kind === "GROUP" ? "En colocation" : "En couple").click();
      if (kind === "COUPLE") {
        cy.get('input[name="coTenantFirstName"]').type(guest.firstname);
        cy.get('input[name="coTenantLastName"]').type(guest.lastname);
      }
      const sentAfter = Date.now();
      cy.get('input[name="email"]').type(guest.email, { log: false });
      if (kind === "GROUP") cy.contains("Inviter ce colocataire").click();
      cy.get('label[for="authorize"]').click();
      cy.intercept("POST", "**/api/register/application/v2").as("inviteTenant");
      cy.clickOnNext();
      cy.wait("@inviteTenant").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        const sharingId = (response!.body as TenantProfile).apartmentSharing.id;
        waitForEmail(
          kind === "GROUP" ? "group-invitation" : "couple-invitation",
          guest.email,
          sentAfter,
        ).then(({ link }) => {
          acceptInvitation(
            { ...guest, realm: "tenant", link, nextPassword, sharingId },
            kind,
          );
        });
      });
    });
  }
});
