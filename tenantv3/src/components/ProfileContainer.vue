<template>
  <div class="fr-container fr-container-full-size">
    <TopEditMenu :step="step" />
    <div class="bg--grey full-height fr-grid-row">
      <LeftEditMenu :step="step" class="fr-col-md-4 fr-col-xl-3" />
      <div
        class="fr-col-xl-9 fr-col-md-8 fr-col-xs-12 fr-pt-md-4w fr-pt-2w fr-grid-row fr-pb-10w fr-m-2w fr-m-md-0 flex--1"
        id="step-content"
      >
        <div class="max-600 ml fr-col-12">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftEditMenu from './editmenu/LeftEditMenu.vue'
import TopEditMenu from './editmenu/TopEditMenu.vue'

defineProps<{ step: number }>()
</script>

<style lang="scss" scoped>
.ml {
  @media all and (min-width: 1024px) {
    margin-left: 10%;
  }
}
</style>
