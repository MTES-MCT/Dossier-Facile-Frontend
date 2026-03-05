<template>
  <DsfrButton
    icon="ri:eye-line"
    :icon-right="true"
    :label="t('see-in-file')"
    secondary
    class="fr-mb-3w"
    @click="isModalOpened = true"
  />
  <DsfrModalPatch v-model:is-opened="isModalOpened" :title="t('sworn-statement')" size="lg">
    <img :src="dfLogo" width="180" height="30" loading="lazy" alt="" />
    <p class="fr-mt-1w">{{ t('i-certify', [name]) }}</p>
    <p><slot></slot></p>
    <p>{{ t('dated') }} {{ date }}</p>
    <p>
      {{ t('signature') }} <br />
      {{ name }}
    </p>
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import dfLogo from '@/assets/df-logo.svg'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DsfrButton } from '@gouvminint/vue-dsfr'

const store = useTenantStore()
const { t } = useI18n()
const { category } = useTaxState()

const name = computed(() => {
  switch (category) {
    case 'tax':
      return UtilsService.tenantFullName(store.user)
    case 'guarantor-tax':
    case 'couple-guarantor-tax':
      return store.guarantor ? UtilsService.guarantorFullName(store.guarantor) : ''
    case 'couple-tax':
      const tenant = store.coTenants.at(0)
      return tenant ? UtilsService.tenantFullName(tenant) : ''
    default:
      return ''
  }
})
const date = dayjs().format('DD/MM/YYYY')

const isModalOpened = ref(false)
</script>

<i18n lang="json">
{
  "en": {
    "see-in-file": "See the certificate in my file",
    "sworn-statement": "Sworn statement",
    "i-certify": "I, {0}, hereby certify that:",
    "dated": "Dated",
    "signature": "Signature:"
  },
  "fr": {
    "see-in-file": "Voir l’attestation dans mon dossier",
    "sworn-statement": "Attestation sur l’honneur",
    "i-certify": "Je soussigné·e {0}, atteste sur l’honneur que :",
    "dated": "Fait le",
    "signature": "Signature :"
  }
}
</i18n>
