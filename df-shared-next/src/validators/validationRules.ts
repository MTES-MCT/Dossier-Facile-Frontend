import { defineRule } from 'vee-validate'

defineRule('required', (value: unknown) => {
  if (typeof value === 'number') {
    if (!value && value !== 0) {
      return 'field-required'
    }
    return true
  }
  if (!value || (Array.isArray(value) && !value.length)) {
    return 'field-required'
  }
  return true
})

defineRule('isTrue', (value: unknown) => {
  if (!value) {
    return 'field-required'
  }
  return true
})

defineRule('email', (value: string | null | undefined) => {
  if (!value || !value.length) {
    return true
  }
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(value)) {
    return 'register.email-not-valid'
  }
  return true
})
