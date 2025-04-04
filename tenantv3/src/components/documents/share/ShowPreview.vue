<template>
  <div class="preview">
    <!-- If a preview is available display it or if it's an image diplay id -->
    <AuthImage v-if="hasToDisplayImage()" :src="getPreviewImage()!" :alt="t('showdoc.preview')" />
    <!-- If there is no preview available and the file is not an image preview pdf-->
    <div v-else-if="!isImage()">
      <vue-pdf-embed
        v-if="isPreviewPdfLoaded"
        :page="0"
        :source="pdfPreviewContent"
        :width="96"
      ></vue-pdf-embed>
      <div v-else>{{ t('showdoc.loading') }}</div>
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

function hasToDisplayImage() {
  if (props.file?.preview) {
    return true
  }

  return props.file?.path && isImage()
}

function getPreviewImage() {
  if (props.file?.preview) {
    return props.file.preview
  }

  return props.file?.path
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
