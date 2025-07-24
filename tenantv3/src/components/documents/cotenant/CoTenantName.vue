<template>
  <Form name="coTenantNameForm" @submit="save">
    <NakedCard class="fr-p-md-5w fr-m-3v">
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
            v-model.trim="lastName"
            name="lastname"
            :field-label="t('cotenantname.lastname')"
            validation-rules="onlyAlpha"
            :required="true"
          />
          <button
            v-if="!displayPreferredNameField"
            class="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line fr-mt-1w"
            type="button"
            @click="displayPreferredNameField = true"
          >
            {{ t('nameinformationform.add-preferredname') }}
          </button>
        </div>
        <div v-if="displayPreferredNameField" class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="preferredName"
            name="preferredname"
            :field-label="t('cotenantname.preferredname')"
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
            v-model.trim="firstName"
            name="firstname"
            :field-label="t('cotenantname.firstname')"
            validation-rules="onlyAlpha"
            :required="true"
          />
        </div>
      </div>
    </NakedCard>
    <FooterContainer>
      <BackNext show-back @on-back="goToGuarantorChoice"></BackNext>
    </FooterContainer>
  </Form>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { User } from 'df-shared-next/src/models/User'
import FooterContainer from '../../footer/FooterContainer.vue'
import BackNext from '../../footer/BackNext.vue'
import RequiredFieldsInstruction from 'df-shared-next/src/components/form/RequiredFieldsInstruction.vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { computed, onBeforeMount, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { useRoute, useRouter } from 'vue-router'
import TextField from '@/components/form/TextField.vue'
import { makeIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { DocumentService } from '@/services/DocumentService'
import { UtilsService } from '@/services/UtilsService'

const selectedCoTenant = ref<CoTenant>(new User())
const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const preferredName = ref('')
const displayPreferredNameField = ref(false)
const tenantId = computed(() => Number(route.params.tenantId))

onBeforeMount(() => {
  selectedCoTenant.value = store.getTenant(tenantId.value)
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
    goToIdentification()
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
      goToIdentification()
    })
    .catch(() => {
      ToastService.error('errors.submit-failed')
    })
    .finally(() => {
      loader.hide()
    })
}

function goToGuarantorChoice() {
  router.push({ name: 'GuarantorChoice' })
}

function goToIdentification() {
  const doc = DocumentService.getCoTenantDocument(tenantId.value, 'IDENTIFICATION')
  const step = UtilsService.getParam(route.params.step)
  const link = makeIdentityDocumentLink(doc, `/documents-colocataire/${tenantId.value}/${step}/1`)
  router.push(link)
}
</script>

<style scoped lang="scss"></style>
