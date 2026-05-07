import { onBeforeMount, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'

type Options = {
  guarantor: MaybeRefOrGetter<Guarantor | null | undefined>
  tenantId?: MaybeRefOrGetter<number | undefined>
  onSuccess: () => void
}

export function useGuarantorNameForm(opts: Options) {
  const { t } = useI18n()
  const store = useTenantStore()

  const firstName = ref<string>('')
  const lastName = ref<string>('')
  const preferredName = ref<string>('')
  const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)

  onBeforeMount(() => {
    const g = toValue(opts.guarantor)
    firstName.value = g?.firstName || ''
    lastName.value = g?.lastName || ''
    preferredName.value = g?.preferredName || ''
  })

  function isUnchanged(g: Guarantor | null | undefined) {
    return (
      firstName.value === (g?.firstName || '') &&
      lastName.value === (g?.lastName || '') &&
      preferredName.value === (g?.preferredName || '')
    )
  }

  function buildFormData(g: Guarantor | null | undefined, tenantId: number | undefined) {
    const formData = new FormData()
    if (firstName.value) {
      formData.append('firstName', UtilsService.capitalize(firstName.value))
    }
    if (lastName.value) {
      formData.append('lastName', UtilsService.capitalize(lastName.value))
    }
    formData.append(
      'preferredName',
      preferredName.value ? UtilsService.capitalize(preferredName.value) : ''
    )
    if (g?.id) {
      formData.append('guarantorId', g.id.toString())
    }
    if (tenantId !== undefined) {
      formData.append('tenantId', tenantId.toString())
    }
    return formData
  }

  function save({ errorAnchor }: { errorAnchor?: HTMLElement | null } = {}) {
    const g = toValue(opts.guarantor)
    if (isUnchanged(g)) {
      opts.onSuccess()
      return
    }

    const formData = buildFormData(g, toValue(opts.tenantId))

    const $loading = useLoading({})
    const loader = $loading.show()
    store
      .saveGuarantorName(formData)
      .then(() => {
        toast.keep.success(t('save-success'), getNextBtnInFooter)
        opts.onSuccess()
      })
      .catch(() => {
        fileUploadStatus.value = UploadStatus.STATUS_FAILED
        toast.error(t('errors.submit-failed'), errorAnchor ?? undefined)
      })
      .finally(() => {
        loader.hide()
      })
  }

  return { firstName, lastName, preferredName, fileUploadStatus, save }
}
