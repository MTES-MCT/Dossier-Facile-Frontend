export class DocumentType {
  key!: string;
  value!: string;
  explanationText?: string;
  acceptedProofs!: string[];
  refusedProofs!: string[];
  customText?: string;
}
