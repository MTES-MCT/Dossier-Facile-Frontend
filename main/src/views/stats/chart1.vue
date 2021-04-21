<template>
  <div>
    <h2>Évolution des dossiers créés</h2>
    /semaine
    <hr />
    <div class="container-chart text-align-left">
      <div id="chart1"></div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Chart1 extends Vue {
  mounted() {
    axios
      .get(
        "https://sheets.googleapis.com/v4/spreadsheets/1WI4vLK8eS_3N15t40NZp8SCLZBKV2St9zB68tdqMaMw/values:batchGet?key=AIzaSyAifGFaPrs6tkDizbIW8nLmtl0edfe5Vok&ranges=1.comptescrees_w!A1:M53&majorDimension=COLUMNS"
      )
      .then(response => {
        this.updateChart(response.data["valueRanges"][0]["values"]);
      });
  }

  getMaxValue(data: [number[]]) {
    let max = 0;
    console.dir(data);
    for (let i = 1; i < data.length; i++) {
      for (let ii = 1; ii < data[i].length; ii++) {
        if (Number(data[i][ii]) > max) {
          max = Number(data[i][ii]);
        }
      }
    }
    console.log(max);
    return max;
  }

  updateChart(data: [any[]]) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 },
      width = 600 - margin.left - margin.right,
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
      .domain([0, this.getMaxValue(data) * 1.1]);
    svg.append("g").call(d3.axisLeft(y));

    const colors = [
      "#FF8D7E",
      "#169B62",
      "#5770BE",
      "#A26859",
      "#7D4E5B",
      "#FF6F4C",
      "#FDCF41",
      "#D08A77",
      "#484D7A",
      "#958B62"
    ];

    for (let i = 1; i < data.length - 1; i++) {
      // Plot the area
      const localData: any = data[i]
        .splice(1, 53)
        .map((v: number, k: number) => {
          return [k, v];
        });
      svg
        .append("path")
        .attr("class", "mypath")
        .datum(localData)
        .attr("fill", "none")
        .attr("stroke", colors[i % 10])
        .attr("stroke-width", 2)
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
}
</script>
