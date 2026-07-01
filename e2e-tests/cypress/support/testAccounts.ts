export const E2E_PASSWORD = "abcdef12345!";

export interface TestAccount {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

// Builds a testmail.app address so any email sent to the account stays
// readable and matches the backend testing API allowlist
export function testEmail(tag: string): string {
  const namespace = Cypress.env("TESTMAIL_NAMESPACE");
  if (!namespace) {
    throw new Error("Missing TESTMAIL_NAMESPACE environment variable");
  }
  return `${namespace}.${tag}@inbox.testmail.app`;
}

export function testAccount(
  tag: string,
  firstname = "Jean",
  lastname = "DUPONT",
): TestAccount {
  return {
    email: testEmail(tag),
    password: E2E_PASSWORD,
    firstname,
    lastname,
  };
}
