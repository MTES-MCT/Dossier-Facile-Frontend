<template>
  <BackLinkRow label="Vous êtes hébergé" to="/documents-locataire/2" />
  <BackLinkRow
    label="Vous avez une attestation d'hébergement de moins de 3 mois"
    to="/documents-locataire/2/guest"
  />
  <p>
    Veuillez fournir votre attestation d'hébergement à titre gratuit
    <strong>de moins de 3 mois</strong>.
  </p>
  <UploadFiles category="GUEST" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
</script>
