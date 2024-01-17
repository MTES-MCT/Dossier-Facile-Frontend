import { DfFile } from "./DfFile";
import { DocumentDeniedReasons } from "./DocumentDeniedReasons";

export class DfDocument {
  id?: number;
  path?: string;
  documentCategory?: string;
  subCategory?: string;
  documentStatus?: string;
  customText?: string;
  monthlySum?: number;
  files?: DfFile[];
  noDocument?: boolean;
  name?: string;
  documentDeniedReasons?: DocumentDeniedReasons;
  authenticityStatus?: string;
}
