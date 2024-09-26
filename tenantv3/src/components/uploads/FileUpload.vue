<template>
  <div class="file-upload fr-col-md-12">
    <form name="uploadForm" enctype="multipart/form-data" novalidate>
      <label for="file" class="visually-hidden">Ajouter un document</label>
      <div class="dropbox">
        <input
          id="file"
          type="file"
          multiple
          :disabled="isSaving()"
          @change="filesChange"
          class="input-file"
          accept="image/png, image/jpeg, application/pdf"
        />
        <div v-if="!isSaving()" class="fr-mt-2w fr-mb-2w">
          {{ t('fileupload.drag-and-drop-files') }}
          <br />
          {{ t('fileupload.files-format') }}<br />
          {{ getSizeLimit() }}<br />
          {{ getPagesLimit() }}<br />
          {{ t('fileupload.or') }}<br />
          <a href="#">{{ t('fileupload.browse-files') }}</a>
        </div>
        <div v-if="isSaving()">
          {{ t('fileupload.uploading-files') }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ToastService } from '@/services/ToastService'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['reset-files', 'add-files'])

const props = withDefaults(defineProps<{ currentStatus: number; page?: number; size?: number }>(), {
  currentStatus: UploadStatus.STATUS_INITIAL,
  page: 0,
  size: 10
})

function isSaving() {
  return props.currentStatus === UploadStatus.STATUS_SAVING
}

function filesChange(e: any) {
  ;[...e.target.files].forEach((f: File) => {
    if (f.size > props.size * 1024 * 1024) {
      ToastService.errorf(t('fileupload.file-too-big', [props.size]))
      return false
    }
    return true
  })
  const fileList = [...e.target.files].filter((f: File) => {
    return f.size < props.size * 1024 * 1024
  })
  emit('add-files', fileList)
  const form = document.getElementsByName('uploadForm')
  form.forEach((f: any) => {
    f.reset()
  })
}

function getSizeLimit() {
  if (props.size > 0) {
    return t('fileupload.size', [props.size])
  }
  return ''
}

function getPagesLimit() {
  if (props.page > 0) {
    return t('fileupload.pages', [props.page])
  }
  return ''
}
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed var(--primary);
  outline-offset: -10px;
  background-color: var(--g200);
  padding: 10px 10px;
  min-height: 50px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}

.file-upload:focus-within {
  outline-style: auto;
  outline-width: 2px;
  outline-offset: 4px;
  outline-color: #0a76f6;
}

.dropbox:hover {
  background-image: linear-gradient(0deg, var(--color-active), var(--color-active));
  --color-hover: rgba(0, 0, 246, 0.1);
  --color-active: rgba(91, 91, 255, 0.1);
}

.dropbox div {
  font-size: 1em;
  text-align: center;
}
</style>
