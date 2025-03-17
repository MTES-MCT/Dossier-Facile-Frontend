<template>
  <BackLinkRow label="Vous n’avez pas de revenus" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Vous pouvez ajouter une explication sur votre situation ici si vous le souhaitez :
  </p>
  <textarea v-model="customText" class="fr-input fr-mb-2w" />
  <FinancialFooter :on-submit="save" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useRoute, useRouter } from 'vue-router'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import { computed, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useLoading } from 'vue-loading-overlay'
import { ToastService } from '@/services/ToastService'
import { UtilsService } from '@/services/UtilsService'

const route = useRoute()
const router = useRouter()
const parent = useParentRoute()
const store = useTenantStore()

const document = computed(() =>
  store.financialDocuments.find((d) => d.id === Number(route.params.docId))
)
const customText = ref(document.value?.customText || '')

async function save(): Promise<boolean> {
  const formData = new FormData()
  formData.append('typeDocumentFinancial', 'NO_INCOME')
  formData.append('noDocument', 'true')
  formData.append('customText', customText.value || '-')
  formData.append('monthlySum', '0')
  if (document.value?.id) {
    formData.append('id', document.value.id.toString())
  }

  const $loading = useLoading()
  const loader = $loading.show()
  try {
    await store.saveTenantFinancial(formData)
    ToastService.saveSuccess()
    return true
  } catch (err) {
    UtilsService.handleCommonSaveError(err)
    return false
  } finally {
    loader.hide()
  }
}
</script>
