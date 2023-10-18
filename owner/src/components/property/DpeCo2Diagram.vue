<script setup lang="ts">
import { withDefaults } from 'vue';
import { useI18n } from 'vue-i18n';
import LeftDpeArrow from './LeftDpeArrow.vue';

const props = withDefaults(
  defineProps<{
    letter?: string;
    consumption?: number;
  }>(),
  {
    letter: 'A',
    consumption: 0,
  },
);

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const { t } = useI18n();
</script>

<template>
  <div>
    <div v-for="l in letters" class="container fr-mb-1v" :class="l" v-bind:key="l">
      <span class="rectangle" :class="l">{{ l }}</span>
      <LeftDpeArrow
        :label="t('dpe.kgco2')"
        :consumption="$props.consumption"
        v-if="$props.letter === l"
      ></LeftDpeArrow>
    </div>
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
