# End-to-end tests

Use Node 22 and pnpm. Run commands from the repository root.

## Run tests

```sh
pnpm install --frozen-lockfile
pnpm --filter e2e-tests exec cypress install
pnpm --filter e2e-tests typecheck

# Functional journeys: tenant, owner and accessibility
pnpm --filter e2e-tests test

# Security and existing-account regressions: additional setup below
pnpm --filter e2e-tests test:regressions
# Run either group separately
pnpm --filter e2e-tests test:security
pnpm --filter e2e-tests test:accounts

# One functional spec
pnpm --filter e2e-tests test --spec cypress/e2e/tenant/account/password-errors.cy.ts
# Interactive functional runner
pnpm --filter e2e-tests cy:open
# Functional suite on preproduction, excluding accessibility
pnpm --filter e2e-tests test --config-file cypress-preprod.config.ts
```

The daily CI workflow typechecks the package and runs the preproduction functional
suite. It does not run the privileged regression suite.

## Services and settings

Start the frontends, APIs, Keycloak, PostgreSQL, Redis and RabbitMQ needed by the
selected tests. Uploads also need the PDF generator. FranceConnect, ADEME and
document-analysis scenarios require their respective services.

| Service | Default local URL |
| --- | --- |
| Main site | http://localhost:9001 |
| Tenant frontend / API | http://localhost:9002 / http://localhost:8090 |
| Owner frontend / API | http://localhost:3000 / http://localhost:8083 |
| Keycloak | http://localhost:8085/auth |
| Back office | http://localhost:8081 |

Functional account fixtures use the back-office testing API. Enable it, configure
`testing.api.allowed-email-pattern` for the test mailbox and set
`testing.api.operator-email`. Its Keycloak client must manage test users.
Override the back-office URL with `--env boUrl=http://localhost:18081`.

For email delivery, set `CYPRESS_TESTMAIL_NAMESPACE` and `CYPRESS_TESTMAIL_API_KEY`,
or use the private settings file below. Local `cypress.env.json` also accepts
`TESTMAIL_NAMESPACE` and `TESTMAIL_API_KEY`. The email reader runs in Node and
removes the API key from the configuration exposed to the browser.

### Additional setup for security and account regressions

These tests need `psql`, access to a test database, and a Keycloak service account
in the `master` realm. The service account must create, read, update and delete
test users and read credential metadata in `dossier-facile` and
`dossier-facile-owner`. Database access includes updates to newly created test
rows for historical-account scenarios.

Create an ignored file such as `e2e-tests/.account-security/settings.local.json`:

```json
{
  "DF_E2E_ENVIRONMENT": "local",
  "DF_E2E_DATABASE_URL": "postgresql://test_user:URL_ENCODED_PASSWORD@localhost:5434/test_database",
  "DF_E2E_KEYCLOAK_CLIENT_ID": "fixture-service-account",
  "DF_E2E_KEYCLOAK_CLIENT_SECRET": "TEST_SECRET",
  "DF_E2E_TESTMAIL_NAMESPACE": "YOUR_NAMESPACE",
  "DF_E2E_TESTMAIL_API_KEY": "YOUR_TESTMAIL_KEY"
}
```

Load it before running the tests:

```sh
export DF_E2E_SETTINGS_FILE="$PWD/e2e-tests/.account-security/settings.local.json"
```

Keep this file and mail captures out of Git. The file accepts `DF_E2E_` string
settings; environment variables take precedence over its values.

- Endpoint overrides: `DF_E2E_TENANT_URL`, `DF_E2E_OWNER_URL`,
  `DF_E2E_TENANT_API_URL`, `DF_E2E_OWNER_API_URL`, `DF_E2E_KEYCLOAK_URL`.
- Client overrides: `DF_E2E_TENANT_CLIENT` and `DF_E2E_OWNER_CLIENT` must match
  the applications' public OIDC clients. `DF_E2E_PSQL` sets the `psql` executable.
- For preproduction regressions, set `DF_E2E_ENVIRONMENT=preprod`, the matching
  database credentials and OIDC clients. Endpoints must use HTTPS hosts ending
  in `-preprod.dossierfacile.fr`. Production targets are rejected.

Cypress URL and namespace overrides from `--env` or `CYPRESS_*` take precedence
over defaults and are shared by browser tests and Node helpers.

For local email capture instead of Testmail, use `DF_E2E_MAIL_CAPTURE_FILE` for
Brevo JSONL requests containing `to[].email` and `params.tokenUrl` or
`params.confirmToken`. Use `DF_E2E_KEYCLOAK_MAIL_CAPTURE_FILE` for SMTP JSONL
containing recipient strings in `to`, the actual `subject` and decoded `html`.
Tenant signup requires Keycloak registration and email verification to be enabled.

## Organization and reruns

| Folder under `cypress/` | Contents |
| --- | --- |
| `e2e/tenant/` | Account, dossier, document and sharing journeys |
| `e2e/owner/` | Registration, recovery, properties and invalid links |
| `e2e/accessibility/` | Axe checks |
| `e2e/security/` | Token isolation between realms, substring identities and incorrect account bindings |
| `e2e/accounts/` | Existing sessions, first login, existing identities and historical accounts |
| `support/` | Shared browser actions and types |
| `node/` | Email, database and Keycloak helpers; fixture cleanup |
| `fixtures/` | Uploaded images and PDFs |

Rerun the same commands without changing an identifier or preparing links.
Each privileged test creates fresh accounts and cleans them up after its
assertions, including failures. Cleanup uses exact account IDs and reports
errors. A forced stop can leave fixtures behind, but they do not block the next run.
Functional tests reset their accounts or use fresh email addresses. Run `signup`,
`alone` and `residency` as whole specs because their steps share state.

The suites test the running version. They do not wait for a deployment or verify
a version change while a browser remains open.

## Known limits

- Tenant signup currently exposes a Keycloak theme bug: `handleSubmit()` reads
  a missing password field in `theme/df/login/register.ftl`.
- The partner-sharing spec is skipped while the DFConnect demo is unavailable.
- The SSO setup uses `chromeWebSecurity: false`; these tests do not check browser
  CORS enforcement. Application errors still fail tests.
