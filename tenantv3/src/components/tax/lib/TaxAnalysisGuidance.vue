<template>
  <div v-if="kind !== undefined && kind !== 'unknown'" class="tax-analysis-guidance fr-mt-2w">
    <template v-if="kind === 'declarative'">
      <h3 class="fr-text--md fr-text--bold fr-mb-1w">{{ t('declarative-title') }}</h3>
      <i18n-t tag="p" keypath="declarative-help">
        <strong>{{ t('notice-title') }}</strong>
      </i18n-t>
    </template>
    <template v-else-if="kind === 'classification' || kind === 'unreadable'">
      <h3 class="fr-text--md fr-text--bold fr-mb-1w">{{ t('classification-title') }}</h3>
      <p>{{ t('classification-help') }}</p>
    </template>
    <template v-else-if="kind === 'pages'">
      <h3 class="fr-text--md fr-text--bold fr-mb-1w">{{ t('pages-title') }}</h3>
      <ul role="list" class="fr-mb-2w">
        <i18n-t tag="li" keypath="pages-download">
          <a
            href="https://www.impots.gouv.fr"
            target="_blank"
            rel="noopener noreferrer"
            :title="`impots.gouv.fr - ${t('new-window')}`"
            >impots.gouv.fr</a
          >
        </i18n-t>
        <li>{{ t('pages-paper') }}</li>
      </ul>
    </template>
    <p v-else-if="kind === 'year'" class="year-help">
      <VIcon
        name="ri:information-line"
        color="var(--text-action-high-blue-france)"
        class="year-help-icon"
        aria-hidden="true"
      />
      {{ t('year-help') }}
    </p>
    <template v-else-if="kind === 'names'">
      <h3 class="fr-text--md fr-text--bold fr-mb-1w">{{ t('names-title') }}</h3>
      <ul role="list">
        <li>
          {{ t(isSelf ? 'parents-help' : 'parents-help-other') }}
          <TaxBackLinkRow
            inline
            :to="parentsTo"
            :label="t(isSelf ? 'parents-link' : 'parents-link-other')"
          />
        </li>
        <i18n-t v-if="identityTo" tag="li" :keypath="isSelf ? 'name-help' : 'name-help-other'">
          <RouterLink :to="identityTo">{{
            t(isSelf ? 'name-link' : 'name-link-other')
          }}</RouterLink>
        </i18n-t>
        <li v-else>{{ t('franceconnect-name-help') }}</li>
      </ul>
    </template>
    <p
      v-if="
        kind === 'declarative' ||
        kind === 'classification' ||
        kind === 'unreadable' ||
        kind === 'pages'
      "
    >
      <a
        href="https://www.impots.gouv.fr/particulier/questions/jai-perdu-mon-avis-dimpot-sur-le-revenu-puis-je-en-obtenir-une-copie"
        target="_blank"
        rel="noopener noreferrer"
        :title="`${t('download-help')} - ${t('new-window')}`"
        >{{ t('download-help') }}</a
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { getTaxAnalysisErrorKind } from '@/components/analysis/strategies/TaxAnalysisErrorStrategy'
import { VIcon } from '@gouvminint/vue-dsfr'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import TaxBackLinkRow from './TaxBackLinkRow.vue'

const props = defineProps<{
  failedRules: DocumentRule[]
  parentsTo: RouteLocationRaw
  identityTo?: RouteLocationRaw
  isSelf: boolean
}>()
const { t } = useI18n()
// The combined-error mockup groups the requirements without repeating each help section.
const kind = computed(() =>
  props.failedRules.length === 1 ? getTaxAnalysisErrorKind(props.failedRules[0]) : undefined
)
</script>

<style scoped>
.tax-analysis-guidance {
  background-color: var(--background-alt-blue-france);
  padding: 0.75rem;
}
.tax-analysis-guidance p {
  margin-bottom: 0.5rem;
}
.tax-analysis-guidance > ul[role='list'] {
  list-style-type: disc;
  padding-inline-start: 1.5rem;
}
.tax-analysis-guidance > ul > li::marker {
  content: normal;
}
.tax-analysis-guidance > :last-child {
  margin-bottom: 0;
}
.year-help {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.year-help-icon {
  flex-shrink: 0;
}
</style>

<i18n lang="json">
{
  "fr": {
    "declarative-title": "Comment les distinguer",
    "declarative-help": "L'avis d'impôt porte la mention {0} en haut de la première page.",
    "notice-title": "« Avis d'impôt »",
    "classification-title": "Avant de redéposer",
    "classification-help": "Vérifiez que le fichier est lisible et qu'il contient toutes les pages de l'avis.",
    "pages-title": "Pour un avis complet",
    "pages-download": "Téléchargez le PDF sur {0} plutôt qu'une photo.",
    "pages-paper": "Si vous avez une version papier, ajoutez chaque page dans un fichier.",
    "year-help": "L'année figure en haut de la première page de l'avis.",
    "names-title": "Deux situations fréquentes",
    "parents-help": "C'est l'avis de vos parents : leur avis n'est pas accepté à votre nom.",
    "parents-link": "Je suis rattaché au foyer fiscal de mes parents",
    "name-help": "Il manque votre nom d'usage ou votre nom de naissance : {0}.",
    "franceconnect-name-help": "Votre identité provient de FranceConnect. Si le nom sur votre avis est différent, expliquez pourquoi dans le champ ci-dessous.",
    "name-link": "ajoutez-le à votre dossier",
    "parents-help-other": "C'est l'avis de ses parents : leur avis n'est pas accepté à son nom.",
    "parents-link-other": "Cette personne est rattachée au foyer fiscal de ses parents",
    "name-help-other": "Il manque son nom d'usage ou son nom de naissance : {0}.",
    "name-link-other": "ajoutez-le à son dossier",
    "download-help": "Aide en ligne : démarche pour récupérer son avis d'impôt",
    "new-window": "nouvelle fenêtre"
  },
  "en": {
    "declarative-title": "How to tell them apart",
    "declarative-help": "The tax notice has the words {0} at the top of the first page.",
    "notice-title": "“Avis d'impôt”",
    "classification-title": "Before uploading again",
    "classification-help": "Check that the file is legible and contains every page of the notice.",
    "pages-title": "For a complete notice",
    "pages-download": "Download the PDF from {0} instead of taking a photo.",
    "pages-paper": "If you have a paper copy, upload a file for each page.",
    "year-help": "The year appears at the top of the first page of the notice.",
    "names-title": "Two common situations",
    "parents-help": "This is your parents' notice: it cannot be accepted in your name.",
    "parents-link": "I am part of my parents' tax household",
    "name-help": "Your preferred name or birth name is missing: {0}.",
    "franceconnect-name-help": "Your name comes from FranceConnect. If your tax notice shows a different name, explain the difference in the field below.",
    "name-link": "add it to your application",
    "parents-help-other": "This is their parents' notice: it cannot be accepted in this person's name.",
    "parents-link-other": "This person is part of their parents' tax household",
    "name-help-other": "Their preferred name or birth name is missing: {0}.",
    "name-link-other": "add it to their application",
    "download-help": "Online help: how to retrieve a tax notice",
    "new-window": "new window"
  }
}
</i18n>
