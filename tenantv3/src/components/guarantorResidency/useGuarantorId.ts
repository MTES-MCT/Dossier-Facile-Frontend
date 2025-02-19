import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useGuarantorId() {
  const route = useRoute()
  const guarantorId = computed(() => {
    return typeof route.params.guarantorId === 'string' ? route.params.guarantorId : ''
  })
  return guarantorId
}
