<template>
  <div class="fr-mb-15w">
    <NakedCard class="fr-p-5w fr-mt-3w">
      <h1 class="fr-h4">{{ t('nameinformationform.title') }}</h1>
      <div>
        <NameInformationHelp @update-information="openUnlinkModal = true" />
        <RequiredFieldsInstruction />
        <ConfirmModal
          v-if="openUnlinkModal"
          class="fr-px-md-16w"
          :validate-btn-text="t('nameinformationform.unlink-account-btn')"
          @valid="unlinkFranceConnect()"
          @cancel="openUnlinkModal = false"
        >
          <template #title>
            <span class="fr-fi-refresh-line"></span>
            <span> {{ t('nameinformationform.unlink-fc-link') }}</span>
          </template>
          <p>
            {{ t('nameinformationform.unlink-fc-content') }}
            <span>{{ t('nameinformationform.unlink-fc-content-password-undefined') }}</span>
          </p>
        </ConfirmModal>
      </div>

      <Form class="fr-mt-3w" name="nameInformationForm" @submit="handleNameInformation">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <TextField
              v-model.trim="lastname"
              name="lastname"
              :field-label="t('nameinformationform.lastname')"
              validation-rules="onlyAlpha"
              :required="true"
              :disabled="user?.franceConnect"
            />
            <button
              v-if="!displayPreferredNameField"
              class="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line fr-mt-1w"
              type="button"
              title="{{ t('nameinformationform.add-preferredname') }}"
              @click="displayPreferredNameField = true"
            >
              {{ t('nameinformationform.add-preferredname') }}
            </button>
          </div>
          <div v-if="displayPreferredNameField" class="fr-col-12 fr-mb-3w">
            <TextField
              v-model.trim="preferredname"
              name="preferredname"
              :field-label="t('nameinformationform.preferredname')"
              validation-rules="onlyAlpha"
            >
              <template #right>
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
              v-model.trim="firstname"
              name="firstname"
              :field-label="t('nameinformationform.firstname')"
              validation-rules="onlyAlpha"
              :required="true"
              :disabled="user?.franceConnect"
            />
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <TextField
              v-model="zipcode"
              name="zipcode"
              :field-label="t('nameinformationform.zipcode')"
              validation-rules="zipcode"
            />
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-checkbox-group bg-purple fr-mb-3w">
              <input id="abroad" v-model="abroad" type="checkbox" class="fr-checkbox" />
              <label for="abroad">
                {{ t('nameinformationform.abroad-residency-checkbox') }}
              </label>
            </div>
          </div>
        </div>
        <ProfileFooter :show-back="false"></ProfileFooter>
      </Form>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import RequiredFieldsInstruction from 'df-shared-next/src/components/form/RequiredFieldsInstruction.vue'
import NameInformationHelp from './helps/NameInformationHelp.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import ProfileFooter from './footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useI18n } from 'vue-i18n'
import TextField from './form/TextField.vue'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)

const router = useRouter()

const openUnlinkModal = ref(false)
const displayPreferredNameField = ref(false)

const firstname = ref('')
const lastname = ref('')
const preferredname = ref('')
const zipcode = ref('')
const abroad = ref(false)
const $loading = useLoading({})

onBeforeMount(() => {
  firstname.value = user.value?.firstName || ''
  lastname.value = user.value?.lastName || ''
  preferredname.value = UtilsService.capitalize(user.value?.preferredName || '')
  zipcode.value = user.value?.zipCode || ''
  abroad.value = user.value?.abroad === true
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
        window.location.href = import.meta.env.VITE_RESET_PASSWORD_URL
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
    user.value.zipCode === zipcode.value &&
    user.value.abroad === abroad.value
  ) {
    router.push({ name: 'TenantType' })
    return
  }
  const loader = $loading.show()
  store.updateUserFirstname(firstname.value)
  store.updateUserLastname(lastname.value)
  store.updateUserPreferredname(preferredname.value)
  store.updateUserZipcode(zipcode.value)
  store.updateUserAbroad(abroad.value)

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
