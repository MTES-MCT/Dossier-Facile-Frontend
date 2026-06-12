# AGENTS.md — DossierFacile Frontend

DossierFacile.fr (service public, Ministère de la Transition écologique) aide les candidats locataires à constituer un dossier de location numérique vérifié.

Ce monorepo héberge les interfaces web de DossierFacile, ainsi que celle de **FiligraneFacile** (sous-produit de filigrane de documents), portée par le package `watermark`.

## Stack technique

- **Langages / Framework** : Vue 3 (Composition API), TypeScript
- **Build / Runtime / Package manager** : Vite, Node 22, pnpm
- **Formulaires** : vee-validate (+ règles custom déclarées dans les `main.ts`)
- **HTTP / auth** : Axios , keycloak-js (OIDC)
- **Design system** : DSFR (`@gouvfr/dsfr` + `@gouvminint/vue-dsfr`)
- **Tests** : Vitest, Cypress (package `e2e-tests`)
- **Analytics** : Matomo

## Packages

| Package | Rôle |
|---|---|
| `tenantv3` | App locataire - funnel de constitution du dossier |
| `owner` | App propriétaire - gestion des propriétés et candidatures |
| `www` | Site vitrine |
| `watermark` | App FiligraneFacile  - standalone app de filigranage de document |
| `df-shared-next` | Lib partagée : composants, modèles TS, services, validateurs, plugins (consent, robots, Crisp) |
| `storybook` | Documentation des composants |
| `e2e-tests` | Tests Cypress |

Commandes depuis la racine : `pnpm install`, puis `pnpm --filter <package> dev | build | test:unit | lint | tsc`.

## Backend 
Repo backend : https://github.com/MTES-MCT/dossierfacile-backend
Ce frontend échange avec 3 API du repo backend:
- tenantv3 -> api-tenant
- owner -> api-owner
- watermark -> api-watermark
Le modèle de donnée et les différents statuts du dossier sont définis dans le `AGENTS.md` du repo backend

## Points d'attention avant tout dev

Pour limiter les risques de régressions, évaluer l'impact sur chacun de ces axes ; le traiter ou le justifier.

- **i18n** : toute clé ajoutée doit être mise en priorité dans le bloc `<i18n>` du composant. Si c'est une traduction commune à plusieurs composants, elle est à ajouter dans le `fr.json`/`en.json`/`base.json` dans le `/src` de chaque package.
- **Design** : DSFR obligatoire (RGAA). Privilégier les composants `@gouvminint/vue-dsfr` et ceux déjà utilisés dans la codebase. Se référer en seconde priorité à `@gouvfr/dsfr`. Utiliser les tokens DSFR plutôt que des valeurs en dur : classes utilitaires d'espacement (`fr-mt-3w`…) et variables CSS de couleur (`var(--primary)`…)
- **Accessibilité (RGAA)** : axe prioritaire et obligation légale de viser un site "totalement conforme" au RGAA. 
  - **Modales** : utiliser le composant `DsfrModalPatch.vue` (a11y compatible) plutôt que le `DsfrModal` de `vue-dsfr`
  - **Titres de page** : Les titres doivent décrire la hiérarchie d'information du funnel (voir le `afterEach` dans `tenantv3/src/router/index.ts`).
  - **Roles** :  Faux positifs Sonar attendus : `role="list"` sur `<ul>` (contournement du bug VoiceOver quand list-style:none) et `role="presentation"` sur `<li>` d'une structure d'onglets — ne pas « corriger » en supprimant ces rôles.
  - **Formulaires** : toujours associer un `input` avec un `label`, renseigner l'attribut `required` sur les champs obligatoires et afficher en toute lettre leur caractère "obligatoire" ou "facultatif", renseigner `aria-describedby` / `aria-invalid` sur les champs en erreur, utiliser `fieldset` et `legend` pour les groupes de champs. Pour les erreurs multiples, afficher la listes des erreurs reliées aux champs dans un bloc dédié via le composant `ErrorSummary.vue`.
  - **Contenu dynamique** : ajouter le `role="status"` ou annoncer les changements via `aria-live="polite"`. 
  - Vérifier la navigation clavier et la présence du focus visible.
  - **Tests E2E** : Utiliser `axe-core` pour tester l'a11y sur le principaux scenarios
