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
          <FieldLabel :required="true">
            {{ t('coupleinformation.spouseLastName') }}
          </FieldLabel>
          <Field
            id="coTenantLastName"
            v-slot="{ field, meta }"
            v-model="coTenant.lastName"
            name="coTenantLastName"
            :rules="{
              required: true,
              onlyAlpha: true
            }"
          >
            <input
              v-bind="field"
              class="form-control validate-required fr-input"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              type="text"
              :disabled="disableNameFields"
              @input="handleInput"
            />
          </Field>
          <ErrorMessage v-slot="{ message }" name="coTenantLastName">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <FieldLabel :required="true">
            {{ t('coupleinformation.spouseFirstName') }}
          </FieldLabel>
          <Field
            id="coTenantFirstName"
            v-slot="{ field, meta }"
            v-model="coTenant.firstName"
            name="coTenantFirstName"
            :rules="{
              required: true,
              onlyAlpha: true
            }"
          >
            <input
              v-bind="field"
              class="validate-required form-control fr-input"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              type="text"
              :disabled="disableNameFields"
              @input="handleInput"
            />
          </Field>
          <ErrorMessage v-slot="{ message }" name="coTenantFirstName">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>
    </NakedCard>
    <NakedCard class="fr-p-md-5w fr-mb-2w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h1 class="fr-h6">
            {{ t('coupleinformation.partner-email-title') }}
          </h1>
          <v-gouv-fr-modal class="fr-link fr-link--sm">
            <template #button>
              {{ t('coupleinformation.more-information') }}
            </template>
            <template #title>
              {{ t('coupleinformation.more-information') }}
            </template>
            <template #content>
              <CoupleInformationHelp></CoupleInformationHelp>
            </template>
          </v-gouv-fr-modal>
        </div>
        <div class="fr-col-12 fr-mt-3w fr-mb-3w">
          <FieldLabel for-input="email">
            {{ t('coupleinformation.spouseEmail') }}
          </FieldLabel>
          <Field
            id="email"
            v-slot="{ field, meta }"
            v-model="coTenant.email"
            name="email"
            :rules="{
              email: true,
              custom: user.email
            }"
          >
            <input
              v-bind="field"
              class="validate-required form-control fr-input"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              name="email"
              placeholder="Ex : exemple@exemple.fr"
              type="email"
              :disabled="disableEmailField"
              @input="handleInput"
            />
          </Field>
          <ErrorMessage v-slot="{ message }" name="email">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>
    </NakedCard>
    <div v-if="showCheckBox" ref="checkboxauthorize" class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w fr-mt-3w">
        <div class="bg-purple fr-checkbox-group">
          <Field
            v-slot="{ field, meta }"
            v-model="authorize"
            name="authorize"
            type="checkbox"
            rules="isTrue"
            :value="true"
          >
            <input
              id="authorize"
              type="checkbox"
              v-bind="field"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              @change="updateAuthorize"
            />
            <label for="authorize" v-html="t('coupleinformation.acceptAuthor')"> </label>
          </Field>
          <ErrorMessage v-slot="{ message }" name="authorize">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import VGouvFrModal from 'df-shared-next/src/GouvFr/VGouvFrModal.vue'
import CoupleInformationHelp from './helps/CoupleInformationHelp.vue'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'
import { computed, onMounted, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Field, ErrorMessage, defineRule } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

defineRule('custom', (v1: string, [v2]: string[]) => {
  if (v1 === v2) {
    return 'same-email-not-valid'
  }
  return true
})

const emit = defineEmits<{ 'update:modelValue': [coTenants: CoTenant[]] }>()

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)

const coTenant = ref<CoTenant>(new User())
const authorize = ref(false)
const showCheckBox = ref(false)
const disableNameFields = ref(false)
const disableEmailField = ref(false)
const checkboxauthorize = ref()

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

function scrollToEnd() {
  if (!checkboxauthorize.value) {
    return
  }
  checkboxauthorize.value.scrollIntoView({ behavior: 'smooth' })
}

function handleInput() {
  emit('update:modelValue', [coTenant.value])
  if (coTenant.value.email?.length > 0) {
    showCheckBox.value = true
    scrollToEnd()
  } else {
    showCheckBox.value = false
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
