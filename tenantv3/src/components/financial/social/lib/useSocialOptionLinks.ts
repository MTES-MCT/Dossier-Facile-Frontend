import type { OptionLink } from '@/components/common/RadioList.vue'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

/**
 * @param suffix - suffix for translations
 */
export function useSocialOptionLinks(suffix = ''): ComputedRef<OptionLink[]> {
  const route = useRoute()
  const { t } = useI18n()

  const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
    {
      to: `${route.path}/plus-3-mois`,
      title: t('form.financial.more-3-months'),
      event: 'plus-3-mois'
    },
    {
      to: `${route.path}/moins-3-mois`,
      title: t('form.financial.less-3-months'),
      event: 'moins-3-mois'
    },
    {
      to: `${route.path}/pas-encore`,
      title: t(`not-yet.${suffix}`),
      event: 'pas-encore'
    }
  ])

  return optionLinks
}
