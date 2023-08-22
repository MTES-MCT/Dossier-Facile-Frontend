<template>
  <div class="flex-reverse">
    <h2 class="description">Liens partagés avec DossierFacile</h2>
    <p class="fr-h2 number">{{ total }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StatsService } from "@/services/StatsService";

@Component
export default class Chart4 extends Vue {
  total = 0;
  mounted() {
    StatsService.getDataFromStatsSpreadsheet("4.link_tot!A1:M53", "COLUMNS")
      .then(response => {
        this.total = response.data["valueRanges"][0]["values"][0][0];
      });
  }
}
</script>

<style scoped>
.description {
  width: 100%;
  text-align: center;
  font-weight: 400;
  font-size: 1rem;
}
.flex-reverse {
  flex-direction: column-reverse;
  display: flex;
}
</style>
