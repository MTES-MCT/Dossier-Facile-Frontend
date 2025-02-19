<template>
  <div class="fr-card fr-mb-3w">
    <div class="cursor--pointer" @click="openDoc()">
      <ShowPreview :file="file"></ShowPreview>
    </div>
    <div class="text fr-pt-1w fr-pl-2w">
      <h3 class="fr-card__title">
        <a @click="openDoc()" href="#">{{ getName() }}</a>
      </h3>
      <div class="size">{{ getSize() }}</div>
      <div class="links blue-text fr-mb-1w fr-mr-2w">
        <a href="#" v-if="file.path || file.preview" @click="openDoc()" :title="t('listitem.show')">
          <span>{{ t('listitem.see') }}</span>
          <span class="fr-fi--sm fr-icon-eye-line fr-ml-1w"></span>
        </a>
        <a href="#" @click="remove()" :title="t('listitem.remove')">
          <span>{{ t('listitem.delete') }}</span>
          <span class="fr-fi--sm fr-icon-delete-line fr-ml-1w"></span>
        </a>
      </div>
    </div>
    <Modal @close="isDocModalVisible = false" v-if="isDocModalVisible">
      <template #body>
        <ShowDoc :file="file" :watermark-url="watermarkUrl"></ShowDoc>
      </template>
    </Modal>
    <ConfirmModal v-if="confirmDeleteFile" @valid="validDeleteFile()" @cancel="cancelDeleteFile()">
      {{ t('listitem.will-delete-file') }}
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { DfFile } from 'df-shared-next/src/models/DfFile'
import ShowDoc from '../documents/share/ShowDoc.vue'
import ShowPreview from '../documents/share/ShowPreview.vue'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import { AnalyticsService } from '../../services/AnalyticsService'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const emit = defineEmits<{ remove: []; 'ask-confirm': []; cancel: [] }>()

const props = withDefaults(
  defineProps<{
    file: DfFile
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

const isDocModalVisible = ref(false)
const confirmDeleteFile = ref(false)

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
  AnalyticsService.viewFromMain()
  isDocModalVisible.value = true
}

function getSize() {
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
}

function getName() {
  return props.file.name ? props.file.name : props.file.originalName
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
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: normal;
  max-width: 250px;
  a {
    background-image: none;
    outline-width: 0;
  }
}

.links {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  gap: 32px;
}
</style>
