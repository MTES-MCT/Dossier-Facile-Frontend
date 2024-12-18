import { Property } from '../models/Property'

export const SharedPropertyService = {
  hasDpe(property: Property) {
    return (
      (property.co2Emission !== undefined && property.energyConsumption !== undefined) ||
      property.dpeNotRequired
    )
  }
}
