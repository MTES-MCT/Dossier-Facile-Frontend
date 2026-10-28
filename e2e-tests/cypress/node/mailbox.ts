import { existsSync, readFileSync } from "node:fs";
import type {
  DeliveredEmail,
  EmailKind,
  EmailQuery,
} from "../support/types/mail";

interface MailboxOptions {
  tenantUrl: string;
  ownerUrl: string;
  keycloakUrl: string;
  namespace?: string;
  apiKey?: string;
  applicationCapture?: string;
  keycloakCapture?: string;
}

interface MailMessage {
  to?: Array<string | { email: string }>;
  subject?: string;
  html?: string;
  text?: string;
  params?: { tokenUrl?: string; confirmToken?: string };
}

// One transport for functional and privileged regression tests. Secrets and
// complete mail captures stay in Node; only the selected email reaches Cypress.
export class TestMailbox {
  constructor(readonly options: MailboxOptions) {}

  private action(kind: EmailKind): { prefix: string; subject?: string } {
    const o = this.options;
    switch (kind) {
      case "tenant-signup":
        return {
          prefix: `${o.keycloakUrl}/realms/dossier-facile/login-actions/action-token?`,
          subject: "Bienvenue sur DossierFacile !",
        };
      case "tenant-recovery":
        return {
          prefix: `${o.keycloakUrl}/realms/dossier-facile/login-actions/action-token?`,
          subject: "Réinitialiser le mot de passe",
        };
      case "group-invitation":
        return { prefix: `${o.tenantUrl}/ajout-groupe/` };
      case "couple-invitation":
        return { prefix: `${o.tenantUrl}/ajout-couple/` };
      case "owner-confirmation":
        return { prefix: `${o.ownerUrl}/confirmerCompte/` };
      case "owner-recovery":
        return { prefix: `${o.ownerUrl}/modifier-mot-de-passe/` };
      default:
        throw new Error("Unsupported account email kind.");
    }
  }

  private async messages(query: EmailQuery): Promise<MailMessage[]> {
    const keycloak = query.kind.startsWith("tenant-");
    const capture = keycloak
      ? this.options.keycloakCapture
      : this.options.applicationCapture;
    if (capture) {
      if (!existsSync(capture)) return [];
      return readFileSync(capture, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as MailMessage)
        .filter((mail) =>
          mail.to?.some(
            (to) => (typeof to === "string" ? to : to.email) === query.email,
          ),
        )
        .reverse();
    }
    const { namespace, apiKey } = this.options;
    if (!namespace || !apiKey)
      throw new Error(
        "Email delivery tests require a local mail capture or a Testmail namespace and API key.",
      );
    const prefix = `${namespace}.`;
    if (
      !query.email.startsWith(prefix) ||
      !query.email.endsWith("@inbox.testmail.app")
    )
      throw new Error(
        "The requested mailbox is outside the configured Testmail namespace.",
      );
    const tag = query.email.slice(prefix.length).split("@")[0];
    const search = new URLSearchParams({
      apikey: apiKey,
      namespace,
      tag,
      timestamp_from: String(query.sentAfter),
    });
    const response = await fetch(
      `https://api.testmail.app/api/json?${search}`,
      { signal: AbortSignal.timeout(15_000) },
    );
    if (!response.ok) throw new Error(`Testmail returned ${response.status}`);
    const inbox = (await response.json()) as {
      result?: string;
      emails?: MailMessage[];
    };
    if (inbox.result && inbox.result !== "success")
      throw new Error("Testmail did not accept the mailbox query.");
    return inbox.emails ?? [];
  }

  async wait(query: EmailQuery): Promise<DeliveredEmail> {
    const { prefix, subject } = this.action(query.kind);
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      for (const mail of await this.messages(query)) {
        if (subject && mail.subject !== subject) continue;
        const html = mail.html ?? "";
        const links = [...html.matchAll(/href=["']([^"']+)["']/g)].map(
          (match) => match[1].replaceAll("&amp;", "&"),
        );
        for (const match of (mail.text ?? "").matchAll(
          /https?:\/\/[^\s<>"']+/g,
        )) {
          links.push(match[0].replace(/[.,;)]$/, ""));
        }
        if (mail.params?.tokenUrl) links.push(mail.params.tokenUrl);
        if (
          [
            "owner-confirmation",
            "group-invitation",
            "couple-invitation",
          ].includes(query.kind) &&
          mail.params?.confirmToken
        )
          links.push(`${prefix}${mail.params.confirmToken}`);
        const link = links.find(
          (candidate) =>
            candidate.startsWith(prefix) &&
            (!query.expectedLink || candidate === query.expectedLink),
        );
        if (link) return { subject: mail.subject ?? "", html, link };
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(
      `No delivered ${query.kind} email matched the test account and action link.`,
    );
  }
}
