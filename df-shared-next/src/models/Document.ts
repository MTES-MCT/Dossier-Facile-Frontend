export class DocumentType {
  key!: string;
  value!: string;
  acceptedProofs!: string[];
  refusedProofs!: string[];
  customText?: string;
  maxFileCount?: number;
}
