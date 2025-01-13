<template>
  <BackLinkRow label="Vous êtes locataire" to="/documents-locataire/2" />
  <BackLinkRow
    label="Vous avez une attestation de bon paiement des loyers"
    to="/documents-locataire/2/tenant"
  />
  <p>
    Veuillez fournir votre attestation de bon paiement des loyers
    <strong>de moins de 3 mois</strong>.
  </p>
  <div class="fr-alert fr-alert--warning fr-mb-2w">
    <p>
      Seules les attestations de bon paiement des loyers sont des documents valides ici. Tout autre
      document sera refusé.
    </p>
  </div>
  <UploadFiles category="TENANT" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
</script>
