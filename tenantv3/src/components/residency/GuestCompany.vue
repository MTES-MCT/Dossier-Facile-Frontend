<template>
  <BackLinkRow label="Dans un logement de fonction" to="/documents-locataire/2" />
  <p>
    Veuillez fournir <strong>une attestation de votre employeur</strong> indiquant que vous
    bénéficiez d’un logement de fonction.
  </p>
  <p>Si vous n’en avez pas, vous pouvez ajouter, au choix :</p>
  <ul>
    <li>un bulletin de salaire sur lequel le logement de fonction est visible</li>
    <li>un contrat de travail qui mentionne votre logement de fonction</li>
  </ul>
  <p>
    Nous vous recommandons d’ajouter également une attestation sur l’honneur expliquant votre
    situation. Vous pouvez utiliser le modèle disponible sur le site
    <a href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement" target="_blank"
      >service-public.fr</a
    >.
  </p>
  <UploadFiles category="GUEST_COMPANY" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
</script>
