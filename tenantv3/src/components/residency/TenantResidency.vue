<template>
  <BackLinkRow
    :label="t(textKey + '.you-tenant')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <DsfrAlert :title="t(textKey + '.no-receipts-title')" title-tag="h2">
    <p>
      {{ t(textKey + '.no-receipts') }}
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/R54103"
        :title="`${t(textKey + '.receipt-model')} - ${t('new-window')}`"
        target="_blank"
        >{{ t(textKey + '.receipt-model') }}</a
      >
    </p>
  </DsfrAlert>
  <hr />
  <DsfrCallout :content="t(textKey + '.no-receipts-title')">
    <p>
      {{ t(textKey + '.no-receipts') }}
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/R54103"
        :title="`${t(textKey + '.receipt-model')} - ${t('new-window')}`"
        target="_blank"
        >{{ t(textKey + '.receipt-model') }}</a
      >
    </p>
  </DsfrCallout>
  <DsfrNotice type="info">
    <template #default> {{ t(textKey + '.no-receipts-title') }} <br /> </template>
    <template #desc>
      {{ t(textKey + '.no-receipts') }}
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/R54103"
        :title="`${t(textKey + '.receipt-model')} - ${t('new-window')}`"
        target="_blank"
        >{{ t(textKey + '.receipt-model') }}</a
      >
    </template>
  </DsfrNotice>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { DsfrAlert, DsfrCallout, DsfrNotice } from '@gouvminint/vue-dsfr'

const route = useRoute()
const here = computed(() => route.path)
const { t } = useI18n()
const { category, textKey } = useResidencyState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'tenant', subCategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/receipts`,
    title: t(textKey + '.have-receipts'),
    event: 'receipts'
  },
  {
    to: `${here.value}/proof`,
    title: t(textKey + '.have-proof'),
    event: 'proof'
  }
])
</script>

<i18n>
{
  "en": {
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-receipts": "You have your last 3 rent receipts",
      "have-proof": "You have proof of good payment of rent",
      "no-receipts-title": "Don't have a rent receipt?",
      "no-receipts": "Contact your landlord, who is legally obliged to provide them. You can send him {0} ",
      "receipt-model": "this sample receipt"
    },
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-receipts": "Your spouse has his or her last 3 rent receipts",
      "have-proof": "Your spouse has proof of good payment of rent",
      "no-receipts-title": "Does your spouse not have a rent receipt?",
      "no-receipts": "He can contact his landlord, who is legally obliged to provide them. He can send him {0} ",
      "receipt-model": "this sample receipt"
    }
  },
  "fr": {
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-receipts": "Vous avez vos 3 dernières quittances de loyer",
      "have-proof": "Vous avez une attestation de bon paiement des loyers",
      "no-receipts-title": "Vous n’avez pas de quittance de loyer ?",
      "no-receipts": "Contactez votre propriétaire : il est légalement tenu de vous les fournir. Vous pouvez lui transmettre ce {0} ",
      "receipt-model": "modèle de quittance"
    },
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-receipts": "Votre conjoint a ses 3 dernières quittances de loyer",
      "have-proof": "Votre conjoint a attestation de bon paiement des loyers",
      "no-receipts-title": "Votre conjoint n'a pas de quittance de loyer ?",
      "no-receipts": "Il peut contacter son propriétaire : il est légalement tenu de vous les fournir. Votre conjoint peut lui transmettre {0} ",
      "receipt-model": "ce modèle de quittance"
    }
  }
}
</i18n>
