import { describe, expect, it } from 'vitest'
import { normalizeDpeNumber, validateDpeNumber } from '../validators/dpeNumberValidator'

describe('dpeNumber validator', () => {
  it('normalizes spaces and hyphens and uppercases', () => {
    expect(normalizeDpeNumber('1412 v1020002-u')).toBe('1412V1020002U')
  })

  it('accepts a valid DPE number (13 alphanumeric chars)', () => {
    expect(validateDpeNumber('1412V1020002U')).toBe(true)
  })

  it('accepts lowercase input (normalized to uppercase)', () => {
    expect(validateDpeNumber('1412v1020002u')).toBe(true)
  })

  it('rejects invalid length', () => {
    expect(validateDpeNumber('1412V1020002')).toBe('propertydiagnosticform.dpe-invalid')
  })

  it('rejects invalid characters', () => {
    expect(validateDpeNumber('1412V1020002!')).toBe('propertydiagnosticform.dpe-invalid')
  })

  it('blocks empty value', () => {
    expect(validateDpeNumber('')).toBe('propertydiagnosticform.dpe-invalid')
    expect(validateDpeNumber('   ')).toBe('propertydiagnosticform.dpe-invalid')
    expect(validateDpeNumber(null)).toBe('propertydiagnosticform.dpe-invalid')
    expect(validateDpeNumber(undefined)).toBe('propertydiagnosticform.dpe-invalid')
  })
})

