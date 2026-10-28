import type { DeliveredEmail, EmailKind } from "./types/mail";

export const WELCOME_SUBJECT = "Bienvenue sur DossierFacile !";
export const RESET_SUBJECT = "Réinitialiser le mot de passe";

export function waitForEmail(
  kind: EmailKind,
  email: string,
  sentAfter: number,
): Cypress.Chainable<DeliveredEmail> {
  return cy.task<DeliveredEmail>(
    "mailbox:wait",
    { kind, email, sentAfter },
    { log: false, timeout: 90_000 },
  );
}
