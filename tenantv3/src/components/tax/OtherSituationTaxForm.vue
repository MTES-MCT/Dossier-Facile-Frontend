<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('other-situation')" :to="parent" />

  <p>{{ t('this-situation') }}</p>

  <form class="honor-declaration-form">
    <label :for="formId"
      >{{ t(textKey + '.describe-situation') }}
      <span class="fr-ml-1v" style="color: red">*</span>
    </label>
    <textarea :id="formId" v-model="explanation" class="fr-input" />
  </form>

  <p>{{ t(textKey + '.you-can-add-docs') }}</p>

  <UploadFilesTax v-if="showUpload" category="OTHER_TAX" :explanation="explanation" />
  <DfButton v-else class="mx-auto" @click="showUpload = true">{{ t('add-document') }}</DfButton>

  <JointTaxInfo :parent="grandParent" class="fr-mt-3w" />

  <TaxFooter category="OTHER_TAX" :explanation="explanation" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { useI18n } from 'vue-i18n'
import { ref, useId } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import JointTaxInfo from './lib/JointTaxInfo.vue'
import UploadFilesTax from './lib/UploadFilesTax.vue'

const { t } = useI18n()
const { document, textKey } = useTaxState()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()

const explanation = ref(document.value?.customText || '')
const showUpload = ref((document.value?.files?.length || 0) > 0)
</script>

<style scoped>
.honor-declaration-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}
</style>

<i18n>
{
  "en": {
    "other-situation": "Other situation",
    "this-situation": "This situation concerns people who cannot provide a tax notice.",
    "add-document": "Add document",
    "tenant": {
      "your-situation": "Your situation:",
      "have-no-tax-notice": "You have no tax notice",
      "describe-situation": "Describe your situation. Your explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify your situation.",
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-no-tax-notice": "Your guarantor has no tax notice",
      "describe-situation": "Describe their situation. The explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify their situation.",
    },
    "couple": {
      "your-situation": "Your spouse's situation:",
      "have-no-tax-notice": "Your spouse has no tax notice",
      "describe-situation": "Describe their situation. The explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify their situation.",
    },
    "couple-guarantor": {
      "your-situation": "Their guarantor's situation:",
      "have-no-tax-notice": "Their guarantor has no tax notice",
      "describe-situation": "Describe their situation. The explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify their situation.",
    },
  },
  "fr": {
    "other-situation": "Autre situation",
    "this-situation": "Cette situation concerne les personnes qui ne peuvent pas fournir un avis d’impôt.",
    "add-document": "Ajouter un document",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
      "describe-situation": "Décrivez votre situation. Votre explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier votre situation.",
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
      "describe-situation": "Décrivez sa situation. L’explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier sa situation.",
    },
    "couple": {
      "your-situation": "La situation de votre conjoint :",
      "have-no-tax-notice": "Votre conjoint n’a pas d’avis d’impôt",
      "describe-situation": "Décrivez sa situation. L’explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier sa situation.",
    },
    "couple-guarantor": {
      "your-situation": "La situation de son garant :",
      "have-no-tax-notice": "Son garant n’a pas d’avis d’impôt",
      "describe-situation": "Décrivez sa situation. L’explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier sa situation.",
    },
  }
}
</i18n>
