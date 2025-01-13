<template>
  <BackLinkRow label="Hébergé par un organisme" to="/documents-locataire/2" />
  <p>
    Veuillez fournir une
    <a href="https://www.service-public.fr/simulateur/calcul/16030"
      >attestation d'élection de domicile</a
    >
    de moins de 3 mois datée et signée par l’organisme d’hébergement (hébergement d’urgence,
    placement...)
  </p>
  <UploadFiles category="GUEST_ORGANISM" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
</script>
