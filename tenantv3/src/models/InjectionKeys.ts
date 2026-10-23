// Global provide/inject typing
// https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject

import type { InjectionKey } from 'vue'

export type FocusLegendType = () => Promise<void>

export const FocusLegendKey: InjectionKey<FocusLegendType> =
	Symbol('setFocusLegendType')