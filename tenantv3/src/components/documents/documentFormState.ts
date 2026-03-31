import type { StoreAction } from '@/stores/tenant-store'
import type { DfDocument, DocumentCategory } from 'df-shared-next/src/models/DfDocument'
import { inject, type InjectionKey, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type FormField = 'typeDocumentTax' | 'typeDocumentCertificate' | 'typeDocumentFinancial'

type DocumentFormState = {
  previousStep: RouteLocationRaw
  nextStep: RouteLocationRaw
  document: Ref<DfDocument | undefined>
  category: DocumentCategory
  textKey: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor'
  formFieldValue: FormField
  storeAction: StoreAction
  userId: number | undefined
  addData?: (formData: FormData) => void
}
export const documentFormKey = Symbol() as InjectionKey<DocumentFormState>

export function useDocumentFormKey() {
  const documentFormState = inject(documentFormKey)
  if (!documentFormState) {
    throw new Error('Document state was not provided')
  }
  return documentFormState
}
