import {
  account,
  accessibility,
  isolatedAccounts,
  login,
  profile,
  restoreSession,
  saveSession,
} from "../../support/accounts";
import type {
  AccountFixture,
  OwnerProfile,
} from "../../support/types/accounts";

describe("Existing owner accounts", () => {
  isolatedAccounts("owner");

  it("restores an existing session with the original property and applicant and reconnects", () => {
    cy.task<AccountFixture>("accounts:fresh", "active-owner", {
      log: false,
    }).then((fixture) => {
      login(fixture);
      profile(fixture);
      saveSession(fixture.key);
      account(fixture.key)
        .then((saved) => restoreSession(saved))
        .then(({ body }) => {
          const property = (body as OwnerProfile).properties!.find(
            (p) => p.id === fixture.property!.id,
          )!;
          expect(property.name).to.eq(fixture.property!.name);
          expect(property.propertyApartmentSharingCount).to.eq(1);
        });
      cy.contains(fixture.property!.name).should("be.visible");
      accessibility();
      login(fixture);
      profile(fixture);
      cy.contains(fixture.property!.name).should("be.visible");
    });
  });
});
