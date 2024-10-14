<template>
  <div>
    <div class="fr-grid-col main-content">
      <div ref="pdfcontent" class="pdf-content">
        <div
          v-if="loadedRatio > 0 && loadedRatio < 1"
          style="background-color: green; color: white; text-align: center"
          :style="{ width: loadedRatio * 100 + '%' }"
        >
          {{ Math.floor(loadedRatio * 100) }}%
        </div>
        <vue-pdf-embed
          style="border: 1px solid red"
          :source="src"
          :width="pdfcontent?.width"
        ></vue-pdf-embed>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const pdfcontent = ref()

const props = defineProps<{
  src: string
}>()

const loadedRatio = ref(0)
</script>

<style scoped lang="scss">
.main-content {
  margin: auto;
  width: 768px;
  @media all and (max-width: 992px) {
    width: 95%;
  }
}

.pdf-content {
  width: 100%;
}
</style>
