import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { inject, type InjectionKey, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

type FinancialState = {
  previousStep: RouteLocationRaw
  nextStep: RouteLocationRaw
  recap: RouteLocationRaw
  documents: Ref<DfDocument[]>
  category: 'financial' | 'guarantor-financial' | 'couple-financial' | 'couple-guarantor-financial'
  textKey: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor'
  userId: number | undefined
  action: 'saveTenantFinancial' | 'saveGuarantorFinancial'
  addData?: (formData: FormData) => void
}
export const financialKey = Symbol() as InjectionKey<FinancialState>

export function useFinancialState() {
  const financialState = inject(financialKey)
  if (!financialState) {
    throw new Error('Financial state was not provided')
  }
  const suffix = financialState.textKey === 'tenant' ? 'tenant' : 'other'
  return { ...financialState, suffix }
}
