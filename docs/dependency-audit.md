# Guide d'Audit et de Correction de Dépendances

Ce document décrit la procédure pour auditer et corriger les vulnérabilités de dépendances au sein du monorepo **Dossier-Facile-Frontend**.

---

## 📋 Étape 1 : Réaliser l'Audit avec Snyk

Pour identifier les vulnérabilités, lancez la commande suivante à la racine du workspace :
```bash
snyk test --all-projects
```
*Note : Snyk doit être installé localement et authentifié (`snyk auth`).*

---

## 🛠️ Étape 2 : Plan de Correction et d'Application

### A. Dépendances cataloguées (`pnpm-workspace.yaml`)
Si la dépendance vulnérable est partagée via les catalogues pnpm (ex: `axios`, `@sentry/*`, `vue`, etc.) :
1. Ouvrez `pnpm-workspace.yaml`.
2. Repérez la section `catalog:`.
3. Mettez à jour le numéro de version de la dépendance vers sa version stable corrigée.
4. N'éditez pas directement les `package.json` individuels pour ces dépendances, car ils utilisent la syntaxe `"dep": "catalog:"`.

### B. Dépendances locales (`package.json` de chaque package)
Si la dépendance est déclarée de manière classique dans un ou plusieurs packages (ex: `js-cookie`, `cypress` dans `e2e-tests`) :
1. Modifiez les `package.json` de chaque package concerné.
2. Augmentez la version de la dépendance vers la version corrigée.

### C. Dépendances transitives indirectes (`pnpm.overrides`)
Si la dépendance vulnérable n'est pas déclarée directement mais provient d'un package parent (ex: `systeminformation` ou `tmp` appelés par Cypress, ou `brace-expansion` appelé par Sentry) :
1. Ouvrez le fichier `package.json` racine du projet.
2. Modifiez ou ajoutez la règle de surcharge dans la clé `"pnpm"."overrides"` :
   ```json
   "pnpm": {
     "overrides": {
       "nom-du-package-transitif": "version.corrigee"
     }
   }
   ```
3. Cela forcera le gestionnaire pnpm à installer la version spécifiée de manière globale pour l'ensemble du monorepo.

---

## ⚙️ Étape 3 : Application et Validation

1. **Mise à jour du lockfile** :
   Lancez une réinstallation des paquets pour recalculer l'arbre de dépendances et générer le nouveau lockfile :
   ```bash
   pnpm install
   ```

2. **Vérification de compilation** :
   Pour s'assurer que les nouvelles versions n'introduisent pas de régressions ou d'incompatibilités d'API, lancez la compilation (ex: pour `tenantv3`) :
   ```bash
   pnpm --filter tenantv3 build
   ```

3. **Validation Snyk finale** :
   Relancez un scan complet pour confirmer la résolution complète :
   ```bash
   snyk test --all-projects
   ```
   *Cible attendue : `no vulnerable paths were found. (Exit code: 0)`.*
