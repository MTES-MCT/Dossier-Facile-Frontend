import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { inject, type InjectionKey, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

type IdentityDocumentState = {
  previousStep: RouteLocationRaw
  nextStep: RouteLocationRaw
  document: Ref<DfDocument | undefined>
  category:
    | 'identification'
    | 'guarantor-identification'
    | 'couple-identification'
    | 'couple-guarantor-identification'
  textKey: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor'
  userId: number | undefined
  action: 'saveTenantIdentification' | 'saveGuarantorIdentification'
  addData?: (formData: FormData) => void
}
export const idDocKey = Symbol() as InjectionKey<IdentityDocumentState>

export function useIdentificationState() {
  const idDocState = inject(idDocKey)
  if (!idDocState) {
    throw new Error('Identity document state was not provided')
  }
  const suffix = idDocState.textKey === 'tenant' ? 'tenant' : 'other'
  return { ...idDocState, suffix }
}
