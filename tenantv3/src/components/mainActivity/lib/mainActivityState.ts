import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { inject, ref, type InjectionKey, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const showAllItems = ref(false)

type MainActivityState = {
  previousStep: RouteLocationRaw
  nextStep: RouteLocationRaw
  document: Ref<DfDocument | undefined>
  category:
    | 'professional'
    | 'guarantor-professional'
    | 'couple-professional'
    | 'couple-guarantor-professional'
  textKey: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor'
  userId: number | undefined
  addData?: (formData: FormData) => void
}
export const mainActivityKey = Symbol() as InjectionKey<MainActivityState>

export function useMainActivityState() {
  const mainActivityState = inject(mainActivityKey)
  if (!mainActivityState) {
    throw new Error('MainActivity state was not provided')
  }
  const suffix = mainActivityState.textKey === 'tenant' ? 'tenant' : 'other'
  return { ...mainActivityState, suffix }
}
