import * as pdfjs from "pdfjs-dist/webpack";
import { PDFDocumentProxy } from "pdfjs-dist";

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
  async findRejectedTaxDocuments(files: File[]): Promise<File[]> {
    const rejectedFiles = [];
    for (const file of files) {
      if (await this.isRejectedAsTaxDocument(file)) {
        rejectedFiles.push(file);
      }
    }
    return rejectedFiles;
  },
};
