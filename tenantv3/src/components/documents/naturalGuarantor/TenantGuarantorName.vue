<template>
  <div>
    <Form name="tenantGuarantorNameForm" @submit="save">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">{{ t('tenantguarantorname.title') }}</h1>
        <div class="fr-alert fr-alert--info">
          <p v-html="t('tenantguarantorchoice.two-guarantors-warning')"></p>
        </div>
        <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="lastname"
                >{{ t('tenantguarantorname.lastname') }} :</label
              >
              <Field
                v-slot="{ field, meta }"
                v-model="lastName"
                name="lastname"
                :rules="{
                  required: true,
                  onlyAlpha: true
                }"
              >
                <input
                  v-bind="field"
                  id="lastname"
                  class="form-control fr-input validate-required"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  name="lastname"
                  :placeholder="t('tenantguarantorname.lastname-placeholder')"
                  type="text"
                  required
                />
              </Field>
              <ErrorMessage v-slot="{ message }" name="lastname">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label for="firstname" class="fr-label"
                >{{ t('tenantguarantorname.firstname') }} :</label
              >
              <Field
                v-slot="{ field, meta }"
                v-model="firstName"
                name="firstname"
                :rules="{
                  required: true,
                  onlyAlpha: true
                }"
              >
                <input
                  id="firstname"
                  :placeholder="t('tenantguarantorname.firstname-placeholder')"
                  type="text"
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  required
                />
              </Field>
              <ErrorMessage v-slot="{ message }" name="firstname">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
        </div>
      </NakedCard>
      <GuarantorFooter @on-back="goBack"></GuarantorFooter>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { UtilsService } from '../../../services/UtilsService'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { onBeforeMount, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  tenantId: number
  guarantor: Guarantor
}>()
const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()
const store = useTenantStore()

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const firstName = ref<string | undefined>('')
const lastName = ref<string | undefined>('')

onBeforeMount(() => {
  firstName.value = props.guarantor.firstName
  lastName.value = props.guarantor.lastName
})

function save() {
  if (
    firstName.value === props.guarantor.firstName &&
    lastName.value === props.guarantor.lastName
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
  if (props.guarantor.id) {
    formData.append('guarantorId', props.guarantor.id?.toString())
  }
  formData.append('tenantId', props.tenantId.toString())

  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .saveGuarantorName(formData)
    .then(() => {
      ToastService.saveSuccess()
      emit('on-next')
    })
    .catch(() => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      ToastService.saveFailed()
    })
    .finally(() => {
      loader.hide()
    })
}

function goBack() {
  emit('on-back')
}
</script>

<style scoped lang="scss"></style>
