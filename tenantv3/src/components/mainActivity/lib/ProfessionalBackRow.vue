<template>
  <BackLinkRow :label="label" @click="onClick">
    <ModalComponent v-if="showChangeSituation" @close="ignore">
      <template #body>
        <p>{{ t('will-delete') }}</p>
        <p>{{ t('will-have-to-add') }}</p>
      </template>
      <template #footer>
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <DfButton primary @click="ignore">{{ t('cancel') }}</DfButton>
          </li>
          <li>
            <DfButton @click="confirm">{{ t('delete-docs') }}</DfButton>
          </li>
        </ul>
      </template>
    </ModalComponent>
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { useTenantStore } from '@/stores/tenant-store'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import type { MainActivityCategory } from '@/components/documents/share/DocumentTypeConstants'
import { useMainActivityState } from './mainActivityState'

const props = defineProps<{
  label: string
  to: RouteLocationRaw
  category: MainActivityCategory
}>()
const router = useRouter()
const store = useTenantStore()
const { t } = useI18n()
const state = useMainActivityState()

const showChangeSituation = ref(false)

const onClick = () => {
  AnalyticsService.editSituation(state.category, props.category)
  if (state.document.value?.documentCategory) {
    showChangeSituation.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  const docId = state.document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  router.push(props.to)
}

const ignore = () => {
  showChangeSituation.value = false
}
</script>

<i18n>
{
  "en": {
    "cancel": "Cancel",
    "delete-docs": "Confirm",
    "will-delete": "Please note that any change in your situation will result in the deletion of your documents.",
    "will-have-to-add": "You will need to add the documents corresponding to your new situation.",
  },
  "fr": {
    "cancel": "Annuler",
    "delete-docs": "Supprimer mes documents",
    "will-delete": "Attention, toute modification de votre situation entraînera la suppression de vos justificatifs.",
    "will-have-to-add": "Vous devrez ajouter les documents correspondant à votre nouvelle situation.",
  }
}
</i18n>
