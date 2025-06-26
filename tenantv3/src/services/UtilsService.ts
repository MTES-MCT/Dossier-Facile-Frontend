import { User } from 'df-shared-next/src/models/User'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { ToastService } from './ToastService'
import { isAxiosError } from 'axios'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

export const UtilsService = {
  getLastAddedGuarantor(user: User) {
    if (user.guarantors?.length && user.guarantors?.length > 0) {
      return user.guarantors[user.guarantors.length - 1]
    }
    throw Error('guarantor is not found')
  },
  guarantorHasDoc(docType: string, g: Guarantor | User) {
    const f = g.documents?.find((d: DfDocument) => {
      return (
        d.documentCategory === docType &&
        (d.documentStatus === 'TO_PROCESS' || d.documentStatus === 'VALIDATED')
      )
    })?.files
    return f && f.length > 0
  },
  isGuarantorDocumentValid(docType: string, g: Guarantor) {
    const document = g.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType
    })
    return this.isDocumentValid(document)
  },
  isDocumentValid(document?: DfDocument) {
    if (document === undefined) {
      return false
    }
    if (!document.noDocument && (document.files?.length || 0) <= 0) {
      return false
    }
    if (document.documentStatus === 'DECLINED') {
      return false
    }
    if (
      import.meta.env.VITE_FEATURE_FLIPPING_PRE_VALIDATE === 'true' &&
      document.documentAnalysisReport?.analysisStatus === 'DENIED' &&
      document.documentAnalysisReport?.comment === null
    ) {
      return false
    }
    return true
  },
  getAllDocuments(user: CoTenant) {
    const docs = user.documents || []
    return docs
  },
  isMobile() {
    return window.innerWidth < 768
  },
  capitalize(word: string) {
    if (word.length == 0) {
      return ''
    }
    word = word[0].toUpperCase() + word.slice(1).toLowerCase()
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, (s) => s.toUpperCase())
  },
  canShareFile(user: User) {
    return (
      user.status === 'VALIDATED' &&
      user.apartmentSharing?.tokenPublic !== undefined &&
      user.apartmentSharing?.tokenPublic !== ''
    )
  },
  handleCommonSaveError(err: unknown) {
    let hasSpecificMessage = false
    if (isAxiosError(err)) {
      const message: string = err.response?.data.message ?? ''
      if (message.includes('NumberOfPages')) {
        ToastService.saveFailedNumPages()
        hasSpecificMessage = true
      } else if (message.includes('invalid file extension')) {
        ToastService.error('errors.invalid-file-extension')
        hasSpecificMessage = true
      } else if (message.includes('number of document must be at least 1')) {
        ToastService.error('errors.no-file')
        hasSpecificMessage = true
      }
    }
    if (!hasSpecificMessage) {
      ToastService.saveFailed()
    }
  },
  tenantFullName(user: CoTenant) {
    const firstName = this.capitalize(user.firstName ?? '')
    const lastName = this.capitalize(user.lastName ?? '')
    const preferredName = this.capitalize(user.preferredName ?? '')
    let usedLastName = preferredName
    if (preferredName == null || preferredName.length == 0) {
      usedLastName = lastName
    }

    if (firstName === usedLastName) {
      return user.email
    }

    return firstName + '\xa0' + usedLastName
  },
  guarantorFullName(user: Guarantor) {
    const firstName = this.capitalize(user.firstName || '')
    const lastName = this.capitalize(user.lastName || '')
    return firstName + '\xa0' + lastName
  },
  hasBrokenRules(documents: DfDocument[]): boolean {
    const documentsDenied = documents.find(
      (doc) => doc.documentAnalysisReport?.analysisStatus === 'DENIED'
    )
    return documentsDenied !== undefined
  },
  getTenantDocumentByType(user: CoTenant, docType: string): DfDocument | undefined {
    return user.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType
    })
  },
  getParam(param: string | string[]) {
    return Array.isArray(param) ? param[0] : param
  }
}
