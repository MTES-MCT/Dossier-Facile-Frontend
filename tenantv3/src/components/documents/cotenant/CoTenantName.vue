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
      <RequiredFieldsInstruction />
      <div class="fr-grid-row fr-grid-row--center fr-mt-3w">
        <div class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="lastName"
            name="lastname"
            :field-label="t('cotenantname.lastname')"
            validation-rules="required|onlyAlpha"
          />
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="preferredName"
            name="preferredname"
            :field-label="t('cotenantname.preferredname')"
            validation-rules="onlyAlpha"
          />
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <TextField
            v-model.trim="firstName"
            name="firstname"
            :field-label="t('cotenantname.firstname')"
            validation-rules="required|onlyAlpha"
          />
        </div>
      </div>
    </NakedCard>
    <FooterContainer>
      <BackNext show-back @on-back="goToGuarantorChoice" />
    </FooterContainer>
  </Form>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { User } from 'df-shared-next/src/models/User'
import FooterContainer from '../../footer/FooterContainer.vue'
import BackNext from '../../footer/BackNext.vue'
import RequiredFieldsInstruction from 'df-shared-next/src/components/form/RequiredFieldsInstruction.vue'
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
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'

const selectedCoTenant = ref<CoTenant>(new User())
const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const preferredName = ref('')
const tenantId = computed(() => Number(route.params.tenantId))

onBeforeMount(() => {
  selectedCoTenant.value = store.getTenant(tenantId.value)
  firstName.value = selectedCoTenant.value?.firstName || ''
  lastName.value = selectedCoTenant.value?.lastName || ''
  preferredName.value = selectedCoTenant.value?.preferredName || ''
})

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
      toast.keep.success(t('save-success'), getNextBtnInFooter)
      goToIdentification()
    })
    .catch(() => {
      toast.error(t('errors.submit-failed'), getNextBtnInFooter())
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
