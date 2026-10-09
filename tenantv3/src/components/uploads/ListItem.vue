<template>
  <div class="fr-card">
    <ShowPreview :file="file" />

    <div class="text fr-px-5v fr-py-3v">
      <h3 class="fr-card__title text-overflow">
        {{ fileName }}
      </h3>
      <p class="fr-text--sm">{{ size }}</p>
      <div class="btn-gtoup fr-mt-1w">
        <DsfrButton icon="fr-icon-eye-line" icon-right tertiary no-outline @click="openDoc">
          {{ t('listitem.see') }}
          <span class="visually-hidden">{{ t('listitem.document') }} {{ fileName }}</span>
        </DsfrButton>
        <DsfrButton
          ref="remove-btn"
          icon="fr-icon-delete-bin-line"
          icon-right
          tertiary
          no-outline
          @click="remove"
        >
          {{ t('listitem.delete') }}
          <span class="visually-hidden">{{ t('listitem.document') }} {{ fileName }}</span>
        </DsfrButton>
      </div>
    </div>
    <DsfrModalPatch v-model:is-opened="isDocModalVisible" :title="t('doc-preview')" size="xl">
      <ShowDoc v-if="isDocModalVisible" :file="file" :watermark-url="watermarkUrl" />
    </DsfrModalPatch>

    <ConfirmModal
      v-model:is-opened="isDeleteModalOpen"
      :title="t('listitem.will-delete-file')"
      @valid="validDeleteFile"
      @cancel="cancelDeleteFile"
    />
  </div>
</template>

<script setup lang="ts">
import { DfFile } from 'df-shared-next/src/models/DfFile'
import ShowDoc from '../documents/share/ShowDoc.vue'
import ShowPreview from '../documents/share/ShowPreview.vue'
import { AnalyticsService, type DocumentCategory } from '../../services/AnalyticsService'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from 'vue'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'

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

const removeButton = useTemplateRef<ComponentPublicInstance>('remove-btn')
defineExpose({ removeButton })

const isDeleteModalOpen = ref(false)
const isDocModalVisible = ref(false)
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
  isDeleteModalOpen.value = true
}

function validDeleteFile() {
  emit('remove')
  isDeleteModalOpen.value = false
}

function cancelDeleteFile() {
  emit('cancel')
  isDeleteModalOpen.value = false
  return false
}

function openDoc() {
  AnalyticsService.viewFromMain(props.docCategory)
  isDocModalVisible.value = true
}
</script>

<style scoped>
.text {
  min-width: 0;
}

.size {
  color: var(--g600);
}

.fr-card {
  align-items: flex-start;
  flex-flow: row wrap;
}

.fr-card > * {
  flex: 9999 1 0;
  min-width: 0;
}
.fr-card > :first-child {
  flex: 1 0 96px;
}

.fr-card__title {
  font-size: 16px;
  font-weight: normal;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.btn-gtoup {
  display: flex;
  gap: 0.25rem;
  justify-content: end;
}
</style>

<i18n lang="json">
{
  "en": {
    "doc-preview": "Preview your document"
  },
  "fr": {
    "doc-preview": "Aperçu de votre document"
  }
}
</i18n>
