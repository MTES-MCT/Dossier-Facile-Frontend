<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-no-tax-notice')" @click="backTwoSteps" />
  <BackLinkRow :label="t('other-situation')" @click="backOneStep" />

  <p>{{ t('this-situation') }}</p>

  <form class="honor-declaration-form">
    <label :for="formId"
      >{{ t('describe-situation') }}
      <span class="fr-ml-1v" style="color: red">*</span>
    </label>
    <textarea :id="formId" v-model="explanation" class="fr-input" />
  </form>

  <p>{{ t('you-can-add-docs') }}</p>

  <UploadFilesTax v-if="showUpload" category="OTHER_TAX" :explanation="explanation" />
  <DfButton v-else class="mx-auto" @click="showUpload = true">{{ t('add-document') }}</DfButton>

  <JointTaxInfo :parent="grandParent" class="fr-mt-3w" />

  <TaxFooter category="OTHER_TAX" :explanation="explanation" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed, ref, useId } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import JointTaxInfo from './lib/JointTaxInfo.vue'
import UploadFilesTax from './lib/UploadFilesTax.vue'

const { t } = useI18n()
const router = useRouter()
const taxState = useTaxState()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()

const explanation = ref(taxState.document.value?.customText || '')
const showUpload = ref((taxState.document.value?.files?.length || 0) > 0)

function backOneStep() {
  AnalyticsService.editSituation2(taxState.category, 'with-tax', 'foreign')
  router.push(parent.value)
}

function backTwoSteps() {
  AnalyticsService.editSituation2(taxState.category, 'with-tax', 'foreign')
  router.push(grandParent.value)
}
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
    "your-situation": "Your situation:",
    "you-have-no-tax-notice": "You have no tax notice",
    "other-situation": "Other situation",
    "this-situation": "This situation concerns people who cannot provide a tax notice.",
    "describe-situation": "Describe your situation. Your explanation will be added to your file.",
    "you-can-add-docs": "You can add any document that can demonstrate or justify your situation.",
    "add-document": "Add document"
  },
  "fr": {
    "your-situation": "Votre situation :",
    "you-have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    "other-situation": "Autre situation",
    "this-situation": "Cette situation concerne les personnes qui ne peuvent pas fournir un avis d’impôt.",
    "describe-situation": "Décrivez votre situation. Votre explication sera ajoutée à votre dossier.",
    "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier votre situation.",
    "add-document": "Ajouter un document"
  }
}
</i18n>
