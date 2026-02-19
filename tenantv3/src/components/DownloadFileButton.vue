<template>
  <DfButton v-if="showProgressBar" :primary="true">
    {{ t('file.download-all-inprogress') }}
    <span><ProgressIndicator diameter="22px" border="3px" /></span>
  </DfButton>
  <DfButton
    v-else
    ref="dfButton"
    :disabled="disabled"
    :title="t('file.download-disabled-title')"
    :primary="true"
    @click="$emit('download')"
  >
    {{ t('file.download-all') }}
  </DfButton>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ProgressIndicator from 'df-shared-next/src/Button/ProgressIndicator.vue'

defineProps<{
  showProgressBar: boolean
  disabled: boolean
}>()

defineEmits<{ download: [] }>()

const { t } = useI18n()
const dfButton = useTemplateRef('dfButton')

defineExpose({ dfButton })
</script>
