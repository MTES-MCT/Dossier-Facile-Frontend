<template>
  <RadioList>
    <RadioListItem to="2/tenant" @click="sendEvent('tenant')">{{
      t('residency.tenant')
    }}</RadioListItem>
    <RadioListItem to="2/guest" @click="sendEvent('guest')"
      >{{ t('residency.guest') }}
      <span class="fr-hint-text">{{ t(textKey + '.guest-subtext') }}</span>
    </RadioListItem>
    <RadioListItem to="2/owner" @click="sendEvent('owner')">{{
      t('residency.owner')
    }}</RadioListItem>
    <template v-if="showAllItems">
      <RadioListItem to="2/guest-company" @click="sendEvent('guest-company')">{{
        t('residency.guest-company')
      }}</RadioListItem>
      <RadioListItem to="2/short-term-rental" @click="sendEvent('short-term-rental')">{{
        t('residency.short-term-rental')
      }}</RadioListItem>
      <RadioListItem to="2/guest-organism" @click="sendEvent('guest-organism')"
        >{{ t('residency.guest-organism') }}
        <span class="fr-hint-text">{{ t('residency.guest-organism-subtext') }}</span>
      </RadioListItem>
      <RadioListItem to="2/other-residency" @click="sendEvent('other-residency')"
        >{{ t('residency.other-residency') }}
        <span class="fr-hint-text">{{ t('residency.other-residency-subtext') }}</span>
      </RadioListItem>
    </template>
  </RadioList>
  <DfButton v-if="!showAllItems" class="fr-ml-auto" @click="showAll">{{
    t('residency.other')
  }}</DfButton>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from '../common/RadioList.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import RadioListItem from '../common/RadioListItem.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { showAllItems, useResidencyState } from './residencyState'
const { t } = useI18n()
const { category, textKey } = useResidencyState()
const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)
const showAll = () => {
  AnalyticsService.selectOther(category)
  showAllItems.value = true
}
</script>

<i18n>
{
  "en": {
    "residency": {
      "tenant": "Tenant",
      "guest": "Staying with someone",
      "owner": "Owner",
      "guest-company": "In a staff housing",
      "short-term-rental": "Airbnb rentals, hotels, campsites",
      "guest-organism": "Hosted by an organization",
      "guest-organism-subtext": "Emergency housing, placement",
      "other-residency": "In a precarious situation",
      "other-residency-subtext": "homeless, victim of domestic violence",
      "other": "Other situations…"
    },
    "tenant": {
      "guest-subtext": "At your parents', a friend's, a relative's…",
    },
    "couple": {
      "guest-subtext": "At a relative's, a friend's…",
    }
  },
  "fr": {
    "residency": {
      "tenant": "Locataire",
      "guest": "Hébergé chez quelqu'un",
      "owner": "Propriétaire",
      "guest-company": "Dans un logement de fonction",
      "short-term-rental": "En location de type airbnb, à l'hôtel, au camping",
      "guest-organism": "Hébergé par un organisme",
      "guest-organism-subtext": "Hébergement d'urgence, placement",
      "other-residency": "En situation précaire",
      "other-residency-subtext": "sans-abri, victime de violences conjugales",
      "other": "Autres situations…"
    },
    "tenant": {
      "guest-subtext": "Chez vos parents, un ami, un proche…",
    },
    "couple": {
      "guest-subtext": "Chez un parent, un ami, un proche…",
    }
  }
}
</i18n>
