import { useI18n } from 'vue-i18n'
import { ProfileService } from '@/services/ProfileService'
import { UtilsService } from '@/services/UtilsService'
import { toast } from '@/components/toast/toastUtils'

/**
 * Downloads the watermarked documents as a ZIP archive.
 * `triggerElement` receives the focus back when the error toast is dismissed.
 */
export function useZipDownload() {
  const { t } = useI18n()

  function downloadZip(triggerElement?: HTMLElement | null) {
    return ProfileService.downloadZip()
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/zip' })
        const link = window.document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = UtilsService.getFileNameFromHeaders(response.headers, 'dossierFacile.zip')
        link.click()
      })
      .catch((error) => {
        console.error(error)
        toast.error(t('file.download-failed'), triggerElement)
      })
  }

  return { downloadZip }
}
