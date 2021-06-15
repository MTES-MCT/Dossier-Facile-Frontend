<template>
  <div class="fr-container fr-grid-row fr-mt-9w fr-grid-row--center">
    <p>
      Nous sommes désolé, le service est en cours de migration, veuillez
      <a href="locataire.dossierfacile.fr/forgotten-password"
        >réinitialiser votre mot de passe</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ConfirmAccount extends Vue {
}
</script>