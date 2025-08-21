<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t(textKey + '.no-declaration')" :to="parent" />

  <form class="fr-mb-3w">
    <div class="fr-checkbox-group fr-checkbox-group--sm">
      <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
      <label class="fr-label" :for="formId">{{ t('i-attest') }}</label>
    </div>
  </form>

  <StatementPreview v-if="attestChecked"> "{{ t('i-cant-provide') }}" </StatementPreview>

  <MandatoryDeclarationInfo />
  <FirstDeclarationInfo />

  <TaxFooter category="OTHER_TAX" step="TAX_NO_DECLARATION" :next-disabled="!attestChecked" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useI18n } from 'vue-i18n'
import { ref, useId } from 'vue'
import MandatoryDeclarationInfo from './lib/MandatoryDeclarationInfo.vue'
import FirstDeclarationInfo from './lib/FirstDeclarationInfo.vue'
import { useTaxState } from './lib/taxState'
import StatementPreview from '@/components/tax/lib/StatementPreview.vue'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()
const { document, textKey } = useTaxState()

const attestChecked = ref(document.value?.documentCategoryStep === 'TAX_NO_DECLARATION')
</script>

<i18n>
{
  "en": {
    "i-attest": "I hereby certify that I cannot provide a document, and I understand that this information will be visible in my file.",
    "i-cant-provide": "I am unable to provide a tax notice because I have not yet filed my first tax return.",
    "tenant": {
      "your-situation": "Your situation:",
      "have-no-tax-notice": "You have no tax notice",
      "no-declaration": "You have not yet made your first declaration",
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-no-tax-notice": "Your guarantor has no tax notice",
      "no-declaration": "Your guarantor has not yet made their first declaration",
    },
    "couple": {
      "your-situation": "Your spouse's situation:",
      "have-no-tax-notice": "Your spouse has no tax notice",
      "no-declaration": "Your spouse has not yet made their first declaration",
    }
  },
  "fr": {
    "i-attest": "J’atteste sur l’honneur ne pas pouvoir fournir de document, et je comprends que cette information sera visible dans mon dossier.",
    "i-cant-provide": "Je ne suis pas en mesure de fournir un avis d’imposition car je n’ai pas encore effectué ma première déclaration.",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
      "no-declaration": "Vous n’avez pas encore fait votre première déclaration",
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
      "no-declaration": "Votre garant n’a pas encore fait sa première déclaration",
    },
    "couple": {
      "your-situation": "La situation de votre conjoint :",
      "have-no-tax-notice": "Votre conjoint n’a pas d’avis d’impôt",
      "no-declaration": "Votre conjoint n’a pas encore fait sa première déclaration",
    }
  }
}
</i18n>
