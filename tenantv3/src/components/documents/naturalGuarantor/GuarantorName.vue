<template>
  <div>
    <Form name="guarantorNameForm" @submit="save">
      <NakedCard class="fr-p-md-5w">
        <GuarantorBadge />
        <h1 class="fr-h4">{{ t('guarantorname.title') }}</h1>
        <DsfrAlert type="info" small>
          <p v-html="t('guarantorchoice.two-guarantors-warning')"></p>
        </DsfrAlert>
        <div class="fr-mt-4w">
          <TextField
            v-model.trim="lastName"
            :field-label="t('guarantorname.lastname')"
            name="lastname"
            validation-rules="required|onlyAlpha"
            autocomplete="off"
          />

          <TextField
            v-model.trim="firstName"
            :field-label="t('guarantorname.firstname')"
            name="firstname"
            validation-rules="required|onlyAlpha"
            autocomplete="off"
          />
        </div>
      </NakedCard>
      <GuarantorFooter ref="footer" @on-back="goBack" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { UtilsService } from '../../../services/UtilsService'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { Form } from 'vee-validate'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'
import TextField from 'df-shared-next/src/components/form/TextField.vue'
import { DsfrAlert } from '@gouvminint/vue-dsfr'

const store = useTenantStore()
const footer = useTemplateRef('footer')
const selectedGuarantor = computed(() => store.selectedGuarantor)

const { t } = useI18n()

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const firstName = ref('')
const lastName = ref('')

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

onBeforeMount(() => {
  firstName.value = selectedGuarantor.value?.firstName || ''
  lastName.value = selectedGuarantor.value?.lastName || ''
})

function save() {
  if (
    firstName.value === selectedGuarantor.value?.firstName &&
    lastName.value === selectedGuarantor.value?.lastName
  ) {
    emit('on-next')
    return
  }
  const formData = new FormData()
  if (firstName.value) {
    formData.append('firstName', UtilsService.capitalize(firstName.value))
  }
  if (lastName.value) {
    formData.append('lastName', UtilsService.capitalize(lastName.value))
  }
  formData.append('guarantorId', store.guarantor?.id?.toString() || '')
  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .saveGuarantorName(formData)
    .then(() => {
      toast.keep.success(t('save-success'), getNextBtnInFooter)
      emit('on-next')
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
