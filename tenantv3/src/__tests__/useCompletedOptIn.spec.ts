import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCompletedOptIn } from '@/composables/useCompletedOptIn'

const { mockStore } = vi.hoisted(() => ({
  mockStore: {
    user: {
      status: undefined as string | undefined,
      optInEligible: undefined as boolean | undefined,
      validationRequested: undefined as boolean | undefined,
      lotteryStatus: undefined as string | undefined,
      nextEligibleDate: undefined as string | undefined
    },
    updateValidationRequest: vi.fn(() => Promise.resolve()),
    loadUser: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => mockStore
}))

function givenUser(user: Partial<typeof mockStore.user>) {
  mockStore.user = {
    status: undefined,
    optInEligible: undefined,
    validationRequested: undefined,
    lotteryStatus: undefined,
    nextEligibleDate: undefined
  }
  Object.assign(mockStore.user, user)
}

function axiosError(status: number) {
  return Object.assign(new Error('request failed'), {
    isAxiosError: true,
    response: { status }
  })
}

describe('useCompletedOptIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('dashboard state', () => {
    it('is "completed" for an eligible COMPLETED dossier', () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })

      const { isCompleted, isVerificationInProgress, showOptIn } = useCompletedOptIn()

      expect(isCompleted.value).toBe(true)
      expect(isVerificationInProgress.value).toBe(false)
      expect(showOptIn.value).toBe(true)
    })

    it('is "validation requested" for an eligible TO_PROCESS dossier that asked for it', () => {
      givenUser({ status: 'TO_PROCESS', optInEligible: true, validationRequested: true })

      const { isCompleted, isVerificationInProgress, showOptIn } = useCompletedOptIn()

      expect(isCompleted.value).toBe(false)
      expect(isVerificationInProgress.value).toBe(true)
      expect(showOptIn.value).toBe(true)
    })

    it('is hidden for a TO_PROCESS dossier that never answered the question', () => {
      givenUser({ status: 'TO_PROCESS', optInEligible: true })

      const { showOptIn } = useCompletedOptIn()

      expect(showOptIn.value).toBe(false)
    })

    it('is hidden for a dossier that is not eligible anymore (partner link)', () => {
      givenUser({ status: 'TO_PROCESS', optInEligible: false, validationRequested: true })

      const { showOptIn } = useCompletedOptIn()

      expect(showOptIn.value).toBe(false)
    })

    it('is hidden outside of the rollout', () => {
      givenUser({ status: 'TO_PROCESS' })

      const { showOptIn } = useCompletedOptIn()

      expect(showOptIn.value).toBe(false)
    })

    it('is hidden for a validated dossier', () => {
      givenUser({ status: 'VALIDATED', optInEligible: false })

      const { showOptIn } = useCompletedOptIn()

      expect(showOptIn.value).toBe(false)
    })
  })

  describe('lottery state', () => {
    it('is "lottery pending" for a COMPLETED dossier with a registered application', () => {
      givenUser({ status: 'COMPLETED', optInEligible: true, lotteryStatus: 'PENDING' })

      const { isLotteryPending, isInCooldown, canApply, showOptIn } = useCompletedOptIn()

      expect(isLotteryPending.value).toBe(true)
      expect(isInCooldown.value).toBe(false)
      expect(canApply.value).toBe(false)
      expect(showOptIn.value).toBe(true)
    })

    it('is "cooldown" with its end date after a lost draw', () => {
      givenUser({
        status: 'COMPLETED',
        optInEligible: true,
        lotteryStatus: 'COOLDOWN',
        nextEligibleDate: '2026-09-18'
      })

      const { isLotteryPending, isInCooldown, canApply, nextEligibleDate, showOptIn } =
        useCompletedOptIn()

      expect(isInCooldown.value).toBe(true)
      expect(isLotteryPending.value).toBe(false)
      expect(canApply.value).toBe(false)
      expect(nextEligibleDate.value).toBe('2026-09-18')
      expect(showOptIn.value).toBe(true)
    })

    it('allows a new application when eligible', () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })

      const { canApply, isLotteryPending, isInCooldown } = useCompletedOptIn()

      expect(canApply.value).toBe(true)
      expect(isLotteryPending.value).toBe(false)
      expect(isInCooldown.value).toBe(false)
    })

    it('shows an isValidationRequested display for a drawn dossier in the queue', () => {
      givenUser({
        status: 'TO_PROCESS',
        optInEligible: true,
        validationRequested: true,
        lotteryStatus: 'DRAWN'
      })

      const { isVerificationInProgress, isLotteryPending, isInCooldown } = useCompletedOptIn()

      expect(isVerificationInProgress.value).toBe(true)
      expect(isLotteryPending.value).toBe(false)
      expect(isInCooldown.value).toBe(false)
    })
  })

  describe('isDossierCompletedOrToProcess', () => {
    it('is true for an eligible COMPLETED dossier', () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })

      expect(useCompletedOptIn().isDossierCompletedOrToProcess.value).toBe(true)
    })

    it('is true while an eligible dossier waits for its verification', () => {
      givenUser({ status: 'TO_PROCESS', optInEligible: true, validationRequested: true })

      expect(useCompletedOptIn().isDossierCompletedOrToProcess.value).toBe(true)
    })

    it('is true for an eligible TO_PROCESS dossier that never answered the question', () => {
      givenUser({ status: 'TO_PROCESS', optInEligible: true })

      expect(useCompletedOptIn().isDossierCompletedOrToProcess.value).toBe(true)
    })

    it('is false outside of the rollout', () => {
      givenUser({ status: 'TO_PROCESS' })

      expect(useCompletedOptIn().isDossierCompletedOrToProcess.value).toBe(false)
    })

    it('is false for a validated dossier', () => {
      givenUser({ status: 'VALIDATED', optInEligible: true })

      expect(useCompletedOptIn().isDossierCompletedOrToProcess.value).toBe(false)
    })
  })

  describe('submitValidationRequest', () => {
    it('forwards the choice to the store', async () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })

      const { submitValidationRequest } = useCompletedOptIn()
      const result = await submitValidationRequest(true)

      expect(mockStore.updateValidationRequest).toHaveBeenCalledWith(true)
      expect(result).toBe('success')
    })

    it('reloads the profile and reports a conflict on 409', async () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })
      mockStore.updateValidationRequest.mockRejectedValueOnce(axiosError(409))

      const { submitValidationRequest } = useCompletedOptIn()
      const result = await submitValidationRequest(true)

      expect(result).toBe('conflict')
      expect(mockStore.loadUser).toHaveBeenCalled()
    })

    it('reports an error on any other failure', async () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })
      mockStore.updateValidationRequest.mockRejectedValueOnce(axiosError(500))
      vi.spyOn(console, 'error').mockImplementation(() => undefined)

      const { submitValidationRequest } = useCompletedOptIn()
      const result = await submitValidationRequest(false)

      expect(result).toBe('error')
      expect(mockStore.loadUser).not.toHaveBeenCalled()
    })

    it('resets the submitting flag once done', async () => {
      givenUser({ status: 'COMPLETED', optInEligible: true })

      const { isSubmitting, submitValidationRequest } = useCompletedOptIn()
      const pending = submitValidationRequest(true)
      expect(isSubmitting.value).toBe(true)
      await pending

      expect(isSubmitting.value).toBe(false)
    })
  })
})
