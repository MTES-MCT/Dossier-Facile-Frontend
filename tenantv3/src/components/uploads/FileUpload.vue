<template>
  <div class="file-upload-group">
    <form
      id="uploadForm"
      ref="uploadForm"
      name="uploadForm"
      enctype="multipart/form-data"
      novalidate
    >
      <div class="dropbox">
        <p v-if="isSaving">{{ t('fileupload.uploading-files') }}</p>

        <label for="file" class="fr-mb-3v"
          >{{ t('fileupload.drag-and-drop-files') }} {{ t('fileupload.browse-files') }}
          <span class="fr-hint-text">
            {{ t('fileupload.files-format') }}<br />
            {{ sizeLimit }}<br v-if="sizeLimit" />
            {{ pagesLimit }}
          </span>
        </label>
        <input
          id="file"
          ref="inputFile"
          type="file"
          multiple
          :disabled="isSaving"
          aria-describedby="errors-file-upload"
          class="input-file fr-upload fr-mt-1w"
          accept="image/png, image/jpeg, image/heic, application/pdf"
          @change="onFileChange"
        />
      </div>
      <FieldErrors
        v-if="r$.$errors.files"
        id="errors-file-upload"
        :errors="flatErrors(r$.$errors.files)"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/components/toast/toastUtils'
import { useRegle, flatErrors } from '@regle/core'
import { exactLength, fileType, maxFileSize, withMessage } from '@regle/rules'
import FieldErrors from 'df-shared-next/src/components/form/FieldErrors.vue'

const { t } = useI18n()
const emit = defineEmits<{ 'add-files': [files: File[]] }>()

const uploadForm = useTemplateRef('uploadForm')
const inputFile = useTemplateRef('inputFile')

defineExpose({ inputFile })

const props = withDefaults(
  defineProps<{ currentStatus?: number; page?: number; size?: number }>(),
  {
    currentStatus: UploadStatus.STATUS_INITIAL,
    page: 1,
    size: 10
  }
)

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf', 'image/heif']

const sizeInMb: number = props.size * 1024 * 1024

/**
 * TODO:
 * custom error messages for type and size
 * pass the current saved files as an initial value for the r$ files
 */
const { r$ } = useRegle(
  { files: [] as File[] },
  {
    files: {
      fileType: fileType(ALLOWED_FILE_TYPES),
      maxFileSize: maxFileSize(sizeInMb),
      exactLength: withMessage(exactLength(props.page), ({ $value, $params: [max] }) =>
        t('validation.exactFile', { max, n: $value?.length })
      )
    }
  }
)

const onFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  r$.$value.files = input.files ? Array.from(input.files) : []

  const { valid } = await r$.$validate()

  if (!valid) return
  emit('add-files', r$.$value.files)
}

const isSaving = computed(() => props.currentStatus === UploadStatus.STATUS_SAVING)
const sizeLimit = computed(() => (props.size > 0 ? t('fileupload.size', [props.size]) : ''))
const pagesLimit = computed(() => (props.page > 0 ? t('fileupload.pages', [props.page]) : ''))
</script>

<style scoped lang="scss">
.dropbox {
  border: 1px solid var(--border-default-grey);
  padding: 1rem;
  min-height: 50px;
  position: relative;
}

.input-file {
  position: static;
  // padding: 0.5rem 1rem;
  // margin-left: 0.5rem;
  // border-radius: 4px;
  // background-color: var(--background-contrast-grey);
}
.input-file::after {
  content: '';
  position: absolute;
  inset: 0;
}

.file-upload:focus-within {
  outline-style: auto;
  outline-width: 2px;
  outline-offset: 4px;
  outline-color: #0a76f6;
}
</style>
