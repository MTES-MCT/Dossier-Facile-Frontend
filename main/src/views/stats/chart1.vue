<template>
  <div>
    <h2>Évolution des dossiers complétés</h2>
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
        const values = response.data["valueRanges"][0]["values"].filter(
          (v: string[]) => v.length > 0
        );
        this.updateChart(values);
      });
  }

  getMaxValue(data: [number[]]) {
    let max = 0;
    for (let i = 1; i < data.length; i++) {
      for (let ii = 1; ii < data[i].length; ii++) {
        if (Number(data[i][ii]) > max) {
          max = Number(data[i][ii]);
        }
      }
    }
    return max;
  }

  updateChart(data: [any[]]) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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
      .domain([1, 53])
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
      "#7D4E5B",
      "#FF6F4C",
      "#FDCF41",
      "#D08A77",
      "#484D7A",
      "#A26859",
      "#958B62"
    ];
    // Define the div for the tooltip
    const div = d3
      .select("#chart1")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    for (let i = 1; i < data.length - 1; i++) {
      // Plot the area
      let localData: any = data[i].splice(1, 53);
      if (localData === undefined) {
        continue;
      }
      localData = localData.map((v: number, k: number) => {
        return { key: k + 1, value: v };
      });
      svg
        .append("path")
        .datum(localData)
        .attr("fill", "none")
        .attr("stroke", colors[i % 10])
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr(
          "d",
          d3
            .line()
            .x(function(d: any) {
              return x(d.key);
            })
            .y(function(d: any) {
              return y(d.value);
            })
        );

      svg
        .selectAll(".dot")
        .data(localData)
        .enter()
        .append("circle")
        .attr("fill", colors[i])
        .attr("r", 3)
        .attr("cx", function(d: any) {
          return x(d.key);
        })
        .attr("cy", function(d: any) {
          return y(Number(d.value));
        })
        .on("mouseover", function(d, i: any) {
          div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          div
            .html("semaine: " + i.key + "<br>" + i.value)
            .style("left", d.pageX + "px")
            .style("top", d.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
          div
            .transition()
            .duration(500)
            .style("opacity", 0);
        });

      svg
        .append("circle")
        .attr("cx", 30)
        .attr("cy", function(d) {
          return i * 25;
        })
        .attr("r", 7)
        .style("fill", function(d) {
          return colors[i];
        });

      svg
        .append("text")
        .attr("x", 50)
        .attr("y", function(d) {
          return i * 25;
        })
        .style("fill", function(d) {
          return colors[i];
        })
        .text(data[i][0])
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    }
  }
}
</script>
<style lang="scss">
.tooltip {
  position: absolute;
  text-align: center;
  width: 80px;
  height: 32px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
</style>
