import { expect, it, describe } from 'vitest'
import DpeService from '@/services/DpeService'
import { Property } from 'df-shared-next/src/models/Property'

describe('getEnergyConsumptionLetterSmallArea', () => {
  it('should return the correct letter for a valid energy consumption and property living space', () => {
    const property: Property = new Property()
    property.livingSpace = 20
    const energyConsumption = 90
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, property)
    expect(result).to.eq('B')
  })

  it('should return "-" for an invalid energy consumption (negative)', () => {
    const property: Property = new Property()
    property.livingSpace = 20
    const energyConsumption = -100
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, property)
    expect(result).to.eq('G')
  })

  it('should return "-" for an invalid energy consumption (zero)', () => {
    const property: Property = new Property()
    property.livingSpace = 20
    const energyConsumption = 0
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, property)
    expect(result).to.eq('G')
  })

  it('should return the correct letter for a property living space that is less than 8', () => {
    const property: Property = new Property()
    property.livingSpace = 5
    const energyConsumption = 380
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, property)
    expect(result).to.eq('C')
  })

  it('should return "G" for a property living space that doesn\'t match any area in areaDpeMatching', () => {
    const property: Property = new Property()
    property.livingSpace = 1000
    const energyConsumption = 100
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, property)
    expect(result).to.eq('G')
  })

  it('should return "G" for an energy consumption that doesn\'t match any letter in dpeValues', () => {
    const property: Property = new Property()
    property.livingSpace = 20
    const energyConsumption = 1000
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, property)
    expect(result).to.eq('G')
  })
})

describe('getCO2EmissionLetterSmallArea', () => {
  it('should return A for co2Emission within A range', () => {
    const property: Property = new Property()
    property.livingSpace = 10
    const result = DpeService.getCO2EmissionLetterSmallArea(9, property)
    expect(result).to.eq('A')
  })
  it('should return B for co2Emission within B range', () => {
    const property: Property = new Property()
    property.livingSpace = 10
    const result = DpeService.getCO2EmissionLetterSmallArea(13, property)
    expect(result).to.eq('B')
  })
})
