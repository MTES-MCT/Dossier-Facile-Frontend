<template>
  <BackLinkRow :label="t('you-tenant')" to="/documents-locataire/2" />
  <RadioList>
    <RadioListItem to="tenant/receipts">{{ t('have-receipts') }}</RadioListItem>
    <RadioListItem to="tenant/proof">{{ t('have-proof') }}</RadioListItem>
  </RadioList>
  <div class="fr-highlight">
    <i18n-t keypath="no-receipts" tag="p">
      <a href="https://www.service-public.fr/particuliers/vosdroits/R54103" target="_blank">{{
        t('receipt-model')
      }}</a>
    </i18n-t>
  </div>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from './lib/RadioList.vue'
import RadioListItem from './lib/RadioListItem.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-tenant": "You are a tenant",
    "have-receipts": "You have your last 3 rent receipts",
    "have-proof": "You have proof of good payment of rent",
    "no-receipts": "Don't have a rent receipt? Contact your landlord, who is legally obliged to provide them. You can send him {0}.",
    "receipt-model": "this sample receipt"
  },
  "fr": {
    "you-tenant": "Vous êtes locataire",
    "have-receipts": "Vous avez vos 3 dernières quittances de loyer",
    "have-proof": "Vous avez une attestation de bon paiement des loyers",
    "no-receipts": "Vous n’avez pas de quittance de loyer ? Contactez votre propriétaire : il est légalement tenu de vous les fournir. Vous pouvez lui transmettre {0}.",
    "receipt-model": "ce modèle de quittance"
  }
}
</i18n>
