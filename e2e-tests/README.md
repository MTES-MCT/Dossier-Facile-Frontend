## How to run tests

Run locally:
```yarn cypress run```

Run on preprod:
```yarn cypress run --config-file cypress-preprod.config.ts```

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
