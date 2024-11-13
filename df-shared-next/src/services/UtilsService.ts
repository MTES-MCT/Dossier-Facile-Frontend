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
