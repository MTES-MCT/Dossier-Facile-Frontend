/* This is needed to avoid CSP errors. Otherwise, the PdfWorker is loaded from
 * data:text and blocked by the browser */
import VuePdfEmbed, { GlobalWorkerOptions } from 'vue-pdf-embed/dist/index.essential.mjs'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
GlobalWorkerOptions.workerSrc = PdfWorker
export default VuePdfEmbed
