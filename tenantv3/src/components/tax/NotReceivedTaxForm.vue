<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t(textKey + '.not-received')" :to="parent" />

  <p class="text-bold">{{ t('only-this-case') }}</p>
  <ul>
    <i18n-t tag="li" :keypath="textKey + '.tax-not-available'">
      <strong>{{ t(textKey + '.first-declaration') }}</strong>
    </i18n-t>
  </ul>

  <form class="honor-declaration-form">
    <div class="fr-checkbox-group fr-checkbox-group--sm">
      <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
      <label class="fr-label" :for="formId">{{ t('i-attest') }}</label>
    </div>
  </form>

  <StatementPreview v-if="attestChecked"> "{{ t('i-cant-provide') }}" </StatementPreview>

  <JointTaxInfo :parent="grandParent" class="fr-mt-3w" />

  <TaxFooter category="OTHER_TAX" step="TAX_NOT_RECEIVED" :next-disabled="!attestChecked" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useI18n } from 'vue-i18n'
import { ref, useId } from 'vue'
import JointTaxInfo from './lib/JointTaxInfo.vue'
import StatementPreview from '@/components/tax/lib/StatementPreview.vue'
import { useTaxState } from './lib/taxState'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()
const { textKey } = useTaxState()

const attestChecked = ref(false)
</script>

<style scoped>
.honor-declaration-form {
  display: flex;
  align-items: start;
  margin-bottom: 1.5rem;
}
</style>

<i18n>
{
  "en": {
    "i-attest": "I hereby certify that I cannot provide a document, and I understand that this information will be visible in my file.",
    "i-cant-provide": "I am unable to provide a tax notice because I have not yet received it (e.g., recent first filing, processing in progress).",
    "only-this-case": "Only the following cases are concerned:",
    "tenant": {
      "your-situation": "Your situation:",
      "have-no-tax-notice": "You have no tax notice",
      "not-received": "You have not yet received your tax notice",
      "tax-not-available": "You made {0} recently, the tax notice is not yet available",
      "first-declaration": "your first return",
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-no-tax-notice": "Your guarantor has no tax notice",
      "not-received": "Your guarantor has not yet received their tax notice",
      "tax-not-available": "Your guarantor made {0} recently, the tax notice is not yet available",
      "first-declaration": "their first return",
    }
  },
  "fr": {
    "i-attest": "J’atteste sur l’honneur ne pas pouvoir fournir de document, et je comprends que cette information sera visible dans mon dossier.",
    "i-cant-provide": "Je ne suis pas en mesure de fournir un avis d’imposition car je n’ai pas encore reçu mon avis (ex. : première déclaration récente, traitement en cours).",
    "only-this-case": "Seuls les cas suivants sont concernés :",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
      "not-received": "Vous n’avez pas encore reçu votre avis d’impôt",
      "tax-not-available": "Vous avez fait {0} récemment, l’avis d’impôt n’est pas encore disponible.",
      "first-declaration": "votre première déclaration",
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
      "not-received": "Votre garant n’a pas encore reçu son avis d’impôt",
      "tax-not-available": "Votre garant a fait {0} récemment, l’avis d’impôt n’est pas encore disponible.",
      "first-declaration": "sa première déclaration",
    }
  }
}
</i18n>
