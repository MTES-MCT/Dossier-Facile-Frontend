import type {
  AccountFixture,
  AccountSnapshot,
  TenantProfile,
} from "../../support/types/accounts";
import {
  account,
  accessibility,
  finishInvitation,
  isolatedAccounts,
  login,
  profile,
  restoreSession,
  saveSession,
} from "../../support/accounts";

describe("Existing tenant accounts", () => {
  isolatedAccounts("tenant");

  it("restores an existing session, preserves its dossier, saves a change and reconnects", () => {
    cy.task<AccountFixture>("accounts:fresh", "active-tenant", {
      log: false,
    }).then((fixture) => {
      login(fixture);
      profile(fixture);
      saveSession(fixture.key);
      account(fixture.key).then((saved) => restoreSession(saved));
      cy.visit(`${Cypress.env("tenantUrl")}/nom-locataire/pour-moi`);
      accessibility();
      cy.get("#lastname").clear().type("Compte Existant");
      cy.get("#firstName").clear().type("Alice");
      cy.intercept("POST", "**/api/register/names").as("saveNames");
      cy.get('[data-cy="next-btn"]').click();
      cy.wait("@saveNames").then(({ request, response }) => {
        expect(request.body.lastName).to.eq("Compte Existant");
        expect(response?.statusCode).to.eq(200);
        expect(response!.body.lastName).to.eq("Compte Existant");
      });
      login(fixture);
      profile(fixture).then(({ body }) => {
        expect((body as TenantProfile).apartmentSharing.id).to.eq(
          fixture.sharingId,
        );
        expect(body.lastName).to.eq("Compte Existant");
      });
    });
  });

  it("creates the application account only on the first login of an existing Keycloak identity", () => {
    cy.task<AccountFixture>("accounts:fresh", "first-login", {
      log: false,
    }).then((fixture) => {
      cy.task<AccountSnapshot>("accounts:snapshot", fixture.key, { log: false })
        .its("local")
        .should("eq", null);
      login(fixture);
      profile(fixture);
      cy.task<AccountSnapshot>("accounts:snapshot", fixture.key, {
        log: false,
      }).then((snapshot) => {
        expect(snapshot.local?.keycloakId).to.eq(fixture.keycloakId);
        expect(snapshot.local?.email).to.eq(fixture.email);
      });
    });
  });

  it("reuses an exact unverified Keycloak identity for a COUPLE invitation and retains dossier permissions", () => {
    cy.task<AccountFixture>("accounts:fresh", "existing-couple", {
      log: false,
    }).then((fixture) => {
      finishInvitation(fixture, "COUPLE");
    });
  });

  it("adds email to a historical cotenant and preserves its original dossier and tenant ID", () => {
    cy.task<AccountFixture>("accounts:fresh", "late-email", {
      log: false,
    }).then((guest) => {
      account("late-email-main").then((main) => {
        login(main);
        cy.visit(`${Cypress.env("tenantUrl")}/type-locataire`);
        cy.get('input[name="coTenantFirstName"]').should(
          "have.value",
          "Invite",
        );
        cy.get('input[name="email"]').clear().type(guest.email, { log: false });
        cy.get("#authorize").check({ force: true });
        cy.intercept("POST", "**/api/register/application/v2").as("addEmail");
        cy.get('[data-cy="next-btn"]').click();
        cy.wait("@addEmail").its("response.statusCode").should("eq", 200);
        cy.task<AccountFixture>(
          "accounts:refresh",
          { key: guest.key, route: "ajout-couple" },
          { log: false },
        ).then((updated) => {
          expect(updated.localId).to.eq(guest.localId);
          finishInvitation(updated, "COUPLE");
        });
      });
    });
  });
});
