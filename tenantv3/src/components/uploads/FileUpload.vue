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
          name="file"
          :multiple="page > 1"
          :aria-invalid="r$.files.$error ? true : undefined"
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
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegle, flatErrors } from '@regle/core'
import { fileType, maxFileSize, maxLength, withMessage } from '@regle/rules'
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
    size: 5
  }
)

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf', 'image/heif']
const sizeInBytes = props.size * 1024 * 1024

const formFiles = ref<{ files: { file: File }[] }>({
  files: []
})
const { r$ } = useRegle(formFiles, {
  // maximum number of files per upload
  files: {
    maxLength: withMessage(maxLength(props.page), ({ $value, $params: [max] }) =>
      t('validation.maxFile', { max, n: $value?.length })
    ),
    // rules for each file uploaded
    $each: {
      file: {
        maxFileSize: maxFileSize(sizeInBytes),
        fileType: fileType(ALLOWED_FILE_TYPES)
      }
    }
  }
})

const onFileChange = async (event: Event) => {
  // assign the files to the form manually because v-model can't handle files
  const input = event.target as HTMLInputElement
  r$.$value.files = input.files ? Array.from(input.files).map((file) => ({ file })) : []

  // super duper important, won't work without nextTick
  await nextTick()
  const { valid } = await r$.$validate()
  // convert back to emit the payload
  const files = r$.$value.files.map(({ file }) => file)

  if (valid) emit('add-files', files)
}

const isSaving = computed(() => props.currentStatus === UploadStatus.STATUS_SAVING)
const sizeLimit = computed(() => t('fileupload.size', [props.size]))
const pagesLimit = computed(() => t('fileupload.pages', [props.page]))
</script>

<style scoped>
.dropbox {
  border: 1px solid var(--border-default-grey);
  padding: 1rem;
  min-height: 50px;
  position: relative;
}

.input-file {
  position: static;
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
