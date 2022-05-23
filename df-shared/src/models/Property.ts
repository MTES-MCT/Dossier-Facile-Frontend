export class Property {
  id!: number;
  name!: string;
  token!: string;
  creation_date!: string;
  count_visit!: number;
  rentCost!: number;
  chargesCost!: number;
  displayed!: boolean;
  validated!: boolean;
  type?: string;
  furniture?: string;
  address?: string;
  propertiesApartmentSharing: any;
}