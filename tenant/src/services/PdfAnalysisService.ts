import * as pdfjs from "pdfjs-dist/webpack";
import { PDFDocumentProxy } from "pdfjs-dist";
import { AnalyticsService } from "./AnalyticsService";

function loadPdfDocument(file: File): Promise<PDFDocumentProxy> {
  return file.arrayBuffer().then((data) => pdfjs.getDocument(data).promise);
}

function readPdfFirstPage(file: File): Promise<string> {
  return (
    loadPdfDocument(file)
      .then((pdf) => pdf.getPage(1))
      .then((page) => {
        const content = page.getTextContent();
        page.cleanup();
        return content;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((content) => content.items.map((item: any) => item.str).join(""))
  );
}

export const PdfAnalysisService = {
  async isRejectedAsTaxDocument(file: File): Promise<boolean> {
    if (file.type != "application/pdf") {
      return false;
    }
    const forbiddenTitles = [
      "AVIS DE SITUATION DÉCLARATIVE",
      "MA DÉCLARATION AUTOMATIQUE",
      "DÉCLARATION DES REVENUS",
      "DÉCLARATION PRÉREMPLIE",
    ];
    const firstPageContent = await readPdfFirstPage(file);
    return forbiddenTitles.some((title) => firstPageContent.includes(title));
  },
  async includesRejectedTaxDocuments(files: File[]): Promise<boolean> {
    const includesRejectedTaxDocuments = async (files: File[]) => {
      for (const file of files) {
        if (await this.isRejectedAsTaxDocument(file)) {
          AnalyticsService.avisDetected();
          return true;
        }
      }
      return false;
    };
    const timeout = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // If the search for rejected documents takes more than 2s, ignore result and consider the document valid
    return Promise.race([
      includesRejectedTaxDocuments(files),
      timeout(2000).then(() => false),
    ]).catch(() => false);
  },
};
