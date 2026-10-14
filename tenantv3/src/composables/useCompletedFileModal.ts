import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompletedOptIn } from '@/composables/useCompletedOptIn'
import { AnalyticsService } from '@/services/AnalyticsService'

/** Query value set by the submit step when it redirects to the dashboard */
export const FROM_SUBMIT = 'submit'

/**
 * Opens the "your documents are submitted" modal once per submit.
 */
export function useCompletedFileModal() {
  const route = useRoute()
  const router = useRouter()
  const { canApply } = useCompletedOptIn()
  const isOpened = ref(false)

  onMounted(() => {
    if (route.query.from !== FROM_SUBMIT) return
    void router.replace({ name: 'Account' })
    if (canApply.value) {
      isOpened.value = true
      AnalyticsService.optInCompletedModalDisplayed()
    }
  })

  return { isOpened }
}
