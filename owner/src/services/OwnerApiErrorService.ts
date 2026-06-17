import { isAxiosError } from 'axios'
import type { ComposerTranslation } from 'vue-i18n'

export type OwnerApiErrorPayload = {
  code?: string
  message?: string
  details?: Record<string, unknown>
  errors?: string[]
}

const KNOWN_CODES = new Set([
  'DPE_NOT_FOUND',
  'ADEME_UNAVAILABLE',
  'VALIDATION_ERROR',
  'GENERIC'
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parsePayload(data: unknown): OwnerApiErrorPayload | undefined {
  if (!isRecord(data)) {
    return undefined
  }
  return {
    code: typeof data.code === 'string' ? data.code : undefined,
    message: typeof data.message === 'string' ? data.message : undefined,
    details: isRecord(data.details) ? data.details : undefined,
    errors: Array.isArray(data.errors)
      ? data.errors.filter((error): error is string => typeof error === 'string')
      : undefined
  }
}

export function getOwnerApiErrorMessage(error: unknown, t: ComposerTranslation): string {
  if (!isAxiosError(error)) {
    return t('try-again')
  }

  const payload = parsePayload(error.response?.data)
  if (payload?.code && KNOWN_CODES.has(payload.code)) {
    const key = `property-errors.${payload.code.replaceAll('_', '-').toLowerCase()}`
    return t(key, payload.details ?? {})
  }

  if (payload?.errors?.length) {
    return t('property-errors.validation')
  }

  if (payload?.message) {
    return payload.message
  }

  if (typeof error.response?.data === 'string' && error.response.data.length > 0) {
    return error.response.data
  }

  const status = error.response?.status
  if (status === 400) {
    return t('property-errors.dpe-not-found')
  }
  if (status === 502) {
    return t('property-errors.ademe-unavailable')
  }

  return t('try-again')
}
