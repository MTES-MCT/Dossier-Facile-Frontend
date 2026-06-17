import { describe, expect, it } from 'vitest'
import { getOwnerApiErrorMessage } from '../services/OwnerApiErrorService'
import type { ComposerTranslation } from 'vue-i18n'
import type { AxiosError } from 'axios'

const t = ((key: string) => {
  const messages: Record<string, string> = {
    'property-errors.dpe-not-found': 'Ce numéro de DPE est introuvable.',
    'property-errors.validation': 'Certaines informations sont invalides.',
    'property-errors.validation-error': 'Certaines informations sont invalides.',
    'try-again': 'Une erreur est survenue.'
  }
  return messages[key] ?? key
}) as ComposerTranslation

function axiosError(data: unknown, status?: number): AxiosError {
  return {
    isAxiosError: true,
    response: {
      data,
      status,
      statusText: '',
      headers: {},
      config: {} as AxiosError['config']
    },
    name: 'AxiosError',
    message: 'error'
  } as AxiosError
}

describe('OwnerApiErrorService', () => {
  it('maps structured owner api error code to i18n key', () => {
    const message = getOwnerApiErrorMessage(
      axiosError({
        code: 'DPE_NOT_FOUND',
        message: 'Le DPE est introuvable.',
        details: { dpeNumber: '2178V1001934U' }
      }, 400),
      t
    )

    expect(message).toBe('Ce numéro de DPE est introuvable.')
  })

  it('returns validation message when field errors are present', () => {
    const message = getOwnerApiErrorMessage(
      axiosError({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: ['dpeDate: invalid']
      }, 400),
      t
    )

    expect(message).toBe('Certaines informations sont invalides.')
  })

  it('falls back to backend message for legacy responses', () => {
    const message = getOwnerApiErrorMessage(
      axiosError({
        message: 'Legacy backend message'
      }, 400),
      t
    )

    expect(message).toBe('Legacy backend message')
  })

  it('falls back to generic try-again message', () => {
    expect(getOwnerApiErrorMessage(new Error('boom'), t)).toBe('Une erreur est survenue.')
  })
})
