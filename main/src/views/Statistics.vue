<template>
  <div class="main">
    <div class="fr-container fr-pt-5w fr-pb-5w">
      <h1>{{ $t("title") }}</h1>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Statistics extends Vue {}
</script>

<style lang="scss">
.main {
  background-color: var(--bf100-g750);
}

.iframe-container {
  text-align: center;
}
</style>
