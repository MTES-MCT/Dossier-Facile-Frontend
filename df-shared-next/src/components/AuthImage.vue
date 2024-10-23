<template>
  <img :alt="alt" :src="imageData" v-if="!error" />
  <div v-else>{{ error }}</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { Buffer } from 'buffer'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  src: string
  alt?: string
}>()

const imageData = ref('')
const error = ref('')
const { t } = useI18n()

onMounted(() => {
  axios({ method: 'get', url: props.src, responseType: 'arraybuffer' })
    .then((resp) => {
      if (resp.data.length === 0) {
        error.value = t('showdoc.error')
        return
      }
      const mimeType = resp.headers['content-type'].toLowerCase()
      const imgBase64 = new Buffer(resp.data, 'binary').toString('base64')
      imageData.value = 'data:' + mimeType + ';base64,' + imgBase64
    })
    .catch(() => {
      error.value = t('showdoc.error')
      imageData.value = props.src
    })
})
</script>
