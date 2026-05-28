import { UtilsService } from '../services/UtilsService'
import { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosError } from 'axios'
import { toast } from '@/components/toast/toastUtils'
import { i18n } from '@/i18n'

vi.mock('@/components/toast/toastUtils', () => ({
  toast: { error: vi.fn() }
}))
vi.mock('@/i18n', () => ({
  i18n: {
    global: {
      t: vi.fn((key: string, params?: Record<string, unknown>) =>
        params ? `${key}|${JSON.stringify(params)}` : key)
    }
  }
}))

describe('UtilsService', () => {
  describe('tenantFullName', () => {
    it.each([
      {
        user: { firstName: 'john', lastName: 'doe', email: 'john.doe@example.com' },
        expected: 'John\xa0Doe'
      },
      {
        user: {
          firstName: 'john',
          lastName: 'doe',
          preferredName: 'smith',
          email: 'john.doe@example.com'
        },
        expected: 'John\xa0Smith'
      },
      {
        user: {
          firstName: 'jean-pierre',
          lastName: 'de la fontaine',
          email: 'jp@example.com'
        },
        expected: 'Jean-Pierre\xa0De La Fontaine'
      },
      {
        user: {
          firstName: 'john',
          lastName: 'doe',
          preferredName: '',
          email: 'john.doe@example.com'
        },
        expected: 'John\xa0Doe'
      },
      {
        user: {
          firstName: 'John',
          lastName: 'John',
          email: 'john@example.com'
        },
        expected: 'John\xa0John'
      },
      {
        user: {
          firstName: 'John',
          lastName: 'poeut',
          preferredName: 'John',
          email: 'john@example.com'
        },
        expected: 'John\xa0John'
      },
      {
        user: { email: 'test@test.com' },
        expected: 'test@test.com'
      }
    ])('should return $expected for $user', ({ user, expected }) => {
      const result = UtilsService.tenantFullName(user as CoTenant)
      expect(result).toBe(expected)
    })
  })

  describe('guarantorFullName', () => {
    it.each([
      {
        user: { firstName: 'john', lastName: 'doe' },
        expected: 'John\xa0Doe'
      },
      {
        user: { firstName: 'john', lastName: 'doe', preferredName: 'smith' },
        expected: 'John\xa0Smith'
      },
      {
        user: { firstName: 'john', lastName: 'doe', preferredName: '' },
        expected: 'John\xa0Doe'
      },
      {
        user: { firstName: 'jean-pierre', lastName: 'de la fontaine' },
        expected: 'Jean-Pierre\xa0De La Fontaine'
      },
      {
        user: {},
        expected: '\xa0'
      }
    ])('should return $expected for $user', ({ user, expected }) => {
      const result = UtilsService.guarantorFullName(user as Guarantor)
      expect(result).toBe(expected)
    })
  })

  describe('handleCommonSaveError', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    const buildErr = (message: string) =>
      ({ isAxiosError: true, response: { data: { message } } }) as unknown as AxiosError

    it.each([
      { form: 'documentTaxForm', max: 1355 },
      { form: 'documentTaxGuarantorNaturalPersonForm', max: 1355 },
      { form: 'documentFinancialForm', max: 2000 },
      { form: 'documentFinancialGuarantorNaturalPersonForm', max: 2000 },
      { form: 'documentResidencyForm', max: 2000 },
      { form: 'documentResidencyGuarantorNaturalPersonForm', max: 2000 }
    ])('shows customText too-long toast with max=$max for $form', ({ form, max }) => {
      const err = buildErr(`Validation failed ... LengthOfText.${form}.customText ...`)
      UtilsService.handleCommonSaveError(err, null)
      expect(i18n.global.t).toHaveBeenCalledWith('errors.custom-text-too-long', { max })
      expect(i18n.global.t).not.toHaveBeenCalledWith('add-file-failed')
      expect(toast.error).toHaveBeenCalledTimes(1)
    })

    it('falls back to add-file-failed when no LengthOfText code matches', () => {
      const err = buildErr('some unknown server error')
      UtilsService.handleCommonSaveError(err, null)
      expect(i18n.global.t).toHaveBeenCalledWith('add-file-failed')
      expect(toast.error).toHaveBeenCalledTimes(1)
    })
  })
})
