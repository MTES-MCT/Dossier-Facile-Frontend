import { DfFile } from 'df-shared-next/src/models/DfFile'

export const ImageService = {
  isImage(file: DfFile) {
    if (file.originalName) {
      return !file.originalName?.toLowerCase().endsWith('pdf')
    }
    return !file.name?.toLowerCase().endsWith('pdf')
  }
}
