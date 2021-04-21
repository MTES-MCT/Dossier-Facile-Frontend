<template>
  <div>
    <h2 class="number">{{ total }}</h2>
    <p class="description">Partenaires utilisant DossierFacile</p>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Chart6 extends Vue {
  total = 0;
  mounted() {
    axios
      .get(
        "https://sheets.googleapis.com/v4/spreadsheets/1WI4vLK8eS_3N15t40NZp8SCLZBKV2St9zB68tdqMaMw/values:batchGet?key=AIzaSyAifGFaPrs6tkDizbIW8nLmtl0edfe5Vok&ranges=6%20partenaires!A1:M53&majorDimension=COLUMNS"
      )
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
}
</style>
