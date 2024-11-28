<template>
  <div>
    <Form name="coTenantNameForm" @submit="save">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">{{ t('cotenantname.title') }}</h1>
        <div>
          {{ t('cotenantname.subtitle') }}
          <span v-if="selectedCoTenant.franceConnect">
            {{ t('cotenantname.franceconnect-account') }}
          </span>
        </div>
        <RequiredFieldsInstruction></RequiredFieldsInstruction>
        <div class="fr-grid-row fr-grid-row--center fr-mt-3w">
          <div class="fr-col-12 fr-mb-3w">
            <TextField
              name="lastname"
              :field-label="t('cotenantname.lastname')"
              validation-rules="onlyAlpha"
              v-model.trim="lastName"
              :required="true"
            />
            <button
              class="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line fr-mt-1w"
              v-if="!displayPreferredNameField"
              @click="displayPreferredNameField = true"
              type="button"
            >
              {{ t('nameinformationform.add-preferredname') }}
            </button>
          </div>
          <div class="fr-col-12 fr-mb-3w" v-if="displayPreferredNameField">
            <TextField
              name="preferredname"
              :field-label="t('cotenantname.preferredname')"
              validation-rules="onlyAlpha"
              v-model.trim="preferredName"
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
              name="firstname"
              :field-label="t('cotenantname.firstname')"
              validation-rules="onlyAlpha"
              v-model.trim="firstName"
              :required="true"
            />
          </div>
        </div>
      </NakedCard>
      <FooterContainer>
        <BackNext :show-back="true" @on-back="goBack()"> </BackNext>
      </FooterContainer>
    </Form>
  </div>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { User } from 'df-shared-next/src/models/User'
import FooterContainer from '../../footer/FooterContainer.vue'
import BackNext from '../../footer/BackNext.vue'
import RequiredFieldsInstruction from 'df-shared-next/src/components/form/RequiredFieldsInstruction.vue'
import TextField from 'df-shared-next/src/components/form/TextField.vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { onBeforeMount, ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

const props = defineProps<{
  coTenantId: number
}>()

const selectedCoTenant = ref<CoTenant>(new User())
const { t } = useI18n()
const store = useTenantStore()

const firstName = ref('')
const lastName = ref('')
const preferredName = ref('')
const displayPreferredNameField = ref(false)

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

onBeforeMount(() => {
  selectedCoTenant.value = store.getTenant(Number(props.coTenantId))
  firstName.value = selectedCoTenant.value?.firstName || ''
  lastName.value = selectedCoTenant.value?.lastName || ''
  preferredName.value = selectedCoTenant.value?.preferredName || ''
  displayPreferredNameField.value = preferredName.value !== ''
})

function deletePreferredName() {
  preferredName.value = ''
  displayPreferredNameField.value = false
}

function save() {
  if (
    firstName.value === selectedCoTenant.value?.firstName &&
    lastName.value === selectedCoTenant.value?.lastName &&
    preferredName.value === selectedCoTenant.value?.preferredName
  ) {
    emit('on-next')
    return
  }

  selectedCoTenant.value.firstName = firstName.value
  selectedCoTenant.value.lastName = lastName.value
  selectedCoTenant.value.preferredName = preferredName.value

  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .setNames(selectedCoTenant.value)
    .then(() => {
      ToastService.saveSuccess()
      emit('on-next')
    })
    .catch(() => {
      ToastService.saveFailed()
    })
    .finally(() => {
      loader.hide()
    })
}

function goBack() {
  emit('on-back')
}
</script>

<style scoped lang="scss"></style>
