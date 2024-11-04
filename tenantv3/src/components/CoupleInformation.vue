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
            name="coTenantLastName"
            v-model="coTenant.lastName"
            v-slot="{ field, meta }"
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
              @input="handleInput"
              :disabled="disableNameFields"
            />
          </Field>
          <ErrorMessage name="coTenantLastName" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <FieldLabel :required="true">
            {{ t('coupleinformation.spouseFirstName') }}
          </FieldLabel>
          <Field
            id="coTenantFirstName"
            name="coTenantFirstName"
            v-model="coTenant.firstName"
            v-slot="{ field, meta }"
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
              @input="handleInput"
              :disabled="disableNameFields"
            />
          </Field>
          <ErrorMessage name="coTenantFirstName" v-slot="{ message }">
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
          <v-gouv-fr-modal>
            <template v-slot:button>
              <span class="small-font">{{ t('coupleinformation.more-information') }}</span>
            </template>
            <template v-slot:title>
              {{ t('coupleinformation.more-information') }}
            </template>
            <template v-slot:content>
              <p>
                <CoupleInformationHelp></CoupleInformationHelp>
              </p>
            </template>
          </v-gouv-fr-modal>
        </div>
        <div class="fr-col-12 fr-mt-3w fr-mb-3w">
          <FieldLabel for-input="email">
            {{ t('coupleinformation.spouseEmail') }}
          </FieldLabel>
          <Field
            id="email"
            name="email"
            v-model="coTenant.email"
            v-slot="{ field, meta }"
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
              @input="handleInput"
              :disabled="disableEmailField"
            />
          </Field>
          <ErrorMessage name="email" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>
    </NakedCard>
    <div ref="checkboxauthorize" v-if="showCheckBox" class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w fr-mt-3w">
        <div class="bg-purple fr-checkbox-group">
          <Field
            name="authorize"
            v-model="authorize"
            v-slot="{ field, meta }"
            type="checkbox"
            rules="isTrue"
            :value="true"
          >
            <input
              type="checkbox"
              id="authorize"
              v-bind="field"
              @change="updateAuthorize"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
            />
            <label for="authorize" v-html="t('coupleinformation.acceptAuthor')"> </label>
          </Field>
          <ErrorMessage name="authorize" v-slot="{ message }">
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
import VGouvFrModal from 'df-shared-next/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue'
import CoupleInformationHelp from './helps/CoupleInformationHelp.vue'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'
import { computed, onMounted, ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { Field, ErrorMessage, defineRule } from 'vee-validate'
import { useI18n } from 'vue-i18n'

defineRule('custom', (v1: string, [v2]: string[]) => {
  if (v1 === v2) {
    return 'same-email-not-valid'
  }
  return true
})

const emit = defineEmits<{ 'update:modelValue': [coTenants: User[]] }>()

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)
const spouseAuthorize = computed(() => store.spouseAuthorize)

const coTenant = ref(new User())
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
      authorize.value = spouseAuthorize.value
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
  store.updateCoupleAuthorize(authorize.value)
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
