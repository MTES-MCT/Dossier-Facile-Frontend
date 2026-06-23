<template>
  <div>
    <NakedCard class="fr-p-md-5w fr-mb-2w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h1 class="fr-h4">
            {{ t('coupleinformation.partner-email-title') }}
          </h1>
          <DsfrButton
            tertiary
            size="sm"
            type="button"
            :label="t('coupleinformation.more-information')"
            @click="isModalOpened = true"
          />
          <DsfrModalPatch
            v-model:is-opened="isModalOpened"
            :title="t('coupleinformation.more-information')"
            icon="ri:arrow-right-line"
            :is-alert="isAlert"
          >
            <template #default>
              <CoupleInformationHelp />
            </template>
          </DsfrModalPatch>
        </div>
        <div class="fr-col-12 fr-mt-3w fr-mb-3w">
          <TextField
            v-model.trim="coTenant.lastName"
            :field-label="t('coupleinformation.spouseLastName')"
            name="coTenantLastName"
            validation-rules="required|onlyAlpha"
            :disabled="disableNameFields"
            @input="handleInput"
          />
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="coTenant.firstName"
            :field-label="t('coupleinformation.spouseFirstName')"
            name="coTenantFirstName"
            validation-rules="required|onlyAlpha"
            :disabled="disableNameFields"
            @input="handleInput"
          />
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <FieldLabel for-input="email" :required="!disableEmailField">
            {{ t('coupleinformation.spouseEmail') }}
          </FieldLabel>
          <HintText id="email-hint">{{ t('coupleinformation.spouseEmailHint') }}</HintText>
          <Field
            v-slot="{ field, meta }"
            v-model="coTenant.email"
            name="email"
            :rules="emailRules"
          >
            <input
              id="email"
              ref="email-input"
              v-bind="field"
              :aria-describedby="emailDescribedBy"
              :aria-invalid="(hasSubmited && !meta.valid) || !!emailServerError"
              class="validate-required form-control fr-input"
              :class="{
                'fr-input--valid': meta.valid && !emailServerError,
                'fr-input--error': !meta.valid || !!emailServerError
              }"
              placeholder="nom@exemple.fr"
              type="email"
              :required="!disableEmailField"
              :disabled="disableEmailField"
              @input="handleInput"
            />
          </Field>
          <div id="email-errors" role="alert">
            <ErrorMessage v-if="hasSubmited" v-slot="{ message }" name="email">
              <span class="fr-error-text">{{ t(message || '') }}</span>
            </ErrorMessage>
            <span v-if="emailServerError" class="fr-error-text">{{ t(emailServerError) }}</span>
          </div>
        </div>
      </div>
      <div ref="checkboxauthorize" class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-mt-3w">
          <div class="bg-purple fr-checkbox-group">
            <Field
              v-slot="{ field, meta }"
              v-model="authorize"
              name="authorize"
              type="checkbox"
              :rules="{
                isTrue: true
              }"
              :value="true"
            >
              <input
                id="authorize"
                ref="authorize-input"
                type="checkbox"
                required
                v-bind="field"
                :aria-describedby="authorizeDescribedBy"
                :aria-invalid="(hasSubmited && !meta.valid) || !!authorizeServerError"
                :class="{
                  'fr-input--valid': meta.valid,
                  'fr-input--error': !meta.valid || !!authorizeServerError
                }"
                @change="updateAuthorize"
              />
              <label for="authorize" v-html="t('coupleinformation.acceptAuthor')" />
            </Field>
            <div id="auth-errors" role="alert">
              <ErrorMessage v-if="hasSubmited" v-slot="{ message }" name="authorize">
                <span class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
              <span v-if="authorizeServerError" class="fr-error-text">{{
                t(authorizeServerError)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import CoupleInformationHelp from './helps/CoupleInformationHelp.vue'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'
import HintText from '@/components/common/HintText.vue'
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Field, ErrorMessage, defineRule } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import TextField from './form/TextField.vue'

interface Props {
  hasSubmited: boolean
}

const props = defineProps<Props>()

defineRule('custom', (v1: string, [v2]: string[]) => {
  if (v1 === v2) {
    return 'same-email-not-valid'
  }
  return true
})

const { t } = useI18n()
const store = useTenantStore()
const emailInput = useTemplateRef('email-input')
const authorizeInput = useTemplateRef('authorize-input')

const user = computed(() => store.user)

const coTenant = ref<CoTenant>(new User())
const coTenants = defineModel<CoTenant[]>({
  default: () => []
})
const authorize = ref(false)
const showCheckBox = ref(false)
const disableNameFields = ref(false)
const disableEmailField = ref(false)
const checkboxauthorize = ref()

// Server-side error returned by POST /application/v2, displayed inline (RGAA).
const serverError = ref<{ messageKey: string; field?: 'email' | 'authorize' } | null>(null)
const emailServerError = computed(() =>
  serverError.value?.field === 'email' ? serverError.value.messageKey : null
)
const authorizeServerError = computed(() =>
  serverError.value?.field === 'authorize' ? serverError.value.messageKey : null
)

const emailRules = computed(() => ({
  required: !disableEmailField.value,
  email: true,
  custom: user.value.email
}))

const emailDescribedBy = computed(() => {
  const ids = ['email-hint']
  if (props.hasSubmited || emailServerError.value) {
    ids.push('email-errors')
  }
  return ids.join(' ')
})

const authorizeDescribedBy = computed(() =>
  props.hasSubmited || authorizeServerError.value ? 'auth-errors' : undefined
)

// modal logic
const isModalOpened = ref(false)
const isAlert = ref(false)

function showApiError(messageKey: string, field?: 'email' | 'authorize') {
  serverError.value = { messageKey, field }
  nextTick(() => {
    if (field === 'authorize') {
      authorizeInput.value?.focus()
    } else if (field === 'email') {
      emailInput.value?.focus()
    }
  })
}

defineExpose({ showApiError })

onMounted(() => {
  if ((user.value.apartmentSharing?.tenants.length || 0) > 1) {
    const partner = user.value.apartmentSharing?.tenants.find((t) => {
      return t.email != user.value.email
    })
    coTenant.value = partner || coTenant.value
    if (coTenant.value.firstName || coTenant.value.lastName) {
      disableNameFields.value = true
    }
    if (coTenant.value.email?.length > 0) {
      disableEmailField.value = true
      showCheckBox.value = true
      authorize.value = store.spouseAuthorize
    }
  }
})

function handleInput() {
  serverError.value = null
  if (coTenant.value.firstName && coTenant.value.lastName) {
    coTenants.value = [coTenant.value]
  }
}

function updateAuthorize() {
  if (authorizeServerError.value) {
    serverError.value = null
  }
  store.spouseAuthorize = authorize.value
}
</script>

<style scoped lang="scss">
.overflow--hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.icon-btn {
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.center-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-icon {
  border-radius: 50%;
  background-color: var(--primary);
  padding: 0.25rem;
}

.nowrap {
  flex-wrap: nowrap;
  overflow: auto;
}

.max-content {
  max-width: max-content;
  @media all and (max-width: 420px) {
    max-width: 200px;
  }
}
</style>
