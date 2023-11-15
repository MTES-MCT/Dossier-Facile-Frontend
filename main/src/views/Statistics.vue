<template>
  <div class="main">
    <div class="fr-container fr-pt-5w fr-pb-5w">
      <h1>{{ $t("title") }}</h1>
      <div class="iframe-container">
        <iframe
          title="Statistiques sur metabase"
          :src="metabaseUrl"
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
export default class Statistics extends Vue {
    metabaseUrl = `${process.env.VUE_APP_METABASE_DASHBOARD_URL}`;
}
</script>

<style lang="scss">
.main {
  background-color: var(--bf100-g750);
}

.iframe-container {
  text-align: center;
}
</style>
