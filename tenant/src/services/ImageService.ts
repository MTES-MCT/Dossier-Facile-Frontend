import { DfFile } from "df-shared/src/models/DfFile";

export const ImageService = {
  isImage(file: DfFile) {
    if (file.path) {
      return !file.path.endsWith("pdf");
    }
    return !file.name?.endsWith("pdf");
  }
};
