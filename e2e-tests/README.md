# Tests

Four suites, from the lightest to the heaviest:

| Suite | Command | What it checks | What it needs |
| --- | --- | --- | --- |
| Unit | `pnpm test:unit` | Functions and components in isolation, in every package | Nothing |
| Component | `pnpm test:component` | The tax error block, mounted alone in a browser | Nothing |
| End-to-end | `pnpm test:e2e` | Full user journeys in the applications | The local stack |
| Document IA integration | `pnpm test:integration` | Real upload and real document analysis | The local stack and Document IA |

The last three use Cypress. Add `:open` to their command (`pnpm test:e2e:open`)
to open the Cypress window, where you pick a test and watch it run.

## Strategy

Each suite checks what the cheaper ones cannot:

- **Unit tests own the logic and the wording.** Every sentence shown to the user
  is asserted here, and only here.
- **Component tests check what needs a real browser:** layout at desktop and
  mobile widths, accessibility rules, focus and dialogs. They recognise a case
  by its title and do not check the other texts.
- **End-to-end tests check user journeys across pages:** navigation, saving,
  reloading. In the tax, Visale and payslip scenarios the document analysis is
  simulated, so they do not depend on Document IA.
- **The Document IA integration checks the real service,** with one scenario per
  document type.

Put a new test in the lowest suite that can catch the bug.

The simulated analysis answers use the application's own types
(`df-shared-next/src/models`), which mirror the backend. `pnpm --filter e2e-tests tsc`
fails when a simulated answer no longer matches them.

| Where | Unit | Component | End-to-end | Integration |
| --- | --- | --- | --- | --- |
| Every pull request (`.github/workflows/www.yml`) | yes | yes | no | no |
| Every morning, on preproduction (`.github/workflows/e2e.yml`) | no | no | yes | yes |
| Developer machine | yes | yes | yes | yes |

## Setup

Use Node 26 and pnpm, and run every command from the repository root.

```sh
pnpm install --frozen-lockfile
```

`pnpm install` reports a peer dependency warning for `cypress-axe`, which has not
declared Cypress 16 support yet. It works.

## Component tests

No application or backend to start. They also run on every pull request.

```sh
pnpm test:component        # run
pnpm test:component:open   # Cypress window
```

The specs are in `tenantv3/cypress/component`. They cover the six tax error
cases at desktop and mobile widths: layout, heading levels, accessibility rules,
focus and the confirmation dialog. No check depends on the icons, which the
application downloads from the Iconify API: the tests also pass offline.

## End-to-end tests

### Start the local stack

The tests target these addresses (see `cypress.config.ts`):

| Service | URL |
| --- | --- |
| Main site (`www`) | http://localhost:9001 |
| Tenant frontend (`tenantv3`) | http://localhost:9002 |
| Owner frontend (`owner`) | http://localhost:3000 |
| Back office | http://localhost:8081 |

Start the frontends (`pnpm dev`), their backend APIs, the back office, Keycloak,
PostgreSQL, Redis and RabbitMQ. Scenarios that upload documents also need the PDF
generator.

Test accounts are created and deleted through the back office, so:

- the back office must run with its testing API enabled (for example with the
  `dev` profile);
- `testing.api.allowed-email-pattern` must allow `local.*@inbox.testmail.app`, and
  `testing.api.operator-email` must be set;
- the Keycloak admin service account must be allowed to create and delete users
  in the tenant realm, and in the owner realm for the owner scenarios.

In the frontend `.env` files, URLs must include `http://` or `https://`.

### Run

```sh
pnpm test:e2e:open                                             # Cypress window
pnpm test:e2e --spec cypress/e2e/tenant/password.cy.ts         # one file, a good first check
pnpm test:e2e --config 'excludeSpecPattern=**/signup.cy.ts'    # everything except signup
```

The specs are in `e2e-tests/cypress/e2e`. Add `--headed` to a `test:e2e` command
to see the browser while it runs.

If a service uses another port, override its address for one run, for example
`--expose boUrl=http://localhost:18081`.

### Scenarios that need more than the local stack

| Scenario | Extra requirement |
| --- | --- |
| `signup` | A Testmail key (see [Secrets](#secrets)) and a local Keycloak able to send emails |
| `franceconnect`, `owner` | A FranceConnect test provider and its test accounts; `owner` also needs the ADEME lookup service |
| `partner` | Preproduction only: skipped unless `dfConnectDemoUrl` is set |

### Simulated document analysis

`tax-analysis`, `visale-analysis` and `payslip-upload` do not call Document IA.
The upload, the analysis result, the saved explanation and the file deletion are
simulated in the browser by `cypress/support/documentAnalysisMock.ts`. Login and
account creation stay real. These scenarios therefore pass or fail on the
interface alone, whatever the state of Document IA.

## Document IA integration

```sh
pnpm test:integration        # run
pnpm test:integration:open   # Cypress window
```

The specs are in `e2e-tests/cypress/integration`. Nothing is simulated: the
suite uploads a real tax notice, Visale certificate and payslip, waits for the
analysis, saves an explanation and checks it after a reload. It needs Document IA
to be reachable, and the task scheduler to be running when Document IA cannot
call back to localhost. Each scenario may wait up to three minutes.

## Preproduction

```sh
pnpm test:e2e --config-file cypress-preprod.config.ts   # run
pnpm --filter e2e-tests cy:open-preprod                 # Cypress window
```

The E2E workflow (`.github/workflows/e2e.yml`) does this every morning with
Chrome: first the end-to-end tests, then the Document IA integration. Neither
runs on pull requests, which only run the unit and component tests
(`.github/workflows/www.yml`).

## Settings and secrets

Addresses and account names are public settings. They live in the `expose` block
of each Cypress configuration file and are read with `Cypress.expose("name")`.

### Secrets

The only secret is the [testmail.app](https://testmail.app) key, used by
`signup.cy.ts` to read the welcome and password-reset emails. Other tests create
their account through the back office and never read a mailbox.

Put it in `e2e-tests/cypress.env.json`, which is git-ignored:

```json
{
  "TESTMAIL_API_KEY": "<key>"
}
```

A local signup run also needs your Testmail namespace and the `testmailTag` and
`testmailEndpoint` settings (see `cypress-preprod.config.ts` for an example). In
CI, the key and the namespace come from `CYPRESS_TESTMAIL_API_KEY` and
`CYPRESS_TESTMAIL_NAMESPACE`.
