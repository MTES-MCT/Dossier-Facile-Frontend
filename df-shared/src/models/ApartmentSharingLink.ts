export class ApartmentSharingLink {
  id?: number;
  creationDate?: string;
  ownerEmail?: string;
  lastVisit?: string;
  enabled?: boolean;
}

export class ApartmentSharingLinks {
  links?: ApartmentSharingLink[];
}