<template>
  <NakedCard class="fr-mt-3w">
    <p v-if="isTenant" class="fr-badge fr-badge--new fr-badge--no-icon fr-mb-1w">
      {{ t('badge-loc') }}
    </p>
    <p v-if="!isTenant" class="fr-badge fr-badge--warning fr-badge--no-icon fr-mb-1w">
      {{ t('badge-guarantor') }}
    </p>
    <h1 class="fr-h6">
      {{ nameToDisplay }}
    </h1>
    <DocumentPreviewCard
      v-for="doc in documents"
      :key="doc.document?.id || doc.documentCategory"
      :preview-document="doc"
      :guarantor-id="guarantorId"
      :co-tenant-id="coTenantId"
      class="fr-mb-2w"
    />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { allTenantDocumentCategories, type DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { DocumentAnalysisStatus, PreviewDocument, User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DocumentPreviewCard from './DocumentPreviewCard.vue'
import { useTenantStore } from '@/stores/tenant-store'

const props = defineProps<{
  user: User | Guarantor
  documentAnalysisStatus: DocumentAnalysisStatus[]
  isTenant: boolean
}>()

const { t } = useI18n()

const store = useTenantStore()

const guarantorId = computed(() => {
  if (props.isTenant) {
    return undefined
  } else {
    return props.user.id
  }
})

const coTenantId = computed(() => {
  if (!props.isTenant || props.user.id === store.user.id) {
    return undefined
  } else {
    return props.user.id
  }
})

const nameToDisplay = computed(() => {
  if (
    props.isTenant ||
    (!props.isTenant &&
      'typeGuarantor' in props.user &&
      props.user.typeGuarantor === 'NATURAL_PERSON')
  ) {
    return t('documents-of', { firstName: props.user.firstName, lastName: props.user.lastName })
  }
  if (
    !props.isTenant &&
    'typeGuarantor' in props.user &&
    props.user.typeGuarantor === 'LEGAL_PERSON'
  ) {
    return t('documents-of', { firstName: props.user.firstName, lastName: props.user.lastName })
  }
  if (!props.isTenant && 'typeGuarantor' in props.user && props.user.typeGuarantor === 'ORGANISM') {
    return t('document-of-organization')
  }
  return t('documents-of')
})

const documents = computed(() => {
  const documentToReturn: PreviewDocument[] = []
  const userDocuments: DfDocument[] = props.user.documents || []

  let categories = allTenantDocumentCategories

  if (!props.isTenant && 'typeGuarantor' in props.user) {
    if (props.user.typeGuarantor === 'LEGAL_PERSON') {
      categories = ['IDENTIFICATION_LEGAL_PERSON', 'IDENTIFICATION']
    } else if (props.user.typeGuarantor === 'ORGANISM') {
      categories = ['GUARANTEE_PROVIDER_CERTIFICATE']
    }
  }

  for (const category of categories) {
    if (category === 'FINANCIAL') {
      const financialDocs = userDocuments.filter((d) => d.documentCategory === 'FINANCIAL')
      if (financialDocs.length > 0) {
        financialDocs.forEach((doc) => {
          documentToReturn.push({
            documentCategory: category,
            document: doc,
            documentAnalysisStatus: props.documentAnalysisStatus.find(
              (status) => status.id === doc.id
            )
          })
        })
      } else {
        documentToReturn.push({
          documentCategory: category,
          document: undefined,
          documentAnalysisStatus: undefined
        })
      }
    } else {
      const doc = userDocuments.find((d) => d.documentCategory === category)
      documentToReturn.push({
        documentCategory: category,
        document: doc,
        documentAnalysisStatus: doc
          ? props.documentAnalysisStatus.find((status) => status.id === doc.id)
          : undefined
      })
    }
  }
  return documentToReturn
})
</script>

<i18n>
{
  "en": {
    "documents-of": "Documents of {firstName} {lastName}",
    "document-of-organization": "Documents of the organization",
    "badge-loc": "TENANT FILE",
    "badge-guarantor": "GUARANTOR FILE"
  },
  "fr": {
    "documents-of": "Documents de {firstName} {lastName}",
    "document-of-organization": "Documents de l'organisme",
    "badge-loc": "DOSSIER LOCATAIRE",
    "badge-guarantor": "DOSSIER GUARANT"
  }
}
</i18n>
