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
      <div class="fr-col-8">
        <div id="chart2"></div>
      </div>
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
        console.dir(response.data);
        console.dir(response.data["valueRanges"][0]["values"][3].splice(1, 52));
        this.updateBart(
          response.data["valueRanges"][0]["values"][1].splice(3, 52)
        );
      });
  }

  updateBart(data: number[]) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select("#chart2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3
      .scaleLinear()
      .domain([0, 1000])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLog()
      .range([height, 0])
      .domain([1, 1000])
      .base(10);
    svg.append("g").call(d3.axisLeft(y));

    // Compute kernel density estimation
    const kde = this.kernelDensityEstimator(
      this.kernelEpanechnikov(7),
      x.ticks(40)
    );

    const density = kde(
      data.map(function(d) {
        return d;
      })
    );

    // Plot the area
    svg
      .append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
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
            console.dir(d);
            return y(d[1] * 10000000);
          })
      );
  }

  // Function to compute density
  kernelDensityEstimator(kernel: any, X: any) {
    return function(V: any) {
      return X.map(function(x: any) {
        return [
          x,
          d3.mean(V, function(v: number) {
            return kernel(x - v);
          })
        ];
      });
    };
  }
  kernelEpanechnikov = function(k: number) {
    return function(v: number) {
      return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
  };
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
