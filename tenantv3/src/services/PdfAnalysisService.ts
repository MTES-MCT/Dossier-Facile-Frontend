import * as pdfjsLib from 'pdfjs-dist/webpack'
import { AnalyticsService } from './AnalyticsService'

export const PdfAnalysisService = {
  async readPdfFirstPage(file: File): Promise<string> {
    try {
      const loadingTask = pdfjsLib.getDocument(await file.arrayBuffer())
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)
      const content = await page.getTextContent()
      page.cleanup()
      return content.items.map((item: any) => item.str).join('')
    } catch (error) {
      console.error('Error reading PDF first page:', error)
      return 'Error reading PDF'
    }
  },

  async isRejectedAsTaxDocument(file: File): Promise<boolean> {
    if (file.type !== 'application/pdf') {
      return false
    }
    const forbiddenTitles = [
      'AVIS DE SITUATION DÉCLARATIVE',
      'MA DÉCLARATION AUTOMATIQUE',
      'DÉCLARATION DES REVENUS',
      'DÉCLARATION PRÉREMPLIE'
    ]
    const firstPageContent = await this.readPdfFirstPage(file)
    return forbiddenTitles.some((title) => firstPageContent.includes(title))
  },

  async includesRejectedTaxDocuments(files: File[]): Promise<boolean> {
    const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    try {
      return await Promise.race([
        Promise.any(
          files.map(async (file) => {
            const isRejected = await this.isRejectedAsTaxDocument(file)
            if (isRejected) {
              AnalyticsService.avisDetected()
            }
            return isRejected
          })
        ),
        timeout(2000).then(() => false)
      ])
    } catch (error) {
      console.error('Error during includesRejectedTaxDocuments:', error)
      return false
    }
  }
}
