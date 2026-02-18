import { defineRule } from 'vee-validate'
import { required, email, max } from '@vee-validate/rules'

defineRule('required', required)
defineRule('email', email)
defineRule('max', max)
