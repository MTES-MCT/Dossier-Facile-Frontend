<template>
  <div>
    <NakedCard class="fr-p-md-5w fr-mb-2w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h1 class="fr-h6">
            {{ t('coupleinformation.partner-name-title') }}
          </h1>
        </div>
        <div class="fr-col-12 fr-mb-3w">
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
      </div>
    </NakedCard>
    <NakedCard class="fr-p-md-5w fr-mb-2w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h1 class="fr-h6">
            {{ t('coupleinformation.partner-email-title') }}
          </h1>
          <DsfrButton
            tertiary
            size="sm"
            type="button"
            :label="t('coupleinformation.more-information')"
            @click="isModalOpened = true"
          />
          <DsfrModalPatched
            v-model:is-opened="isModalOpened"
            :title="t('coupleinformation.more-information')"
            icon="ri:arrow-right-line"
            :is-alert="isAlert"
          >
            <template #default>
              <CoupleInformationHelp />
            </template>
          </DsfrModalPatched>
        </div>
        <div class="fr-col-12 fr-mt-3w fr-mb-3w">
          <FieldLabel for-input="email">
            {{ t('coupleinformation.spouseEmail') }}
          </FieldLabel>
          <Field
            v-slot="{ field, meta }"
            v-model="coTenant.email"
            name="email"
            :rules="{
              email: true,
              custom: user.email
            }"
          >
            <input
              id="email"
              ref="email-input"
              v-bind="field"
              :aria-describedby="hasSubmited ? 'email-errors' : undefined"
              :aria-invalid="hasSubmited && !meta.valid"
              class="validate-required form-control fr-input"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              placeholder="nom@exemple.fr"
              type="email"
              :disabled="disableEmailField"
            />
          </Field>
          <ErrorMessage v-if="hasSubmited" v-slot="{ message }" name="email">
            <span id="email-errors" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
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
                isTrue: coTenant?.email?.length > 0 ? true : false
              }"
              :value="true"
            >
              <input
                id="authorize"
                type="checkbox"
                :required="coTenant?.email?.length > 0 ? true : false"
                v-bind="field"
                :aria-describedby="hasSubmited ? 'auth-errors' : undefined"
                :aria-invalid="hasSubmited && !meta.valid"
                :class="{
                  'fr-input--valid': meta.valid,
                  'fr-input--error': !meta.valid
                }"
                @change="updateAuthorize"
              />
              <label for="authorize" v-html="t('coupleinformation.acceptAuthor')" />
            </Field>
            <ErrorMessage v-if="hasSubmited" v-slot="{ message }" name="authorize">
              <span id="auth-errors" class="fr-error-text">{{ t(message || '') }}</span>
            </ErrorMessage>
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
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Field, ErrorMessage, defineRule } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import DsfrModalPatched from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import TextField from './form/TextField.vue'

interface Props {
  hasSubmited: boolean
}

defineProps<Props>()

defineRule('custom', (v1: string, [v2]: string[]) => {
  if (v1 === v2) {
    return 'same-email-not-valid'
  }
  return true
})

const { t } = useI18n()
const store = useTenantStore()
const emailInput = useTemplateRef('email-input')

defineExpose({ emailInput })
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

// modal logic
const isModalOpened = ref(false)
const isAlert = ref(false)

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
  if (coTenant.value.firstName && coTenant.value.lastName) {
    coTenants.value = [coTenant.value]
  }
}

function updateAuthorize() {
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
