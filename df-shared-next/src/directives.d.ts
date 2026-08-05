import type { Directive } from 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalDirectives {
    vSafeHtml: Directive<HTMLElement, string | undefined | null>
  }
}

declare module 'vue' {
  export interface GlobalDirectives {
    vSafeHtml: Directive<HTMLElement, string | undefined | null>
  }
}
