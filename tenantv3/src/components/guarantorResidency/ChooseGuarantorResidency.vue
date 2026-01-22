<template>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { useRoute } from 'vue-router'
import { computed, type ComputedRef } from 'vue'
import { useResidencyState } from '../residency/residencyState'

const { t } = useI18n()
const route = useRoute()
const { category } = useResidencyState()
const here = computed(() => route.path)

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/tenant`,
    title: t('residency.tenant'),
    event: 'tenant'
  },
  {
    to: `${here.value}/owner`,
    title: t('residency.owner'),
    event: 'owner'
  },
  {
    to: `${here.value}/guest`,
    title: t('residency.guest'),
    event: 'guest',
    description: t('residency.guest-subtext')
  },
  {
    to: `${here.value}/guest-company`,
    title: t('residency.guest-company'),
    event: 'guest-company'
  },
  {
    to: `${here.value}/other`,
    title: t('residency.other'),
    event: 'other'
  }
])
</script>

<i18n>
{
  "en": {
    "residency": {
      "tenant": "Tenant",
      "guest": "Staying with someone",
      "guest-subtext": "At a relative's, a friend's…",
      "owner": "Owner",
      "guest-company": "In a staff housing",
      "guest-organism": "Hosted by an organization",
      "other": "Other"
    }
  },
  "fr": {
    "residency": {
      "tenant": "Locataire",
      "guest": "Hébergé chez quelqu'un",
      "guest-subtext": "Chez un parent, un ami, un proche…",
      "owner": "Propriétaire",
      "guest-company": "Dans un logement de fonction",
      "other": "Autre",
    }
  }
}
</i18n>
