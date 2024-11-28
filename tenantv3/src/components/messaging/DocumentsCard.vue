<template>
  <div v-if="hasDeclinedDocuments" class="user-card">
    <strong>{{ label }}</strong>
    <div class="file-list">
      <template v-for="doc of declinedDocuments" :key="doc.id">
        <span>{{ t(doc.documentCategory!.toLowerCase()) }}</span>
        <DfButton type="button" @click="goToDoc(doc.documentCategory)">{{
          buttonText(doc)
        }}</DfButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const declinedDocuments = computed(
  () =>
    props.tenant.documents?.filter(
      (doc) => doc.documentStatus === 'DECLINED' || !doc.documentStatus
    ) || []
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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  border-radius: 5px;
  & > strong {
    flex-basis: 12rem;
    white-space: nowrap;
  }
}
.file-list {
  display: grid;
  --max-col-width: calc((100% - 1rem) / 2);
  grid-template-columns: repeat(auto-fill, minmax(max(16rem, var(--max-col-width)), 1fr));
  gap: 1rem;
  flex-grow: 1;
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
