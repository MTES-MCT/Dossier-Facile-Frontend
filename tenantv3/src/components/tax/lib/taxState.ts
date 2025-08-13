import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { inject, type InjectionKey, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

type TaxState = {
  previousStep: RouteLocationRaw
  nextStep: Ref<RouteLocationRaw>
  document: Ref<DfDocument | undefined>
  category: 'tax' | 'guarantor-tax' | 'couple-tax' | 'couple-guarantor-tax'
  textKey: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor'
  userId: number | undefined
  action: 'saveTenantTax' | 'saveGuarantorTax'
  addData?: (formData: FormData) => void
}
export const taxKey = Symbol() as InjectionKey<TaxState>

export function useTaxState() {
  const taxState = inject(taxKey)
  if (!taxState) {
    throw new Error('Tax state was not provided')
  }
  return taxState
}
