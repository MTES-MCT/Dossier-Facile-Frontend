<template>
  <div class="fr-m-12w">
    <h1>{{ $t("title") }}</h1>
    <div class="fr-grid-row">
      <div class="fr-col-8">
        <h2>Bar Chart I</h2>
        <hr />
        <div class="container-chart text-align-left">
          <div class="chart"></div>
        </div>
      </div>
      <div class="fr-col-4">t</div>
      <div class="fr-col-8"></div>
      <div class="fr-col-4"></div>
      <div class="fr-col-8"></div>
      <div class="fr-col-4"></div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Statistics extends Vue {
  mounted() {
    axios
      .get(
        "https://sheets.googleapis.com/v4/spreadsheets/1WI4vLK8eS_3N15t40NZp8SCLZBKV2St9zB68tdqMaMw/values:batchGet?key=AIzaSyAifGFaPrs6tkDizbIW8nLmtl0edfe5Vok&ranges=A1:M53&majorDimension=COLUMNS"
      )
      .then(response => {
        this.updateBart(
          response.data["valueRanges"][0]["values"][1].splice(1, 52)
        );
      });
  }

  updateBart(data: number[]) {
    d3.select(".chart")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .style("width", function(d: number) {
        return d / 10 + "px";
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

<i18n>
{
  "en":
  {
    "title": "Satistics"
  },
  "fr":
  {
    "title": "Satistiques"
  }
}
</i18n>
