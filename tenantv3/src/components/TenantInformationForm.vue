<template>
  <div>
    <div v-if="!isOwner()">
      <Form name="form" @submit="authorize">
        <NakedCard class="fr-p-md-5w">
          <div v-if="applicationType === 'COUPLE'" class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12">
              <Field
                v-slot="{ field, meta }"
                v-model="localSpouseAuthorize"
                name="authorize"
                type="checkbox"
                :rules="{ isTrue: true }"
                :value="true"
              >
                <div class="fr-checkbox-group bg-purple">
                  <input
                    id="authorize"
                    type="checkbox"
                    value="false"
                    v-bind="field"
                    :class="{
                      'fr-input--valid': meta.valid,
                      'fr-input--error': !meta.valid
                    }"
                  />
                  <label for="authorize" v-html="t('tenantinformationform.acceptAuthorSpouse')">
                  </label>
                  <ErrorMessage v-slot="{ message }" name="authorize">
                    <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                  </ErrorMessage>
                </div>
              </Field>
            </div>
          </div>
          <div v-if="applicationType === 'GROUP'" class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12">
              <Field
                v-slot="{ field, meta }"
                v-model="localCoTenantAuthorize"
                name="authorize"
                type="checkbox"
                :rules="{ isTrue: true }"
                :value="true"
              >
                <div class="fr-checkbox-group bg-purple">
                  <input
                    id="authorize"
                    type="checkbox"
                    value="false"
                    v-bind="field"
                    :class="{
                      'fr-input--valid': meta.valid,
                      'fr-input--error': !meta.valid
                    }"
                  />
                  <label for="authorize" v-html="t('tenantinformationform.acceptAuthorCoTenant')">
                  </label>
                  <ErrorMessage v-slot="{ message }" name="authorize">
                    <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                  </ErrorMessage>
                </div>
              </Field>
            </div>
          </div>
        </NakedCard>
        <ProfileFooter @on-back="goBack"></ProfileFooter>
      </Form>
    </div>

    <div v-if="isOwner()">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">
          {{ t('tenantinformationform.title') }}
        </h1>
        <ApplicationTypeSelector @selected="updateApplicationType"></ApplicationTypeSelector>
      </NakedCard>
      <Form name="form" @submit="handleOthersInformation">
        <CoupleInformation v-if="applicationType === 'COUPLE'" v-model="coTenants" class="fr-mt-2w">
        </CoupleInformation>
        <RoommatesInformation
          v-if="applicationType === 'GROUP'"
          v-model="coTenants"
          class="fr-mt-2w"
        >
        </RoommatesInformation>
        <ProfileFooter @on-back="goBack"></ProfileFooter>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoommatesInformation from './RoommatesInformation.vue'
import CoupleInformation from './CoupleInformation.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import ProfileFooter from './footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import ApplicationTypeSelector from '../components/ApplicationTypeSelector.vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { isAxiosError } from 'axios'

const router = useRouter()
const store = useTenantStore()
const user = computed(() => store.user)
const roommates = computed(() => store.getRoommates)
const coTenantAuthorize = computed(() => store.coTenantAuthorize)
const spouseAuthorize = computed(() => store.spouseAuthorize)

const { t } = useI18n()

const coTenants = ref<CoTenant[]>([])
const applicationType = ref('')

const localCoTenantAuthorize = ref(false)
const localSpouseAuthorize = ref(false)

onBeforeMount(() => {
  if (user.value.applicationType) {
    applicationType.value = user.value.applicationType
  }
  localCoTenantAuthorize.value = coTenantAuthorize.value
  localSpouseAuthorize.value = spouseAuthorize.value

  if (applicationType.value === 'GROUP' || applicationType.value === 'COUPLE') {
    coTenants.value = roommates.value
  }
})

function handleOthersInformation() {
  if (hasNothingToSave()) {
    router.push({ name: 'TenantIdentification' })
    return
  }

  const dispatchMethod = () => {
    const data = {
      applicationType: applicationType.value,
      coTenants: coTenants.value,
      acceptAccess: true
    }
    return store.setCoTenants(data)
  }
  const $loading = useLoading({})
  const loader = $loading.show()

  dispatchMethod().then(
    () => {
      AnalyticsService.confirmType()
      loader.hide()
      if (applicationType.value === 'COUPLE') {
        const messageKey = coTenants.value[0]?.email ? 'couple-saved-with-mail' : 'couple-saved'
        ToastService.success(`tenantinformationform.${messageKey}`)
      }
      if (applicationType.value === 'GROUP') {
        ToastService.success('tenantinformationform.roommates-saved')
      }
      router.push({ name: 'TenantIdentification' })
    },
    (error: unknown) => {
      loader.hide()
      if (isAxiosError(error) && error.response?.data.message?.includes('are already being used')) {
        ToastService.error('tenantinformationform.email-exists')
        return
      } else {
        ToastService.error('errors.submit-failed')
        return
      }
    }
  )
}

function updateApplicationType(value: string) {
  applicationType.value = value
  deleteCoTenants()
}

function hasNothingToSave() {
  if (applicationType.value === user.value.applicationType && applicationType.value === 'ALONE') {
    return true
  }
  if (applicationType.value === user.value.applicationType && applicationType.value === 'GROUP') {
    const unregisteredRoommate = coTenants.value.find((r) => r.id === undefined)
    if (unregisteredRoommate === undefined) {
      return true
    }
  }
  return false
}

function deleteCoTenants() {
  user.value.apartmentSharing?.tenants.forEach((t) => {
    if (t.tenantType !== 'CREATE') {
      store.deleteCoTenant(t)
    }
  })
  coTenants.value = []
}

function isOwner() {
  return user.value.tenantType === undefined || user.value.tenantType === 'CREATE'
}

function authorize() {
  if (applicationType.value === 'COUPLE' && !localSpouseAuthorize.value) {
    return
  }
  if (applicationType.value === 'GROUP' && !localCoTenantAuthorize.value) {
    return
  }
  router.push({ name: 'TenantIdentification' })
}

function goBack() {
  router.push({ name: 'TenantName' })
}
</script>

<style scoped lang="scss">
.warning {
  padding: 0.5rem;
}

.spa {
  justify-content: space-around;
  align-content: space-around;
  height: 100%;
  align-items: center;
}

.selected {
  .icon-container {
    background-color: var(--primary);
    color: white;
  }
}

.icon-container {
  border-radius: 0.5rem;
  height: 5rem;
  width: 6rem;
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);

  display: flex;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 991px) {
    display: none;
  }
}
</style>
