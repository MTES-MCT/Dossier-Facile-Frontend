import { config } from '@vue/test-utils'

config.global.mocks = {
  t: (tKey) => {
    return tKey
  } // just return translation key
}
