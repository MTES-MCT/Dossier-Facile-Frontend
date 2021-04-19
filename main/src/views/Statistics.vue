<template>
  <div class="fr-m-12w">
    <h1>{{ $t("title") }}</h1>
    <div class="fr-grid-row">
      <div class="fr-col-8">
        <h2>Évolution des dossiers créés</h2>
        /semaine
        <hr />
        <div class="container-chart text-align-left">
          <div id="chart1"></div>
        </div>
      </div>
      <div class="fr-col-4">
        2 354 543<br />Dossiers accompagnés avec DossierFacile
      </div>
      <div class="fr-col-8">
        <h2>Évolution des liens partagés</h2>
        /semaine
        <hr />
        <div class="container-chart text-align-left">
          <div id="chart2"></div>
        </div>
      </div>
      <div class="fr-col-4">
        2 354 543<br />Liens partagés avec DossierFacile
      </div>
      <div class="fr-col-8">
        <h2>Évolution de la satisfaction des usagers</h2>
        /semaine
        <hr />
        <div class="container-chart text-align-left">
          <div id="chart3"></div>
        </div>
      </div>
      <div class="fr-col-4">543<br />Partenaires utilisant DossierFacile</div>
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
          response.data["valueRanges"][0]["values"][3]
            .splice(1, 52)
            .map((v: number, k: number) => {
              return [k, v];
            })
        );
      });
  }

  updateBart(data: []) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select("#chart1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3
      .scaleLinear()
      .domain([0, 52])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, 5000]);
    svg.append("g").call(d3.axisLeft(y));

    // Plot the area
    svg
      .append("path")
      .attr("class", "mypath")
      .datum(data)
      .attr("fill", "none")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function(d) {
            return x(d[0]);
          })
          .y(function(d) {
            return y(d[1]);
          })
      );
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
