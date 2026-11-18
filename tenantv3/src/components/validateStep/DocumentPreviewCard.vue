<template>
  <div
    :id="isError || isMissing ? documentIdForInternalLink : undefined"
    class="fr-p-1w document-preview-card"
    :class="{ 'document-preview-card--error': isError }"
  >
    <DsfrBadge v-if="badge" v-bind="badge" class="fr-mb-1w" />

    <div class="document-preview-card__content">
      <div>
        <p v-if="statusIcon" class="file-name fr-m-0">
          <component :is="statusIcon" size="20px" class="icon bleue" aria-hidden="true" />
          <span class="fr-ml-1w">{{ label }}</span>
        </p>
        <p v-else class="fr-text--md fr-mb-1w">{{ label }}</p>
        <p
          v-if="subTitle"
          class="fr-text--sm text-mention"
          :class="statusIcon ? 'fr-mb-0' : 'fr-mb-1w'"
        >
          {{ subTitle }}
        </p>
      </div>

      <div v-if="isSuccess || isMissing" class="actions">
        <DsfrButton
          v-if="isSuccess"
          class="fr-mr-1w"
          secondary
          size="sm"
          @click="isModalOpened = true"
        >
          {{ t('filerowlistitem.see') }}
          <span class="visually-hidden">{{
            t('filerowlistitem.document', { doc: label, name: nameToDisplay })
          }}</span>
        </DsfrButton>
        <RouterLink
          v-if="isSuccess"
          :to="getEditLink()"
          class="fr-btn fr-btn--secondary fr-btn--sm"
        >
          {{ t('documents.edit') }}
          <span class="visually-hidden">{{
            t('filerowlistitem.document', { doc: label, name: nameToDisplay })
          }}</span>
        </RouterLink>
        <RouterLink v-else :to="getEditLink()" class="fr-btn fr-btn--secondary fr-btn--sm">
          {{ t('add-document') }}
          <span class="visually-hidden">{{
            t('filerowlistitem.add', { doc: label, name: nameToDisplay })
          }}</span>
        </RouterLink>
      </div>
    </div>

    <template v-if="isError">
      <hr class="fr-py-1w" />
      <ul class="fr-mt-0 fr-mb-1w">
        <li v-for="(rule, k) in failedRules" :key="k" class="fr-text--sm warning-text fr-my-0">
          {{ getRuleShortMessage(rule) }}
        </li>
      </ul>
      <div class="fr-grid-row fr-grid-row--right">
        <RouterLink
          :to="getEditLink()"
          class="fr-btn fr-btn--secondary fr-btn--sm"
          @click="editPressed"
        >
          {{ t('correct') }}
          <span class="visually-hidden">{{
            t('filerowlistitem.document', { doc: label, name: nameToDisplay })
          }}</span>
        </RouterLink>
      </div>
    </template>

    <template v-if="isSuccess">
      <div v-if="hasAnalysisComment" :class="subTitle ? 'fr-mt-1w' : 'fr-mt-2w'">
        <hr class="fr-pb-1w" />
        <p class="fr-text--sm fr-mb-0">{{ t('explanation-message') }}</p>
      </div>
      <DsfrModalPatched v-model:is-opened="isModalOpened" :title="modalTitle" size="xl">
        <ShowDoc
          v-if="isModalOpened"
          :file="previewDocument.document!"
          :watermark-url="previewDocument.document?.name"
        />
      </DsfrModalPatched>
    </template>
  </div>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { RiCheckboxCircleFill, RiHourglassFill } from '@remixicon/vue'
import { DsfrBadge, DsfrButton } from '@gouvminint/vue-dsfr'
import DsfrModalPatched from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ShowDoc from '../documents/share/ShowDoc.vue'
import { useDocumentPreview } from './useDocumentPreview'

const props = defineProps<{
  previewDocument: PreviewDocument
  nameToDisplay?: string
  guarantorId?: number
  coTenantId?: number
}>()

const { t } = useI18n()

const { status, label, subTitle, documentIdForInternalLink, getRuleShortMessage, getEditLink } =
  useDocumentPreview(toRef(props, 'previewDocument'), props.guarantorId, props.coTenantId)

const isLoading = computed(() => status.value === 'LOADING')
const isSuccess = computed(() => status.value === 'SUCCESS')
const isError = computed(() => status.value === 'ERROR')
const isMissing = computed(() => status.value === 'MISSING')

const statusIcon = computed(() => {
  if (isLoading.value) return RiHourglassFill
  if (isSuccess.value) return RiCheckboxCircleFill
  return undefined
})

const badge = computed(() => {
  if (isError.value) return { type: 'warning', label: t('to-correct') } as const
  if (isMissing.value) return { type: 'info', label: t('missing-document') } as const
  return undefined
})

// Success
const isModalOpened = ref(false)

const hasAnalysisComment = computed(
  () => (props.previewDocument.document?.documentAnalysisReport?.comment?.length ?? 0) > 0
)

const modalTitle = computed(() =>
  subTitle.value
    ? t('preview_subtitle', { label: label.value, subTitle: subTitle.value })
    : t('preview_title', { label: label.value })
)

// Error
const failedRules = computed(() => props.previewDocument.documentAnalysisStatus?.failedRules || [])

const editPressed = () => {
  const documentCategory =
    props.previewDocument.document?.documentCategory || props.previewDocument.documentCategory
  if (props.guarantorId !== undefined) {
    AnalyticsService.validate_correct_error_click('guarantor', documentCategory)
  } else if (props.coTenantId !== undefined) {
    AnalyticsService.validate_correct_error_click('couple', documentCategory)
  } else {
    AnalyticsService.validate_correct_error_click('tenant', documentCategory)
  }
}
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &--error {
    border-color: var(--red-marianne-main-472);
  }

  &__content {
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }
}

.file-name {
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: auto;
  }
}

.icon {
  flex-shrink: 0;
}

.bleue {
  color: var(--blue-france-sun-113-625);
}

.warning-text {
  color: var(--text-default-warning);
}

.text-mention {
  color: var(--text-mention-grey);
}
</style>

<i18n lang="json">
{
  "en": {
    "add-document": "Add a document",
    "missing-document": "MISSING DOCUMENT",
    "to-correct": "TO CORRECT",
    "correct": "Correct",
    "preview_title": "Document preview: {label}",
    "preview_subtitle": "Document preview: {label}, {subTitle}",
    "explanation-message": "Your explanation has been sent to our team for verification."
  },
  "fr": {
    "add-document": "Ajouter un document",
    "missing-document": "DOCUMENT MANQUANT",
    "to-correct": "À CORRIGER",
    "correct": "Corriger",
    "preview_title": "Aperçu du document : {label}",
    "preview_subtitle": "Aperçu du document : {label}, {subTitle}",
    "explanation-message": "Votre explication a été transmise à notre équipe pour vérification."
  }
}
</i18n>
