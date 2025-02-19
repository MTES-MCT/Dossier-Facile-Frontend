<template>
  <RadioList>
    <RadioListItem :to="guarantorId + '/tenant'" @click="sendEvent('tenant')">{{
      t('residency.tenant')
    }}</RadioListItem>
    <RadioListItem :to="guarantorId + '/owner'" @click="sendEvent('owner')">{{
      t('residency.owner')
    }}</RadioListItem>
    <RadioListItem :to="guarantorId + '/guest'" @click="sendEvent('guest')"
      >{{ t('residency.guest') }}
      <span class="fr-hint-text">{{ t('residency.guest-subtext') }}</span>
    </RadioListItem>
    <RadioListItem :to="guarantorId + '/guest-company'" @click="sendEvent('guest-company')">{{
      t('residency.guest-company')
    }}</RadioListItem>
    <RadioListItem :to="guarantorId + '/other'" @click="sendEvent('other')"
      >{{ t('residency.other') }}
    </RadioListItem>
  </RadioList>
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/residency/lib/RadioList.vue'
import RadioListItem from '@/components/residency/lib/RadioListItem.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useGuarantorId } from './useGuarantorId'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'

const { t } = useI18n()
const guarantorId = useGuarantorId()

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation('guarantor-residency', subcategory)
</script>

<i18n>
{
  "en": {
    "residency": {
      "tenant": "Tenant",
      "guest": "Staying with someone",
      "guest-subtext": "At your parents', a friend's, a relative's…",
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
      "guest-subtext": "Chez vos parents, un ami, un proche…",
      "owner": "Propriétaire",
      "guest-company": "Dans un logement de fonction",
      "other": "Autre",
    }
  }
}
</i18n>
