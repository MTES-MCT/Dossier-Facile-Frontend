<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div class="fr-grid-row cotenant-container">
        <div class="fr-col-12">
          <h2 class="fr-h6">{{ t('roommatesinformation.title') }}</h2>
          <DsfrButton
            @click="isModalOpened = true"
            tertiary
            size="sm"
            type="button"
            :label="t('roommatesinformation.more-information')"
          />
          <DsfrModalPatched
            v-model:is-opened="isModalOpened"
            :title="t('roommatesinformation.more-information')"
            icon="ri:arrow-right-line"
            :is-alert="isAlert"
          >
            <template #default>
              <RoommatesInformationHelp />
            </template>
          </DsfrModalPatched>
        </div>
        <div v-if="coTenants.length > 0" class="fr-col-12 fr-mt-2w">
          <div v-for="(roommate, key) in coTenants" :key="key" class="fr-mb-1w">
            <NakedCard>
              <div class="fr-grid-row bg--white">
                <div class="fr-col-10">
                  <div class="fr-grid-row nowrap">
                    <div class="center-icon fr-mr-1w">
                      <RiUserFill
                        class="color--white round-icon icon"
                        size="32px"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="fr-grid-col overflow--hidden max-content">
                      <div :title="roommate.email" class="overflow--hidden">
                        <b>
                          {{ roommate.email }}
                        </b>
                      </div>
                      <div class="small-text">
                        {{
                          t(
                            roommate.id
                              ? 'roommatesinformation.invite-sent'
                              : 'roommatesinformation.invite-waiting'
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="fr-col-2 center-icon">
                  <DsfrButton
                    :label="t('roommatesinformation.delete')"
                    icon="ri:delete-bin-2-fill"
                    icon-only
                    secondary
                    @click="remove(roommate)"
                  />
                </div>
              </div>
            </NakedCard>
          </div>
        </div>
        <div class="fr-col-12">
          <FieldLabel
            for-input="email"
            :required="coTenants.length ? undefined : true"
            class="fr-mb-1w"
          >
            {{ t('roommatesinformation.roommateEmail') }}
          </FieldLabel>
          <Field
            v-slot="{ field, meta }"
            v-model="newRoommate"
            name="email"
            :rules="{
              email: true,
              atLeastOneEmail: coTenants
            }"
          >
            <input
              id="email"
              v-bind="field"
              :aria-describedby="
                (hasSubmited || hasAddedEmail) && (!meta.valid || !emailIsValid)
                  ? 'email-errors'
                  : undefined
              "
              :aria-invalid="(hasSubmited || hasAddedEmail) && (!meta.valid || !emailIsValid)"
              class="form-control fr-input"
              name="email"
              :required="coTenants.length ? false : true"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              placeholder="nom@exemple.fr"
              type="email"
              @keydown.prevent.enter="validateRoommateEmail"
            />
          </Field>
          <div class="email-errors">
            <ErrorMessage v-if="hasSubmited || hasAddedEmail" v-slot="{ message }" name="email">
              <p class="fr-error-text">{{ t(message || '') }}</p>
            </ErrorMessage>
            <p class="fr-error-text" v-if="showEmailEmpty">
              {{ t('field-required') }}
            </p>
            <p class="fr-error-text" v-if="showRoomMateAlreadyExists">
              {{ t('roommatesinformation.co-tenant-already-exists') }}
            </p>
            <p class="fr-error-text" v-if="showEmailExists">
              {{ t('roommatesinformation.email-exists-2') }}
            </p>
          </div>
        </div>
        <DsfrButton
          secondary
          :label="t('roommatesinformation.add-a-roommate')"
          @click="validateRoommateEmail"
        />
      </div>
      <div class="fr-mt-3w fr-checkbox-group bg-purple">
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
            type="checkbox"
            v-bind="field"
            :aria-describedby="hasSubmited ? 'auth-errors' : undefined"
            :aria-invalid="hasSubmited && !meta.valid"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            @blur="updateAuthorize()"
          />
          <label for="authorize">
            <p class="fr-mb-0">{{ t('roommatesinformation.acceptAuthor') }}</p>
            <p>
              {{ t('roommatesinformation.acceptAuthor-2') }}<span class="color--required">*</span>
            </p>
          </label>
        </Field>
        <ErrorMessage v-if="hasSubmited" v-slot="{ message }" name="authorize">
          <span id="auth-errors" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </div>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import RoommatesInformationHelp from './helps/RoommatesInformationHelp.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import { Field, ErrorMessage, defineRule, useValidateField } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { RiUserFill } from '@remixicon/vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import DsfrModalPatched from './patches/DsfrModal.vue'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'

interface Props {
  hasSubmited: boolean
}

defineProps<Props>()

defineRule('atLeastOneEmail', (email: string, [otherEmails]: string[]) => {
  if (email === '' && otherEmails === undefined) {
    return 'field-required'
  }
  return true
})

const coTenants = defineModel<CoTenant[]>({
  default: () => []
})

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)
const coTenantAuthorize = computed(() => store.coTenantAuthorize)

const authorize = ref(false)
const newRoommate = ref('')
// form errors
const showEmailExists = ref(false)
const showEmailEmpty = ref(false)
const showRoomMateAlreadyExists = ref(false)
const showWrongFormatError = ref(false)

const emailIsValid = ref(false)

// modal logic
const isModalOpened = ref(false)
const isAlert = ref(false)

const hasAddedEmail = ref(false)

onMounted(() => {
  authorize.value = coTenantAuthorize.value
})

const validateEmailField = useValidateField('email')

const validateRoommateEmail = async () => {
  // initialize errors
  showEmailEmpty.value = false
  showEmailExists.value = false
  showWrongFormatError.value = false
  showRoomMateAlreadyExists.value = false
  emailIsValid.value = false
  hasAddedEmail.value = true

  const { valid } = await validateEmailField()

  if (valid) addMail()
}

async function addMail() {
  if (!newRoommate.value.length) {
    showEmailEmpty.value = true
    return
  }

  if (isEmailAlreadyExists(newRoommate.value)) {
    showRoomMateAlreadyExists.value = true
    emailIsValid.value = false
    return
  }
  if (user.value.email !== newRoommate.value) {
    emailIsValid.value = true
    const coTenant = new User()
    coTenant.email = newRoommate.value
    store.createCoTenant(newRoommate.value)
    coTenants.value = [...coTenants.value, coTenant]
    newRoommate.value = ''
    hasAddedEmail.value = false
  } else {
    showEmailExists.value = true
    emailIsValid.value = false
  }
}

function isEmailAlreadyExists(email: string): boolean {
  return coTenants.value.some((tenant) => tenant.email === email)
}

function remove(tenant: CoTenant) {
  if (tenant.id) {
    store.deleteCoTenant(tenant)
    coTenants.value = coTenants.value.filter((t) => t.email !== tenant.email)
  } else {
    coTenants.value = coTenants.value.filter((t) => t.email !== tenant.email)
  }
  return false
}

function updateAuthorize() {
  store.updateCoTenantAuthorize(authorize.value)
}
</script>

<style scoped lang="scss">
.cotenant-container {
  gap: 1rem;
}

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

.icon {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
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

.card {
  @media all and (min-width: 992px) {
    padding: 1.5rem;
  }
}

.nowrap {
  flex-wrap: nowrap;
  overflow: auto;
}

.bg-bf200 {
  background-color: var(--blue-france-200);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.align-bottom {
  align-self: flex-end;

  @media all and (max-width: 1247px) {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
}

.max-content {
  max-width: max-content;

  @media all and (max-width: 420px) {
    max-width: 200px;
  }
}
</style>
