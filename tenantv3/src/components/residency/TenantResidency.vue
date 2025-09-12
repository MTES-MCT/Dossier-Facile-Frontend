<template>
  <BackLinkRow
    :label="t(textKey + '.you-tenant')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <RadioList>
    <RadioListItem to="tenant/receipts" @click="sendEvent('receipts')">{{
      t(textKey + '.have-receipts')
    }}</RadioListItem>
    <RadioListItem to="tenant/proof" @click="sendEvent('proof')">{{
      t(textKey + '.have-proof')
    }}</RadioListItem>
  </RadioList>
  <div class="fr-highlight">
    <i18n-t :keypath="textKey + '.no-receipts'" tag="p">
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/R54103"
        :title="`${t(textKey + '.receipt-model')} - ${t('new-window')}`"
        target="_blank"
        >{{ t(textKey + '.receipt-model') }}</a
      >
    </i18n-t>
  </div>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
const { t } = useI18n()
const { category, textKey } = useResidencyState()
const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'tenant', subCategory)
</script>

<i18n>
{
  "en": {
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-receipts": "You have your last 3 rent receipts",
      "have-proof": "You have proof of good payment of rent",
      "no-receipts": "Don't have a rent receipt? Contact your landlord, who is legally obliged to provide them. You can send him {0}.",
      "receipt-model": "this sample receipt"
    },
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-receipts": "Your spouse has his or her last 3 rent receipts",
      "have-proof": "Your spouse has proof of good payment of rent",
      "no-receipts": "Does your spouse not have a rent receipt? He can contact his landlord, who is legally obliged to provide them. He can send him {0}.",
      "receipt-model": "this sample receipt"
    }
  },
  "fr": {
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-receipts": "Vous avez vos 3 dernières quittances de loyer",
      "have-proof": "Vous avez une attestation de bon paiement des loyers",
      "no-receipts": "Vous n’avez pas de quittance de loyer ? Contactez votre propriétaire : il est légalement tenu de vous les fournir. Vous pouvez lui transmettre {0}.",
      "receipt-model": "ce modèle de quittance"
    },
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-receipts": "Votre conjoint a ses 3 dernières quittances de loyer",
      "have-proof": "Votre conjoint a attestation de bon paiement des loyers",
      "no-receipts": "Votre conjoint n'a pas de quittance de loyer ? Il peut contacter son propriétaire : il est légalement tenu de vous les fournir. Votre conjoint peut lui transmettre {0}.",
      "receipt-model": "ce modèle de quittance"
    }
  }
}
</i18n>
