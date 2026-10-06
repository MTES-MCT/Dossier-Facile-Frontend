import type { Applicant } from './Applicant'

type SortableField = keyof Applicant

export function compareApplicants(
  field: SortableField,
  ascending: boolean
): (left: Applicant, right: Applicant) => number {
  const direction = ascending ? 1 : -1

  return (left, right) => {
    const leftValue = left[field]
    const rightValue = right[field]

    if (leftValue === rightValue) {
      return 0
    }
    if (leftValue === undefined || leftValue === null) {
      return 1
    }
    if (rightValue === undefined || rightValue === null) {
      return -1
    }

    return leftValue < rightValue ? -direction : direction
  }
}
