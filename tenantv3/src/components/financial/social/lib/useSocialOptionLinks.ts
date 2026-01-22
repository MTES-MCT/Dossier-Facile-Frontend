import type { OptionLink } from '@/components/common/RadioList.vue'
import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * @param here - reactive Ref of the current route/base path
 * @param suffix - suffix for translations
 */
export function useSocialOptionLinks(here: Ref<string>, suffix = ''): ComputedRef<OptionLink[]> {
  const { t } = useI18n()

  const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
    {
      to: `${here.value}/plus-3-mois`,
      title: t('form.financial.more-3-months'),
      event: 'plus-3-mois'
    },
    {
      to: `${here.value}/moins-3-mois`,
      title: t('form.financial.less-3-months'),
      event: 'moins-3-mois'
    },
    {
      to: `${here.value}/pas-encore`,
      title: t('not-yet-' + suffix),
      event: 'pas-encore'
    }
  ])

  return optionLinks
}
