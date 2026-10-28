import type {
  AccountFixture,
  AccountSnapshot,
} from "../../support/types/accounts";
import {
  actionRequest,
  finishInvitation,
  unchanged,
  isolatedAccounts,
} from "../../support/accounts";

describe("Pentest regressions with real Keycloak identities and PostgreSQL tokens", () => {
  isolatedAccounts("tenant");
  it("rejects a corrupt historical binding without repair or side effects, then accepts the repaired fixture", () => {
    cy.task<AccountFixture>("accounts:fresh", "invalid-binding", {
      log: false,
    }).then((guest) => {
      cy.task<AccountSnapshot>("accounts:savedSnapshot", guest.key, {
        log: false,
      }).then((before) => {
        expect(before.local?.keycloakId).not.to.eq(guest.keycloakId);
        actionRequest(guest, "tenant", 404);
        unchanged(guest.key, before);
        cy.task<AccountSnapshot>("accounts:savedSnapshot", "binding-witness", {
          log: false,
        }).then((witness) => unchanged("binding-witness", witness));
        cy.task("accounts:restoreBinding", null, { log: false });
        finishInvitation(guest, "GROUP");
      });
    });
  });

  it("rejects a tenant token on the owner API without consuming the rightful invitation", () => {
    cy.task<AccountFixture>("accounts:fresh", "security-group", {
      log: false,
    }).then((guest) => {
      cy.task<AccountSnapshot>("accounts:snapshot", guest.key, {
        log: false,
      }).then((before) => {
        cy.task(
          "accounts:identities",
          { key: guest.key, realm: "owner" },
          { log: false },
        ).should("deep.eq", []);
        actionRequest(guest, "owner", 404);
        actionRequest(guest, "owner", 404);
        unchanged(guest.key, before);
        cy.task(
          "accounts:identities",
          { key: guest.key, realm: "owner" },
          { log: false },
        ).should("deep.eq", []);
        finishInvitation(guest, "GROUP");
      });
    });
  });

  it("never writes credentials or verification flags to unbound substring matches", () => {
    cy.task<AccountFixture>("accounts:fresh", "substring", { log: false }).then(
      (guest) => {
        for (const key of ["witness-a", "witness-b"]) {
          cy.task<AccountSnapshot>("accounts:savedSnapshot", key, {
            log: false,
          }).then((before) => {
            expect(
              before.local,
              "witness has never logged in to DossierFacile",
            ).to.eq(null);
            expect(before.identity.credentials).to.have.length(0);
            expect(before.identity.emailVerified).to.eq(false);
            expect(guest.keycloakId).not.to.eq(before.identity.id);
            unchanged(key, before);
          });
        }
        finishInvitation(guest, "GROUP");
        for (const key of ["witness-a", "witness-b"]) {
          cy.task<AccountSnapshot>("accounts:savedSnapshot", key, {
            log: false,
          }).then((before) => unchanged(key, before));
        }
      },
    );
  });
});
