<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import LeftDpeArrow from './LeftDpeArrow.vue';

const props = withDefaults(
  defineProps<{
    letter?: string;
    consumption?: number;
    short?: boolean;
  }>(),
  {
    letter: 'A',
    consumption: 0,
    short: false,
  }
);

const letters = computed(() =>
  props.short ? [props.letter] : ['A', 'B', 'C', 'D', 'E', 'F', 'G']
);
const consumption = computed(() => Math.round(props.consumption));

const { t } = useI18n();
</script>

<template>
  <div>
    <div v-for="l in letters" class="container fr-mb-1v" :class="l" v-bind:key="l">
      <span class="rectangle" :class="l">{{ l }}</span>
      <span class="arrow-right"></span>
      <LeftDpeArrow
        :label="t('dpe.kwhpy')"
        :consumption="consumption"
        v-if="!$props.short && $props.letter === l"
      ></LeftDpeArrow>
    </div>
    <span v-if="!$props.short" class="small-text" v-html="t('dpe.energy-consumption')"></span>
  </div>
</template>

<style lang="scss" scoped>
.arrow-right {
  width: 0;
  height: 0;
  margin-left: -1px;
  border-top: 12px solid transparent;
  border-bottom: 13px solid transparent;
  border-left: 10px solid var(--current-dpe-color);
}

.rectangle {
  display: inline-block;
  padding-left: 10px;
  &.A {
    width: 50px;
  }
  &.B {
    width: 65px;
  }
  &.C {
    width: 80px;
  }
  &.D {
    width: 95px;
  }
  &.E {
    width: 110px;
  }
  &.F {
    width: 125px;
  }
  &.G {
    width: 140px;
  }
  height: 25px;
  background-color: var(--current-dpe-color);
}

.container {
  display: flex;
  color: white;
  &.A {
    --current-dpe-color: var(--dpe-energy-A);
  }
  &.B {
    --current-dpe-color: var(--dpe-energy-B);
  }
  &.C {
    --current-dpe-color: var(--dpe-energy-C);
  }
  &.D {
    --current-dpe-color: var(--dpe-energy-D);
  }
  &.E {
    --current-dpe-color: var(--dpe-energy-E);
  }
  &.F {
    --current-dpe-color: var(--dpe-energy-F);
  }
  &.G {
    --current-dpe-color: var(--dpe-energy-G);
  }
}
</style>

<i18n>
{
  "en": {
    "dpe.kwhpy": "kWh/m²/year",
    "dpe.energy-consumption": "Energy consumption"
  },
  "fr": {
    "dpe.kwhpy": "kWh/m²/an",
    "dpe.energy-consumption": "Consommation d'énergie"
  }
}
</i18n>
