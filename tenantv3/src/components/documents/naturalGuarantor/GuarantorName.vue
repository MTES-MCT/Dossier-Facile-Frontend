<template>
  <div>
    <Form name="guarantorNameForm" @submit="save">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">{{ t('guarantorname.title') }}</h1>
        <div class="fr-alert fr-alert--info">
          <p v-html="t('guarantorchoice.two-guarantors-warning')"></p>
        </div>
        <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
          <div class="fr-col-12 fr-mb-3w">
            <Field
              name="lastname"
              v-model="lastName"
              v-slot="{ field, meta }"
              :rules="{ required: true, onlyAlpha: true }"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="lastname">{{ t('guarantorname.lastname') }} :</label>
                <input
                  v-bind="field"
                  class="form-control fr-input validate-required"
                  id="lastname"
                  name="lastname"
                  :placeholder="t('guarantorname.lastname-placeholder')"
                  type="text"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  required
                />
                <ErrorMessage name="lastname" v-slot="{ message }">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </Field>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <Field
              name="firstname"
              v-model="firstName"
              v-slot="{ field, meta }"
              :rules="{ required: true, onlyAlpha: true }"
            >
              <div class="fr-input-group">
                <label for="firstname" class="fr-label">{{ t('guarantorname.firstname') }} :</label>
                <input
                  id="firstname"
                  :placeholder="t('guarantorname.firstname-placeholder')"
                  type="text"
                  v-bind="field"
                  name="firstname"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  required
                />

                <ErrorMessage name="firstname" v-slot="{ message }">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </Field>
          </div>
        </div>
      </NakedCard>
      <GuarantorFooter @on-back="goBack"></GuarantorFooter>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { UtilsService } from '../../../services/UtilsService'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import { computed, onBeforeMount, ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { Form, Field, ErrorMessage } from 'vee-validate'

const store = useTenantStore()
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
