import type { Realm } from "./types/accounts";

export interface PasswordAccount {
  email: string;
  password: string;
}

export interface FederatedCredentials {
  username: string;
  password: string;
}

export function cleanBrowser(): void {
  cy.clearAllCookies({ log: false });
  cy.clearAllLocalStorage({ log: false });
  cy.clearAllSessionStorage({ log: false });
  // The current Keycloak theme expects this normal language preference.
  cy.setCookie("lang", "fr", {
    domain: new URL(Cypress.env("keycloakUrl") as string).hostname,
    path: "/",
    log: false,
  });
}

export function dismissCookies(): void {
  cy.get("body").then(($body) => {
    const reject = $body
      .find("button")
      .filter(
        (_, button) =>
          button.textContent?.trim() === "Refuser tout" &&
          Cypress.$(button).is(":visible"),
      );
    if (reject.length) cy.wrap(reject).click();
  });
}

export function openLogin(realm: Realm): void {
  cleanBrowser();
  const base = Cypress.env(
    realm === "tenant" ? "tenantUrl" : "ownerUrl",
  ) as string;
  cy.visit(`${base}/${realm === "tenant" ? "login" : "home"}`);
}

function enterCredentials(account: PasswordAccount): void {
  cy.get('input[name="username"]').type(account.email, {
    log: false,
    parseSpecialCharSequences: false,
  });
  cy.get('input[name="password"]').type(account.password, {
    log: false,
    parseSpecialCharSequences: false,
  });
  cy.get("form").filter(':has(input[name="username"])').submit();
}

export function loginWithPassword(
  account: PasswordAccount,
  realm: Realm = "tenant",
): void {
  openLogin(realm);
  enterCredentials(account);
  const sso = new URL(Cypress.env("keycloakUrl") as string).origin;
  cy.location("origin").then((origin) => {
    if (origin === sso) {
      cy.location("search").should("include", "VERIFY_PROFILE");
      cy.get("#firstName").clear().type("Alice");
      cy.get("#lastName").clear().type("DEPLOIEMENT");
      cy.get("form").filter(":has(#firstName)").submit();
    }
  });
  cy.location("origin").should(
    "eq",
    new URL(
      Cypress.env(realm === "tenant" ? "tenantUrl" : "ownerUrl") as string,
    ).origin,
  );
  cy.get("header").contains("button", "Se déconnecter").should("be.visible");
}

export function expectRejectedPassword(
  account: PasswordAccount,
  realm: Realm,
): void {
  openLogin(realm);
  enterCredentials(account);
  cy.get(
    '[id^="input-error"], #kc-error-message, .alert-error, .pf-m-danger, .fr-alert--error',
    { timeout: 15_000 },
  )
    .filter(":visible")
    .should("exist");
}

export function registerTenant(account: PasswordAccount): void {
  cleanBrowser();
  cy.visit(`${Cypress.env("tenantUrl")}/login`);
  cy.contains("S'inscrire").click();
  cy.get('input[name="email"]').type(account.email, { log: false });
  cy.get("body").then(($body) => {
    if ($body.find('input[name="password"]').length)
      cy.get('input[name="password"]').type(account.password, {
        log: false,
        parseSpecialCharSequences: false,
      });
  });
  cy.get("#acceptCgu").check({ force: true });
  cy.get('#kc-register-form input[type="submit"]').click();
  cy.contains("Consultez vos e-mails").should("be.visible");
}

export function setKeycloakPasswordIfRequested(password: string): void {
  cy.get("body").then(($body) => {
    if (!$body.find("#password-new").length) return;
    cy.get("#password-new").type(password, {
      log: false,
      parseSpecialCharSequences: false,
    });
    cy.get("#password-confirm").type(password, {
      log: false,
      parseSpecialCharSequences: false,
    });
    cy.get("#kc-passwd-update-form").submit();
  });
}

export function registerOwner(account: PasswordAccount): void {
  cleanBrowser();
  cy.visit(`${Cypress.env("ownerUrl")}/creation`);
  cy.get('input[name="email"]').type(account.email, { log: false });
  cy.get('input[name="password"]').type(account.password, {
    log: false,
    parseSpecialCharSequences: false,
  });
  cy.get('input[name="confirm-password"]').type(account.password, {
    log: false,
    parseSpecialCharSequences: false,
  });
  cy.get("#terms").check({ force: true });
  const alias = Cypress._.uniqueId("registerOwner");
  cy.intercept("POST", "**/api/register/account").as(alias);
  dismissCookies();
  cy.get("form")
    .filter(':has(input[name="email"])')
    .find('button[type="submit"]')
    .click();
  cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
}

export function fillActionPassword(password: string): void {
  cy.get("#password").type(password, {
    log: false,
    parseSpecialCharSequences: false,
  });
  cy.get("#confirm-password").type(password, {
    log: false,
    parseSpecialCharSequences: false,
  });
  dismissCookies();
}

export function submitActionPassword(link: string, password: string): void {
  cleanBrowser();
  cy.visit(link, { log: false });
  fillActionPassword(password);
  cy.get("form")
    .filter(":has(#confirm-password)")
    .find('button[type="submit"]')
    .click();
  cy.location("pathname").should("not.eq", new URL(link).pathname);
}

// Tenant and owner FranceConnect journeys share the same provider interaction.
export function continueFranceConnectLogin(
  credentials: FederatedCredentials,
  realm: Realm = "tenant",
): void {
  const destination = new URL(
    Cypress.env(realm === "tenant" ? "tenantUrl" : "ownerUrl") as string,
  ).origin;
  const sso = new URL(Cypress.env("keycloakUrl") as string).origin;
  cy.setCookie("lang", "fr", {
    domain: new URL(sso).hostname,
    path: "/",
    log: false,
  });
  cy.get("#social-oidc").click();
  function step(remaining: number): void {
    cy.location("origin").then((origin) => {
      if (origin === destination) return;
      expect(
        remaining,
        "FranceConnect authentication completes",
      ).to.be.greaterThan(0);
      cy.get('form, [data-testid="main-providers"]')
        .filter(":visible")
        .should("exist");
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="main-providers"]').length) {
          cy.get('[data-testid="main-providers"] button').first().click();
        } else if ($body.find("#login").length) {
          cy.get("#login").clear().type(credentials.username, {
            log: false,
            parseSpecialCharSequences: false,
          });
          cy.get("#password").clear().type(credentials.password, {
            log: false,
            parseSpecialCharSequences: false,
          });
          cy.get("form").filter(":has(#login)").submit();
        } else {
          cy.get("form").filter(":visible").should("have.length", 1).submit();
        }
      });
      step(remaining - 1);
    });
  }
  step(6);
  cy.location("origin").should("eq", destination);
}
