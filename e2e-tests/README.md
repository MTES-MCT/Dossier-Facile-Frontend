## How to run tests

Use Node 22 and pnpm. Run the commands below from the repository root.

Install dependencies, including after switching branches:

```sh
pnpm install --frozen-lockfile
pnpm --filter e2e-tests exec cypress install
```

### Local services

The default `cypress.config.ts` targets these local services:

| Service | URL |
| --- | --- |
| Main site (`www`) | http://localhost:9001 |
| Tenant frontend (`tenantv3`) | http://localhost:9002 |
| Owner frontend (`owner`) | http://localhost:3000 |
| Back office | http://localhost:8081 |

Start the relevant frontend packages, their backend APIs, local Keycloak,
PostgreSQL, Redis and RabbitMQ. Document-upload scenarios also need the PDF
generator. Frontend environment variables must point to these local services;
URL variables must include `http://` or `https://`.

The back office must run with its testing API enabled (for example, the `dev`
profile). Its `testing.api.allowed-email-pattern` must allow the test addresses
`local.*@inbox.testmail.app`, and `testing.api.operator-email` must be configured.
The Keycloak administrative service account needs permission to create and
delete users in the local tenant realm. The owner scenarios also need this
permission in the local owner realm so account cleanup can delete its test users.

Run a small scenario first:

```sh
pnpm --filter e2e-tests test --spec cypress/e2e/tenant/password.cy.ts
```

Run the suite, excluding the email signup tests that require Testmail:

```sh
pnpm --filter e2e-tests test --config 'excludeSpecPattern=**/signup.cy.ts'
```

To watch the suite in a browser and save failure screenshots, use command-line
overrides:

```sh
pnpm --filter e2e-tests test --headed --config 'excludeSpecPattern=**/signup.cy.ts,screenshotOnRunFailure=true'
```

Open the interactive runner:

```sh
pnpm --filter e2e-tests cy:open
```

If the back office uses another port, append
`--env boUrl=http://localhost:18081` to any of these commands.

The owner and FranceConnect scenarios require a configured FranceConnect test
provider and its fixture accounts. The partner scenario skips itself unless
`dfConnectDemoUrl` is configured.
The owner property-creation scenario requires a certified FranceConnect identity
and a working ADEME lookup service. It keeps the original DPE lookup assertion.

The `alone` and `declined` scenarios support both verification flows. When
`tenant_completed_optin` makes a dossier eligible, they request verification;
otherwise they check that submission queued the dossier directly.

The tax, payslip and Visale analysis scenarios use the real analysis and
explanation endpoints. They require a working document-analysis service that
returns the expected classification errors for the test files. Integration
errors remain test failures.
The residency navigation scenarios handle both enabled and disabled analysis;
they do not require an analysis verdict when no analysis is scheduled.

### Preproduction

This runs against the remote preproduction services:

```sh
pnpm --filter e2e-tests test --config-file cypress-preprod.config.ts
```

### Testmail API key

Most tenant tests provision their account server-side through the backoffice
testing API (`POST /api/testing/users`), without touching the mailbox. Only
`signup.cy.ts` still reads the inbox through [testmail.app](https://testmail.app),
as it covers the real registration flow: welcome email, confirmation link, and
password reset. Put the key in `cypress.env.json`, which is git-ignored:

```json
{
  "TESTMAIL_API_KEY": "<key>"
}
```

The key is stored as the `CYPRESS_TESTMAIL_API_KEY` secret of the E2E workflow.
For a local signup run, also configure your Testmail namespace, `testmailTag`
and `testmailEndpoint`, and make sure local Keycloak can deliver the emails.
