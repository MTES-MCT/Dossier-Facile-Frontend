import type { InjectionKey, TemplateRef } from 'vue'
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'

export interface DataFooter {
  analysisWrapper: TemplateRef<InstanceType<typeof AnalysisWrapper>>
  submit: () => Promise<void>
}
export const FooterKey: InjectionKey<DataFooter> = Symbol('data-footer')
