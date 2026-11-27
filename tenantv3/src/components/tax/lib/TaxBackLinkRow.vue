<template>
  <template v-if="inline">
    <button v-if="hasDocument" type="button" class="fr-link" @click="onEdit">{{ label }}</button>
    <RouterLink v-else :to>{{ label }}</RouterLink>
  </template>
  <BackLinkRow v-else :to :is-button="hasDocument" :label="label" @edit="onEdit" />
  <ConfirmDeleteModal
    v-model:is-opened="isModalOpened"
    document-category="tax"
    @confirm="confirm"
  />
</template>

<script setup lang="ts">
import { RouterLink, useRouter, type RouterLinkProps } from 'vue-router'
import { computed, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { AnalyticsService } from '@/services/AnalyticsService'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'

const props = defineProps<{ label: string; to: RouterLinkProps['to']; inline?: boolean }>()
const emit = defineEmits<{ edit: [] }>()
const router = useRouter()
const store = useTenantStore()
const { category, document } = useTaxState()

const isModalOpened = ref(false)
const hasDocument = computed(() => !!document.value)

const onEdit = () => {
  emit('edit')
  if (document.value) {
    AnalyticsService.showWarningModale(category)
    isModalOpened.value = true
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
