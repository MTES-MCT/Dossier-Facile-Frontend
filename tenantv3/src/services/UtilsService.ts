import { User } from 'df-shared-next/src/models/User'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { ToastService } from './ToastService'

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
  isDocumentValid(document?: DfDocument, preValidationActivated?: boolean) {
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
      preValidationActivated &&
      document.documentAnalysisReport?.analysisStatus === 'DENIED' &&
      document.documentAnalysisReport?.comment === null
    ) {
      return false
    }
    return true
  },
  getAllDocuments(user: User) {
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
  handleCommonSaveError(err: any) {
    if (err?.response?.data?.message === null) {
      return
    }
    if (err.response.data.message.includes('NumberOfPages')) {
      ToastService.saveFailedNumPages()
    } else {
      ToastService.saveFailed()
    }
  },
  tenantFullName(user: User) {
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
  getTenantDocumentByType(user: User, docType: string): DfDocument | undefined {
    return user.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType
    })
  }
}
