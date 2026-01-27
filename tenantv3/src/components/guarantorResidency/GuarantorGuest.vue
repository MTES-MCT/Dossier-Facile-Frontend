<template>
  <BackLinkRow
    :label="t(textKey + '.guest')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <GuarantorResidencyFooter />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const parentRoute = useParentRoute()
const { category, textKey } = useResidencyState()

const route = useRoute()
const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(category, 'guest', subcategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/proof`,
    title: t(textKey + '.proof'),
    event: 'proof'
  },
  {
    to: `${here.value}/no-proof`,
    title: t(textKey + '.no-proof'),
    event: 'no-proof'
  }
])
</script>

<i18n>
{
  "en": {
    "tenant": {
      "guest": "Your guarantor is a lodger",
      "proof": "Your guarantor has proof of accomodation less than 3 months old",
      "no-proof": "Your guarantor has no proof of accomodation"
    },
    "couple": {
      "guest": "Their guarantor is a lodger",
      "proof": "Their guarantor has proof of accomodation less than 3 months old",
      "no-proof": "Their guarantor has no proof of accomodation"
    }
  },
  "fr": {
    "tenant": {
      "guest": "Votre garant est hébergé",
      "proof": "Votre garant a une attestation d'hébergement de moins de 3 mois",
      "no-proof": "Votre garant n'a pas d'attestation d'hébergement"
    },
    "couple": {
      "guest": "Son garant est hébergé",
      "proof": "Son garant a une attestation d'hébergement de moins de 3 mois",
      "no-proof": "Son garant n'a pas d'attestation d'hébergement"
    }
  }
}
</i18n>
