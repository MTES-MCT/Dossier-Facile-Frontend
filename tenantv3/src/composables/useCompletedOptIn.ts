import { computed, ref } from 'vue'
import { isAxiosError } from 'axios'
import { useTenantStore } from '@/stores/tenant-store'

export type ValidationRequestResult = 'success' | 'conflict' | 'error'

/**
 * Derives the dashboard state of the operator validation opt-in.
 *
 * `optInEligible` is computed by the backend (ALONE dossier, no partner link, never validated nor
 * declined, feature flag enabled). The front never knows about the feature flag itself.
 *
 * - completed: the dossier is usable as is, the tenant may ask for a verification
 * - validation requested: the tenant asked for it, the dossier is back in the operator queue
 *   (status TO_PROCESS) but the dashboard keeps showing it as ready to share
 */
export function useCompletedOptIn() {
  const store = useTenantStore()
  const isSubmitting = ref(false)

  const isCompleted = computed(
    () => store.user.optInEligible === true && store.user.status === 'COMPLETED'
  )

  const isValidationRequested = computed(
    () =>
      store.user.optInEligible === true &&
      store.user.status === 'TO_PROCESS' &&
      store.user.validationRequested === true
  )

  const showOptIn = computed(() => isCompleted.value || isValidationRequested.value)

  // The dossier content is complete in both statuses an eligible tenant can be in: COMPLETED, and
  // TO_PROCESS once it went back to the operator queue. Drives the dashboard subtitle.
  const isDossierCompletedOrToProcess = computed(
    () =>
      store.user.optInEligible === true &&
      (store.user.status === 'COMPLETED' || store.user.status === 'TO_PROCESS')
  )

  async function submitValidationRequest(
    validationRequested: boolean
  ): Promise<ValidationRequestResult> {
    isSubmitting.value = true
    try {
      await store.updateValidationRequest(validationRequested)
      return 'success'
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        // Eligibility changed server-side (partner link, operator decision…): resync the profile,
        // the dashboard then falls back to the regular display
        await store.loadUser().catch(() => undefined)
        return 'conflict'
      }
      console.error(error)
      return 'error'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isCompleted,
    isValidationRequested,
    isDossierCompletedOrToProcess,
    showOptIn,
    isSubmitting,
    submitValidationRequest
  }
}
