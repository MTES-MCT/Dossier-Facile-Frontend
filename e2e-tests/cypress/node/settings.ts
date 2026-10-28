import { readFileSync } from "node:fs";
import { TestMailbox } from "./mailbox";
import type { EmailQuery } from "../support/types/mail";
import { log } from "../support/accessibility";
import { forceFrenchLocale } from "../support/browserLocale";

export interface TestTargets {
  tenantUrl: string;
  ownerUrl: string;
  tenantApiUrl: string;
  ownerApiUrl: string;
  keycloakUrl: string;
}

export function loadPrivateSettings(): void {
  if (!process.env.DF_E2E_SETTINGS_FILE) return;
  const settings: unknown = JSON.parse(
    readFileSync(process.env.DF_E2E_SETTINGS_FILE, "utf8"),
  );
  if (!settings || typeof settings !== "object" || Array.isArray(settings))
    throw new Error("Private settings must be a JSON object.");
  for (const [key, value] of Object.entries(settings)) {
    if (!key.startsWith("DF_E2E_") || typeof value !== "string")
      throw new Error(
        "Private settings must contain only DF_E2E_ string values.",
      );
    process.env[key] ??= value;
  }
}

export function targets(preprod = false): TestTargets {
  return {
    tenantUrl:
      process.env.DF_E2E_TENANT_URL ??
      (preprod
        ? "https://locataire-preprod.dossierfacile.fr"
        : "http://localhost:9002"),
    ownerUrl:
      process.env.DF_E2E_OWNER_URL ??
      (preprod
        ? "https://proprietaire-preprod.dossierfacile.fr"
        : "http://localhost:3000"),
    tenantApiUrl:
      process.env.DF_E2E_TENANT_API_URL ??
      (preprod
        ? "https://api-preprod.dossierfacile.fr"
        : "http://localhost:8090"),
    ownerApiUrl:
      process.env.DF_E2E_OWNER_API_URL ??
      (preprod
        ? "https://api-owner-preprod.dossierfacile.fr"
        : "http://localhost:8083"),
    keycloakUrl:
      process.env.DF_E2E_KEYCLOAK_URL ??
      (preprod
        ? "https://sso-preprod.dossierfacile.fr/auth"
        : "http://localhost:8085/auth"),
  };
}

export function resolvedTargets(env: Record<string, unknown>): TestTargets {
  function urlSetting(key: keyof TestTargets): string {
    const value = env[key];
    if (typeof value !== "string")
      throw new Error(`Missing URL setting: ${key}`);
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error(`Invalid URL setting: ${key}`);
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error(
        `${key} must be an HTTP(S) URL without credentials, query or fragment.`,
      );
    return url.href.replace(/\/+$/, "");
  }
  return {
    tenantUrl: urlSetting("tenantUrl"),
    ownerUrl: urlSetting("ownerUrl"),
    tenantApiUrl: urlSetting("tenantApiUrl"),
    ownerApiUrl: urlSetting("ownerApiUrl"),
    keycloakUrl: urlSetting("keycloakUrl"),
  };
}

function stringSetting(...values: unknown[]): string | undefined {
  return values.find(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

export function installSupportTasks(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): TestMailbox {
  // Cypress has merged config files, CYPRESS_* and --env at this point.
  // The browser, mailbox and privileged fixtures must use these same values.
  const target = resolvedTargets(config.env);
  Object.assign(config.env, target);
  const namespace = stringSetting(
    config.env.TESTMAIL_NAMESPACE,
    process.env.DF_E2E_TESTMAIL_NAMESPACE,
  );
  if (namespace) config.env.TESTMAIL_NAMESPACE = namespace;
  on("before:browser:launch", (browser, options) => {
    forceFrenchLocale(browser, options);
    return options;
  });
  const mailbox = new TestMailbox({
    ...target,
    namespace,
    apiKey: stringSetting(
      process.env.DF_E2E_TESTMAIL_API_KEY,
      config.env.TESTMAIL_API_KEY,
    ),
    applicationCapture: process.env.DF_E2E_MAIL_CAPTURE_FILE,
    keycloakCapture: process.env.DF_E2E_KEYCLOAK_MAIL_CAPTURE_FILE,
  });
  delete config.env.TESTMAIL_API_KEY;
  on("task", {
    ...log(),
    "mailbox:wait": (query: EmailQuery) => mailbox.wait(query),
  });
  return mailbox;
}
