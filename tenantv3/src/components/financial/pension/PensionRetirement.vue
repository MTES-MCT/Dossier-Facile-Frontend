<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="grandparent" />
  <BackLinkRow :label="t('you-receive.' + textKey)" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/bulletin'"
      >{{ t('pension-statement.' + textKey) }}
      <span class="fr-hint-text">Info retraite, AGIRC-ARCO, Carsat</span>
    </RadioListItem>
    <RadioListItem :to="here + '/pas-de-bulletin'">{{
      t('no-statement.' + textKey)
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive a pension",
      "guarantor": "Your guarantor receives a pension",
      "couple": "Your spouse receives a pension",
      "couple-guarantor": "Their guarantor receives a pension",
    },
    "pension-statement": {
      "tenant": "You have a pension statement",
      "guarantor": "Your guarantor has a pension statement",
      "couple": "Your spouse has a pension statement",
      "couple-guarantor": "Their guarantor has a pension statement",
    },
    "no-statement": {
      "tenant": "You don't have a pension statement",
      "guarantor": "Your guarantor has no pension statement",
      "couple": "Your spouse has no pension statement",
      "couple-guarantor": "Their guarantor has no pension statement",
    },
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une retraite",
      "guarantor": "Votre garant touche une retraite",
      "couple": "Votre conjoint touche une retraite",
      "couple-guarantor": "Son garant touche une retraite",
    },
    "pension-statement": {
      "tenant": "Vous avez un bulletin de pension",
      "guarantor": "Votre garant a un bulletin de pension",
      "couple": "Votre conjoint a un bulletin de pension",
      "couple-guarantor": "Son garant a un bulletin de pension",
    },
    "no-statement": {
      "tenant": "Vous n’avez pas de bulletin de pension",
      "guarantor": "Votre garant n’a pas de bulletin de pension",
      "couple": "Votre conjoint n’a pas de bulletin de pension",
      "couple-guarantor": "Son garant n’a pas de bulletin de pension",
    }
  }
}
</i18n>
