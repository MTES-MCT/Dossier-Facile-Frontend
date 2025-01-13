<template>
  <BackLinkRow label="Vous êtes locataire" to="/documents-locataire/2" />
  <RadioList>
    <RadioListItem to="tenant/receipts"
      >Vous avez vos 3 dernières quittances de loyer</RadioListItem
    >
    <RadioListItem to="tenant/proof"
      >Vous avez une attestation de bon paiement des loyers</RadioListItem
    >
  </RadioList>
  <div class="fr-highlight">
    <p>
      Vous n’avez pas de quittance de loyer ? Contactez votre propriétaire : il est légalement tenu
      de vous les fournir. Vous pouvez lui transmettre
      <a href="https://www.service-public.fr/particuliers/vosdroits/R54103"
        >ce modèle de quittance</a
      >.
    </p>
  </div>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from './lib/RadioList.vue'
import RadioListItem from './lib/RadioListItem.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
</script>
