# Tests end-to-end

## Lancer les tests

Depuis la racine du monorepo, demarrer les applications locales et les API backend correspondantes, puis lancer :

```sh
pnpm --filter e2e-tests test
```

Depuis le dossier `e2e-tests`, les commandes disponibles sont :

```sh
pnpm test
pnpm cy:open
pnpm cy:open-preprod
```

Pour executer la suite sur la preprod en ligne de commande :

```sh
pnpm --filter e2e-tests exec cypress run --config-file cypress-preprod.config.ts
```

## Comptes locataire de test

Les scenarios locataire utilisent l'inscription native par defaut. Pour creer un scenario avec un compte locataire jetable :

- definir le compte avec `testAccount("tag")` depuis `cypress/support/testAccounts` ;
- utiliser un tag unique par scenario pour generer une adresse `${TESTMAIL_NAMESPACE}.${tag}@inbox.testmail.app` ;
- appeler `cy.createTestAccount(account)` pour reinitialiser le compte, l'inscrire et verifier son email ;
- appeler `cy.createFreshTenant(account)` quand le scenario doit demarrer avec le locataire connecte sur la premiere etape du funnel.

Ces helpers passent par les endpoints de test exposes par `boUrl`. Les API backend correspondantes doivent donc etre disponibles.

## Emails Testmail

Les scenarios qui lisent des emails Testmail (inscription, reinitialisation de mot de passe, etc.) ont besoin des variables Cypress `TESTMAIL_NAMESPACE` et `TESTMAIL_API_KEY`. En CI, elles sont fournies via `CYPRESS_TESTMAIL_NAMESPACE` et `CYPRESS_TESTMAIL_API_KEY`.

FranceConnect reste a reserver aux specs dediees a la connexion FranceConnect.