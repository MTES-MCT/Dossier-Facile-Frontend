<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-a-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('foreign')" :to="parent" />
  <p class="text-bold">{{ t(textKey + '.add-last-tax-notice') }}</p>
  <p class="fr-mb-0">
    {{ t('doc-must-contain') }}
  </p>
  <ul class="fr-mb-3w">
    <li>{{ t(textKey + '.personal-information') }}</li>
    <li>{{ t(textKey + '.declared-income') }}</li>
    <li>{{ t('fiscal-year') }}</li>
  </ul>
  <p class="display--flex text-bold fr-mb-1w">
    <RiInformationFill class="color--primary fr-mr-1v" />
    {{ t('mandatory-translation') }}
  </p>
  <p>{{ t('add-french-translation') }}</p>
  <UploadFilesTax category="MY_NAME" step="TAX_FOREIGN_NOTICE" />
  <TaxFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useI18n } from 'vue-i18n'
import { RiInformationFill } from '@remixicon/vue'
import UploadFilesTax from './lib/UploadFilesTax.vue'
import { useTaxState } from './lib/taxState'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const { textKey } = useTaxState()
</script>

<i18n>
{
  "en": {
    "foreign": "foreign",
    "doc-must-contain": "The document must contain:",
    "fiscal-year": "The fiscal year",
    "mandatory-translation": "Translation into French mandatory",
    "add-french-translation": "Add a French translation of essential information with the original document.",
    "tenant": {
      "your-situation": "Your situation:",
      "have-a-tax-notice": "You have a tax notice",
      "add-last-tax-notice": "Add your last tax notice issued by your country of residence.",
      "personal-information": "Your personal information",
      "declared-income": "Your declared income",
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-a-tax-notice": "Your guarantor has a tax notice",
      "add-last-tax-notice": "Add their last tax notice issued by their country of residence.",
      "personal-information": "Their personal information",
      "declared-income": "Their declared income",
    },
    "couple": {
      "your-situation": "Your spouse's situation:",
      "have-a-tax-notice": "Your spouse has a tax notice",
      "add-last-tax-notice": "Add their last tax notice issued by their country of residence.",
      "personal-information": "Their personal information",
      "declared-income": "Their declared income",
    },
    "couple-guarantor": {
      "your-situation": "Their guarantor's situation:",
      "have-a-tax-notice": "Their guarantor has a tax notice",
      "add-last-tax-notice": "Add their last tax notice issued by their country of residence.",
      "personal-information": "Their personal information",
      "declared-income": "Their declared income",
    },
  },
  "fr": {
    "foreign": "étranger",
    "doc-must-contain": "Le document doit contenir :",
    "fiscal-year": "L’année fiscale",
    "mandatory-translation": "Traduction en français obligatoire",
    "add-french-translation": "Ajoutez une traduction en français des informations essentielles avec le document original.",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-a-tax-notice": "Vous avez un avis d’impôt",
      "add-last-tax-notice": "Ajoutez votre dernier avis d’imposition délivré par votre pays de résidence.",
      "personal-information": "Vos informations personnelles",
      "declared-income": "Vos revenus déclarés",
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-a-tax-notice": "Votre garant a un avis d’impôt",
      "add-last-tax-notice": "Ajoutez le dernier avis d’imposition de votre garant délivré par son pays de résidence.",
      "personal-information": "Ses informations personnelles",
      "declared-income": "Ses revenus déclarés",
    },
    "couple": {
      "your-situation": "La situation de votre conjoint :",
      "have-a-tax-notice": "Votre conjoint a un avis d’impôt",
      "add-last-tax-notice": "Ajoutez le dernier avis d’imposition de votre conjoint délivré par son pays de résidence.",
      "personal-information": "Ses informations personnelles",
      "declared-income": "Ses revenus déclarés",
    },
    "couple-guarantor": {
      "your-situation": "La situation de son garant :",
      "have-a-tax-notice": "Son garant a un avis d’impôt",
      "add-last-tax-notice": "Ajoutez le dernier avis d’imposition de son garant délivré par son pays de résidence.",
      "personal-information": "Ses informations personnelles",
      "declared-income": "Ses revenus déclarés",
    },
  }
}
</i18n>
