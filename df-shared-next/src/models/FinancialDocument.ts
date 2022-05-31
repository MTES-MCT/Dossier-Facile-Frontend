import { DfFile } from "./DfFile";
import { UploadStatus } from "./UploadStatus";
import { DocumentType } from "./Document";

export class FinancialDocument {
  id?: number;
  documentType = new DocumentType();
  noDocument = false;
  files: DfFile[] = [];
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  customText = "";
  monthlySum?: number;
}
