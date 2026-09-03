import { computed, ref } from 'vue'
import { isAxiosError } from 'axios'
import { useTenantStore } from '@/stores/tenant-store'

export type ValidationRequestResult = 'success' | 'conflict' | 'error'

/**
 * Dashboard state of the verification opt-in. `optInEligible` and `lotteryStatus`
 * are backend-computed: the front never knows the feature flags.
 * completed = may apply; lottery pending = waiting for the draw; validation
 * requested = in the operator queue (legacy or drawn); cooldown = lost a draw,
 * can re-apply from `nextEligibleDate`.
 */
export function useCompletedOptIn() {
  const store = useTenantStore()
  const isSubmitting = ref(false)

  const isCompleted = computed(
    () => store.user.optInEligible === true && store.user.status === 'COMPLETED'
  )

  const isVerificationInProgress = computed(
    () =>
      store.user.optInEligible === true &&
      store.user.status === 'TO_PROCESS' &&
      store.user.validationRequested === true
  )

  const isLotteryPending = computed(
    () => isCompleted.value && store.user.lotteryStatus === 'PENDING'
  )

  const isInCooldown = computed(
    () => isCompleted.value && store.user.lotteryStatus === 'COOLDOWN'
  )

  /** Only set during a cooldown (ISO date) */
  const nextEligibleDate = computed(() => store.user.nextEligibleDate)

  const canApply = computed(
    () => isCompleted.value && !isLotteryPending.value && !isInCooldown.value
  )

  const showOptIn = computed(() => isCompleted.value || isVerificationInProgress.value)

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
    isVerificationInProgress,
    isLotteryPending,
    isInCooldown,
    nextEligibleDate,
    canApply,
    isDossierCompletedOrToProcess,
    showOptIn,
    isSubmitting,
    submitValidationRequest
  }
}
