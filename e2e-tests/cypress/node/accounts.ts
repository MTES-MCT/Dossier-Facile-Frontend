import { TestMailbox } from "./mailbox";
import { createHash, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import type {
  AccountFixture,
  AccountSnapshot,
  OwnerProfile,
  Realm,
  SavedCookie,
  TenantProfile,
} from "../support/types/accounts";

interface Options {
  tenantUrl: string;
  ownerUrl: string;
  tenantApiUrl: string;
  ownerApiUrl: string;
  keycloakUrl: string;
  tenantClient: string;
  ownerClient: string;
}

interface Identity {
  id: string;
  email: string;
  enabled: boolean;
  emailVerified: boolean;
  requiredActions: string[];
}

type TokenRow = { id: number; token: string; expiration_date: string | null };
type LocalRow = NonNullable<AccountSnapshot["local"]>;

// Only the Node process sees administrative credentials and the database URL.
// Browser tasks accept fixture keys, never arbitrary SQL, realm names or user IDs.
export class AccountFixtures {
  private runId = "";
  private startedAt = 0;
  private accounts: Record<string, AccountFixture> = {};
  private snapshots: Record<string, AccountSnapshot> = {};
  private identities = new Map<
    string,
    { realm: Realm; id: string; email: string }
  >();
  private bindingCorrupted = false;

  constructor(
    readonly options: Options,
    private readonly mailbox: TestMailbox,
  ) {
    const environment = process.env.DF_E2E_ENVIRONMENT;
    if (environment !== "local" && environment !== "preprod") {
      throw new Error(
        "Set DF_E2E_ENVIRONMENT=local or preprod. This suite must not target production.",
      );
    }
    for (const target of this.targets()) {
      const url = new URL(target);
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      const preprod =
        url.protocol === "https:" &&
        url.hostname.endsWith("-preprod.dossierfacile.fr");
      if (!(environment === "local" ? local : preprod)) {
        throw new Error(`Account-security tests refuse target ${url.origin}`);
      }
    }
  }

  private targets() {
    const o = this.options;
    return [
      o.tenantUrl,
      o.ownerUrl,
      o.tenantApiUrl,
      o.ownerApiUrl,
      o.keycloakUrl,
    ];
  }

  account(key: string) {
    const account = this.accounts[key];
    if (!account) throw new Error(`Unknown account fixture: ${key}`);
    return account;
  }

  private sql<T>(query: string, variables: Record<string, string>): T | null {
    const databaseUrl = process.env.DF_E2E_DATABASE_URL;
    if (!databaseUrl)
      throw new Error(
        "Missing DF_E2E_DATABASE_URL. Database reads are required to verify token preservation and unbound witnesses.",
      );
    const connection = new URL(databaseUrl);
    const args = ["-XAtq", "-v", "ON_ERROR_STOP=1"];
    for (const [name, value] of Object.entries(variables))
      args.push("-v", `${name}=${value}`);
    const output = execFileSync(process.env.DF_E2E_PSQL ?? "psql", args, {
      input: query,
      encoding: "utf8",
      timeout: 15_000,
      env: {
        ...process.env,
        PGHOST: connection.hostname,
        PGPORT: connection.port || "5432",
        PGDATABASE: decodeURIComponent(connection.pathname.slice(1)),
        PGUSER: decodeURIComponent(connection.username),
        PGPASSWORD: decodeURIComponent(connection.password),
        PGCONNECT_TIMEOUT: "10",
      },
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    const rows = output.split("\n").filter(Boolean);
    if (rows.length > 1)
      throw new Error(
        "Fixture query returned more than one account; refusing an ambiguous identity.",
      );
    return output ? (JSON.parse(output) as T) : null;
  }

  private local(account: AccountFixture) {
    return this.sql<LocalRow>(
      `SELECT row_to_json(u) FROM (SELECT id,email,keycloak_id AS "keycloakId",enabled,user_type AS "userType"
      FROM user_account WHERE email=:'email' AND user_type=:'type') u;`,
      {
        email: account.email,
        type: account.realm === "tenant" ? "TENANT" : "OWNER",
      },
    );
  }

  private token(account: AccountFixture, confirmation = false) {
    return this.sql<TokenRow>(
      `SELECT row_to_json(t) FROM (SELECT p.id,p.token,${confirmation ? "NULL" : "p.expiration_date"} AS expiration_date
      FROM ${confirmation ? "confirmation_token" : "password_recovery_token"} p JOIN user_account u ON u.id=p.user_id
      WHERE u.email=:'email' AND u.user_type=:'type') t;`,
      {
        email: account.email,
        type: account.realm === "tenant" ? "TENANT" : "OWNER",
      },
    );
  }

  private async request<T>(
    url: string,
    init: RequestInit = {},
    expected: number | number[] = 200,
  ): Promise<T> {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(25_000),
    });
    if (
      !(Array.isArray(expected) ? expected : [expected]).includes(
        response.status,
      )
    ) {
      // Deliberately omit response bodies, full URLs, tokens and credentials.
      throw new Error(
        `${init.method ?? "GET"} ${new URL(url).pathname.replace(/\/[0-9a-f-]{32,}/gi, "/[redacted]")} returned ${response.status}; expected ${expected}`,
      );
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  private async adminToken() {
    const id = process.env.DF_E2E_KEYCLOAK_CLIENT_ID;
    const secret = process.env.DF_E2E_KEYCLOAK_CLIENT_SECRET;
    if (!id || !secret)
      throw new Error(
        "Missing DF_E2E_KEYCLOAK_CLIENT_ID / DF_E2E_KEYCLOAK_CLIENT_SECRET for the non-production fixture service account.",
      );
    const result = await this.request<{ access_token: string }>(
      `${this.options.keycloakUrl}/realms/master/protocol/openid-connect/token`,
      {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: id,
          client_secret: secret,
        }),
      },
    );
    return result.access_token;
  }

  private realm(realm: Realm) {
    return realm === "tenant" ? "dossier-facile" : "dossier-facile-owner";
  }

  private async keycloak<T>(
    realm: Realm,
    path: string,
    method = "GET",
    body?: unknown,
    expected: number | number[] = 200,
  ) {
    return this.request<T>(
      `${this.options.keycloakUrl}/admin/realms/${this.realm(realm)}/${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${await this.adminToken()}`,
          "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      expected,
    );
  }

  private actor(key: string, realm: Realm, email?: string): AccountFixture {
    if (!this.runId)
      throw new Error(
        "Start an isolated fixture scope before creating accounts.",
      );
    if (this.accounts[key]) return this.accounts[key];
    const namespace = this.mailbox.options.namespace;
    const tag = `dfe2e-${this.runId}-${key}`;
    const account: AccountFixture = {
      key,
      realm,
      email:
        email ??
        (namespace
          ? `${namespace}.${tag}@inbox.testmail.app`
          : `${tag}@example.test`),
      password: `Df!7${randomBytes(15).toString("base64url")}`,
      nextPassword: `Df!9${randomBytes(15).toString("base64url")}`,
      keycloakId: "",
    };
    this.accounts[key] = account;
    return account;
  }

  private async createIdentity(
    account: AccountFixture,
    credentials = true,
    verified = true,
  ) {
    await this.keycloak(
      account.realm,
      "users",
      "POST",
      {
        username: account.email,
        email: account.email,
        firstName: "Alice",
        lastName: "DEPLOIEMENT",
        enabled: true,
        emailVerified: verified,
        requiredActions: [],
        credentials: credentials
          ? [{ type: "password", value: account.password, temporary: false }]
          : [],
      },
      201,
    );
    const users = await this.keycloak<Identity[]>(
      account.realm,
      `users?${new URLSearchParams({ email: account.email, exact: "true" })}`,
    );
    if (
      users.length !== 1 ||
      users[0].email.toLowerCase() !== account.email.toLowerCase()
    )
      throw new Error(
        "Fixture identity creation did not resolve exactly one full-email match.",
      );
    account.keycloakId = users[0].id;
    this.trackIdentity(account);
  }

  // Use the same Authorization Code + PKCE clients as the apps. A direct-grant
  // override in the local tenant client is a broker flow, so password grants
  // would hide working browser logins behind an unrelated fixture failure.
  private async login(account: AccountFixture) {
    const client =
      account.realm === "tenant"
        ? this.options.tenantClient
        : this.options.ownerClient;
    const redirect =
      account.realm === "tenant"
        ? `${this.options.tenantUrl}/account`
        : `${this.options.ownerUrl}/home`;
    const verifier = randomBytes(32).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const endpoint = `${this.options.keycloakUrl}/realms/${this.realm(account.realm)}/protocol/openid-connect`;
    const auth = await fetch(
      `${endpoint}/auth?${new URLSearchParams({ client_id: client, redirect_uri: redirect, response_type: "code", scope: "openid", code_challenge: challenge, code_challenge_method: "S256" })}`,
      { redirect: "manual", signal: AbortSignal.timeout(25_000) },
    );
    const html = await auth.text();
    const action = html
      .match(/<form\b[^>]*\bid="kc-form-login"[^>]*\baction="([^"]+)"/)?.[1]
      ?.replaceAll("&amp;", "&");
    if (
      !action ||
      new URL(action).origin !== new URL(this.options.keycloakUrl).origin
    )
      throw new Error(
        "Expected a local/approved Keycloak login form for the fixture.",
      );
    const cookies = auth.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");
    const result = await fetch(action, {
      method: "POST",
      redirect: "manual",
      headers: {
        Cookie: cookies,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: account.email,
        password: account.password,
        credentialId: "",
      }),
      signal: AbortSignal.timeout(25_000),
    });
    const location = result.headers.get("location");
    const code = location ? new URL(location).searchParams.get("code") : null;
    if (!code || !location?.startsWith(redirect))
      throw new Error(
        `Fixture ${account.key} did not complete normal OAuth login; check its required actions and realm setup.`,
      );
    const token = await this.request<{ access_token: string }>(
      `${endpoint}/token`,
      {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: client,
          redirect_uri: redirect,
          code,
          code_verifier: verifier,
        }),
      },
    );
    return token.access_token;
  }

  private async api<T>(account: AccountFixture, path: string, body?: unknown) {
    const base =
      account.realm === "tenant"
        ? this.options.tenantApiUrl
        : this.options.ownerApiUrl;
    return this.request<T>(`${base}/api/${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${await this.login(account)}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  private async tenant(key: string) {
    const account = this.actor(key, "tenant");
    await this.createIdentity(account);
    const profile = await this.api<TenantProfile>(account, "tenant/profile");
    account.localId = profile.id;
    account.sharingId = profile.apartmentSharing.id;
    await this.api(account, "register/names", {
      tenantId: profile.id,
      firstName: "Alice",
      lastName: "DEPLOIEMENT",
      ownerType: "SELF",
    });
    return account;
  }

  private async owner(key: string) {
    const account = this.actor(key, "owner");
    await this.createIdentity(account);
    const profile = await this.api<OwnerProfile>(account, "owner/profile");
    account.localId = this.local(account)!.id;
    await this.api(account, "owner/names", {
      firstName: "Alice",
      lastName: "DEPLOIEMENT",
    });
    return account;
  }

  async invitation(
    key: string,
    type: "GROUP" | "COUPLE",
    options: { email?: string; preexisting?: boolean } = {},
  ) {
    const main = await this.tenant(`${key}-main`);
    const guest = this.actor(key, "tenant", options.email);
    if (options.preexisting) await this.createIdentity(guest, false, false);
    const originalIdentity = guest.keycloakId;
    await this.api<TenantProfile>(main, "register/application/v2", {
      applicationType: type,
      acceptAccess: true,
      coTenants: [
        { firstName: "Invite", lastName: "DEPLOIEMENT", email: guest.email },
      ],
    });
    const local = this.local(guest);
    if (!local?.keycloakId)
      throw new Error("Invitation did not bind an exact identity.");
    if (originalIdentity && local.keycloakId !== originalIdentity)
      throw new Error(
        "Invitation did not reuse the exact pre-existing identity.",
      );
    guest.keycloakId = local.keycloakId;
    this.trackIdentity(guest);
    guest.localId = local.id;
    guest.sharingId = main.sharingId;
    guest.link = await this.mailLink(
      guest,
      type === "GROUP" ? "ajout-groupe" : "ajout-couple",
    );
    return guest;
  }

  async mailLink(account: AccountFixture, route: string) {
    const row = this.token(account, route === "confirmerCompte");
    if (!row) throw new Error(`No ${route} token for fixture ${account.key}`);
    const base =
      account.realm === "tenant"
        ? this.options.tenantUrl
        : this.options.ownerUrl;
    const expected = `${base}/${route}/${row.token}`;
    const kind =
      route === "confirmerCompte"
        ? "owner-confirmation"
        : route === "modifier-mot-de-passe"
          ? "owner-recovery"
          : route === "ajout-groupe"
            ? "group-invitation"
            : route === "ajout-couple"
              ? "couple-invitation"
              : null;
    if (!kind) throw new Error("Unsupported account action route.");
    const delivered = await this.mailbox.wait({
      email: account.email,
      kind,
      sentAfter: this.startedAt,
      expectedLink: expected,
    });
    return delivered.link;
  }

  async reset(key: string) {
    const account = this.account(key);
    await this.request(
      `${this.options.ownerApiUrl}/api/register/forgotPassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email }),
      },
    );
    account.link = await this.mailLink(account, "modifier-mot-de-passe");
    return account;
  }

  async snapshot(key: string): Promise<AccountSnapshot> {
    const account = this.account(key);
    const identity = await this.keycloak<Identity>(
      account.realm,
      `users/${encodeURIComponent(account.keycloakId)}`,
    );
    const credentials = await this.keycloak<
      Array<{ id: string; type: string; createdDate?: number }>
    >(
      account.realm,
      `users/${encodeURIComponent(account.keycloakId)}/credentials`,
    );
    const token = this.token(account);
    return {
      identity: {
        id: identity.id,
        email: identity.email,
        enabled: identity.enabled,
        emailVerified: identity.emailVerified,
        requiredActions: [...identity.requiredActions].sort(),
        credentials: credentials
          .map(({ id, type, createdDate }) => ({ id, type, createdDate }))
          .sort((a, b) => a.id.localeCompare(b.id)),
      },
      local: this.local(account),
      token: token
        ? {
            id: token.id,
            digest: createHash("sha256").update(token.token).digest("hex"),
            expiration: token.expiration_date,
          }
        : null,
    };
  }

  async remember(key: string) {
    this.snapshots[key] = await this.snapshot(key);
    return null;
  }

  savedSnapshot(key: string) {
    return this.snapshots[key];
  }

  saveCookies(key: string, cookies: SavedCookie[]) {
    this.account(key).cookies = cookies;
    return null;
  }

  // Each test/retry/interactive rerun starts its own scope. Nothing is loaded
  // from a previous process, even if old deployment environment variables remain.
  async start() {
    await this.cleanup();
    this.runId = randomBytes(8).toString("hex");
    this.startedAt = Date.now();
    this.accounts = {};
    this.snapshots = {};
    return null;
  }

  private trackIdentity(account: AccountFixture) {
    this.identities.set(`${account.realm}:${account.keycloakId}`, {
      realm: account.realm,
      id: account.keycloakId,
      email: account.email,
    });
  }

  // Cleanup runs only after assertions. Resetting the passwords of these exact
  // fixture IDs lets it work even when a test failed midway through activation.
  async cleanup() {
    if (this.bindingCorrupted) this.restoreBinding();
    const errors: string[] = [];
    const accounts = Object.values(this.accounts).sort(
      (a, b) => Number(b.realm === "owner") - Number(a.realm === "owner"),
    );
    for (const account of accounts) {
      try {
        const local = this.local(account);
        if (!local) continue;
        if (
          !account.keycloakId ||
          local.keycloakId !== account.keycloakId ||
          (account.localId && local.id !== account.localId)
        )
          throw new Error("Unexpected fixture binding during cleanup.");
        const identity = await this.keycloak<Identity>(
          account.realm,
          `users/${account.keycloakId}`,
        );
        if (identity.email !== account.email)
          throw new Error("Unexpected fixture identity during cleanup.");
        const password = `Df!Cleanup${randomBytes(15).toString("base64url")}`;
        await this.keycloak(
          account.realm,
          `users/${account.keycloakId}`,
          "PUT",
          {
            enabled: true,
            emailVerified: true,
            requiredActions: [],
          },
          204,
        );
        await this.keycloak(
          account.realm,
          `users/${account.keycloakId}/reset-password`,
          "PUT",
          {
            type: "password",
            value: password,
            temporary: false,
          },
          204,
        );
        const base =
          account.realm === "tenant"
            ? this.options.tenantApiUrl
            : this.options.ownerApiUrl;
        const path = account.realm === "tenant" ? "user" : "owner";
        await this.request(`${base}/api/${path}/deleteAccount`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${await this.login({ ...account, password })}`,
          },
        });
        if (this.local(account))
          throw new Error("Fixture account remains after deletion.");
      } catch {
        errors.push(account.key);
      }
    }
    // Includes witnesses that never logged in and orphan identities from the
    // historical no-email fixture. Never search by substring for cleanup.
    if (!errors.length) {
      for (const [key, identity] of this.identities) {
        try {
          const current = await this.keycloak<Identity | null>(
            identity.realm,
            `users/${identity.id}`,
            "GET",
            undefined,
            [200, 404],
          );
          if (current && current.id) {
            if (current.email !== identity.email)
              throw new Error("Unexpected cleanup identity.");
            await this.keycloak(
              identity.realm,
              `users/${identity.id}`,
              "DELETE",
              undefined,
              [204, 404],
            );
          }
          this.identities.delete(key);
        } catch {
          errors.push(key);
        }
      }
    }
    if (errors.length)
      throw new Error(
        `Fixture cleanup failed for ${errors.length} account(s). Check the test APIs and fixture permissions.`,
      );
    this.accounts = {};
    this.snapshots = {};
    return null;
  }

  async fresh(
    kind:
      | "active-tenant"
      | "active-owner"
      | "first-login"
      | "existing-couple"
      | "late-email"
      | "security-owner"
      | "security-group"
      | "substring"
      | "invalid-binding",
  ) {
    if (kind === "active-tenant") return this.tenant(kind);
    if (kind === "active-owner") {
      const tenant = await this.tenant("property-applicant");
      const owner = await this.owner(kind);
      owner.property = await this.api(owner, "property", {
        name: `E2E ${this.runId}`,
        type: "APARTMENT",
        furniture: "UNFURNISHED",
        address: "42 rue du Test",
        livingSpace: 30,
        rentCost: 600,
        chargesCost: 50,
        validated: true,
        dpeNotRequired: true,
      });
      await this.request(
        `${this.options.ownerApiUrl}/api/property/public/subscribe/${owner.property!.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access: true,
            kcToken: await this.login(tenant),
          }),
        },
      );
      return owner;
    }
    if (kind === "first-login") {
      const account = this.actor(kind, "tenant");
      await this.createIdentity(account);
      if (this.local(account))
        throw new Error(
          "The first-login fixture already has an application account.",
        );
      return account;
    }
    if (kind === "existing-couple")
      return this.invitation(kind, "COUPLE", { preexisting: true });
    if (kind === "late-email") {
      const guest = await this.invitation(kind, "COUPLE");
      // Reproduce the supported historical state on this newly created row.
      // Keep the old identity in the cleanup registry when it is unbound.
      const historical = this.sql<{ id: number }>(
        `BEGIN;
        DELETE FROM password_recovery_token WHERE user_id=:'id'::bigint;
        UPDATE user_account SET email=NULL,keycloak_id=NULL WHERE id=:'id'::bigint AND email=:'email';
        SELECT row_to_json(u) FROM (SELECT id FROM user_account WHERE id=:'id'::bigint AND email IS NULL AND keycloak_id IS NULL) u;
        COMMIT;`,
        { id: String(guest.localId), email: guest.email },
      );
      if (historical?.id !== guest.localId)
        throw new Error("The historical fixture was not prepared correctly.");
      guest.keycloakId = "";
      guest.link = undefined;
      return guest;
    }
    if (kind === "security-owner") {
      await this.owner(kind);
      return this.reset(kind);
    }
    if (kind === "security-group") return this.invitation(kind, "GROUP");
    if (kind === "invalid-binding") {
      const guest = await this.invitation(kind, "GROUP");
      const witness = this.actor("binding-witness", "tenant");
      await this.createIdentity(witness, false, false);
      await this.remember(witness.key);
      const changed = this.sql<{ id: number }>(
        `UPDATE user_account SET keycloak_id=:'wrong'
        WHERE id=:'id'::bigint AND email=:'email' AND keycloak_id=:'original'
        RETURNING json_build_object('id',id);`,
        {
          id: String(guest.localId),
          email: guest.email,
          original: guest.keycloakId,
          wrong: witness.keycloakId,
        },
      );
      if (!changed)
        throw new Error(
          "The new fixture's binding was not changed; refusing to touch another account.",
        );
      this.bindingCorrupted = true;
      await this.remember(guest.key);
      return guest;
    }
    const email = this.actor("substring", "tenant").email;
    for (const prefix of ["b", "a"]) {
      const witness = this.actor(
        `witness-${prefix}`,
        "tenant",
        `${prefix}${email}`,
      );
      await this.createIdentity(witness, false, false);
      await this.remember(witness.key);
      if (this.local(witness))
        throw new Error(
          "Substring witnesses must never have logged in to the application.",
        );
    }
    return this.invitation("substring", "GROUP", { email });
  }

  async refresh(key: string, route?: string) {
    const account = this.account(key);
    const local = this.local(account);
    if (local) {
      account.localId = local.id;
      account.keycloakId = local.keycloakId!;
      this.trackIdentity(account);
    }
    if (route) account.link = await this.mailLink(account, route);
    return account;
  }

  async identitiesForEmail(key: string, realm: Realm) {
    return this.keycloak<Identity[]>(
      realm,
      `users?${new URLSearchParams({ email: this.account(key).email, exact: "true" })}`,
    );
  }

  async peerPermission(key: string) {
    const guest = this.account(key);
    const main = this.account(`${key}-main`);
    const token = await this.login({ ...guest, password: guest.nextPassword });
    const response = await fetch(
      `${this.options.tenantApiUrl}/api/message?tenantId=${main.localId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(15_000),
      },
    );
    await response.arrayBuffer();
    return response.status;
  }

  restoreBinding() {
    const guest = this.account("invalid-binding");
    const witness = this.account("binding-witness");
    const restored = this.sql<{ id: number }>(
      `UPDATE user_account SET keycloak_id=:'original'
      WHERE id=:'id'::bigint AND email=:'email' AND keycloak_id=:'wrong'
      RETURNING json_build_object('id',id);`,
      {
        id: String(guest.localId),
        email: guest.email,
        original: guest.keycloakId,
        wrong: witness.keycloakId,
      },
    );
    if (!restored)
      throw new Error("Fixture binding no longer has the expected value.");
    this.bindingCorrupted = false;
    return null;
  }

  tasks() {
    return {
      "accounts:start": () => this.start(),
      "accounts:cleanup": () => this.cleanup(),
      "accounts:get": (key: string) => this.account(key),
      "accounts:fresh": (kind: Parameters<AccountFixtures["fresh"]>[0]) =>
        this.fresh(kind),
      "accounts:refresh": ({ key, route }: { key: string; route?: string }) =>
        this.refresh(key, route),
      "accounts:snapshot": (key: string) => this.snapshot(key),
      "accounts:remember": (key: string) => this.remember(key),
      "accounts:savedSnapshot": (key: string) => this.savedSnapshot(key),
      "accounts:saveCookies": ({
        key,
        cookies,
      }: {
        key: string;
        cookies: SavedCookie[];
      }) => this.saveCookies(key, cookies),
      "accounts:identities": ({ key, realm }: { key: string; realm: Realm }) =>
        this.identitiesForEmail(key, realm),
      "accounts:peerPermission": (key: string) => this.peerPermission(key),
      "accounts:restoreBinding": () => this.restoreBinding(),
    };
  }
}
