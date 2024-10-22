<template>
  <div>
    <Form name="form" @submit="sendFile">
      <div v-if="!hasErrors()">
        <NakedCard class="fr-p-md-5w fr-mb-3w">
          <h1 class="fr-h6">{{ t('validatefile.title') }}</h1>
          <p>{{ getCheckboxInstructions() }}<span style="color: red"> *</span></p>
          <div class="fr-checkbox-group bg-purple fr-mb-3w">
            <Field
              name="declaration"
              type="checkbox"
              v-model="declaration"
              v-slot="{ field, meta }"
              :rules="{
                isTrue: true
              }"
              :value="true"
            >
              <input
                id="declaration"
                type="checkbox"
                :class="{
                  'fr-input--valid': meta.valid,
                  'fr-input--error': !meta.valid
                }"
                v-bind="field"
              />
            </Field>
            <label for="declaration" v-html="t('validatefile.declaration')"> </label>
            <ErrorMessage name="declaration" v-slot="{ message }">
              <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
            </ErrorMessage>
          </div>
          <div v-if="hasGuarantors()">
            <div class="fr-checkbox-group bg-purple fr-mb-3w">
              <Field
                name="declaration2"
                type="checkbox"
                v-model="declaration2"
                v-slot="{ field, meta }"
                :rules="{
                  isTrue: true
                }"
                :value="true"
              >
                <input
                  type="checkbox"
                  id="declaration2"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  v-bind="field"
                />
              </Field>
              <label for="declaration2">{{
                user.guarantors.length > 1
                  ? t('validatefile.declaration2-plural')
                  : t('validatefile.declaration2')
              }}</label>
              <ErrorMessage name="declaration2" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
        </NakedCard>

        <div v-if="user.tenantType === 'CREATE'">
          <NakedCard class="fr-px-5w fr-py-3w fr-mb-2w">
            <p>
              <label for="precision" class="fr-label">
                {{ t('validatefile.precision') }}
              </label>
              <Field id="precision" name="precision" v-model="precision" v-slot="{ field, meta }">
                <textarea
                  id="precision"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="t('validatefile.placeholder')"
                  type="text"
                  maxlength="2000"
                  rows="3"
                  v-bind="field"
                  name="precision"
                  class="validate-required form-control fr-input"
                />
              </Field>
              <span>{{ precision.length }} / 2000</span>
              <ErrorMessage name="precision" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </p>
          </NakedCard>
        </div>
      </div>
      <ProfileFooter
        @on-back="goBack()"
        :disabled="hasErrors()"
        :nextLabel="t('validatefile.validate')"
      >
      </ProfileFooter>
    </Form>
    <div v-if="hasErrors()">
      <NakedCard class="fr-px-5w fr-py-3w">
        <div>
          <h6 class="fr-h6 color--secondary">
            {{ t('validatefile.validation-error-title') }}
          </h6>
          <p>
            {{ t('validatefile.validation-error-description') }}
          </p>
        </div>
      </NakedCard>
      <FileErrors></FileErrors>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileFooter from './footer/ProfileFooter.vue'
import FileErrors from './fileerrors/FileErrors.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useLoading } from 'vue-loading-overlay'
import useTenantStore from '../stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { ToastService } from '../services/ToastService'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { AnalyticsService } from '../services/AnalyticsService'
import { User } from 'df-shared-next/src/models/User'
import { UtilsService } from '../services/UtilsService'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'

const { t } = useI18n()

const store = useTenantStore()
const user = computed(() => store.user)
const emit = defineEmits(['on-back'])

const router = useRouter()

const precision = ref('')
const declaration = ref(false)
const declaration2 = ref(false)

onMounted(() => {
  if (user.value.honorDeclaration) {
    declaration.value = true
    declaration2.value = true
  }
  precision.value = user.value?.clarification || ''
  sendEventPrevalidation(user.value)
})

function sendEventPrevalidation(user: User) {
  if (
    import.meta.env.VITE_FEATURE_FLIPPING_PRE_VALIDATE !== 'true' ||
    !user.preValidationActivated
  ) {
    return
  }
  UtilsService.getAllDocuments(user).forEach((d: DfDocument) => {
    if (
      d.documentAnalysisReport?.analysisStatus === 'DENIED' &&
      !d.documentAnalysisReport?.comment
    ) {
      AnalyticsService.prevalidationEvent(d.documentSubCategory || '', 'DENIED')
    } else if (d.documentAnalysisReport?.analysisStatus === 'CHECKED') {
      AnalyticsService.prevalidationEvent(d.documentSubCategory || '', 'CHECKED')
    }
  })

  if (user.applicationType === 'COUPLE') {
    const cotenants = user.apartmentSharing?.tenants.filter(
      (cotenant: User) => user.id !== cotenant.id
    )
    cotenants.forEach((cotenant: User) => {
      sendEventPrevalidation(cotenant)
    })
  }
}

function sendFile() {
  if (!canValidate()) {
    window.scrollTo(0, 800)
    return
  }

  if (
    declaration.value === user.value?.honorDeclaration &&
    precision.value === user.value?.clarification
  ) {
    router.push('/account')
    return
  }
  const $loading = useLoading({})
  const loader = $loading.show()
  const params: any = {
    honorDeclaration: true
  }
  if (user.value.tenantType === 'CREATE') {
    params.clarification = precision.value
  }
  store
    .validateFile(params)
    .then(() => {
      store.loadUser().then(() => {
        router.push('/account')
      })
    })
    .catch(() => {
      ToastService.error()
    })
    .finally(() => {
      loader.hide()
    })
}

function goBack() {
  emit('on-back')
}

function hasErrors() {
  return !store.allDocumentsPreValidated || !store.allNamesFilled
}

function canValidate() {
  return declaration.value && (!hasGuarantors() || declaration2.value)
}

function getCheckboxInstructions() {
  return hasGuarantors() ? t('validatefile.read') : t('validatefile.read-no-guarantor')
}

function hasGuarantors() {
  return (
    user.value.guarantors.length > 0 &&
    user.value.guarantors.findIndex((g: Guarantor) => {
      return g.typeGuarantor !== 'ORGANISM'
    }) >= 0
  )
}
</script>
