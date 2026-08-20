# Architecture des Stratégies d'Erreurs d'Analyse Automatique de Documents

Ce document explique la nouvelle architecture basée sur le pattern **Stratégie** (`BaseAnalysisErrorStrategy`) pour l'affichage, la personnalisation et la gestion des erreurs d'analyse automatique des documents dans l'application DossierFacile.

---

## 1. Contexte & Objectif

Auparavant, la gestion des erreurs d'analyse reposait sur un système de bannières génériques (`AnalysisBanners.vue` / `GenericAnalysisErrorContent.vue`).

Afin de permettre une personnalisation fine des messages d'erreur par type de document (titres d'en-tête, listes de puces adaptées avec plusieurs identités extraites, consignes spécifiques, et boutons d'action d'étape), un paradigme basé sur le **Pattern Stratégie** a été introduit.

---

## 2. Composants & Architecture

L'architecture s'articule autour de 5 éléments principaux :

```
[Composant Métier] (ex: OrganismCert.vue)
        │
        ├── Instancie ──► [VisaleAnalysisErrorStrategy] (Hérite de BaseAnalysisErrorStrategy)
        │
        └── Transmet :strategy ──► [AnalysisWrapper.vue]
                                        │
                                        └── Affiche ──► [AnalysisErrorBlock.vue]
```

### 1. `BaseAnalysisErrorStrategy.ts`
*(Emplacement : `tenantv3/src/components/analysis/strategies/BaseAnalysisErrorStrategy.ts`)*

Classe de base abstraite définissant les contrats que toute stratégie d'erreur doit implémenter :

- **`getHeaderTitle(failedRules, t): string`** : Renvoie le titre principal du bloc d'erreur en fonction des règles en échec (gestion single vs multiple).
- **`getBulletText(rule, t): string`** : Renvoie le texte HTML d'une puce pour une règle donnée.
- **`getBulletList(failedRules, t): string[]`** : Renvoie la liste complète des puces HTML à afficher. Par défaut, si plus d'une règle est en échec, elle mappe sur `getBulletText`. Elle peut être surchargée pour traiter des cas complexes (ex: plusieurs noms extraits pour une même règle).
- **`getExpectedDocumentHtml(failedRules, t): string`** : Renvoie le texte HTML des consignes et documents attendus.
- **`getAction(failedRules, t): AnalysisErrorAction | undefined`** : Optionnel. Renvoie un objet définissant l'action d'étape (titre, description, label du bouton, sous-texte et `customEventName`). Si la méthode renvoie `undefined`, la section d'action est automatiquement masquée.

### 2. Stratégies Concrètes (ex: `VisaleAnalysisErrorStrategy.ts`)
*(Emplacement : `tenantv3/src/components/analysis/strategies/VisaleAnalysisErrorStrategy.ts`)*

Implémente la logique spécifique d'un type de document (ici les certificats de garantie Visale) :
- Typage strict des données de règles via les unions discriminées de `DocumentRule` (`ruleData.type === 'R_EXPIRATION'` ou `'R_NAMES'`).
- Génération d'une puce par identité extraite si le certificat contient plusieurs noms (`extractedNames`).
- Définition d'un `customEventName` dynamique selon les erreurs rencontrées (`errorGuarantorExpiration`, `errorGuarantorName`, `errorGuarantorClassification`, `multipleError`).

### 3. `AnalysisErrorBlock.vue`
*(Emplacement : `tenantv3/src/components/analysis/AnalysisErrorBlock.vue`)*

Composant d'affichage réutilisable qui :
- Reçoit la proposition `:strategy` et les `:failed-rules`.
- Affiche l'en-tête d'erreur rouge/rose avec l'icône `ri:alert-fill`.
- Affiche la liste des puces `<ul>` si `bullets.length > 0`.
- Affiche la section "Document attendu" (titre noir `700`, texte bleu `#000091`).
- Affiche le bloc d'action conditionnel `<template v-if="action">`.
- Émet un événement générique `@custom-event="emit('customEvent', action.customEventName)"`.
- Propose la zone de texte d'explication avec auto-sauvegarde et encadré d'information.
- Gère la prise de focus d'accessibilité (`tabindex="-1"` et méthode exposée `focus()`).

### 4. `AnalysisWrapper.vue`
*(Emplacement : `tenantv3/src/components/analysis/AnalysisWrapper.vue`)*

Acteur central qui :
- Si la prop `:strategy` est fournie, bascule automatiquement sur `AnalysisErrorBlock.vue`.
- Si aucune prop `:strategy` n'est fournie, conserve le fonctionnement legacy avec les bannières existantes.
- Relaie les événements `@custom-event`.

### 5. Composant de Page Document (ex: `OrganismCert.vue`)
Instancie la stratégie et intercepte les événements personnalisés :
```ts
const visaleStrategy = computed(() => {
  if (selectedSubCategory.value === 'VISALE') {
    return new VisaleAnalysisErrorStrategy()
  }
  return undefined
})

async function onCustomEvent(eventName?: string) {
  // Action sur clic du bouton (ex: suppression du garant et redirection vers /validation-dossier)
  const g = currentGuarantor.value
  if (g) {
    await store.deleteGuarantor(g)
  }
  router.push({ name: 'ValidateFile' })
}
```

---

## 3. Guide Pas à Pas : Créer ou Remplacer la Stratégie pour un Type de Document

Pour créer une nouvelle stratégie d'erreur d'analyse (ex: pour les bulletins de salaire ou l'avis d'imposition) :

### Étape 1 : Créer le fichier de stratégie
Créez un nouveau fichier dans `tenantv3/src/components/analysis/strategies/MyDocumentAnalysisErrorStrategy.ts` :

```ts
import {
  BaseAnalysisErrorStrategy,
  type AnalysisErrorAction,
  type TranslationFunction
} from './BaseAnalysisErrorStrategy'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

export class MyDocumentAnalysisErrorStrategy extends BaseAnalysisErrorStrategy {
  override getHeaderTitle(failedRules: DocumentRule[], t: TranslationFunction): string {
    if (failedRules.length > 1) {
      return t('my-doc-errors.multiple-header')
    }
    const rule = failedRules[0]
    if (rule.rule === 'R_PAYSLIP_NAME_MATCH') {
      return t('my-doc-errors.name-header')
    }
    return rule.message || t('my-doc-errors.default-header')
  }

  override getBulletText(rule: DocumentRule, t: TranslationFunction): string {
    if (rule.rule === 'R_PAYSLIP_NAME_MATCH') {
      return t('my-doc-errors.name-bullet')
    }
    return rule.message
  }

  override getExpectedDocumentHtml(failedRules: DocumentRule[], t: TranslationFunction): string {
    return t('my-doc-errors.expected-document')
  }

  override getAction(failedRules: DocumentRule[], t: TranslationFunction): AnalysisErrorAction | undefined {
    // Si l'étape propose un bouton d'action spécifique :
    return {
      title: t('my-doc-errors.action-title'),
      description: t('my-doc-errors.action-description'),
      buttonLabel: t('my-doc-errors.action-button'),
      subtext: t('my-doc-errors.action-subtext'),
      customEventName: 'myCustomActionEvent'
    }
    // Si pas de bouton d'action : return undefined
  }
}
```

### Étape 2 : Ajouter les traductions i18n
Ajoutez les clés de traduction dans le bloc `<i18n>` de `AnalysisErrorBlock.vue` (ou dans `fr.json` / `en.json`).

### Étape 3 : Instancier et transmettre la stratégie dans le composant Vue
Dans votre composant de document (ex: `UploadFilesFinancial.vue` ou `UploadFilesTax.vue`) :

```html
<AnalysisWrapper
  ref="analysis-wrapper"
  :is-uploading="isUploading"
  :strategy="myDocumentStrategy"
  @custom-event="handleCustomEvent"
>
  <template #fileUploader>
    ...
  </template>
</AnalysisWrapper>
```

```ts
import { MyDocumentAnalysisErrorStrategy } from '../strategies/MyDocumentAnalysisErrorStrategy'

const myDocumentStrategy = computed(() => new MyDocumentAnalysisErrorStrategy())

function handleCustomEvent(eventName: string) {
  if (eventName === 'myCustomActionEvent') {
    // Logique métier spécifique au clic sur le bouton d'action
  }
}
```

### Étape 4 : Ajouter les tests unitaires
Créez un fichier de test dédié dans `tenantv3/src/components/__tests__/MyDocumentAnalysisErrorStrategy.spec.ts` pour tester le comportement des méthodes `getHeaderTitle`, `getBulletList`, `getExpectedDocumentHtml` et `getAction`.

---

## 4. Rétrocompatibilité

Les composants existants n'ayant pas encore de stratégie personnalisée continuent de transmettre des bannières via l'ancien système (`AnalysisBanners.vue`). La migration vers le pattern stratégie se fait de manière progressive et sans régression.
