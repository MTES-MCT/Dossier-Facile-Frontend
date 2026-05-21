import dayjs from 'dayjs'

// Rule: current year if september 15th or later, else previous year
const year = dayjs().year()
const dateOfChange = dayjs().set('year', year).set('month', 8).set('date', 15)

export const getTaxYear = (date: Date) =>
  dayjs(date).isBefore(dateOfChange, 'day') ? year - 1 : year

export const taxYear = getTaxYear(new Date())

// Tax notice label "YYYY-YY": income year + 2-digit notice year (e.g. 2024 income → "2024-25")
export const getTaxNoticeLabel = (date: Date) => {
  const y = getTaxYear(date)
  return `${y - 1}-${String(y).slice(-2)}`
}

export const taxNoticeLabel = getTaxNoticeLabel(new Date())
