<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('other-situation')" :to="parent" />

  <p>{{ t('this-situation') }}</p>

  <form class="honor-declaration-form">
    <div class="fr-input-group" :class="{ 'fr-input-group--error': showError }">
      <label :for="formId" class="fr-label explain-label">
        {{ t(textKey + '.describe-situation') }} ({{ t('form.label.required') }})
        <span class="fr-hint-text">{{ t('character-min') }}</span>
      </label>
      <textarea
        :id="formId"
        ref="explainTextarea"
        v-model="explanation"
        class="fr-input fr-mt-1w"
        :class="{ 'fr-input--error': showError }"
        rows="3"
        minlength="10"
        maxlength="1355"
        aria-required="true"
        :aria-invalid="showError"
        :aria-describedby="showError ? 'explainText-error explain-info-text' : 'explain-info-text'"
      />
      <p id="explain-info-text" class="fr-my-1w">
        {{ t('character-count', { n: explanation.length, max: 1355 }) }}
      </p>
      <p v-if="showError" id="explainText-error" class="fr-error-text" role="alert">
        {{ explainErrorMessage }}
      </p>
    </div>
  </form>

  <p>{{ t(textKey + '.you-can-add-docs') }}</p>

  <UploadFilesTax v-if="showUpload" category="OTHER_TAX" :explanation="explanation" />
  <DfButton v-else class="mx-auto" @click="showUpload = true">{{ t('add-document') }}</DfButton>

  <JointTaxInfo :parent="grandParent" class="fr-mt-3w" />

  <AnalysisFooter
    ref="footer"
    :previous-step="previousStep"
    :on-submit-action="submitAction"
    :on-error="handleError"
    @on-next="handleNext"
  />
</template>

<script setup lang="ts">
// TODO: add (better) validation to required input
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { computed, ref, useId, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import JointTaxInfo from './lib/JointTaxInfo.vue'
import UploadFilesTax from './lib/UploadFilesTax.vue'
import AnalysisFooter from '../footer/AnalysisFooter.vue'

const { t } = useI18n()
const router = useRouter()
const { document, textKey, previousStep, nextStep, category, action, addData } = useTaxState()
const store = useTenantStore()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()

const footer = useTemplateRef('footer')

const explanation = ref(document.value?.customText || '')
const showUpload = ref((document.value?.files?.length || 0) > 0)

const hasSubmitted = ref(false)
const isExplainError = computed(() => explanation.value.trim().length < 10)
const explainErrorMessage = computed(() => {
  if (explanation.value.trim().length === 0) {
    return t('explain-error')
  }
  return t('explain-error-min-length')
})
const showError = computed(() => isExplainError.value && hasSubmitted.value)

const submitAction = async () => {
  hasSubmitted.value = true
  if (isExplainError.value) return

  AnalyticsService.validateFunnelStep(category)

  const formData = new FormData()
  formData.append('typeDocumentTax', 'OTHER_TAX')
  formData.append('noDocument', String((document.value?.files?.length || 0) === 0))

  if (explanation.value) {
    formData.append('customText', UtilsService.stripNewlines(explanation.value))
  }

  addData?.(formData)
  await store[action](formData)
}

const handleError = (error: unknown) => {
  hasSubmitted.value = true
  UtilsService.handleCommonSaveError(error, footer.value?.button)
}

const handleNext = () => {
  if (showError.value) return
  router.push(nextStep)
}
</script>

<style scoped>
.honor-declaration-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "other-situation": "Other situation",
    "explain-error": "Please describe your situation before continuing.",
    "explain-error-min-length": "Your explanation must contain at least 10 characters.",
    "character-min": "At least 10 characters",
    "character-count": "{n}/{max} characters",
    "this-situation": "This situation concerns people who cannot provide a tax notice.",
    "add-document": "Add document",
    "tenant": {
      "your-situation": "Your situation:",
      "have-no-tax-notice": "You have no tax notice",
      "describe-situation": "Describe your situation. Your explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify your situation."
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-no-tax-notice": "Your guarantor has no tax notice",
      "describe-situation": "Describe their situation. The explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify their situation."
    },
    "couple": {
      "your-situation": "Your spouse's situation:",
      "have-no-tax-notice": "Your spouse has no tax notice",
      "describe-situation": "Describe their situation. The explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify their situation."
    },
    "couple-guarantor": {
      "your-situation": "Their guarantor's situation:",
      "have-no-tax-notice": "Their guarantor has no tax notice",
      "describe-situation": "Describe their situation. The explanation will be added to your file.",
      "you-can-add-docs": "You can add any document that can demonstrate or justify their situation."
    }
  },
  "fr": {
    "other-situation": "Autre situation",
    "explain-error": "Veuillez décrire votre situation avant de continuer.",
    "explain-error-min-length": "Votre explication doit contenir au moins 10 caractères.",
    "character-min": "Au moins 10 caractères",
    "character-count": "{n}/{max} caractères",
    "this-situation": "Cette situation concerne les personnes qui ne peuvent pas fournir un avis d’impôt.",
    "add-document": "Ajouter un document",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
      "describe-situation": "Décrivez votre situation. Votre explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier votre situation."
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
      "describe-situation": "Décrivez sa situation. L’explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier sa situation."
    },
    "couple": {
      "your-situation": "La situation de votre conjoint :",
      "have-no-tax-notice": "Votre conjoint n’a pas d’avis d’impôt",
      "describe-situation": "Décrivez sa situation. L’explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier sa situation."
    },
    "couple-guarantor": {
      "your-situation": "La situation de son garant :",
      "have-no-tax-notice": "Son garant n’a pas d’avis d’impôt",
      "describe-situation": "Décrivez sa situation. L’explication sera ajoutée à votre dossier.",
      "you-can-add-docs": "Vous pouvez ajouter tout document pouvant démontrer ou justifier sa situation."
    }
  }
}
</i18n>
