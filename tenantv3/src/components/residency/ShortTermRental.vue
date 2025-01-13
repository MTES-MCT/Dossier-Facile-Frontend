<template>
  <BackLinkRow
    label="En location de type airbnb, à l’hôtel, au camping"
    to="/documents-locataire/2"
  />
  <p>Veuillez fournir <strong>les factures réglées</strong> de ces 3 derniers mois.</p>
  <UploadFiles category="SHORT_TERM_RENTAL" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import UploadFiles from './lib/UploadFiles.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
</script>
