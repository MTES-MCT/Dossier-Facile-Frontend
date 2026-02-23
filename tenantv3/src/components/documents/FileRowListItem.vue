<template>
  <li
    class="fr-grid-row file-list-item fr-p-3w"
    :class="{ 'not-validated': documentStatus() !== 'VALIDATED' }"
  >
    <p :id class="item-label fr-m-0">
      {{ label }}
      <br />
      <span v-if="subLabel" class="fr-text--xs">
        {{ subLabel }}
      </span>
    </p>
    <div class="tag-container fr-m-0">
      <div>
        <ColoredTag :text="getTagLabel()" :status="documentStatus()"></ColoredTag>
      </div>
      <div>
        <slot name="postTag"></slot>
      </div>
    </div>
    <div v-if="enableDownload || canEdit" class="file-actions">
      <!-- Lien public (lien de partage) : ouverture directe sans JWT -->
      <a
        v-if="
          enableDownload &&
          document &&
          document.name &&
          (!showValidated || document.documentStatus === 'VALIDATED') &&
          !isAuthenticatedDocumentUrl
        "
        :href="document.name"
        :title="t('filerowlistitem.see-title')"
        target="_blank"
        :aria-describedby="id"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-fi-eye-line large-btn"
      >
        {{ t('filerowlistitem.see') }}
      </a>
      <!-- URL authentifiée (/api/document/resource/) : fetch avec JWT puis ouverture en nouvel onglet -->
      <button
        v-else-if="
          enableDownload &&
          document &&
          document.name &&
          (!showValidated || document.documentStatus === 'VALIDATED') &&
          isAuthenticatedDocumentUrl
        "
        ref="see-button"
        type="button"
        :title="t('filerowlistitem.see-title')"
        :aria-describedby="id"
        :disabled="isLoadingDocument"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-fi-eye-line large-btn"
        @click.prevent="openDocumentWithAuth"
      >
        <span v-if="isLoadingDocument" class="fr-mr-1w" aria-hidden="true">…</span>
        {{ t('filerowlistitem.see') }}
      </button>

      <RouterLink
        v-if="canEdit && to"
        :to
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-pencil-line large-btn"
        :aria-describedby="id"
        @click="$emit('click-edit')"
      >
        {{ t('filerowlistitem.edit') }}
      </RouterLink>
    </div>
  </li>
</template>

<script setup lang="ts">
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref, useId, useTemplateRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { apiService } from '@/services/ApiService'
import { toast } from '@/components/toast/toastUtils'

defineEmits<{ 'click-edit': [] }>()

const props = withDefaults(
  defineProps<{
    label: string
    subLabel?: string
    document?: DfDocument
    enableDownload?: boolean
    tagLabel?: string
    showValidated?: boolean
    canEdit?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    subLabel: undefined,
    document: undefined,
    enableDownload: true,
    tagLabel: undefined,
    showValidated: false,
    canEdit: false,
    to: undefined
  }
)

const { t } = useI18n()
const id = useId()
const seeButtonRef = useTemplateRef<HTMLButtonElement>('see-button')
const isLoadingDocument = ref(false)

const isAuthenticatedDocumentUrl = computed(() => {
  const name = props.document?.name
  if (!name) return false
  return name.includes('/api/document/resource/') || name.includes('document/resource/')
})

function getTagLabel() {
  if (props.tagLabel) {
    return props.tagLabel
  }
  return t('documents.status.' + documentStatus()).toString()
}

function documentStatus() {
  if (props.document) {
    return props.document.documentStatus ? props.document.documentStatus : 'EMPTY'
  }
  return 'EMPTY'
}

async function openDocumentWithAuth() {
  const path = props.document?.name
  if (!path) {
    toast.error(t('filerowlistitem.view-failed'), seeButtonRef.value ?? undefined)
    return
  }
  isLoadingDocument.value = true
  try {
    const response = await apiService.get<Blob>(path, { responseType: 'blob' })
    if (response.status !== 200) {
      toast.error(t('filerowlistitem.view-failed'), seeButtonRef.value ?? undefined)
      return
    }
    const contentType = response.headers['content-type']
    const blob = new Blob([response.data], { type: contentType || 'application/pdf' })
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
    setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000)
  } catch {
    toast.error(t('filerowlistitem.view-failed'), seeButtonRef.value ?? undefined)
  } finally {
    isLoadingDocument.value = false
  }
}
</script>

<style lang="scss" scoped>
.fr-icon-checkbox-circle-line:before {
  margin-right: 0.5rem;
  color: green;
}

.fr-icon-information-fill:before {
  margin-right: 0.5rem;
  color: var(--purple-text);
}

.fr-icon-alert-fill:before {
  margin-right: 0.5rem;
  color: var(--danger);
}

.fr-icon-circle-empty:before {
  background-color: transparent;
  color: grey;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  height: 20px;
  width: 20px;
  margin: 4px 8px 4px 6px;
}

.file-list-item {
  container-type: inline-size;
  container-name: list-item;
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-style: solid;
  border-width: thin;
  border-radius: 0.25rem;
  border-color: var(--grey-900-175);
  min-height: 4rem;

  &.not-validated {
    background-color: var(--background-alt-grey);
    border-style: none;
  }
}

.item-label {
  flex: 1 1 33%;
  min-inline-size: 12ch;
}
.tag-container {
  flex: 0 0 auto;

  display: flex;

  @media screen and (width <= 767px) {
    flex-direction: column;
  }
}
.file-actions {
  flex: 1 0 auto;

  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  @media screen and (width <= 767px) {
    flex-direction: column;
    flex: 1 0 100%;
  }
}
.large-btn {
  flex-grow: 0;
  justify-content: center;
  margin-inline-start: auto;

  @media screen and (width <= 767px) {
    inline-size: 100%;
  }
}
</style>
