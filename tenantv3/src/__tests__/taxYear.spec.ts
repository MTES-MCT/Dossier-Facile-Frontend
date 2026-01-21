import { describe, expect, it } from 'vitest'
import { getTaxYear } from '../components/tax/lib/taxYear'
import { getTaxYear as getResidencyTaxYear } from '../components/residency/lib/taxYear'

const year = new Date().getFullYear()

describe('taxYear for tax', () => {
  it('Before 15/09 use the previous year', async () => {
    expect(getTaxYear(new Date(year, 4, 12))).to.eq(year - 1)
    expect(getTaxYear(new Date(year, 8, 14))).to.eq(year - 1)
  })

  it('On the 15/09 use the current year', async () => {
    expect(getTaxYear(new Date(year, 8, 15))).to.eq(year)
  })

  it('After 15/09 use the current year', async () => {
    expect(getTaxYear(new Date(year, 8, 16))).to.eq(year)
    expect(getTaxYear(new Date(year, 10, 7))).to.eq(year)
  })
})

describe('taxYear for residency', () => {
  it('Before 29/09 use the previous year', async () => {
    expect(getResidencyTaxYear(new Date(year, 4, 12))).to.eq(year - 1)
    expect(getResidencyTaxYear(new Date(year, 8, 28))).to.eq(year - 1)
  })

  it('On the 29/09 use the current year', async () => {
    expect(getResidencyTaxYear(new Date(year, 8, 29))).to.eq(year)
  })

  it('After 29/09 use the current year', async () => {
    expect(getResidencyTaxYear(new Date(year, 8, 30))).to.eq(year)
    expect(getResidencyTaxYear(new Date(year, 10, 7))).to.eq(year)
  })
})
