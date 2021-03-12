import { User } from "./User";

export class FileUser {
  id!: number;
  applicationType?: string;

  tenants?: User[];
  pdfLink?: string;
}
