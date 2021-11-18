import { DfFile } from "./DfFile";

export class DfDocument {
  id?: number;
  path?: string;
  documentCategory?: string;
  documentSubCategory?: string;
  documentStatus?: string;
  customText?: string;
  monthlySum?: number;
  files?: DfFile[];
  noDocument?: boolean;
  name?: string;
}
