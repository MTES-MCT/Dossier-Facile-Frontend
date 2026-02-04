<template>
  <div
    class="fr-p-2w document-preview-card"
    :class="{ 'document-preview-card--error': status === 'ERROR' }"
  >
    <div v-if="status === 'ERROR'">
      <p class="fr-badge fr-badge--error fr-mb-1w fr-badge--no-icon">
        <RiAlertFill
          size="16px"
          class="fr-mr-1w"
          color="var(--text-default-error)"
          aria-hidden="true"
        />
        {{ t('documents.status.to_correct') }}
      </p>
      <div class="fr-text--bold fr-text--lg">{{ label }}</div>
      <hr class="fr-mt-1w fr-mb-1w fr-pb-0" />
      <ul>
        <li v-for="(rule, k) in failedRules" :key="k" class="error-text">
          {{ rule.message }}
        </li>
      </ul>
      <div class="fr-grid-row fr-grid-row--right">
        <button class="fr-btn fr-btn--secondary" @click="goToEdit">
          {{ t('documents.status.correct') }}
        </button>
      </div>
    </div>
    <div v-else class="document-preview-card__content">
      <RiHourglassFill
        v-if="status === 'LOADING'"
        size="20px"
        class="icon bleue"
        aria-hidden="true"
      />
      <RiCheckboxCircleFill
        v-if="status === 'SUCCESS'"
        size="20px"
        class="icon bleue"
        aria-hidden="true"
      />
      <RiCloseCircleFill
        v-if="status === 'MISSING'"
        size="20px"
        class="icon bleue"
        aria-hidden="true"
      />
      <span class="fr-ml-1w">{{ label }}</span>
      <div class="fr-ml-auto">
        <button
          v-if="status === 'SUCCESS'"
          class="fr-btn fr-btn--secondary fr-btn--sm fr-mr-1w"
          @click="openDocument"
        >
          Voir
        </button>
        <button
          v-if="status === 'MISSING' || status === 'SUCCESS'"
          class="fr-btn fr-btn--secondary fr-btn--sm"
          @click="goToEdit"
        >
          Modifier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentType,
  DocumentTypeTranslations,
  TENANT_COMPONENTS
} from '@/components/editmenu/documents/DocumentType'
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiHourglassFill
} from '@remixicon/vue'
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps<{
  previewDocument: PreviewDocument
}>()

const { t } = useI18n()
const router = useRouter()

const failedRules = computed(() => {
  return props.previewDocument.document?.documentAnalysisReport?.failedRules || []
})

const label = computed(() => {
  if (
    props.previewDocument.documentCategory === 'FINANCIAL' &&
    props.previewDocument.document?.documentSubCategory
  ) {
    return t('documents.financial_with_subcategory', {
      subcategory: t(`documents.${props.previewDocument.document.documentSubCategory}`)
    })
  }
  const type =
    props.previewDocument.documentCategory === 'IDENTIFICATION'
      ? DocumentType.IDENTITY
      : (props.previewDocument.documentCategory as DocumentType)

  return t(DocumentTypeTranslations[type])
})

const status = computed((): 'MISSING' | 'SUCCESS' | 'LOADING' | 'ERROR' => {
  const analysisStatus = props.previewDocument.documentAnalysisStatus
  const document = props.previewDocument.document

  if (!document) {
    return 'MISSING'
  }
  // If we don't have an analysis status that mean the document is not compatible for the moment with document analysis
  if (!analysisStatus) {
    return 'SUCCESS'
  }

  if (analysisStatus.isFinished && analysisStatus.isValid) {
    return 'SUCCESS'
  }
  if (analysisStatus.isFinished && !analysisStatus.isValid) {
    return 'ERROR'
  }
  return 'LOADING'
})

const getDocumentType = (): DocumentType => {
  return props.previewDocument.documentCategory === 'IDENTIFICATION'
    ? DocumentType.IDENTITY
    : (props.previewDocument.documentCategory as DocumentType)
}

const goToEdit = () => {
  const type = getDocumentType()
  const routeName = TENANT_COMPONENTS[type]
  if (routeName) {
    router.push({ name: routeName })
  }
}

const openDocument = () => {
  const document = props.previewDocument.document
  if (document?.files?.length) {
    window.open(document.files[0].path, '_blank')
  }
}
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &__content {
    display: flex;
    align-items: center;
  }

  &--error {
    background-color: var(--background-default-grey);
    border: 1px solid var(--red-marianne-main-472);
  }
}

.error-text {
  color: #666;
}

.icon {
  flex-shrink: 0;
}

.bleue {
  color: var(--blue-france-sun-113-625);
}
</style>

<i18n>
{
  "en": {
    "identification": "Identification",
    "residency": "Residency",
    "professional": "Professional",
    "financial": "Financial",
    "tax": "Tax",
    "identification-legal-person": "Legal person identification",
    "identity-represent": "Identity of the representative",
    "guarantee-provider-certificate": "Guarantee provider certificate",
    "documents": {
      "financial_with_subcategory": "Financial resources ({subcategory})",
      "status": {
        "to_correct": "TO CORRECT",
        "correct": "Correct"
      }
    }
  },
  "fr": {
    "identification": "Pièce d’identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionnelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "identification-legal-person": "K-bis de la société",
    "identity-represent": "Pièce d’identité du représentant",
    "guarantee-provider-certificate": "Certificat de l’organisme se portant garant",
    "documents": {
      "financial_with_subcategory": "Justificatif de ressources ({subcategory})",
      "status": {
        "to_correct": "À CORRIGER",
        "correct": "Corriger"
      }
    }
  }
}
</i18n>
