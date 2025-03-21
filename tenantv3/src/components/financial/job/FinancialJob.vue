<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="parent" />
  <p>{{ t('you-are') }}</p>
  <RadioList>
    <RadioListItem :to="here + '/salarie'" @click="sendEvent('employed')">{{
      t('employee')
    }}</RadioListItem>
    <RadioListItem :to="here + '/independant'" @click="sendEvent('freelance')">{{
      t('freelance')
    }}</RadioListItem>
    <RadioListItem :to="here + '/intermittent'" @click="sendEvent('intermittent')">{{
      t('intermittent')
    }}</RadioListItem>
    <RadioListItem :to="here + '/artiste-auteur'" @click="sendEvent('artist-author')">{{
      t('artist-author')
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'travail', subCategory)
</script>

<i18n>
{
  "en": {
    "you-are": "You are:",
    "employee": "employee",
    "freelance": "self-employed",
    "intermittent": "intermittent",
    "artist-author": "artist-author"
  },
  "fr": {
    "you-are": "Vous êtes :",
    "employee": "salarié",
    "freelance": "indépendant",
    "intermittent": "intermittent",
    "artist-author": "artiste-auteur"
  }
}
</i18n>
