<template>
  <RadioList>
    <RadioListItem :to="here + '/tenant'" @click="sendEvent('tenant')">{{
      t('residency.tenant')
    }}</RadioListItem>
    <RadioListItem :to="here + '/owner'" @click="sendEvent('owner')">{{
      t('residency.owner')
    }}</RadioListItem>
    <RadioListItem :to="here + '/guest'" @click="sendEvent('guest')"
      >{{ t('residency.guest') }}
      <span class="fr-hint-text">{{ t('residency.guest-subtext') }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/guest-company'" @click="sendEvent('guest-company')">{{
      t('residency.guest-company')
    }}</RadioListItem>
    <RadioListItem :to="here + '/other'" @click="sendEvent('other')"
      >{{ t('residency.other') }}
    </RadioListItem>
  </RadioList>
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useResidencyState } from '../residency/residencyState'

const { t } = useI18n()
const route = useRoute()
const { category } = useResidencyState()
const here = computed(() => route.path)

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)
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
