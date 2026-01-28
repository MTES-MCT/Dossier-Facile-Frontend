import { isAxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import { toast } from '@/components/toast/toastUtils'

export function useResendMail() {
  const { t } = useI18n()

  async function resendMail(link: ApartmentSharingLink): Promise<boolean> {
    try {
      await ApartmentSharingLinkService.resendLink(link)
      toast.success(t('resend-mail.success'), null)
      return true
    } catch (error) {
      const isTooManyRequests = isAxiosError(error) && error.response?.status === 429
      toast.error(t(isTooManyRequests ? 'resend-mail.too-many-requests' : 'resend-mail.error'), null)
      return false
    }
  }

  return { resendMail }
}
