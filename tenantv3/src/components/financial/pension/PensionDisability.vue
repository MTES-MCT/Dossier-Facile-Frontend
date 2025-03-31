<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="grandparent" />
  <BackLinkRow :label="t('you-receive')" :to="parent" />
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

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive a disability pension",
    "not-yet": "You are not yet receiving a disability pension"
  },
  "fr": {
    "you-receive": "Vous touchez une pension d’invalidité",
    "not-yet": "Vous ne touchez pas encore de pension d’invalidité"
  }
}
</i18n>
