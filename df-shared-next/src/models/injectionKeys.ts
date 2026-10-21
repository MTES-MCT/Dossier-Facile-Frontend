// Global provide/inject typing
// https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject

import type { InjectionKey } from 'vue'

export type AccessibilityPropertiesType = (
  title: string,
  focus?: boolean,
) => void

export const AccessibilityPropertiesKey: InjectionKey<AccessibilityPropertiesType> =
  Symbol('setAccessibilityProperties')
