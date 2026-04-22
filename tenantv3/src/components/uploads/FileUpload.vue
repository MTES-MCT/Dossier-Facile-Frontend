<template>
  <div class="file-upload-group">
    <form
      id="uploadForm"
      ref="uploadForm"
      name="uploadForm"
      enctype="multipart/form-data"
      novalidate
      @submit.prevent=""
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
          @click="onFileInputClick"
          @change="onFileChange"
        />
      </div>
      <FieldErrors
        v-if="r$.$errors.files"
        id="errors-file-upload"
        :errors="flatErrors(r$.$errors.files)"
      />
      <GlobalStepFooter :disabled="!store.getTenantIdentificationDocument" @on-next="handleNext" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { computed, nextTick, onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegle, flatErrors, type RegleExternalErrorTree } from '@regle/core'
import { fileType, maxFileSize, maxLength, required, withMessage } from '@regle/rules'
import FieldErrors from 'df-shared-next/src/components/form/FieldErrors.vue'
import { useNextStep } from '../common/lib/useNextStep'
import { useTenantStore } from '@/stores/tenant-store'
import GlobalStepFooter from '../footer/GlobalStepFooter.vue'
import type { DocumentCategory } from '@/services/AnalyticsService'
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'
import type { DfFile } from 'df-shared-next/src/models/DfFile'

const { t } = useI18n()
const store = useTenantStore()
const emit = defineEmits<{ 'add-files': [files: File[] | undefined] }>()

const inputFile = useTemplateRef('inputFile')

const props = withDefaults(
  defineProps<{
    currentStatus?: number
    page?: number
    size?: number
    category: DocumentCategory
    nextStep: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
    serverErrors: string
    errorMessage?: string
    beforeOpen?: () => boolean
  }>(),
  {
    currentStatus: UploadStatus.STATUS_INITIAL,
    page: 1,
    size: 5,
    errorMessage: undefined,
    beforeOpen: undefined
  }
)

const isSaving = computed(() => props.currentStatus === UploadStatus.STATUS_SAVING)
const sizeLimit = computed(() => t('fileupload.size', [props.size]))
const pagesLimit = computed(() => t('fileupload.pages', [props.page]))

const currentFiles = defineModel<DfFile[]>('currentFiles', {
  // required to avoid forgetting which breaks validation
  required: true,
  default: []
})

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf', 'image/heif']
const sizeInBytes = props.size * 1024 * 1024

function onFileInputClick(e: Event) {
  if (props.beforeOpen && !props.beforeOpen()) {
    e.preventDefault()
  }
}

type FormFile = {
  file?: File // new local file — validated
  dfFile?: DfFile // existing server file — skip validation
}

const formFiles = ref<{ files: FormFile[] }>({
  files:
    currentFiles.value?.map((f) => ({
      dfFile: f
    })) || []
})

const externalErrors = ref<RegleExternalErrorTree<typeof formFiles>>({})

const { r$ } = useRegle(
  formFiles,
  {
    // maximum number of files per upload
    files: {
      required: required,
      maxLength: withMessage(maxLength(props.page), ({ $value, $params: [max] }) =>
        t('max-file', [$value?.length, max])
      ),
      // rules for each file uploaded
      $each: {
        file: {
          maxFileSize: maxFileSize(sizeInBytes),
          fileType: fileType(ALLOWED_FILE_TYPES)
        }
      }
    }
  },
  {
    externalErrors,
    clearExternalErrorsOnValidate: true
  }
)
const isServerError = () => {
  r$.$clearExternalErrors()
  if (props.serverErrors.length) {
    r$.$setExternalErrors({
      files: { $self: [props.serverErrors] }
    })
    return true
  }
  return false
}
watch(
  () => currentFiles.value,
  (currentFiles) => {
    if (isSaving.value) return
    isServerError()

    r$.$value.files =
      currentFiles?.map((f) => ({
        dfFile: f
      })) || []
  }
)

const onFileChange = async (event: Event) => {
  // assign the files to the form manually because v-model can't handle files
  const input = event.target as HTMLInputElement
  const newFiles: FormFile[] = input.files ? Array.from(input.files).map((file) => ({ file })) : []

  // keep existing server files, append new local files
  const existingFiles = r$.$value.files.filter((f) => f.dfFile)
  r$.$value.files = [...existingFiles, ...newFiles]

  // super important, won't work without nextTick
  await nextTick()
  const { valid } = await r$.$validate()

  // only emit the new File objects
  const files = r$.$value.files.filter((f) => f.file).map((f) => f.file)
  if (valid && files.length) {
    emit('add-files', files as File[])
  }
}

const { goNext } = useNextStep(props.category, props.nextStep)

const handleNext = async () => {
  const { valid } = await r$.$validate()
  if (valid) goNext()
}

defineExpose({ inputFile })

onBeforeMount(() => r$.$reset())
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
