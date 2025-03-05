<template>
  <div class="fr-container">
    <div class="fr-grid-row justify-content-center">
      <div class="fr-col-12">
        <div v-if="hasToDisplayWatermarkedDocument()">
          <PdfViewer v-if="isLoaded" :src="pdfContent"></PdfViewer>
          <div v-else>{{ t('showdoc.loading') }}</div>
        </div>
        <div v-else>
          <div v-if="file?.path">
            <AuthImage v-if="isImage()" :src="file?.path" :alt="t('showdoc.preview')" />
            <div v-if="!isImage()">
              <div v-if="!isLoaded">{{ t('showdoc.loading') }}</div>
              <PdfViewer v-if="isLoaded" :src="pdfContent"></PdfViewer>
            </div>
          </div>
          <div v-else>
            <div v-if="file?.numberOfPages && file?.numberOfPages > 0">
              {{ t('showdoc.number-of-pages', [file?.numberOfPages]) }}
            </div>
            <AuthImage :src="file?.preview || ''" :alt="t('showdoc.preview')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DfFile } from 'df-shared-next/src/models/DfFile'
import PdfViewer from '../../PdfViewer.vue'
import AuthImage from 'df-shared-next/src/components/AuthImage.vue'
import { ImageService } from '../../../services/ImageService'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ file: DfFile; watermarkUrl?: string }>()

const isLoaded = ref(false)
const pdfContent = ref('')

function hasToDisplayWatermarkedDocument() {
  return props.watermarkUrl !== undefined
}

function isImage() {
  if (!props.file) {
    return false
  }
  return ImageService.isImage(props.file)
}

onMounted(() => {
  let url = props.watermarkUrl
  if (!props.watermarkUrl && props.file?.path && !isImage()) {
    url = props.file.path
  }
  if (url) {
    axios.get<Blob>(url, { responseType: 'blob' }).then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' })
      pdfContent.value = window.URL.createObjectURL(blob)
      isLoaded.value = true
    })
  }
})
</script>
