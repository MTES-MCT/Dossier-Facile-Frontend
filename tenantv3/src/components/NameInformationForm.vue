<template>
  <div class="fr-mb-15w">
    <NakedCard class="fr-p-5w fr-mt-3w">
      <h1 class="fr-h4">{{ t('nameinformationform.title') }}</h1>
      <div>
        <NameInformationHelp @updateInformation="openUnlinkModal = true" />
        <RequiredFieldsInstruction />
        <ConfirmModal
          class="fr-px-md-16w"
          v-if="openUnlinkModal"
          :validateBtnText="t('nameinformationform.unlink-account-btn')"
          @valid="unlinkFranceConnect()"
          @cancel="openUnlinkModal = false"
        >
          <template v-slot:title>
            <span class="fr-fi-refresh-line"></span>
            <span> {{ t('nameinformationform.unlink-fc-link') }}</span>
          </template>
          <p>
            {{ t('nameinformationform.unlink-fc-content') }}
            <span v-if="user?.passwordEnabled">
              {{ t('nameinformationform.unlink-fc-content-password-exists') }}</span
            >
            <span v-else>{{ t('nameinformationform.unlink-fc-content-password-undefined') }}</span>
          </p>
        </ConfirmModal>
      </div>

      <Form class="fr-mt-3w" name="nameInformationForm" @submit="handleNameInformation">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <TextField
              name="lastname"
              :fieldLabel="t('nameinformationform.lastname')"
              validation-rules="onlyAlpha"
              v-model.trim="lastname"
              :required="true"
              :disabled="user?.franceConnect"
            />
            <button
              class="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line fr-mt-1w"
              v-if="!displayPreferredNameField"
              @click="displayPreferredNameField = true"
              type="button"
              title="{{ t('nameinformationform.add-preferredname') }}"
            >
              {{ t('nameinformationform.add-preferredname') }}
            </button>
          </div>
          <div class="fr-col-12 fr-mb-3w" v-if="displayPreferredNameField">
            <TextField
              name="preferredname"
              :fieldLabel="t('nameinformationform.preferredname')"
              validation-rules="onlyAlpha"
              v-model.trim="preferredname"
            >
              <template v-slot:right>
                <button
                  class="fr-btn fr-btn--tertiary fr-icon-close-line"
                  :title="t('nameinformationform.delete-preferredname')"
                  @click="deletePreferredName()"
                >
                  {{ t('nameinformationform.delete-preferredname') }}
                </button>
              </template>
            </TextField>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <TextField
              name="firstname"
              :fieldLabel="t('nameinformationform.firstname')"
              validation-rules="onlyAlpha"
              v-model.trim="firstname"
              :required="true"
              :disabled="user?.franceConnect"
            />
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <TextField
              name="zipcode"
              :fieldLabel="t('nameinformationform.zipcode')"
              validation-rules="zipcode"
              v-model="zipcode"
            />
          </div>
        </div>
        <ProfileFooter :showBack="false"></ProfileFooter>
      </Form>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import RequiredFieldsInstruction from 'df-shared-next/src/components/form/RequiredFieldsInstruction.vue'
import NameInformationHelp from './helps/NameInformationHelp.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import ProfileFooter from './footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { UtilsService } from '@/services/UtilsService'
import TextField from 'df-shared-next/src/components/form/TextField.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.userToEdit)

const router = useRouter()

const openUnlinkModal = ref(false)
const displayPreferredNameField = ref(false)

const firstname = ref('')
const lastname = ref('')
const preferredname = ref('')
const zipcode = ref('')
const $loading = useLoading({})

onBeforeMount(() => {
  firstname.value = user.value?.firstName || ''
  lastname.value = user.value?.lastName || ''
  preferredname.value = UtilsService.capitalize(user.value?.preferredName || '')
  zipcode.value = user.value?.zipCode || ''
  displayPreferredNameField.value = preferredname.value !== ''
})

function deletePreferredName() {
  preferredname.value = ''
  displayPreferredNameField.value = false
}

function unlinkFranceConnect() {
  openUnlinkModal.value = false
  const loader = $loading.show()
  if (!user.value) {
    return
  }
  store
    .unlinkFranceConnect(user.value)
    .then(
      () => {
        // if user has not password redirect to resetpassword
        if (!user.value?.passwordEnabled) {
          window.location.href = import.meta.env.VITE_RESET_PASSWORD_URL
        }
      },
      (error) => {
        console.dir(error)
      }
    )
    .finally(() => {
      loader.hide()
    })
}
function handleNameInformation() {
  if (!user.value) {
    return
  }
  if (
    user.value.firstName === firstname.value &&
    user.value.lastName === lastname.value &&
    user.value.preferredName === preferredname.value &&
    user.value.zipCode === zipcode.value
  ) {
    router.push({ name: 'TenantType' })
    return
  }
  const loader = $loading.show()
  store.updateUserFirstname(firstname.value)
  store.updateUserLastname(lastname.value)
  store.updateUserPreferredname(preferredname.value)
  store.updateUserZipcode(zipcode.value)

  store
    .setNames(user.value)
    .then(
      () => {
        AnalyticsService.confirmName()
        router.push({ name: 'TenantType' })
      },
      (error) => {
        console.dir(error)
      }
    )
    .finally(() => {
      loader.hide()
    })
}
</script>

<style scoped lang="scss">
.warning-box {
  .title {
    display: flex;
  }

  .link {
    text-align: right;
  }
}
</style>
