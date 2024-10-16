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
  },
);

const letters = computed(() => props.short ? [props.letter] :  ['A', 'B', 'C', 'D', 'E', 'F', 'G'] );

const { t } = useI18n();

const consumption = computed(() => Math.round(props.consumption));

</script>

<template>
  <div>
    <div v-for="l in letters" class="container fr-mb-1v" :class="l" v-bind:key="l">
      <span class="rectangle" :class="l">{{ l }}</span>
      <LeftDpeArrow
        :label="t('dpe.kgco2')"
        :consumption="consumption"
        v-if="!$props.short && $props.letter === l"
      ></LeftDpeArrow>
    </div>
    <span v-if="!$props.short" class="small-text" v-html="t('dpe.gaz-emission')"></span>
  </div>
</template>

<style lang="scss" scoped>
.rectangle {
  display: inline-block;
  padding-left: 10px;
  border-radius: 0 13px 12px 0;
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
    --current-dpe-color: var(--dpe-co2-A);
  }
  &.B {
    --current-dpe-color: var(--dpe-co2-B);
  }
  &.C {
    --current-dpe-color: var(--dpe-co2-C);
  }
  &.D {
    --current-dpe-color: var(--dpe-co2-D);
  }
  &.E {
    --current-dpe-color: var(--dpe-co2-E);
  }
  &.F {
    --current-dpe-color: var(--dpe-co2-F);
  }
  &.G {
    --current-dpe-color: var(--dpe-co2-G);
  }
}
</style>

<i18n>
{
  "en": {
    "dpe.kgco2": "kg CO₂/m²/year",
    "dpe.gaz-emission": "Greenhouse gas emissions"
  },
  "fr": {
    "dpe.kgco2": "kg CO₂/m²/an",
    "dpe.gaz-emission": "Emission de gaz<br>à effet de serre"
  }
}
</i18n>
