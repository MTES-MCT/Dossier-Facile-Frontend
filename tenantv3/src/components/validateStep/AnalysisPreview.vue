<template>
  <NakedCard class="fr-mt-3w">
    <h1 class="fr-h6">Documents de {{ user.firstName }} {{ user.lastName }}</h1>
    <DocumentPreviewCard
      v-for="doc in documents"
      :key="doc.document?.id || doc.documentCategory"
      :preview-document="doc"
      class="fr-mb-2w"
    />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { allTenantDocumentCategories, type DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentAnalysisStatus, PreviewDocument, User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import DocumentPreviewCard from './DocumentPreviewCard.vue'

const props = defineProps<{
  user: User
  documentAnalysisStatus: DocumentAnalysisStatus[]
}>()

const documents = computed(() => {
  const documentToReturn: PreviewDocument[] = []
  const userDocuments: DfDocument[] = props.user.documents || []

  for (const category of allTenantDocumentCategories) {
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
