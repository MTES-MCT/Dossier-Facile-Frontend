<template>
  <div class="fr-m-12w">
    Page en cours de réalisation
    <h2>Bar Chart I</h2>
    <div class="container-chart text-align-left">
      <div class="chart"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Statistics extends Vue {
  mounted() {
    const data = [4, 8, 15, 16, 23, 42];
    d3.select(".chart")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .style("width", function(d: number) {
        return d * 10 + "px";
      })
      .text(function(d: number) {
        return d;
      });
  }
}
</script>

<style lang="scss">
.chart div {
  font: 10px sans-serif;
  background-color: steelblue;
  text-align: right;
  padding: 3px;
  margin: 1px;
  color: white;
}
.container-chart {
  margin: auto;
}
</style>
