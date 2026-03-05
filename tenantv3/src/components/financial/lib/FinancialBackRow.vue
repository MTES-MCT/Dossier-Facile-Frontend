<template>
  <BackLinkRow :label="label" @click="onClick">
    <ConfirmDeleteModal
      v-model:is-opened="isModalOpened"
      document-category="financial"
      @confirm="confirm"
    />
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { computed, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { updateFinancialURL } from './updateFinancialUrl'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'

const props = defineProps<{
  label: string
  to: RouteLocationRaw
  category: 'travail' | 'social' | 'pension' | 'rente' | 'bourse' | 'pas-de-revenus'
  step?: string
  substep?: string
}>()
const route = useRoute()
const router = useRouter()
const store = useTenantStore()
const state = useFinancialState()

const document = computed(() =>
  state.documents.value.find((d) => d.id === Number(route.params.docId))
)
const isModalOpened = ref(false)

function sendEditEvent() {
  if (props.substep && props.step) {
    AnalyticsService.editSituation3(state.category, props.category, props.step, props.substep)
  } else if (props.step) {
    AnalyticsService.editSituation2(state.category, props.category, props.step)
  } else {
    AnalyticsService.editSituation(state.category, props.category)
  }
}

const onClick = () => {
  sendEditEvent()
  if (document.value?.documentCategory) {
    isModalOpened.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  const docId = document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  const to = typeof props.to === 'string' ? updateFinancialURL(props.to, docId) : props.to
  router.push(to)
}
</script>
