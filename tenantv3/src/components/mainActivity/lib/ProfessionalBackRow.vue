<template>
  <BackLinkRow :label="label" @click="onClick">
    <ConfirmDeleteModal
      v-model:is-opened="isModalOpened"
      document-category="professional"
      @confirm="confirm"
    />
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import type { MainActivityCategory } from '@/components/documents/share/DocumentTypeConstants'
import { useMainActivityState } from './mainActivityState'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'

const props = defineProps<{
  label: string
  to: RouteLocationRaw
  category: MainActivityCategory
}>()
const router = useRouter()
const store = useTenantStore()
const state = useMainActivityState()

const isModalOpened = ref(false)

const onClick = () => {
  AnalyticsService.editSituation(state.category, props.category)
  if (state.document.value?.documentCategory) {
    isModalOpened.value = true
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
</script>
