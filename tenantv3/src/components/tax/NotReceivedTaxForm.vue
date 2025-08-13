<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-no-tax-notice')" @click="backTwoSteps" />
  <BackLinkRow :label="t('not-received')" @click="backOneStep" />

  <p class="text-bold fr-mb-0">{{ t('only-this-case') }}</p>
  <ul class="fr-mb-3w">
    <i18n-t tag="li" keypath="tax-not-available">
      <strong>{{ t('first-declaration') }}</strong>
    </i18n-t>
  </ul>

  <form class="fr-mb-3w">
    <div class="fr-checkbox-group fr-checkbox-group--sm">
      <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
      <label class="fr-label" :for="formId">{{ t('i-attest') }}</label>
    </div>
  </form>

  <DfButton v-if="attestChecked" class="mx-auto fr-mb-3w"
    >{{ t('see-in-file') }} <RiEyeLine class="fr-ml-1v"
  /></DfButton>

  <JointTaxInfo :parent="grandParent" class="fr-mt-3w" />

  <TaxFooter category="OTHER_TAX" step="TAX_NOT_RECEIVED" :next-disabled="!attestChecked" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ref, useId } from 'vue'
import JointTaxInfo from './lib/JointTaxInfo.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { RiEyeLine } from '@remixicon/vue'

const { t } = useI18n()
const router = useRouter()
const taxState = useTaxState()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()

const attestChecked = ref(taxState.document.value?.documentCategoryStep === 'TAX_NOT_RECEIVED')

function backOneStep() {
  AnalyticsService.editSituation2(taxState.category, 'with-tax', 'foreign')
  router.push(parent.value)
}

function backTwoSteps() {
  AnalyticsService.editSituation2(taxState.category, 'with-tax', 'foreign')
  router.push(grandParent.value)
}
</script>

<i18n>
{
  "en": {
    "your-situation": "Your situation:",
    "you-have-no-tax-notice": "You have no tax notice",
    "not-received": "You have not yet received your tax notice",
    "only-this-case": "Only the following cases are concerned:",
    "i-attest": "I hereby certify that I cannot provide a document, and I understand that this information will be visible in my file.",
    "tax-not-available": "You made {0} recently, the tax notice is not yet available",
    "first-declaration": "your first return",
    "see-in-file": "See the certificate in my file",
  },
  "fr": {
    "your-situation": "Votre situation :",
    "you-have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    "not-received": "Vous n’avez pas encore reçu votre avis d’impôt",
    "only-this-case": "Seuls les cas suivants sont concernés :",
    "i-attest": "J’atteste sur l’honneur ne pas pouvoir fournir de document, et je comprends que cette information sera visible dans mon dossier.",
    "tax-not-available": "Vous avez fait {0} récemment, l’avis d’impôt n’est pas encore disponible.",
    "first-declaration": "votre première déclaration",
    "see-in-file": "Voir l’attestation dans mon dossier",
  }
}
</i18n>
