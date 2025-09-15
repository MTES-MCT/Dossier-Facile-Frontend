import dayjs from 'dayjs'

// Rule: current year if october 15th or later, else previous year
const year = dayjs().year()
const date = dayjs().set('year', year).set('month', 9).set('date', 15)
export const taxYear = dayjs().isBefore(date) ? year - 1 : year
