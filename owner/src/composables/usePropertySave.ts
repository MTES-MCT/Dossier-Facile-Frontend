import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import useOwnerStore from '../store/owner-store'
import { getOwnerApiErrorMessage } from '../services/OwnerApiErrorService'

const TOAST_TIMEOUT = 7000

export function usePropertySave() {
  const toast = useToast()
  const { t } = useI18n()
  const store = useOwnerStore()

  function showSaveError(error: unknown) {
    console.error(error)
    toast.error(getOwnerApiErrorMessage(error, t).toString(), {
      timeout: TOAST_TIMEOUT
    })
  }

  async function savePropertyAndContinue(
    onSuccess: () => void,
    options?: { includeValidated?: boolean }
  ): Promise<void> {
    try {
      await store.saveProperty(options)
      onSuccess()
    } catch (error) {
      showSaveError(error)
    }
  }

  async function searchDpeAndNotify(dpe: string, onSuccess?: () => void): Promise<void> {
    try {
      await store.searchDpe(dpe)
      onSuccess?.()
    } catch (error) {
      showSaveError(error)
    }
  }

  return {
    savePropertyAndContinue,
    searchDpeAndNotify,
    showSaveError
  }
}
