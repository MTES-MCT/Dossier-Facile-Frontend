import type {
  AccountFixture,
  AccountSnapshot,
} from "../../support/types/accounts";
import {
  actionRequest,
  login,
  profile,
  submitPassword,
  unchanged,
  isolatedAccounts,
} from "../../support/accounts";

describe("Owner recovery token isolation", () => {
  isolatedAccounts("owner");
  it("rejects an owner token on the tenant API twice without creating or changing any identity", () => {
    cy.task<AccountFixture>("accounts:fresh", "security-owner", {
      log: false,
    }).then((owner) => {
      cy.task<AccountSnapshot>("accounts:snapshot", owner.key, {
        log: false,
      }).then((before) => {
        cy.task(
          "accounts:identities",
          { key: owner.key, realm: "tenant" },
          { log: false },
        ).should("deep.eq", []);
        actionRequest(owner, "tenant", 404);
        actionRequest(owner, "tenant", 404);
        unchanged(owner.key, before);
        cy.task(
          "accounts:identities",
          { key: owner.key, realm: "tenant" },
          { log: false },
        ).should("deep.eq", []);
        submitPassword(owner);
        login(owner, owner.nextPassword);
        profile(owner);
      });
    });
  });
});
