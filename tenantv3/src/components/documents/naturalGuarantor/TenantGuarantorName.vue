<template>
  <Form name="tenantGuarantorNameForm" @submit="save">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('tenantguarantorname.title') }}</h1>
      <DsfrAlert type="info" small>
        <p v-html="t('tenantguarantorchoice.two-guarantors-warning')"></p>
      </DsfrAlert>
      <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
        <div class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="lastName"
            name="lastname"
            :field-label="t('tenantguarantorname.lastname')"
            validation-rules="required|onlyAlpha"
            autocomplete="off"
          />
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="firstName"
            name="firstname"
            :field-label="t('tenantguarantorname.firstname')"
            validation-rules="required|onlyAlpha"
            autocomplete="off"
          />
        </div>
      </div>
    </NakedCard>
    <GuarantorFooter ref="footer" @on-back="goBack" />
  </Form>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { UtilsService } from '../../../services/UtilsService'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import { useLoading } from 'vue-loading-overlay'
import { onBeforeMount, ref, useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { makeSpouseGuarantorIdDocLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useRouter } from 'vue-router'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import TextField from 'df-shared-next/src/components/form/TextField.vue'

const { t } = useI18n()

const props = defineProps<{
  tenantId: number
  guarantor: Guarantor
}>()
const emit = defineEmits<{ 'on-back': [] }>()
const store = useTenantStore()
const router = useRouter()
const footer = useTemplateRef('footer')

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const firstName = ref<string | undefined>('')
const lastName = ref<string | undefined>('')

onBeforeMount(() => {
  firstName.value = props.guarantor.firstName
  lastName.value = props.guarantor.lastName
})

function next() {
  const link = makeSpouseGuarantorIdDocLink(props.guarantor, props.tenantId)
  router.push(link)
}

function save() {
  if (
    firstName.value === props.guarantor.firstName &&
    lastName.value === props.guarantor.lastName
  ) {
    next()
    return
  }
  const formData = new FormData()
  if (firstName.value) {
    formData.append('firstName', UtilsService.capitalize(firstName.value))
  }
  if (lastName.value) {
    formData.append('lastName', UtilsService.capitalize(lastName.value))
  }
  if (props.guarantor.id) {
    formData.append('guarantorId', props.guarantor.id?.toString())
  }
  formData.append('tenantId', props.tenantId.toString())

  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .saveGuarantorName(formData)
    .then(() => {
      toast.keep.success(t('save-success'), getNextBtnInFooter)
      next()
    })
    .catch(() => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      toast.error(t('errors.submit-failed'), footer.value?.button)
    })
    .finally(() => {
      loader.hide()
    })
}

function goBack() {
  emit('on-back')
}
</script>
