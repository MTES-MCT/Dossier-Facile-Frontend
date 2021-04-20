<template>
  <div>
    <h2 class="number">2 354 543</h2>
    <p class="description">Dossiers accompagnés avec DossierFacile</p>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Chart2 extends Vue {}
</script>

<style scoped>
.description {
  width: 100%;
  text-align: center;
}
</style>
