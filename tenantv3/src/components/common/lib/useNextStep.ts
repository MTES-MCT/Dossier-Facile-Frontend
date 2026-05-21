import { useRouter } from 'vue-router'
import { AnalyticsService, type DocumentCategory } from '@/services/AnalyticsService'
import type { RouteLocationRaw } from 'vue-router'

export const useNextStep = (
  category: DocumentCategory,
  nextStep: RouteLocationRaw,
  // unused right now, might be useful for future validation implementation
  disabled?: boolean
) => {
  const router = useRouter()

  const goNext = () => {
    if (!disabled) {
      AnalyticsService.validateFunnelStep(category)
      router.push(nextStep)
    }
  }

  return { goNext }
}
