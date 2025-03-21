<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" />
  <BackLinkRow :label="t('form.financial.employed')" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'">{{
      t('form.financial.more-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'">{{
      t('form.financial.less-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/pas-encore'">{{ t('not-yet') }}</RadioListItem>
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
    "not-yet": "You have not yet taken up your position or you have been on the job for less than a month"
  },
  "fr": {
    "not-yet": "Vous n’avez pas encore pris votre poste ou vous avez commencé depuis moins d’un mois"
  }
}
</i18n>
