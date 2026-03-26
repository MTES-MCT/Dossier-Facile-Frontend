import { expect, it, describe } from 'vitest'
import DpeService from '@/services/DpeService'

describe('getEnergyConsumptionLetterSmallArea', () => {
  it('should return the correct letter for a valid energy consumption and property living space', () => {
    const energyConsumption = 90
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, 20)
    expect(result).to.eq('B')
  })

  it('should return "-" for an invalid energy consumption (negative)', () => {
    const energyConsumption = -100
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, 20)
    expect(result).to.eq('G')
  })

  it('should return "-" for an invalid energy consumption (zero)', () => {
    const energyConsumption = 0
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, 20)
    expect(result).to.eq('G')
  })

  it('should return the correct letter for a property living space that is less than 8', () => {
    const energyConsumption = 380
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, 5)
    expect(result).to.eq('C')
  })

  it('should return "G" for a property living space that doesn\'t match any area in areaDpeMatching', () => {
    const energyConsumption = 100
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, 1000)
    expect(result).to.eq('G')
  })

  it('should return "G" for an energy consumption that doesn\'t match any letter in dpeValues', () => {
    const energyConsumption = 1000
    const result = DpeService.getEnergyConsumptionLetterSmallArea(energyConsumption, 20)
    expect(result).to.eq('G')
  })
})

describe('getCO2EmissionLetterSmallArea', () => {
  it('should return A for co2Emission within A range', () => {
    const result = DpeService.getCO2EmissionLetterSmallArea(9, 10)
    expect(result).to.eq('A')
  })
  it('should return B for co2Emission within B range', () => {
    const result = DpeService.getCO2EmissionLetterSmallArea(13, 10)
    expect(result).to.eq('B')
  })
})
