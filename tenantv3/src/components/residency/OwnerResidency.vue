<template>
  <BackLinkRow label="Vous êtes propriétaire" to="/documents-locataire/2" />
  <p>
    Veuillez fournir votre avis de taxe foncière 2024. Vous pouvez le télécharger sur le
    <a href="https://www.impots.gouv.fr/accueil" target="_blank">site internet des impôts</a>.
  </p>
  <div class="fr-alert fr-alert--warning fr-mb-2w">
    <p>
      Seul le dernier avis de taxe foncière est un document valide ici. Tout autre document (avis
      plus ancien par exemple) sera refusé.
    </p>
  </div>
  <UploadFiles category="OWNER" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
</script>
