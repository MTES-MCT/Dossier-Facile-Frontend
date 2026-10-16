import { describe, expect, it } from 'vitest'
import type { Applicant } from '../components/property/Applicant'
import { compareApplicants } from '../components/property/applicantSorting'

function applicant(fields: Partial<Applicant>): Applicant {
  return fields as Applicant
}

function namesSortedBy(field: keyof Applicant, ascending: boolean, list: Applicant[]) {
  return [...list].sort(compareApplicants(field, ascending)).map((a) => a.tenantName)
}

const byRate = [
  applicant({ tenantName: 'high', rate: 90 }),
  applicant({ tenantName: 'low', rate: 12 }),
  applicant({ tenantName: 'middle', rate: 45 })
]

describe('compareApplicants', () => {
  it('puts the smallest value first when ascending', () => {
    expect(namesSortedBy('rate', true, byRate)).toEqual(['low', 'middle', 'high'])
  })

  it('puts the largest value first when descending', () => {
    expect(namesSortedBy('rate', false, byRate)).toEqual(['high', 'middle', 'low'])
  })

  it('orders strings the same way as numbers', () => {
    const list = [
      applicant({ tenantName: 'Zoe' }),
      applicant({ tenantName: 'Alice' }),
      applicant({ tenantName: 'Marc' })
    ]

    expect(namesSortedBy('tenantName', true, list)).toEqual(['Alice', 'Marc', 'Zoe'])
  })

  it('keeps equal values in place', () => {
    const compare = compareApplicants('rate', true)
    const left = applicant({ tenantName: 'first', rate: 30 })
    const right = applicant({ tenantName: 'second', rate: 30 })

    expect(compare(left, right)).toBe(0)
  })

  it('sorts a rate of zero rather than treating it as missing', () => {
    const list = [applicant({ tenantName: 'some', rate: 20 }), applicant({ tenantName: 'none', rate: 0 })]

    expect(namesSortedBy('rate', true, list)).toEqual(['none', 'some'])
  })

  it('sends applicants without a value last whichever way the column is sorted', () => {
    const list = [
      applicant({ tenantName: 'unknown', rate: undefined }),
      applicant({ tenantName: 'known', rate: 50 })
    ]

    expect(namesSortedBy('rate', true, list)).toEqual(['known', 'unknown'])
    expect(namesSortedBy('rate', false, list)).toEqual(['known', 'unknown'])
  })
})
