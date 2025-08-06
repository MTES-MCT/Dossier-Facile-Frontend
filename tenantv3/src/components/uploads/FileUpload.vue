<template>
  <div class="file-upload fr-col-md-12">
    <form ref="uploadForm" name="uploadForm" enctype="multipart/form-data" novalidate>
      <label for="file" class="visually-hidden">Ajouter un document</label>
      <div class="dropbox">
        <input
          id="file"
          ref="inputFile"
          type="file"
          multiple
          :disabled="isSaving"
          class="input-file"
          accept="image/png, image/jpeg, image/heic, application/pdf"
          @change="filesChange"
        />
        <div v-if="isSaving">
          {{ t('fileupload.uploading-files') }}
        </div>
        <div v-else>
          <p class="fr-mb-3v">{{ t('fileupload.drag-and-drop-files') }}</p>
          <p class="text-small text-grey fr-mb-3v">
            {{ t('fileupload.files-format') }}<br />
            {{ sizeLimit }}<br v-if="sizeLimit" />
            {{ pagesLimit }}
          </p>
          <p class="fr-mb-1w">
            {{ t('fileupload.browse-files') }}
            <label for="file" class="label-btn">
              {{ t('fileupload.browse') }}
            </label>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/components/toast/toastUtils'

const { t } = useI18n()
const emit = defineEmits<{ 'add-files': [files: File[]] }>()

const uploadForm = useTemplateRef('uploadForm')
const inputFile = useTemplateRef('inputFile')

defineExpose({ inputFile })

const props = withDefaults(
  defineProps<{ currentStatus?: number; page?: number; size?: number }>(),
  {
    currentStatus: UploadStatus.STATUS_INITIAL,
    page: 0,
    size: 10
  }
)

const isSaving = computed(() => props.currentStatus === UploadStatus.STATUS_SAVING)
const sizeLimit = computed(() => (props.size > 0 ? t('fileupload.size', [props.size]) : ''))
const pagesLimit = computed(() => (props.page > 0 ? t('fileupload.pages', [props.page]) : ''))

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf', 'image/heif']

const isTooBig = (file: File) => file.size > props.size * 1024 * 1024
const hasValidExtension = (file: File) => ALLOWED_FILE_TYPES.includes(file.type)

function filesChange(e: Event) {
  const inputFiles = e.target instanceof HTMLInputElement ? e.target.files : null
  const files = inputFiles ? [...inputFiles] : []
  if (files.some(isTooBig)) {
    toast.error(t('fileupload.file-too-big', [props.size]), inputFile.value)
  }
  if (!files.every(hasValidExtension)) {
    toast.error(t('errors.invalid-file-extension'), inputFile.value)
  }
  const fileList = files.filter((f) => !isTooBig(f) && hasValidExtension(f))
  if (fileList.length > 0) {
    emit('add-files', fileList)
  }
  uploadForm.value?.reset()
}
</script>

<style scoped lang="scss">
.dropbox {
  border: 1px solid var(--border-default-grey);
  padding: 1rem;
  min-height: 50px;
  position: relative;
}

.input-file {
  opacity: 0;
  position: absolute;
  inset: 0;
}

.file-upload:focus-within {
  outline-style: auto;
  outline-width: 2px;
  outline-offset: 4px;
  outline-color: #0a76f6;
}

.text-small {
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.label-btn {
  padding: 4px 8px;
  margin-left: 0.5rem;
  border-radius: 4px;
  background-color: var(--background-contrast-grey);
  cursor: pointer;
}
</style>
