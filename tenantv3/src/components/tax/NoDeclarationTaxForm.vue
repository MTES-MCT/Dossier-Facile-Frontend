<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('no-declaration')" :to="parent" />

  <form class="honor-declaration-form">
    <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
    <label :for="formId">{{ t('i-attest') }}</label>
  </form>

  <DfButton v-if="attestChecked" class="mx-auto fr-mb-3w"
    >{{ t('see-in-file') }} <RiEyeLine class="fr-ml-1v"
  /></DfButton>

  <MandatoryDeclarationInfo />
  <FirstDeclarationInfo />

  <TaxFooter category="OTHER_TAX" step="TAX_NO_DECLARATION" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useI18n } from 'vue-i18n'
import { ref, useId } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { RiEyeLine } from '@remixicon/vue'
import MandatoryDeclarationInfo from './lib/MandatoryDeclarationInfo.vue'
import FirstDeclarationInfo from './lib/FirstDeclarationInfo.vue'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()

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
