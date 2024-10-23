<template>
  <div class="list-item fr-mb-1w doc-container">
    <div class="fr-grid-row" style="align-items: center">
      <div class="fr-mr-md-2w fr-mr-1w cursor--pointer" @click="openDoc()">
        <i class="ri-article-line fs-32 color--focus"></i>
      </div>
      <div class="text fr-pr-2w cursor--pointer" @click="openDoc()">
        <div class="text-bold">{{ getName() }}</div>
        <div class="size">{{ getSize() }}</div>
      </div>
      <div class="progress">
        <Progress :percentage="percentage" :state="uploadState" />
      </div>
      <DfButton
        v-if="file.path || file.preview"
        class="fr-btn--icon-left fr-fi-eye-line fr-mr-md-2w fr-mr-1w"
        @on-click="openDoc()"
        type="button"
        :title="t('listitem.show')"
      >
        <span class="fr-hidden fr-unhidden-lg">{{ t('listitem.see') }}</span>
      </DfButton>
      <DfButton
        @on-click="remove()"
        class="fr-btn--icon-left fr-icon-delete-line"
        type="button"
        :title="t('listitem.remove')"
      >
        <span class="fr-hidden fr-unhidden-lg">{{ t('listitem.delete') }}</span>
      </DfButton>
    </div>
    <Modal @close="isDocModalVisible = false" v-if="isDocModalVisible">
      <template v-slot:body>
        <ShowDoc :file="file"></ShowDoc>
      </template>
    </Modal>
    <ConfirmModal v-if="confirmDeleteFile" @valid="validDeleteFile()" @cancel="undoDeleteFile()">
      {{ t('listitem.will-delete-file') }}
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { DfFile } from 'df-shared-next/src/models/DfFile'
import Progress from './Progress.vue'
import ShowDoc from '../documents/share/ShowDoc.vue'
import Modal from 'df-shared-next/src/components/Modal.vue'
import { AnalyticsService } from '../../services/AnalyticsService'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const emit = defineEmits<{ remove: [] }>()

const props = withDefaults(
  defineProps<{
    file: DfFile
    uploadState?: string
    percentage?: number
  }>(),
  {
    uploadState: 'idle',
    percentage: 0
  }
)

const isDocModalVisible = ref(false)
const confirmDeleteFile = ref(false)

function remove() {
  confirmDeleteFile.value = true
}

function validDeleteFile() {
  emit('remove')
  confirmDeleteFile.value = false
}

function undoDeleteFile() {
  confirmDeleteFile.value = false
  return false
}

function openDoc() {
  AnalyticsService.viewFromMain()
  isDocModalVisible.value = true
}

function getSize() {
  if (props.file.size) {
    const kb = props.file.size / 1000
    if (kb > 1000) {
      const mb = kb / 1000
      return `${mb.toFixed(2)} ${t('listitem.mb')}`
    }
    return `${kb.toFixed(2)} ${t('listitem.kb')}`
  }
  return '-'
}

function getName() {
  return props.file.name ? props.file.name : props.file.originalName
}
</script>

<style scoped lang="scss">
.progress {
  float: left;
}
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

.text > div {
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-bold {
  font-weight: bold;
}
.row {
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list-item {
  background-color: var(--g200);
}

.size {
  font-size: 12px;
  color: var(--g600);
}

.doc-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.5px 4px 0 #cecece;
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
}
</style>
