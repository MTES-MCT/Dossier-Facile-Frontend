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
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import useOwnerStore from '../store/owner-store'
import { computed, type ComputedRef } from 'vue'
import { useModalStore } from 'df-shared-next/src/stores/useModalStore'
import { storeToRefs } from 'pinia'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'

const store = useOwnerStore()
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const { t } = useI18n()
const toast = useToast()

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
  store.deleteAccount().then(
    () => {
      window.location.replace(MAIN_URL)
    },
    () => {
      toast.error(t('deleteaccount.try-again').toString(), {
        timeout: 7000
      })
    }
  )
}
</script>

<style scoped lang="scss">
.align--right {
  text-align: right;
}

.title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.min-w {
  @media (min-width: 768px) {
    min-width: 40rem;
  }
}
</style>
