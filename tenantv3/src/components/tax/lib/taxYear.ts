import dayjs from 'dayjs'

/**
 * Returns tax year period information for a given date.
 *
 * Rules for a given calendar year N (e.g. 2026):
 * 1. Before July 1st (Jan 1 to June 30):
 *    - Required: Tax notice N-1 (2025) on income N-2 (2024)
 * 2. From July 1st to September 15th (July 1 to Sept 14):
 *    - Transition period: Both Tax notice N-1 (2025) on income N-2 (2024)
 *      AND Tax notice N (2026) on income N-1 (2025) are valid.
 * 3. On or after September 15th (Sept 15 to Dec 31):
 *    - Required: Tax notice N (2026) on income N-1 (2025)
 */

export interface TaxYearPeriod {
  period: 'BEFORE_JULY' | 'JULY_TO_SEPTEMBER' | 'AFTER_SEPTEMBER'
  taxYear: number
  incomeYear: number
  nextTaxYear: number
  nextIncomeYear: number
}

export const getTaxYearPeriod = (date: Date = new Date()): TaxYearPeriod => {
  const d = dayjs(date)
  const y = d.year()
  const july1 = d.set('month', 6).set('date', 1)
  const september15 = d.set('month', 8).set('date', 15)

  if (d.isBefore(july1, 'day')) {
    return {
      period: 'BEFORE_JULY',
      taxYear: y - 1,
      incomeYear: y - 2,
      nextTaxYear: y,
      nextIncomeYear: y - 1
    }
  }

  if (d.isBefore(september15, 'day')) {
    return {
      period: 'JULY_TO_SEPTEMBER',
      taxYear: y - 1,
      incomeYear: y - 2,
      nextTaxYear: y,
      nextIncomeYear: y - 1
    }
  }

  return {
    period: 'AFTER_SEPTEMBER',
    taxYear: y,
    incomeYear: y - 1,
    nextTaxYear: y,
    nextIncomeYear: y - 1
  }
}

export const getTaxYear = (date: Date = new Date()): number => {
  const periodInfo = getTaxYearPeriod(date)
  return periodInfo.taxYear
}

export const taxYear = getTaxYear(new Date())

// Tax notice label "YYYY-YY": income year + 2-digit notice year (e.g. 2024 income → "2024-25")
export const getTaxNoticeLabel = (date: Date = new Date()): string => {
  const y = getTaxYear(date)
  return `${y - 1}-${String(y).slice(-2)}`
}

export const taxNoticeLabel = getTaxNoticeLabel(new Date())
