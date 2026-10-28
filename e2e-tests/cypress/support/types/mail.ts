export type EmailKind =
  | "tenant-signup"
  | "tenant-recovery"
  | "group-invitation"
  | "couple-invitation"
  | "owner-confirmation"
  | "owner-recovery";

export interface EmailQuery {
  email: string;
  kind: EmailKind;
  sentAfter: number;
  expectedLink?: string;
}

export interface DeliveredEmail {
  subject: string;
  html: string;
  link: string;
}
