import { Property } from "@/models/Property";


export const SharedPropertyService = {
  hasDpe(property: Property) {
    return property.co2Emission > 0 && property.energyConsumption > 0 || property.dpeNotRequired;
  }
};
