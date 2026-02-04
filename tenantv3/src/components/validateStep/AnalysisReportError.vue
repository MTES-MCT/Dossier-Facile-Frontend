<template>
  <NakedCard class="fr-p-3w">
    <div>
      <p class="fr-badge fr-badge--warning fr-mb-2w">
        {{ t('title-badge') }}
      </p>
      <h1 class="fr-h6 fr-mb-1w">
        {{ t('title', { count: failedDocuments.length }) }}
      </h1>
      <p class="fr-mb-2w">
        {{ t('description') }}
      </p>
      <hr class="fr-pb-2w" />
      <ul class="fr-pl-0 fr-mt-0 links-list">
        <li v-for="(doc, k) in failedDocuments" :key="k" class="failed-item">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-p-0 text-left"
            @click="goToEdit(doc)"
          >
            {{ k + 1 }}. {{ doc.label }}
          </button>
        </li>
      </ul>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { DocumentAnalysisStatus, User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useTenantStore } from '../../stores/tenant-store'
import { DocumentType, TENANT_COMPONENTS } from '../editmenu/documents/DocumentType'
import { getDocumentLabel, getDocumentSubTitle } from './useDocumentPreview'

const props = defineProps<{
  documentAnalysisStatus: DocumentAnalysisStatus[]
}>()

const { t } = useI18n()
const store = useTenantStore()
const router = useRouter()

type FailedDoc = {
  label: string
  doc: DfDocument
  owner: User | Guarantor
}

const failedDocuments = computed(() => {
  const errors = props.documentAnalysisStatus.filter((s) => s.isFinished && !s.isValid)
  const result: FailedDoc[] = []

  const findDocInUser = (user: User | Guarantor) => {
    user.documents?.forEach((d) => {
      if (errors.find((e) => e.id === d.id)) {
        result.push({
          label: getDocLabel(d, user),
          doc: d,
          owner: user
        })
      }
    })
  }

  // Tenant
  findDocInUser(store.user)
  // Guarantors
  store.user.guarantors?.forEach((g) => findDocInUser(g))
  // Cotenants
  store.coTenants?.forEach((co) => {
    findDocInUser(co)
    co.guarantors?.forEach((g) => findDocInUser(g))
  })

  return result
})

const getDocLabel = (doc: DfDocument, owner: User | Guarantor) => {
  const docLabel = getDocumentLabel(doc.documentCategory, t)
  const docSubTitle = getDocumentSubTitle(doc, doc.documentCategory, doc.documentCategoryStep, t)

  let finalName = ''
  if (docSubTitle) {
    finalName = `${docLabel} (${docSubTitle})`
  } else {
    finalName = docLabel
  }
  return t('doc-owner', { docName: finalName, name: `${owner.firstName} ${owner.lastName}` })
}

const goToEdit = (failedDoc: FailedDoc) => {
  const type =
    failedDoc.doc.documentCategory === 'IDENTIFICATION'
      ? DocumentType.IDENTITY
      : (failedDoc.doc.documentCategory as DocumentType)
  const routeName = TENANT_COMPONENTS[type]
  if (routeName) {
    router.push({ name: routeName })
  }
}
</script>

<style scoped lang="scss">
.links-list {
  list-style: none;
  li {
    margin-bottom: 0.5rem;
  }
  .failed-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .text-left {
    text-align: left;
    justify-content: flex-start;
    white-space: normal;
    height: auto;
  }
}
</style>

<i18n>
{
  "en": {
    "title-badge": "ACTION REQUIRED",
    "title": "{count} document to correct | {count} documents to correct",
    "description": "Errors have been detected. Correct them to submit your file.",
    "doc-owner": "{docName} of {name}"
  },
  "fr": {
    "title-badge": "ACTION REQUISE",
    "title": "{count} document à corriger | {count} documents à corriger",
    "description": "Des erreurs ont été détectées. Corrigez-les pour soumettre votre dossier.",
    "doc-owner": "{docName} de {name}"
  }
}
</i18n>
