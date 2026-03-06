<template>
  <BackLinkRow :label="label" @click="onClick">
    <ConfirmDeleteModal
      v-model:is-opened="isModalOpened"
      document-category="identity"
      @confirm="confirm"
    />
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { useIdentificationState } from './identityDocumentState'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'

const props = defineProps<{
  label: string
  to: RouteLocationRaw
  category:
    | 'identity-card'
    | 'passport'
    | 'residency-permit'
    | 'driving-licence'
    | 'france-identité'
    | 'other'
}>()
const router = useRouter()
const store = useTenantStore()
const identificationState = useIdentificationState()

const isModalOpened = ref(false)

const onClick = () => {
  AnalyticsService.editSituation(identificationState.category, props.category)
  if (identificationState.document.value?.documentCategory) {
    isModalOpened.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  const docId = identificationState.document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  router.push(props.to)
}
</script>
