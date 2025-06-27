import { toast } from 'vue3-toastify'
import { i18n } from '@/i18n'

export const ToastService = {
  errorf(message: string) {
    toast.error(message)
  },
  error(message: string = 'error') {
    toast.error(i18n.global.t(message))
  },
  info(message: string) {
    toast.info(i18n.global.t(message))
  },
  success(message: string) {
    toast.success(i18n.global.t(message))
  },
  saveFailed() {
    toast.error(i18n.global.t('save-failed'))
  },
  saveSuccess() {
    toast.success(i18n.global.t('save-success'))
  },
  maxFileError(value: number, max: number) {
    toast.error(i18n.global.t('max-file', [value, max]))
  },
  noFileError() {
    toast.error(i18n.global.t('errors.no-file'))
  },
  deleteFileFailed() {
    toast.error(i18n.global.t('delete-file-failed'))
  },
  deleteSuccess() {
    toast.success(i18n.global.t('delete-success'))
  },
  saveFailedNumPages() {
    toast.error(i18n.global.t('save-failed-num-pages'))
  }
}
