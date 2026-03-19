<template>
  <BackLinkRow :label="label" @click="onClick">
    <ConfirmDeleteModal
      v-model:is-opened="isModalOpened"
      document-category="residency"
      @confirm="confirm"
    />
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRouter, type RouterLinkProps } from 'vue-router'
import { ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from '../residencyState'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'

const props = defineProps<{ label: string; to: RouterLinkProps['to'] }>()
const emit = defineEmits<{ edit: [] }>()
const router = useRouter()
const store = useTenantStore()
const { category, document } = useResidencyState()

const isModalOpened = ref(false)

const onClick = () => {
  emit('edit')
  if (document.value) {
    AnalyticsService.showWarningModale(category)
    isModalOpened.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  AnalyticsService.confirmModale(category)
  const docId = document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  router.push(props.to)
}
</script>
