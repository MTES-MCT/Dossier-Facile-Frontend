import { defineRule } from 'vee-validate'
import { required, email, max, alpha } from '@vee-validate/rules'

import { exactDigits, isFilled, matchRegex, withMessage } from '@regle/rules'
import { useI18n } from 'vue-i18n'
import type { Maybe } from '@regle/core'

defineRule('max', max)
defineRule('email', email)
defineRule('alpha', alpha)
defineRule('required', required)

export const useCustomRules = () => {
  const { t } = useI18n()

  const frenchPostalCode = withMessage(exactDigits(5), () => t('validation.postalCode'))

  // explanation and test https://regex101.com/r/9aVdgZ/1
  const nameRegex = /^[A-Za-zÀ-ÿĀ-ž]+((?:' ?|-| )[A-Za-zÀ-ÿĀ-ž]+)*$/
  const nameFormat = withMessage(
    (value: Maybe<string>) => {
      if (!isFilled(value)) return true
      return matchRegex(value, nameRegex)
    },
    () => t('validation.name')
  )

  return { frenchPostalCode, nameFormat }
}
