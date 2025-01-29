<template>
  <div class="preview">
    <AuthImage :src="file?.path" v-if="file?.path && isImage()" :alt="t('showdoc.preview')" />
    <div v-if="!isImage()">
      <div v-if="!isPreviewPdfLoaded">{{ t('showdoc.loading') }}</div>
      <vue-pdf-embed
        :page="0"
        v-if="isPreviewPdfLoaded"
        :source="pdfPreviewContent"
        width="96"
      ></vue-pdf-embed>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DfFile } from 'df-shared-next/src/models/DfFile'
import VuePdfEmbed from 'vue-pdf-embed'
import AuthImage from 'df-shared-next/src/components/AuthImage.vue'
import { ImageService } from '../../../services/ImageService'
import axios from 'axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ file: DfFile }>()

const isPreviewPdfLoaded = ref(false)
const pdfPreviewContent = ref('empty')

function isImage() {
  if (!props.file) {
    return false
  }
  return ImageService.isImage(props.file)
}

async function getData() {
  if (props.file?.path) {
    const response = await axios.get<Blob>(props.file.path, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    pdfPreviewContent.value = window.URL.createObjectURL(blob)
    isPreviewPdfLoaded.value = true
  }
}
if (!isImage()) {
  getData()
}
</script>

<style lang="css" scoped>
.preview {
  width: 96px;
  height: 107px;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
}
</style>
