<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('parents-declaration')" :to="parent" />

  <form class="honor-declaration-form">
    <div class="fr-checkbox-group fr-checkbox-group--sm">
      <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
      <label class="fr-label" :for="formId">{{ t('i-attest') }}</label>
    </div>
  </form>

  <StatementPreview v-if="attestChecked"> "{{ t('i-have-no-tax') }}". </StatementPreview>

  <MandatoryDeclarationInfo />
  <FirstDeclarationInfo />

  <TaxFooter category="MY_PARENTS" :next-disabled="!attestChecked" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useI18n } from 'vue-i18n'
import { ref, useId } from 'vue'
import MandatoryDeclarationInfo from './lib/MandatoryDeclarationInfo.vue'
import FirstDeclarationInfo from './lib/FirstDeclarationInfo.vue'
import StatementPreview from '@/components/tax/lib/StatementPreview.vue'

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
    "parents-declaration": "You are registered on your parents' tax return",
    "i-attest": "I hereby certify that my situation is accurate, and I understand that this information will be visible in my file.",
    "i-have-no-tax": "I am parts of my parents's tax household and do not have a tax assessment notice in my own name."
  },
  "fr": {
    "your-situation": "Votre situation :",
    "you-have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    "parents-declaration": "Vous êtes inscrit sur la déclaration d’impôt de vos parents",
    "i-attest": "J’atteste sur l’honneur que ma situation est exacte, et je comprends que cette information sera visible dans mon dossier.",
    "i-have-no-tax": "Je suis rattaché·e au foyer fiscal de mes parents et ne dispose pas d’un avis à mon nom propre."
  }
}
</i18n>
