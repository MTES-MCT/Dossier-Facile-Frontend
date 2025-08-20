<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t(textKey + '.parents-declaration')" :to="parent" />

  <form class="fr-mb-3w">
    <div class="fr-checkbox-group fr-checkbox-group--sm">
      <input :id="formId" v-model="attestChecked" type="checkbox" class="fr-mx-2v fr-my-1v" />
      <label class="fr-label" :for="formId">{{ t('i-attest') }}</label>
    </div>
  </form>

  <StatementPreview v-if="attestChecked"> "{{ t(textKey + '.i-have-no-tax') }}". </StatementPreview>

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
import { useTaxState } from './lib/taxState'
import StatementPreview from '@/components/tax/lib/StatementPreview.vue'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const formId = useId()
const { document, textKey } = useTaxState()

const attestChecked = ref(document.value?.documentSubCategory === 'MY_PARENTS')
</script>

<i18n>
{
  "en": {
    "i-attest": "I hereby certify that I am unable to provide any document, and I understand that this information will be visible in my file.",
    "tenant": {
      "your-situation": "Your situation:",
      "have-no-tax-notice": "You have no tax notice",
      "parents-declaration": "You are registered on your parents' tax return",
      "i-have-no-tax": "I am parts of my parents's tax household and do not have a tax assessment notice in my own name."
    },
    "guarantor": {
      "your-situation": "Your situation:",
      "have-no-tax-notice": "You have no tax notice",
      "parents-declaration": "You are registered on your parents' tax return",
      "i-attest": "I hereby certify that my situation is accurate, and I understand that this information will be visible in my file.",
      "i-have-no-tax": "I am parts of my parents's tax household and do not have a tax assessment notice in my own name."
    }
  },
  "fr": {
    "i-attest": "J’atteste sur l’honneur ne pas pouvoir fournir de document, et je comprends que cette information sera visible dans mon dossier.",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
      "parents-declaration": "Vous êtes inscrit sur la déclaration d’impôt de vos parents",
      "i-have-no-tax": "Je suis rattaché·e au foyer fiscal de mes parents et ne dispose pas d’un avis à mon nom propre."
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
      "parents-declaration": "Votre garant est inscrit sur la déclaration d’impôt de ses parents",
      "i-have-no-tax": "Je suis rattaché·e au foyer fiscal de mes parents et ne dispose pas d’un avis à mon nom propre."
    }
  }
}
</i18n>
