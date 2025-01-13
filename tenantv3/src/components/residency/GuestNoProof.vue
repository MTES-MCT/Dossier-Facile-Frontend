<template>
  <BackLinkRow label="Vous êtes hébergé" to="/documents-locataire/2" />
  <BackLinkRow
    label="Vous n'avez pas d'attestation d'hébergement"
    to="/documents-locataire/2/guest"
  />
  <p>
    Veuillez remplir
    <a href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
      >cette attestation d'hébergement</a
    >, la faire signer par votre hébergeur puis la glisser ci-dessous.
  </p>
  <UploadFiles category="GUEST" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
</script>
