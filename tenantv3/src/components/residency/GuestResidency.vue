<template>
  <BackLinkRow label="Vous êtes hébergé" to="/documents-locataire/2" />
  <RadioList>
    <RadioListItem to="guest/proof"
      >Vous avez une attestation d'hébergement de moins de 3 mois</RadioListItem
    >
    <RadioListItem to="guest/no-proof">Vous n'avez pas d'attestation d'hébergement</RadioListItem>
  </RadioList>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import RadioList from './lib/RadioList.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import RadioListItem from './lib/RadioListItem.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
</script>
