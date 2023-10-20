<template>
  <div class="full-width">
    <h1 class="fr-h1">{{ t("title") }}</h1>
    <div class="iframe-container">
      <iframe
        title="Statistiques sur metabase"
        src="https://metabase.dossierfacile.fr/public/dashboard/30dd5e6e-ca3f-4334-8297-679ac5d52dfa"
        frameborder="0"
        width="100%"
        height="1000"
        allowtransparency
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useHead } from '@unhead/vue'

useHead({
      title: "Nos statistiques - DossierFacile",
  meta: [
    {
      name: 'description',
      content: "Consultez nos statistiques sur l’utilisation du service (nombre de dossiers créés, nombre de liens partagés, satisfaction des utilisateurs...)",
    },
  ],
})

const { t } = useI18n();

</script>

<style lang="scss">
.main {
  background-color: var(--bf100-g750);
}

.iframe-container {
  text-align: center;
}
</style>
