<template>
  <div>
    <h2>Évolution des liens partagés</h2>
    /semaine
    <hr />
    <div class="container-chart text-align-left">
      <div id="chart3"></div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Chart3 extends Vue {
  mounted() {
    axios
      .get(
        "https://sheets.googleapis.com/v4/spreadsheets/1WI4vLK8eS_3N15t40NZp8SCLZBKV2St9zB68tdqMaMw/values:batchGet?key=AIzaSyAifGFaPrs6tkDizbIW8nLmtl0edfe5Vok&ranges=3.link_w!A1:M53&majorDimension=COLUMNS"
      )
      .then(response => {
        this.updateChart(
          response.data["valueRanges"][0]["values"][3]
            .splice(1, 52)
            .map((v: number, k: number) => {
              return [k, v];
            })
        );
      });
  }

  updateChart(data: []) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select("#chart3")
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
