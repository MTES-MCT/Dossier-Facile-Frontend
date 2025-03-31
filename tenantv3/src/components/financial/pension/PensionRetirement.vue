<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="grandparent" />
  <BackLinkRow :label="t('you-receive')" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/bulletin'"
      >{{ t('pension-statement') }}
      <span class="fr-hint-text">Info retraite, AGIRC-ARCO, Carsat</span>
    </RadioListItem>
    <RadioListItem :to="here + '/pas-de-bulletin'">{{ t('no-statement') }}</RadioListItem>
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

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive a pension",
    "pension-statement": "You have a pension statement",
    "no-statement": "You don't have a pension statement",
  },
  "fr": {
    "you-receive": "Vous touchez une retraite",
    "pension-statement": "Vous avez un bulletin de pension",
    "no-statement": "Vous n’avez pas de bulletin de pension",
  }
}
</i18n>
