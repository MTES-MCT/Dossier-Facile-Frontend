export function generatePasswordPlaceholder() {
  const chars = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '#!?-_.'
  ]
  return [4, 4, 2, 2]
    .map(function (len, i) {
      return Array(len)
        .fill(chars[i])
        .map(function (x) {
          return x[Math.floor(Math.random() * x.length)]
        })
        .join('')
    })
    .concat()
    .join('')
    .split('')
    .sort(function () {
      return 0.5 - Math.random()
    })
    .join('')
}

export function formatYearMonth(value: string, locale: string): string {
  const normalizedValue = value.trim()
  const yearMonthPattern = /^(\d{4})-(\d{2})$/
  const match = yearMonthPattern.exec(normalizedValue)
  if (!match) {
    return value
  }

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) {
    return value
  }

  const date = new Date(year, month - 1, 1)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date)
}
