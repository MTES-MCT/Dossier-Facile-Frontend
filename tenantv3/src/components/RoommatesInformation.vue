<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h6>{{ t('roommatesinformation.title') }}</h6>
          <v-gouv-fr-modal class="fr-link fr-link--sm">
            <template #button>
              {{ t('roommatesinformation.more-information') }}
            </template>
            <template #title>
              {{ t('roommatesinformation.more-information') }}
            </template>
            <template #content>
              <RoommatesInformationHelp></RoommatesInformationHelp>
            </template>
          </v-gouv-fr-modal>
        </div>
        <div class="fr-col-12 fr-mt-2w">
          <div v-if="showEmailExists" class="fr-callout">
            <p class="fr-mb-1w" v-html="t('roommatesinformation.email-exists')"></p>
          </div>
          <div v-if="modelValue.length > 0">
            <div v-for="(roommate, key) in modelValue" :key="key" class="fr-mb-1w">
              <NakedCard>
                <div class="fr-grid-row bg--white">
                  <div class="fr-col-10">
                    <div class="fr-grid-row nowrap">
                      <div class="center-icon fr-mr-1w">
                        <RiUserFill class="color--white round-icon icon" size="32px" />
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
                    <button
                      class="fr-btn fr-btn--secondary icon-btn"
                      :title="t('roommatesinformation.delete')"
                      @click="remove(roommate)"
                      type="button"
                    >
                      <RiDeleteBin2Fill class="color--primary icon" size="32px" />
                    </button>
                  </div>
                </div>
              </NakedCard>
            </div>
          </div>
        </div>
        <div class="fr-col-12 fr-col-xl-7 fr-mt-2w">
          <label class="fr-label fr-mb-1w">{{ t('roommatesinformation.roommateEmail') }}</label>
          <Field
            id="email"
            name="email"
            v-model="newRoommate"
            v-slot="{ field, meta }"
            :rules="{
              email: true,
              atLeastOneEmail: modelValue
            }"
          >
            <input
              v-bind="field"
              class="form-control fr-input"
              name="email"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              placeholder="Ex : exemple@exemple.fr"
              type="email"
            />
          </Field>
          <ErrorMessage name="email" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>

        <div class="fr-col-12 fr-col-xl-5 btn-container">
          <div class="fr-grid-row fr-grid-row--right">
            <v-gouv-fr-button
              class="full-width-xs"
              :full-width="isMobile()"
              :secondary="true"
              :label="t('roommatesinformation.add-a-roommate')"
              :btn-type="'button'"
              :disabled="invalidEmail != null || !newRoommate || false"
              @click="addMail"
            ></v-gouv-fr-button>
          </div>
        </div>
      </div>
    </NakedCard>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w fr-mt-3w bg-bf200">
        <div class="fr-checkbox-group bg-purple">
          <Field
            name="authorize"
            v-model="authorize"
            v-slot="{ field, meta }"
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
              @change="updateAuthorize()"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
            />
            <label for="authorize" v-html="t('roommatesinformation.acceptAuthor')"> </label>
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
import VGouvFrButton from 'df-shared-next/src/Button/VGouvFrButton.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import RoommatesInformationHelp from './helps/RoommatesInformationHelp.vue'
import VGouvFrModal from 'df-shared-next/src/GouvFr/VGouvFrModal.vue'
import { UtilsService } from '../services/UtilsService'
import useTenantStore from '@/stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import { Field, ErrorMessage, useFieldError, defineRule } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { RiDeleteBin2Fill, RiUserFill } from '@remixicon/vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

defineRule('atLeastOneEmail', (email: unknown, [otherEmails]: unknown[]) => {
  if (email === '' && otherEmails === undefined) {
    return 'field-required'
  }
  return true
})

const emit = defineEmits<{ 'update:modelValue': [CoTenant[]] }>()

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)
const coTenantAuthorize = computed(() => store.coTenantAuthorize)

const props = withDefaults(defineProps<{ modelValue: CoTenant[] }>(), {
  modelValue: () => []
})

const authorize = ref(false)
const newRoommate = ref('')
const showEmailExists = ref(false)

const invalidEmail = useFieldError('email')

onMounted(() => {
  authorize.value = coTenantAuthorize.value
})

function addMail() {
  showEmailExists.value = false
  if (newRoommate.value !== '') {
    if (user.value.email !== newRoommate.value) {
      const coTenant = new User()
      coTenant.firstName = newRoommate.value.replace(/[^a-zA-Z]/g, '')
      coTenant.lastName = newRoommate.value.replace(/[^a-zA-Z]/g, '')
      coTenant.email = newRoommate.value
      store.createCoTenant(newRoommate.value)
      const newCoTenants = [...props.modelValue, coTenant]
      emit('update:modelValue', newCoTenants)
      newRoommate.value = ''
    } else {
      showEmailExists.value = true
    }
  }
}

function remove(tenant: CoTenant) {
  if (tenant.id) {
    store.deleteCoTenant(tenant)
    emit(
      'update:modelValue',
      props.modelValue.filter((t) => t.email != tenant.email)
    )
  } else {
    emit(
      'update:modelValue',
      props.modelValue.filter((t) => t.email != tenant.email)
    )
  }
  return false
}

function updateAuthorize() {
  store.updateCoTenantAuthorize(authorize.value)
}

function isMobile() {
  return UtilsService.isMobile()
}
</script>

<style scoped lang="scss">
@import 'df-shared-next/src/scss/_variables.scss';

.overflow--hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fr-btn {
  box-shadow: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
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

.btn-container {
  @media all and (min-width: 1248px) {
    margin-top: 3rem;
  }
}
</style>
