import { describe, expect, it } from 'vitest'
import { getTaxYear } from '../components/tax/lib/taxYear'
import { getTaxYear as getResidencyTaxYear } from '../components/residency/lib/taxYear'

describe('taxYear for tax', () => {
  it('Before 15/09 use the previous year', async () => {
    expect(getTaxYear(new Date(2025, 4, 12))).to.eq(2024)
    expect(getTaxYear(new Date(2025, 8, 14))).to.eq(2024)
  })

  it('On the 15/09 use the current year', async () => {
    expect(getTaxYear(new Date(2025, 8, 15))).to.eq(2025)
  })

  it('After 15/09 use the current year', async () => {
    expect(getTaxYear(new Date(2025, 8, 16))).to.eq(2025)
    expect(getTaxYear(new Date(2025, 10, 7))).to.eq(2025)
  })
})

describe('taxYear for residency', () => {
  it('Before 15/10 use the previous year', async () => {
    expect(getResidencyTaxYear(new Date(2025, 4, 12))).to.eq(2024)
    expect(getResidencyTaxYear(new Date(2025, 8, 14))).to.eq(2024)
  })

  it('On the 15/10 use the current year', async () => {
    expect(getResidencyTaxYear(new Date(2025, 9, 15))).to.eq(2025)
  })

  it('After 15/10 use the current year', async () => {
    expect(getResidencyTaxYear(new Date(2025, 9, 16))).to.eq(2025)
    expect(getResidencyTaxYear(new Date(2025, 10, 7))).to.eq(2025)
  })
})
