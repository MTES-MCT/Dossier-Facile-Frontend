export function normalizeDpeNumber(input: string): string {
  // Backend expects uppercase and no spaces/hyphens.
  return input.replaceAll(/[\s-]/g, '').toUpperCase()
}

export function validateDpeNumber(value: unknown): true | string {
  // Block empty values: this rule is meant to validate the ADEME/DPE number itself.
  if (value === null || value === undefined) {
    return 'propertydiagnosticform.dpe-invalid'
  }

  if (typeof value !== 'string') {
    return 'propertydiagnosticform.dpe-invalid'
  }

  const raw = value
  if (!raw.trim().length) {
    return 'propertydiagnosticform.dpe-invalid'
  }

  const normalized = normalizeDpeNumber(raw)
  const dpeNumberPattern = /^[A-Z0-9]{13}$/

  if (!dpeNumberPattern.test(normalized)) {
    return 'propertydiagnosticform.dpe-invalid'
  }

  return true
}

