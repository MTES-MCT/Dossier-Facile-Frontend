import { defineRule } from 'vee-validate'
import { required, email, max, alpha } from '@vee-validate/rules'

defineRule('max', max)
defineRule('email', email)
defineRule('alpha', alpha)
defineRule('required', required)
