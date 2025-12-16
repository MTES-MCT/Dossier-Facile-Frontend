import dayjs from 'dayjs'

export function lastMonths() {
  const monthIndex = dayjs().date() < 16 ? 1 : 0
  const month = dayjs().subtract(monthIndex, 'month')
  return [3, 2, 1, 0].map((d) => month.subtract(d, 'month').format('MMMM'))
}
