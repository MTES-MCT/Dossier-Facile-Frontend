<template>
  <Form name="tenantGuarantorNameForm" @submit="save">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h6">{{ t('tenantguarantorname.title') }}</h1>
      <div class="fr-alert fr-alert--info">
        <p v-html="t('tenantguarantorchoice.two-guarantors-warning')"></p>
      </div>
      <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
        <div class="fr-col-12 fr-mb-3w">
          <div class="fr-input-group">
            <label class="fr-label" for="lastname">{{ t('tenantguarantorname.lastname') }} :</label>
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
    <GuarantorFooter ref="footer" @on-back="goBack"></GuarantorFooter>
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
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { makeSpouseGuarantorIdDocLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useRouter } from 'vue-router'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'

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
