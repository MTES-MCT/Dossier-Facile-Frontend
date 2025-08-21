<template>
  <DfButton class="mx-auto fr-mb-3w" @click="showPreview = true"
    >{{ t('see-in-file') }} <RiEyeLine class="fr-ml-1v"
  /></DfButton>
  <ModalComponent v-if="showPreview" @close="showPreview = false">
    <template #body>
      <img :src="dfLogo" alt="" />
      <div class="preview fr-p-2w">
        <h3 class="text-center">{{ t('sworn-statement') }}</h3>
        <p>{{ t('i-certify', [name]) }}</p>
        <p><slot></slot></p>
        <p>{{ t('dated') }} {{ date }}</p>
        <p>
          {{ t('signature') }} <br />
          {{ name }}
        </p>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import dfLogo from '@/assets/df-logo.svg'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RiEyeLine } from '@remixicon/vue'
import dayjs from 'dayjs'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'

const store = useTenantStore()
const { t } = useI18n()
const { category } = useTaxState()

const name = computed(() => {
  switch (category) {
    case 'tax':
      return UtilsService.tenantFullName(store.user)
    case 'guarantor-tax':
      return store.guarantor ? UtilsService.guarantorFullName(store.guarantor) : ''
    case 'couple-tax':
      const tenant = store.coTenants.at(0)
      return tenant ? UtilsService.tenantFullName(tenant) : ''
    default:
      return ''
  }
})
const date = dayjs().format('DD/MM/YYYY')

const showPreview = ref(false)
</script>

<i18n>
{
  "en": {
    "see-in-file": "See the certificate in my file",
    "sworn-statement": "Sworn statement",
    "i-certify": "I, {0}, hereby certify that:",
    "dated": "Dated",
    "signature": "Signature"
  },
  "fr": {
    "see-in-file": "Voir l’attestation dans mon dossier",
    "sworn-statement": "Attestation sur l’honneur",
    "i-certify": "Je soussigné·e {0}, atteste sur l’honneur que :",
    "dated": "Fait le",
    "signature": "Signature"
  }
}
</i18n>
