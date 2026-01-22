<template>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <DfButton v-if="!showAllItems" class="fr-ml-auto" @click="showAll">{{
    t('residency.other')
  }}</DfButton>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { showAllItems, useResidencyState } from './residencyState'
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const here = computed(() => route.path)
const { t } = useI18n()
const { category, textKey } = useResidencyState()

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)

const showAll = () => {
  AnalyticsService.selectOther(category)
  showAllItems.value = true
}

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/tenant`,
    title: t('residency.tenant'),
    event: 'tenant'
  },
  {
    to: `${here.value}/guest`,
    title: t('residency.guest'),
    event: 'guest',
    description: t(textKey + '.guest-subtext')
  },
  {
    to: `${here.value}/owner`,
    title: t('residency.owner'),
    event: 'owner'
  },
  {
    to: `${here.value}/guest-company`,
    title: t('residency.guest-company'),
    event: 'guest-company',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/short-term-rental`,
    title: t('residency.short-term-rental'),
    event: 'short-term-rental',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/guest-organism`,
    title: t('residency.guest-organism'),
    event: 'guest-organism',
    description: t('residency.guest-organism-subtext'),
    condition: showAllItems.value
  },
  {
    to: `${here.value}/other-residency`,
    title: t('residency.other-residency'),
    event: 'other-residency',
    description: t('residency.other-residency-subtext'),
    condition: showAllItems.value
  }
])
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
