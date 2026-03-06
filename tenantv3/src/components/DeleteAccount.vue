<template>
  <DsfrModalPatch
    v-model:is-opened="isOpen"
    modal-id="modal-delete-account"
    :title="t('deleteaccount.title')"
    icon="ri:close-circle-line"
    :actions="modalActions"
    size="xl"
  >
    <p>{{ t('deleteaccount.confirm-delete') }}</p>
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import { AnalyticsService } from '../services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { computed, ref, type ComputedRef } from 'vue'
import { toast } from './toast/toastUtils'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { useModalStore } from 'df-shared-next/src/stores/useModalStore'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import { storeToRefs } from 'pinia'
const $loading = useLoading({})
const isLoading = ref(false)
const { t } = useI18n()

const store = useTenantStore()
const modalStore = useModalStore('deleteAccount')
const { closeModal } = modalStore
const { isOpen } = storeToRefs(modalStore)
const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('deleteaccount.cancel'),
    onClick() {
      closeModal()
    }
  },
  {
    label: t('deleteaccount.validate'),
    secondary: true,
    onClick() {
      deleteAccount()
      closeModal()
    }
  }
])

function deleteAccount() {
  const loader = $loading.show()
  isLoading.value = true
  store.deleteAccount().then(
    () => {
      AnalyticsService.deleteAccount()
      loader.hide()
      // We don't set isLoading to false here because we want to keep the loading state until user is redirected
    },
    () => {
      toast.error(t('deleteaccount.try-again'), document.getElementById('delete-account-btn'))
      loader.hide()
      isLoading.value = false
    }
  )
}
</script>
