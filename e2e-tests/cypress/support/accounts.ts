import {
  cleanBrowser,
  loginWithPassword,
  expectRejectedPassword,
  submitActionPassword,
} from "./auth";
export { cleanBrowser, dismissCookies } from "./auth";
import type {
  AccountFixture,
  AccountSnapshot,
  SavedCookie,
  TenantProfile,
  OwnerProfile,
} from "./types/accounts";

export function account(key: string) {
  return cy.task<AccountFixture>("accounts:get", key, { log: false });
}

export function visitApp(realm: "tenant" | "owner") {
  // Without a fixed app origin Cypress rebases its runner on the first visit
  // and can replay that test. Visit before side-effecting fixture tasks so a
  // switch between owner and tenant cannot create the same account twice.
  cleanBrowser();
  const base = Cypress.env(
    realm === "tenant" ? "tenantUrl" : "ownerUrl",
  ) as string;
  cy.visit(
    `${base}/${realm === "tenant" ? "ajout-groupe/e2e-origin" : "mot-de-passe-oublie"}`,
  );
}

export function login(
  fixture: Pick<AccountFixture, "realm" | "email" | "password">,
  password = fixture.password,
): void {
  loginWithPassword({ email: fixture.email, password }, fixture.realm);
}

export function profile(
  fixture: Pick<AccountFixture, "realm" | "email"> &
    Partial<Pick<AccountFixture, "key" | "localId">>,
) {
  const api = Cypress.env(
    fixture.realm === "tenant" ? "tenantApiUrl" : "ownerApiUrl",
  ) as string;
  const path = `${api}/api/${fixture.realm}/profile`;
  const alias = Cypress._.uniqueId("accountProfile");
  cy.intercept("GET", `${path}*`).as(alias);
  const base = Cypress.env(
    fixture.realm === "tenant" ? "tenantUrl" : "ownerUrl",
  ) as string;
  cy.visit(`${base}/${fixture.realm === "tenant" ? "account" : "home"}`);
  return cy.wait(`@${alias}`).then(({ response, request }) => {
    expect(response?.statusCode).to.eq(200);
    const body = response!.body as TenantProfile | OwnerProfile;
    expect(body.email).to.eq(fixture.email);
    if (fixture.realm === "tenant" && fixture.localId)
      expect(body.id).to.eq(fixture.localId);
    expect(
      typeof request.headers.authorization,
      "authenticated application profile request",
    ).to.eq("string");
    const result = { body };
    if (fixture.realm === "owner" && fixture.localId && fixture.key) {
      // OwnerMapper intentionally omits id from this public response.
      return cy
        .task<AccountSnapshot>("accounts:snapshot", fixture.key, { log: false })
        .then((snapshot) => {
          expect(snapshot.local?.id).to.eq(fixture.localId);
          return result;
        });
    }
    return cy.wrap(result, { log: false });
  });
}

export function restoreSession(fixture: AccountFixture) {
  expect(
    fixture.cookies?.length,
    "cookies saved before restoring the session",
  ).to.be.greaterThan(0);
  cleanBrowser();
  for (const cookie of fixture.cookies ?? []) {
    const { name, value, ...options } = cookie;
    cy.setCookie(name, value, { ...options, log: false });
  }
  // Do not type credentials here: this must resume the existing session.
  return profile(fixture);
}

export function saveSession(key: string) {
  cy.getAllCookies({ log: false }).then((cookies) => {
    const saved: SavedCookie[] = cookies.map(
      ({ name, value, domain, path, secure, httpOnly, expiry, sameSite }) => ({
        name,
        value,
        domain,
        path,
        secure,
        httpOnly,
        expiry,
        sameSite: sameSite === "unspecified" ? undefined : sameSite,
      }),
    );
    cy.task("accounts:saveCookies", { key, cookies: saved }, { log: false });
  });
}

export function submitPassword(
  fixture: Pick<AccountFixture, "link" | "nextPassword">,
): void {
  if (!fixture.link) throw new Error("The delivered action link is missing.");
  submitActionPassword(fixture.link, fixture.nextPassword);
}

export function rejectPassword(
  fixture: Pick<AccountFixture, "realm" | "email">,
  password: string,
): void {
  expectRejectedPassword({ email: fixture.email, password }, fixture.realm);
}

export function actionRequest(
  fixture: AccountFixture,
  destination: "tenant" | "owner",
  expectedStatus: number,
) {
  const token = new URL(fixture.link!).pathname.split("/").at(-1)!;
  const base = Cypress.env(
    destination === "tenant" ? "tenantApiUrl" : "ownerApiUrl",
  ) as string;
  const path = destination === "tenant" ? "user" : "register";
  return cy
    .request({
      method: "POST",
      url: `${base}/api/${path}/createPassword/${token}`,
      body: { password: fixture.nextPassword },
      failOnStatusCode: false,
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(expectedStatus);
    });
}

export function unchanged(key: string, before: AccountSnapshot) {
  return cy
    .task<AccountSnapshot>("accounts:snapshot", key, { log: false })
    .then((after) => {
      expect(after).to.deep.eq(before);
    });
}

export function acceptInvitation(
  fixture: Pick<
    AccountFixture,
    "realm" | "email" | "password" | "nextPassword" | "link" | "sharingId"
  >,
  kind: "GROUP" | "COUPLE",
) {
  submitPassword(fixture);
  login(fixture, fixture.nextPassword);
  profile(fixture).then(({ body }) => {
    const tenant = body as TenantProfile;
    expect(tenant.apartmentSharing.id).to.eq(fixture.sharingId);
    expect(tenant.apartmentSharing.applicationType).to.eq(kind);
    const main = tenant.apartmentSharing.tenants.find(
      (t) => t.id !== tenant.id,
    )!;
    expect(main, "original dossier member").to.exist;
  });
}

export function finishInvitation(
  fixture: AccountFixture,
  kind: "GROUP" | "COUPLE",
): void {
  acceptInvitation(fixture, kind);
  cy.task<number>("accounts:peerPermission", fixture.key, {
    log: false,
  }).should("eq", kind === "COUPLE" ? 200 : 403);
  cy.task<AccountSnapshot>("accounts:snapshot", fixture.key, {
    log: false,
  }).then((snapshot) => {
    expect(snapshot.local?.keycloakId).to.eq(fixture.keycloakId);
    expect(snapshot.identity.emailVerified).to.eq(true);
    expect(snapshot.token).to.eq(null);
  });
  actionRequest(fixture, "tenant", 404);
}

export function accessibility() {
  cy.get("main").should("be.visible");
  cy.injectAxe();
  cy.checkA11y("main", { includedImpacts: ["critical", "serious"] });
}

// Called from each privileged spec, so a selected spec, retry or interactive
// rerun is independent of all earlier scenarios and their consumed links.
export function isolatedAccounts(realm: "tenant" | "owner"): void {
  beforeEach(() => {
    visitApp(realm);
    cy.task("accounts:start", null, { log: false });
  });
  afterEach(() => {
    cy.task("accounts:cleanup", null, { log: false });
  });
}
