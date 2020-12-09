import { DfDocument } from "./DfDocument";
import { Guarantor } from "./Guarantor";

export class User {
  username!: string;
  password?: string;
  token?: string;
  confirm?: string;
  captcha?: string;
  lastName?: string;
  firstName?: string;
  zipCode?: string;
  applicationType?: string;


  identification?: string;
  residency?: string;
  professional?: string;
  financial?: string;
  tax?: string;

  appartmentSharing?: {id?: number, tenants: User[]};
  guarantors?: Guarantor[];
  documents?: DfDocument[];
}
