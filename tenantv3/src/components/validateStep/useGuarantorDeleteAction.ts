import { toast } from '@/components/toast/toastUtils'
import { useTenantStore } from '@/stores/tenant-store'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type DeleteFocusTargetResolver = (guarantor: Guarantor) => Element | null | undefined

type UseGuarantorDeleteActionOptions = {
  getSuccessFocusTarget?: DeleteFocusTargetResolver
  getErrorFocusTarget?: DeleteFocusTargetResolver
  onSuccess?: (guarantor: Guarantor) => void
  onError?: (guarantor: Guarantor) => void
}

export function useGuarantorDeleteAction(options: UseGuarantorDeleteActionOptions = {}) {
  const store = useTenantStore()
  const { t } = useI18n()

  const isDeleteConfirmModalOpened = ref(false)
  const isDeletingGuarantor = ref(false)
  const selectedGuarantor = ref<Guarantor>()

  const deleteLabel = computed(() => t('guarantorssection.delete-guarantor'))
  const deleteConfirmTitle = computed(() => t('guarantorssection.confirm-delete-guarantor'))
  const deleteSuccessMessage = computed(() => t('guarantorssection.guarantor-deleted'))
  const deleteErrorMessage = computed(() => t('guarantorssection.guarantor-delete-failed'))

  const openDeleteModalForGuarantor = (guarantor: Guarantor) => {
    selectedGuarantor.value = guarantor
    isDeleteConfirmModalOpened.value = true
  }

  const closeDeleteConfirmModal = () => {
    isDeleteConfirmModalOpened.value = false
    selectedGuarantor.value = undefined
  }

  const deleteSelectedGuarantor = async (focusTarget?: Element | null) => {
    if (!selectedGuarantor.value || isDeletingGuarantor.value) {
      return
    }

    const guarantor = selectedGuarantor.value
    isDeletingGuarantor.value = true
    try {
      await store.deleteGuarantor(guarantor)
      options.onSuccess?.(guarantor)
      toast.success(
        deleteSuccessMessage.value,
        options.getSuccessFocusTarget?.(guarantor) ?? focusTarget
      )
    } catch {
      options.onError?.(guarantor)
      toast.error(deleteErrorMessage.value, options.getErrorFocusTarget?.(guarantor) ?? focusTarget)
    } finally {
      isDeletingGuarantor.value = false
      closeDeleteConfirmModal()
    }
  }

  return {
    isDeleteConfirmModalOpened,
    isDeletingGuarantor,
    selectedGuarantor,
    deleteLabel,
    deleteConfirmTitle,
    openDeleteModalForGuarantor,
    closeDeleteConfirmModal,
    deleteSelectedGuarantor
  }
}
