import { AdemeApiResult } from './AdemeApiResult';

export class Property {
  id!: number;
  name!: string;
  token!: string;
  creation_date!: string;
  count_visit!: number;
  rentCost!: number;
  co2Emission!: number;
  energyConsumption!: number;
  dpeDate!: string;
  chargesCost!: number;
  displayed!: boolean;
  validated!: boolean;
  type?: string;
  furniture?: string;
  livingSpace!: number;
  address?: string;
  propertiesApartmentSharing: any;
  propertyApartmentSharingCount?: number;
  ownerName?: string;
  ademeNumber?: string;
  ademeApiResult?: AdemeApiResult;
  dpeNotRequired: boolean = false;
}
