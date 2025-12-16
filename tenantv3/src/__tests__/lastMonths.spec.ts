import { afterEach, describe, expect, it, vi } from 'vitest'
import { lastMonths } from '../components/financial/lib/lastMonths'

afterEach(() => {
  vi.useRealTimers()
})

describe('lastMonths', () => {
  it('avant le 16 : retourne les 4 mois précédents', () => {
    const now = new Date(2025, 11, 15, 12, 0, 0) // 15/12/2025
    vi.useFakeTimers()
    vi.setSystemTime(now)

    expect(lastMonths()).toEqual(['August', 'September', 'October', 'November'])
  })

  it('à partir du 16 : prend le mois courant comme référence', () => {
    const now = new Date(2025, 11, 16, 12, 0, 0) // 16/12/2025
    vi.useFakeTimers()
    vi.setSystemTime(now)

    expect(lastMonths()).toEqual(['September', 'October', 'November', 'December'])
  })

  it('gère le passage d’année (janvier avant le 16 => base décembre)', () => {
    const now = new Date(2025, 0, 10, 12, 0, 0) // 10/01/2025
    vi.useFakeTimers()
    vi.setSystemTime(now)

    console.log('LastMonts = ', lastMonths())

    expect(lastMonths()).toEqual(['September', 'October', 'November', 'December'])
  })
})
