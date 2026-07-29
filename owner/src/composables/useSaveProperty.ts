import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useToast } from 'vue-toastification'
import type { Property } from 'df-shared-next/src/models/Property'
import useOwnerStore from '../store/owner-store'

export const useSaveProperty = () => {
  const store = useOwnerStore()
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()

  function saveAndGo(nextRoute: (property: Property) => RouteLocationRaw, onError?: () => void) {
    return store
      .saveProperty()
      .then((property: Property) => router.push(nextRoute(property)))
      .catch(() => {
        onError?.()
        toast.error(t('property-save-failure'))
      })
  }

  return { saveAndGo }
}
