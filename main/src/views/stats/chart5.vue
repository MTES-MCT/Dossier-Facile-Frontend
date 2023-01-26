<template>
  <div>
    <h2>Évolution de la satisfaction des usagers</h2>
    /semaine
    <hr />
    <div class="container-chart text-align-left">
      <div id="chart5"></div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class Chart5 extends Vue {
  mounted() {
    axios
      .get(
        "https://sheets.googleapis.com/v4/spreadsheets/1WI4vLK8eS_3N15t40NZp8SCLZBKV2St9zB68tdqMaMw/values:batchGet?key=AIzaSyAifGFaPrs6tkDizbIW8nLmtl0edfe5Vok&ranges=5.satisfaction!A1:B3&majorDimension=ROWS"
      )
      .then(response => {
        this.updateChart(
          response.data["valueRanges"][0]["values"]?.map((d: any[]) => {
            return { label: d[0], value: Number(d[1].replace("%", "")) };
          })
        );
      });
  }

  updateChart(data: []) {
    // set the dimensions and margins of the graph
    const margin = 100;
    const width = 600;
    const height = 400;

    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the body of the page
    const svg = d3
      .select("#chart5")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .domain(["bof : moins de 4/5", "bien : 4/5", "top : 5/5"])
      .range(["#000091", "#009100", "#009191"]);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value(function(d: any) {
        return d.value;
      });
    const dataReady = pie(data);

    // The arc generator
    const arc: any = d3
      .arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("allSlices")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", ((d: any) => {
        return color(d.data.label);
      }) as any)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add the polylines between chart and labels:
    svg
      .selectAll("allPolylines")
      .data(dataReady)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", ((d: any) => {
        const posA = arc.centroid(d); // line insertion in the slice
        const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      }) as any);

    // Add the polylines between chart and labels:
    svg
      .selectAll("allLabels")
      .data(dataReady)
      .enter()
      .append("text")
      .text(function(d: any) {
        return d.data.label;
      })
      .attr("transform", function(d: any) {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function(d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }
}
</script>
