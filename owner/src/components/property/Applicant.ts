import { User } from 'df-shared/src/models/User';

export default class Applicant extends User {
  date?: Date;

  tenantName?: string;

  tenantSalary?: number;

  guarantorSalary?: number;

  rate?: number;

  token?: string;
}
