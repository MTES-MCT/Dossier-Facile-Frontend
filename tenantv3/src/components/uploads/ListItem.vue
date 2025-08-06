<template>
  <div class="fr-card fr-mb-3w">
    <div class="cursor--pointer" @click="openDoc">
      <ShowPreview :file="file"></ShowPreview>
    </div>
    <div class="text fr-pt-1w fr-pl-1w">
      <h3 class="fr-card__title">
        <button class="color--primary text-overflow" type="button" @click="openDoc">
          {{ fileName }}
        </button>
      </h3>
      <div class="size fr-pl-1w">{{ size }}</div>
      <div class="links blue-text fr-mb-1w fr-mr-2w">
        <button
          v-if="file.path || file.preview"
          class="btn-link"
          type="button"
          :title="t('listitem.show')"
          @click="openDoc"
        >
          <span>{{ t('listitem.see') }}</span>
          <span class="fr-fi--sm fr-icon-eye-line fr-ml-1w"></span>
        </button>
        <button
          ref="remove-btn"
          type="button"
          class="btn-link"
          :title="t('listitem.remove')"
          @click="remove"
        >
          <span>{{ t('listitem.delete') }}</span>
          <span class="fr-fi--sm fr-icon-delete-line fr-ml-1w"></span>
        </button>
      </div>
    </div>
    <Modal v-if="isDocModalVisible" @close="isDocModalVisible = false">
      <template #body>
        <ShowDoc :file="file" :watermark-url="watermarkUrl"></ShowDoc>
      </template>
    </Modal>
    <ConfirmModal v-if="confirmDeleteFile" @valid="validDeleteFile" @cancel="cancelDeleteFile">
      {{ t('listitem.will-delete-file') }}
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { DfFile } from 'df-shared-next/src/models/DfFile'
import ShowDoc from '../documents/share/ShowDoc.vue'
import ShowPreview from '../documents/share/ShowPreview.vue'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import { AnalyticsService, type DocumentCategory } from '../../services/AnalyticsService'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref, useTemplateRef } from 'vue'

const { t } = useI18n()
const emit = defineEmits<{ remove: []; 'ask-confirm': []; cancel: [] }>()

const props = withDefaults(
  defineProps<{
    file: DfFile
    docCategory: DocumentCategory
    watermarkUrl?: string
    uploadState?: string
    percentage?: number
  }>(),
  {
    watermarkUrl: undefined,
    uploadState: 'idle',
    percentage: 0
  }
)

const removeButton = useTemplateRef('remove-btn')
defineExpose({ removeButton })

const isDocModalVisible = ref(false)
const confirmDeleteFile = ref(false)
const fileName = computed(() => (props.file.name ? props.file.name : props.file.originalName))
const size = computed(() => {
  // Extract file extension from props.file.originalName and make it uppercase
  const extension = props.file?.originalName?.split('.').pop()?.toUpperCase() || ''
  if (props.file.size) {
    const kb = props.file.size / 1000
    if (kb > 1000) {
      const mb = kb / 1000
      return `${extension} - ${mb.toFixed(2)} ${t('listitem.mb')}`
    }
    return `${extension} - ${kb.toFixed(2)} ${t('listitem.kb')}`
  }
  return '-'
})

function remove() {
  emit('ask-confirm')
  confirmDeleteFile.value = true
}

function validDeleteFile() {
  emit('remove')
  confirmDeleteFile.value = false
}

function cancelDeleteFile() {
  emit('cancel')
  confirmDeleteFile.value = false
  return false
}

function openDoc() {
  AnalyticsService.viewFromMain(props.docCategory)
  isDocModalVisible.value = true
}
</script>

<style scoped lang="css">
.text {
  float: right;
  flex: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 215px;
  }
}

.size {
  font-size: 12px;
  color: var(--g600);
}

.fr-card {
  align-items: flex-start;
  flex-direction: row;
}

.fr-card__title {
  font-size: 16px;
  font-weight: normal;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.links {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  gap: 32px;
}
</style>
