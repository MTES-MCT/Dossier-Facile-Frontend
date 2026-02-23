import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHandleValidationNavigation } from '../composables/useInternalNavigation'
import { useRouter, useRoute } from 'vue-router'

// Mock de vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn()
}))

describe('useHandleValidationNavigation', () => {
  let mockRouterPush: any
  let mockRoute: any

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    mockRouterPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({
      push: mockRouterPush
    } as any)

    mockRoute = {
      query: {}
    }
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
  })

  describe('handleValidationNavigation', () => {
    it('devrait rediriger vers ValidateFile et retourner true si query.from est "validation"', () => {
      mockRoute.query.from = 'validation'
      const { handleValidationNavigation } = useHandleValidationNavigation()

      const result = handleValidationNavigation()

      expect(result).toBe(true)
      expect(mockRouterPush).toHaveBeenCalledWith({ name: 'ValidateFile' })
    })

    it('devrait retourner false et ne pas rediriger si query.from n\'est pas "validation"', () => {
      mockRoute.query.from = 'autre'
      const { handleValidationNavigation } = useHandleValidationNavigation()

      const result = handleValidationNavigation()

      expect(result).toBe(false)
      expect(mockRouterPush).not.toHaveBeenCalled()
    })

    it('devrait retourner false et ne pas rediriger si query.from est indéfini', () => {
      const { handleValidationNavigation } = useHandleValidationNavigation()

      const result = handleValidationNavigation()

      expect(result).toBe(false)
      expect(mockRouterPush).not.toHaveBeenCalled()
    })
  })

  describe('getNavigationNextStep', () => {
    it('devrait retourner { name: "ValidateFile" } si query.from est "validation"', () => {
      mockRoute.query.from = 'validation'
      const { getNavigationNextStep } = useHandleValidationNavigation()

      const result = getNavigationNextStep({ name: 'EtapeSuivante' })

      expect(result).toEqual({ name: 'ValidateFile' })
    })

    it('devrait retourner l\'objet nextStep fourni si query.from n\'est pas "validation"', () => {
      mockRoute.query.from = 'autre'
      const { getNavigationNextStep } = useHandleValidationNavigation()

      const nextStep = { name: 'EtapeSuivante' }
      const result = getNavigationNextStep(nextStep)

      expect(result).toEqual(nextStep)
    })

    it('devrait retourner la chaîne nextStep fournie si query.from n\'est pas "validation"', () => {
      mockRoute.query.from = 'autre'
      const { getNavigationNextStep } = useHandleValidationNavigation()

      const nextStep = '/etape-suivante'
      const result = getNavigationNextStep(nextStep)

      expect(result).toEqual(nextStep)
    })
  })
})
