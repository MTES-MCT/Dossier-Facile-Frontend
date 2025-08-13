<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-no-tax-notice')" @click="backTwoSteps" />
  <BackLinkRow :label="t('no-declaration')" @click="backOneStep" />

  <form class="fr-mb-3w">
    <div class="fr-checkbox-group fr-checkbox-group--sm">
      <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
      <label class="fr-label" :for="formId">{{ t('i-attest') }}</label>
    </div>
  </form>

  <DfButton v-if="attestChecked" class="mx-auto fr-mb-3w"
    >{{ t('see-in-file') }} <RiEyeLine class="fr-ml-1v"
  /></DfButton>

  <MandatoryDeclarationInfo />
  <FirstDeclarationInfo />

  <TaxFooter category="OTHER_TAX" step="TAX_NO_DECLARATION" :next-disabled="!attestChecked" />
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
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { RiEyeLine } from '@remixicon/vue'
import MandatoryDeclarationInfo from './lib/MandatoryDeclarationInfo.vue'
import FirstDeclarationInfo from './lib/FirstDeclarationInfo.vue'

const { t } = useI18n()
const router = useRouter()
const taxState = useTaxState()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()

const attestChecked = ref(taxState.document.value?.documentCategoryStep === 'TAX_NO_DECLARATION')

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
    "no-declaration": "You have not yet made your first declaration",
    "i-attest": "I hereby certify that I cannot provide a document, and I understand that this information will be visible in my file.",
    "see-in-file": "See the certificate in my file",
  },
  "fr": {
    "your-situation": "Votre situation :",
    "you-have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    "no-declaration": "Vous n’avez pas encore fait votre première déclaration",
    "i-attest": "J’atteste sur l’honneur ne pas pouvoir fournir de document, et je comprends que cette information sera visible dans mon dossier.",
    "see-in-file": "Voir l’attestation dans mon dossier",
  }
}
</i18n>
