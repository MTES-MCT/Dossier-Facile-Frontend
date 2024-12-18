<template>
  <div v-if="hasDeclinedDocuments" class="user-card">
    <template v-for="(doc, i) of declinedDocuments" :key="doc.id">
      <strong v-if="i === 0">{{ label }}</strong>
      <span v-else></span>
      <span>{{ t(doc.documentCategory!.toLowerCase()) }}</span>
      <DfButton type="button" @click="goToDoc(doc.documentCategory)">{{
        buttonText(doc)
      }}</DfButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { DocumentService } from '@/services/DocumentService'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import type { DfDocument, DocumentCategory } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ guarantor?: boolean; tenant: Guarantor }>()
const emit = defineEmits<{ substep: [substep: number] }>()

const { t } = useI18n()

const label = computed(() =>
  props.guarantor
    ? `${t('guarantorchoice.guarantor')} : ${props.tenant.firstName} ${props.tenant.lastName}`
    : props.tenant.firstName
)

const declinedDocuments = computed(() =>
  (
    props.tenant.documents?.filter(
      (doc) => doc.documentStatus === 'DECLINED' || !doc.documentStatus
    ) || []
  ).sort(DocumentService.sortByCategory)
)

const hasDeclinedDocuments = computed(() => declinedDocuments.value.length > 0)

const buttonText = (doc: DfDocument) =>
  `${doc.documentStatus ? t('update') : t('add')} ${t('documents.' + doc.documentCategory?.toLowerCase())}`

const goToDoc = async (doc: DocumentCategory | undefined) => {
  const substep = {
    IDENTIFICATION: 1,
    RESIDENCY: 2,
    PROFESSIONAL: 3,
    FINANCIAL: 4,
    TAX: 5,
    GUARANTEE_PROVIDER_CERTIFICATE: 0,
    IDENTIFICATION_LEGAL_PERSON: 0,
    NULL: 0
  }[doc || 'NULL']
  if (substep === 0) {
    console.warn('Invalid document type', doc)
    return
  }
  emit('substep', substep)
}
</script>

<style scoped>
.user-card {
  background-color: var(--background-alt-grey);
  padding: 1rem;
  display: grid;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  border-radius: 5px;
  & > strong {
    white-space: nowrap;
  }
}
@media (min-width: 62rem) {
  .user-card {
    grid-template-columns: minmax(16rem, 1fr) 14rem 2fr;
  }
}
</style>

<i18n>
{
    "fr": {
        "financial": "Ressources",
        "residency": "Hébergement",
        "professional": "Activité professionnelle",
        "update": "Mettre à jour",
        "add": "Ajouter",
        "documents": {
          "identification": "la pièce d'identité",
          "residency": "le justificatif de situation d'hébergement",
          "professional": "le justificatif de situation professionnelle",
          "financial": "le justificatif de ressources",
          "tax": "l'avis d'imposition"
        }
    },
    "en": {
        "financial": "Resources",
        "residency": "Address",
        "professional": "Employment",
        "update": "Update",
        "add": "Add",
        "documents": {
          "identification": "Identification Document",
          "residency": "Proof of Address",
          "professional": "Proof of Employment",
          "financial": "Proof of Financial Resources",
          "tax": "Tax Notice"
        }
    }
}
</i18n>
