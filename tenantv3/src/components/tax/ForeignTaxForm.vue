<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-a-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('foreign')" :to="parent" />
  <p class="text-bold">{{ t('add-last-tax-notice') }}</p>
  <p class="fr-mb-0">
    {{ t('doc-must-contain') }}
  </p>
  <ul class="fr-mb-3w">
    <li>{{ t('your-personal-information') }}</li>
    <li>{{ t('your-declared-income') }}</li>
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

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
</script>

<i18n>
{
  "en": {
    "your-situation": "Your situation:",
    "you-have-a-tax-notice": "You have a tax notice",
    "foreign": "foreign",
    "add-last-tax-notice": "Add your last tax notice issued by your country of residence.",
    "doc-must-contain": "The document must contain:",
    "your-personal-information": "Your personal information",
    "your-declared-income": "Your declared income",
    "fiscal-year": "The fiscal year",
    "mandatory-translation": "Translation into French mandatory",
    "add-french-translation": "Add a French translation of essential information with the original document."
  },
  "fr": {
    "your-situation": "Votre situation :",
    "you-have-a-tax-notice": "Vous avez un avis d’impôt",
    "foreign": "étranger",
    "add-last-tax-notice": "Ajoutez votre dernier avis d’imposition délivré par votre pays de résidence.",
    "doc-must-contain": "Le document doit contenir :",
    "your-personal-information": "Vos informations personnelles",
    "your-declared-income": "Vos revenus déclarés",
    "fiscal-year": "L’année fiscale",
    "mandatory-translation": "Traduction en français obligatoire",
    "add-french-translation": "Ajoutez une traduction en français des informations essentielles avec le document original."
  }
}
</i18n>
