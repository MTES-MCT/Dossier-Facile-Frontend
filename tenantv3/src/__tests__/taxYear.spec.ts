import { describe, expect, it } from 'vitest'
import { getTaxYear, getTaxNoticeLabel, getTaxYearPeriod } from '../components/tax/lib/taxYear'
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

describe('getTaxYearPeriod', () => {
  it('Before July 1st returns BEFORE_JULY period', () => {
    const periodBeforeJuly = getTaxYearPeriod(new Date(year, 5, 30)) // June 30th
    expect(periodBeforeJuly.period).toBe('BEFORE_JULY')
    expect(periodBeforeJuly.taxYear).toBe(year - 1)
    expect(periodBeforeJuly.incomeYear).toBe(year - 2)
  })

  it('From July 1st to September 14th returns JULY_TO_SEPTEMBER period', () => {
    const periodJuly = getTaxYearPeriod(new Date(year, 6, 1)) // July 1st
    expect(periodJuly.period).toBe('JULY_TO_SEPTEMBER')
    expect(periodJuly.taxYear).toBe(year - 1)
    expect(periodJuly.incomeYear).toBe(year - 2)
    expect(periodJuly.nextTaxYear).toBe(year)
    expect(periodJuly.nextIncomeYear).toBe(year - 1)

    const periodSept14 = getTaxYearPeriod(new Date(year, 8, 14)) // Sept 14th
    expect(periodSept14.period).toBe('JULY_TO_SEPTEMBER')
  })

  it('On or after September 15th returns AFTER_SEPTEMBER period', () => {
    const periodSept15 = getTaxYearPeriod(new Date(year, 8, 15)) // Sept 15th
    expect(periodSept15.period).toBe('AFTER_SEPTEMBER')
    expect(periodSept15.taxYear).toBe(year)
    expect(periodSept15.incomeYear).toBe(year - 1)
  })
})

describe('taxNoticeLabel', () => {
  it('Before 15/09 formats with previous income year', () => {
    expect(getTaxNoticeLabel(new Date(year, 4, 12))).to.eq(
      `${year - 2}-${String(year - 1).slice(-2)}`
    )
  })

  it('On/after 15/09 formats with current notice year', () => {
    expect(getTaxNoticeLabel(new Date(year, 8, 15))).to.eq(
      `${year - 1}-${String(year).slice(-2)}`
    )
    expect(getTaxNoticeLabel(new Date(year, 10, 7))).to.eq(
      `${year - 1}-${String(year).slice(-2)}`
    )
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
