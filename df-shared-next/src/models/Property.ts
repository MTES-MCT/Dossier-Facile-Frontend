import type { ApartmentSharing } from './ApartmentSharing'
import { AdemeApiResult } from './AdemeApiResult'

export type PropertyType = 'HOUSE' | 'APARTMENT' | 'OTHER'

export class Property {
  id!: number
  name!: string
  token!: string
  creation_date!: string
  count_visit!: number
  rentCost!: number
  co2Emission!: number
  energyConsumption!: number
  dpeDate!: string
  chargesCost!: number
  displayed!: boolean
  validated!: boolean
  type?: PropertyType
  furniture?: string
  livingSpace!: number
  address?: string
  propertiesApartmentSharing?: { id: number; apartmentSharing: ApartmentSharing }[]
  propertyApartmentSharingCount?: number
  ownerName?: string
  ademeNumber?: string
  ademeApiResult?: AdemeApiResult
  dpeNotRequired: boolean = false
}

export type LightProperty = Omit<
  Property,
  'propertiesApartmentSharing' | 'propertiesApartmentSharingCount'
>
