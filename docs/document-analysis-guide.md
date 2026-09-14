# Architecture et Fonctionnement des Analyses de Documents (Frontend)

Ce guide explique le fonctionnement global du système d'analyse automatique de documents par l'IA dans l'application locataire (`tenantv3`) et détaille la procédure pas à pas pour intégrer une nouvelle analyse.

---

## 1. Vue d'ensemble du Cycle de Vie d'une Analyse

Le système d'analyse automatique permet de vérifier automatiquement l'authenticité, la complétude et la conformité des pièces justificatives fournies par les candidats locataires (avis d'imposition, bulletins de paie, taxe foncière, justificatifs d'activité, certificats Visale, etc.).

```
┌──────────────────────────────┐
│ Dépôt d'un fichier (Upload)  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ documentStatus: 'TO_PROCESS' │
└──────────────┬───────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Polling actif (AnalysisService.getDocumentAnalysisStatus)   │
│ Toutes les 3s (POLLING_INTERVAL_MS)                         │
└──────────────┬──────────────────────────────────────────────┘
               │
       ┌───────┴───────────────────────────────┐
       │                                       │
       ▼ (Délai normal < timeout)              ▼ (Délai dépassé >= timeout)
┌─────────────────────────────┐         ┌─────────────────────────────────┐
│ Barre de progression (0-100%)│        │ OVERTIME :                      │
│ Spinner animé               │         │ - Barre de progression coupée   │
│ Bouton Continuer désactivé  │         │ - Spinner remplacé par Info     │
└──────────────┬──────────────┘         │ - Message d'attente prolongée   │
               │                        │ - Bouton Continuer RÉACTIVÉ     │
               │                        │ - Polling maintenu en tâche     │
               │                        │   de fond                       │
               │                        └──────────────┬──────────────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
                ┌────────────────────────────────────┐
                │ Résolution de l'analyse (API)      │
                └──────────────────┬─────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ COMPLETED (OK)  │       │ COMPLETED (KO)  │       │ NON PLANIFIÉ    │
│ Aucune erreur   │       │ Règles en échec │       │ OU ERREUR API   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ Carte "Analyse  │       │ Bloc d'erreurs  │       │ Arrêt polling,  │
│ terminée" bleue │       │ (Stratégie ou   │       │ utilisateur non │
│ Bouton actif    │       │ Bannières)      │       │ bloqué          │
│ Polling stoppé  │       │ Explication req │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. Composants Clés et Responsabilités

### 1. `AnalysisWrapper.vue` *(Maître d'orchestre)*
C'est le composant central qui encadre l'analyse. Il est **l'unique source de vérité** pour :
- Le polling régulier (`AnalysisService.getDocumentAnalysisStatus`) toutes les 3 secondes (`POLLING_INTERVAL_MS`).
- Le calcul du timeout (`pollingTimeoutMs`, par défaut 10s, configurable à 20s ou 30s).
- La gestion de l'état `isOvertime` :
  - Dès expiration du délai, `isOvertime` passe à `true`.
  - Le polling **ne s'arrête pas** : il continue en tâche de fond pour capter le résultat dès qu'il arrive.
  - Réactivation du bouton du footer (`nextDisabled = false`, `nextLabel = undefined`).
  - `beforeSubmit()` permet à l'utilisateur de continuer son dossier sans attendre indéfiniment.
- L'orchestration formelle des états via la State Machine (`useAnalysisStateMachine`) :
  - États exclusifs : `'IDLE' | 'UPLOADING' | 'ANALYZING' | 'OVERTIME' | 'SUCCESS' | 'FAILED'`
  - Élimination des états illégaux et dérivation automatique des propriétés réactives (`isBusy`, `nextDisabled`, `nextLabel`, etc.).
- L'exposition des états au slot `#fileUploader` :
  ```html
  <slot
    name="fileUploader"
    :is-overtime="isOvertime"
    :analysis-in-progress="analysisInProgress"
    :analysis-time="props.pollingTimeoutMs"
    :state="currentState"
  />
  ```
- L'affichage conditionnel :
  - Si une `strategy` (`BaseAnalysisErrorStrategy`) est fournie : affichage de `AnalysisErrorBlock.vue`.
  - Sinon (legacy) : affichage des bannières `AnalysisBanners.vue`.
  - Carte de succès `isSuccess` dès que l'analyse est terminée avec succès.
- La persistance de l'explication utilisateur (`saveExplanation()`).

### 2. `UploadFileWithAnalysis.vue` *(Présentation et téléversement)*
Composant d'upload combiné au retour visuel de l'analyse :
- Reçoit les props :
  - `:analysis-in-progress="boolean"` : déclenche l'affichage du bloc d'analyse.
  - `:is-overtime="boolean"` : coupe le loader et adapte l'affichage.
  - `:analysis-time="number"` : durée théorique de l'analyse en ms pour la progression (ex: 30000).
- **Affichage dynamique** :
  - En analyse normale : spinner tournant `ri:loader-4-line`, message *"Nous vérifions vos documents. Cela prend généralement moins de X secondes."*, et barre de progression animée de 0 à 100%.
  - En mode overtime (`isOvertime = true`) : masquage de la barre de progression, remplacement du spinner par une icône fixe `ri:information-line` (sans classe de rotation `spin`), et message *"L'analyse prend plus de temps que prévu. Vous pouvez continuer votre dossier."*.
  - En cas d'ajout d'un nouveau fichier (`addFiles`) : la progression est réinitialisée à 0%.

### 3. `AnalysisFooter.vue` *(Navigation du funnel)*
Pied de page standard relié à `AnalysisWrapper` via template ref :
```html
<AnalysisFooter
  :previous-step="previousStep"
  :before-submit="analysisWrapper?.beforeSubmit"
  :next-disabled="analysisWrapper?.nextDisabled"
  :next-label="analysisWrapper?.nextLabel"
  :on-submit-action="submit"
/>
```

### 4. `BaseAnalysisErrorStrategy.ts` & `AnalysisErrorBlock.vue` *(Gestion des erreurs)*
Modélise la présentation des erreurs d'analyse de façon personnalisée pour chaque catégorie de document (titres, puces d'erreur avec noms extraits, consignes de documents attendus, actions de contournement).
Consulter la documentation dédiée : [document-analysis-error-strategies.md](./document-analysis-error-strategies.md).

---

## 3. Guide Pratique : Créer une Nouvelle Analyse de Document

Voici la procédure complète pour implémenter une nouvelle étape d'analyse (ex: pour un nouveau document justificatif).

### Étape 1 : Définir la Stratégie d'Erreurs d'Analyse

Créez votre stratégie dans `tenantv3/src/components/analysis/strategies/MyDocAnalysisErrorStrategy.ts` en héritant de `BaseAnalysisErrorStrategy` :

```ts
import {
  BaseAnalysisErrorStrategy,
  type AnalysisErrorAction
} from '@/components/analysis/strategies/BaseAnalysisErrorStrategy'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

export class MyDocAnalysisErrorStrategy extends BaseAnalysisErrorStrategy {
  getHeaderTitle(failedRules: DocumentRule[], t: (k: string, p?: Record<string, unknown>) => string): string {
    if (failedRules.length > 1) {
      return t('my-doc-errors.multiple-title')
    }
    const rule = failedRules[0]?.rule
    if (rule === 'R_MY_DOC_EXPIRATION') {
      return t('my-doc-errors.expiration-title')
    }
    return t('my-doc-errors.default-title')
  }

  getBulletText(rule: DocumentRule, t: (k: string, p?: Record<string, unknown>) => string): string {
    if (rule.rule === 'R_MY_DOC_EXPIRATION') {
      return t('my-doc-errors.expiration-bullet')
    }
    return rule.message || t('my-doc-errors.default-bullet')
  }

  getExpectedDocumentHtml(
    failedRules: DocumentRule[],
    t: (k: string, p?: Record<string, unknown>) => string
  ): string {
    return t('my-doc-errors.expected-doc-instruction')
  }

  // Optionnel : si une action spécifique est requise (ex: changer de statut, réinitialiser...)
  getAction(
    failedRules: DocumentRule[],
    t: (k: string, p?: Record<string, unknown>) => string
  ): AnalysisErrorAction | undefined {
    return undefined
  }
}
```

---

### Étape 2 : Créer le Composant d'Étape (ex: `MyDocAnalysisStep.vue`)

Assemblez les composants en utilisant le **scoped slot** `#fileUploader="{ analysisInProgress, isOvertime, analysisTime }"` d'`AnalysisWrapper` :

```html
<template>
  <AnalysisWrapper
    ref="analysis-wrapper"
    :is-uploading="isUploading"
    :polling-timeout-ms="30000"
    :strategy="myDocStrategy"
    @custom-event="onCustomEvent"
  >
    <template #fileUploader="{ analysisInProgress, isOvertime, analysisTime }">
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        doc-category="my-doc-category"
        :sub-category="selectedSubCategory"
        :analysis-time="analysisTime"
        :analysis-in-progress="analysisInProgress"
        :is-overtime="isOvertime"
        :max-file-count="5"
      />
    </template>
  </AnalysisWrapper>

  <AnalysisFooter
    :previous-step="previousStep"
    :before-submit="analysisWrapper?.beforeSubmit"
    :next-disabled="analysisWrapper?.nextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :on-submit-action="submit"
  />
</template>

<script setup lang="ts">
import { computed, provide, useTemplateRef } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import AnalysisWrapper from '@/components/analysis/AnalysisWrapper.vue'
import UploadFileWithAnalysis from '@/components/analysis/UploadFileWithAnalysis.vue'
import AnalysisFooter from '@/components/footer/AnalysisFooter.vue'
import { documentFormKey } from '@/components/documents/documentFormState'
import { MyDocAnalysisErrorStrategy } from '@/components/analysis/strategies/MyDocAnalysisErrorStrategy'
import { useTenantStore } from '@/stores/tenant-store'

const router = useRouter()
const store = useTenantStore()

const analysisWrapper = useTemplateRef('analysis-wrapper')
const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const myDocStrategy = computed(() => new MyDocAnalysisErrorStrategy())

const previousStep: RouteLocationRaw = { name: 'PreviousStepName' }
const nextStep: RouteLocationRaw = { name: 'NextStepName' }

const myDocument = computed(() => store.getTenantDocumentByCategory('MY_DOC_CATEGORY'))

// Configuration du formulaire de document partagé
provide(documentFormKey, {
  category: 'MY_DOC_CATEGORY',
  textKey: 'tenant',
  previousStep: previousStep,
  nextStep: nextStep,
  formFieldValue: 'typeDocumentMyDoc',
  document: myDocument,
  storeAction: 'saveMyDocument',
  userId: store.user.id
})

async function submit() {
  // Enregistre l'explication rédigée par l'utilisateur le cas échéant
  await analysisWrapper.value?.saveExplanation()
  router.push(nextStep)
}

function onCustomEvent(eventName: string) {
  // Traiter un événement personnalisé renvoyé par la stratégie si nécessaire
}
</script>
```

> [!IMPORTANT]
> **Points d'attention :**
> 1. **Cohérence des durées** : La prop `:polling-timeout-ms="30000"` d'`AnalysisWrapper` et la prop `:analysis-time="30000"` d'`UploadFileWithAnalysis` doivent être alignées.
> 2. **Scoped Slot** : Toujours utiliser `<template #fileUploader="slotProps">` pour transmettre `:analysis-in-progress="slotProps?.analysisInProgress"` et `:is-overtime="slotProps?.isOvertime"` à `UploadFileWithAnalysis`. Aucune variable intermédiaire n'est nécessaire dans le `<script setup>`.
> 3. **Sauvegarde de l'explication** : Dans la fonction de soumission `submit()`, toujours appeler `await analysisWrapper.value?.saveExplanation()` avant de router vers l'étape suivante.

---

### Étape 3 : Ajouter les Traductions (i18n)

Déclarez les clés de traduction dans le bloc `<i18n>` du composant ou dans les fichiers de traduction communs (`fr.json` / `en.json`) :

```json
{
  "fr": {
    "my-doc-errors": {
      "default-title": "Votre document nécessite une vérification",
      "expiration-title": "Votre justificatif a expiré",
      "multiple-title": "Plusieurs erreurs détectées sur votre document",
      "expiration-bullet": "La date de validité du document est dépassée",
      "default-bullet": "Le document téléversé ne correspond pas aux critères attendus",
      "expected-doc-instruction": "Ajoutez un justificatif récent de moins de 3 mois."
    }
  },
  "en": {
    "my-doc-errors": {
      "default-title": "Your document requires verification",
      "expiration-title": "Your document has expired",
      "multiple-title": "Multiple errors detected on your document",
      "expiration-bullet": "The document validity date has expired",
      "default-bullet": "The uploaded document does not match the expected criteria",
      "expected-doc-instruction": "Please provide a document issued within the last 3 months."
    }
  }
}
```

---

### Étape 4 : Écrire les Tests Unitaires (Vitest)

Créez les tests associés dans `tenantv3/src/components/__tests__/` :

1. **Test de la stratégie (`MyDocAnalysisErrorStrategy.spec.ts`)** :
   - Vérifier le titre renvoyé pour chaque règle unique et pour des règles multiples.
   - Vérifier les puces HTML générées.
   - Vérifier le document attendu.
2. **Test du composant d'étape (`MyDocAnalysisStep.spec.ts`)** :
   - Vérifier la transmission des états de chargement (`isUploading`, `analysisInProgress`, `isOvertime`).
   - Vérifier que la soumission appelle bien `saveExplanation()`.
   - Vérifier le comportement en overtime (le bouton de soumission reste actif et n'est pas bloqué).

Exécutez la suite de tests pour vous assurer qu'aucune régression n'est introduite :
```bash
pnpm --filter tenantv3 test:unit
pnpm --filter tenantv3 tsc
```
