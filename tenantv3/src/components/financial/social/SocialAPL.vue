<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" />
  <BackLinkRow
    :label="t('form.financial.you-receive', [t('form.financial.social.apl')])"
    :to="parent"
  />
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
    "not-yet": "You're not yet receiving APL",
  },
  "fr": {
    "not-yet": "Vous ne touchez pas encore l’APL",
  }
}
</i18n>
