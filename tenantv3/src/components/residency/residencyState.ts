import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { inject, ref, type InjectionKey, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const showAllItems = ref(false)

type ResidencyState = {
  previousStep: RouteLocationRaw
  nextStep: RouteLocationRaw
  document: Ref<DfDocument | undefined>
  category: 'residency' | 'guarantor-residency'
  textKey: 'tenant' | 'couple'
  userId: number | undefined
  addData?: (formData: FormData) => void
}
export const residencyKey = Symbol() as InjectionKey<ResidencyState>

export function useResidencyState() {
  const residencyState = inject(residencyKey)
  if (!residencyState) {
    throw new Error('Residency state was not provided')
  }
  return residencyState
}
