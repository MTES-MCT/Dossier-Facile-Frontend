<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="grandparent" />
  <BackLinkRow
    :label="t('form.financial.you-receive.' + textKey, [t('form.financial.social.aah')])"
    :to="parent"
  />
  <RadioList>
    <RadioListItem :to="here + '/plus-3-mois'">{{
      t('form.financial.more-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/moins-3-mois'">{{
      t('form.financial.less-3-months')
    }}</RadioListItem>
    <RadioListItem :to="here + '/pas-encore'">{{ t('not-yet-' + suffix) }}</RadioListItem>
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

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "not-yet-tenant": "You're not yet receiving AAH",
    "not-yet-other": "They're not yet receiving AAH",
  },
  "fr": {
    "not-yet-tenant": "Vous ne touchez pas encore l’AAH",
    "not-yet-other": "Ne touche pas encore l’AAH",
  }
}
</i18n>
