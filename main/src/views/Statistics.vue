<template>
  <div class="main">
    <div class="fr-container">
      <h1>{{ $t("title") }}</h1>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-xl-8">
          <NakedCard>
            <template v-slot:content>
              <chart1></chart1>
            </template>
          </NakedCard>
        </div>
        <div class="fr-col-12 fr-col-xl-4">
          <NakedCard>
            <template v-slot:content>
              <chart2></chart2>
            </template>
          </NakedCard>
        </div>
        <div class="fr-col-12 fr-col-xl-8">
          <NakedCard>
            <template v-slot:content>
              <chart3></chart3>
            </template>
          </NakedCard>
        </div>
        <div class="fr-col-12 fr-col-xl-4">
          <NakedCard>
            <template v-slot:content>
              <chart4></chart4>
            </template>
          </NakedCard>
        </div>
        <div class="fr-col-12 fr-col-xl-8">
          <NakedCard>
            <template v-slot:content>
              <chart5></chart5>
            </template>
          </NakedCard>
        </div>
        <div class="fr-col-12 fr-col-xl-4">
          <NakedCard>
            <template v-slot:content>
              <chart6></chart6>
            </template>
          </NakedCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import chart1 from "./stats/chart1.vue";
import chart2 from "./stats/chart2.vue";
import chart3 from "./stats/chart3.vue";
import chart4 from "./stats/chart4.vue";
import chart5 from "./stats/chart5.vue";
import chart6 from "./stats/chart6.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  components: {
    chart1,
    chart2,
    chart3,
    chart4,
    chart5,
    chart6,
    NakedCard
  }
})
export default class Statistics extends Vue {}
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
.main {
  background-color: var(--bf100-g750);
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
