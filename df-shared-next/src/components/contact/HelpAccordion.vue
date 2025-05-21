<template>
  <div class="fr-accordions-group">
    <section v-for="e in elements" :key="e.id" class="fr-accordion">
      <h3 class="fr-accordion__title">
        <button
          class="fr-accordion__btn fr-h3"
          aria-expanded="false"
          :aria-controls="e.id"
          @click="accordionClicked(e.tag)"
        >
          <RiArrowRightLine class="circle fr-p-1v" />{{ e.title }}
        </button>
      </h3>
      <div :id="e.id" class="fr-collapse">
        <p v-html="e.content"></p>
        <div class="fr-highlight">
          <p v-html="e.highlight"></p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RiArrowRightLine } from '@remixicon/vue'
import { AccordionHelpModel } from '../../models/AccordionHelpModel'

defineProps<{
  elements: AccordionHelpModel[]
}>()

const emit = defineEmits<{ 'accordion-clicked': [tag: string] }>()

function accordionClicked(tag: string) {
  emit('accordion-clicked', tag)
}
</script>

<style scoped lang="scss">
.fr-h3 {
  font-weight: 400 !important;
}
</style>
