<template>
  <GuarantorNameForm
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    text-key="couple-guarantor"
    :tenant-id="tenantId"
    :guarantor="guarantor"
    @on-back="$emit('on-back')"
    @on-saved="onSpouseGuarantorSaved"
  />
  <CorporationIdentification
    v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'"
    :tenant-id="tenantId"
    :guarantor="guarantor"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import GuarantorNameForm from './GuarantorNameForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { makeSpouseGuarantorIdDocLink } from '@/components/identityDocument/lib/identityDocumentLink'
import CorporationIdentification from '../legalPersonGuarantor/CorporationIdentification.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const guarantor = computed(() => store.selectedGuarantor)
const tenantId = computed(() => Number(route.params.tenantId) || 0)

function onSpouseGuarantorSaved() {
  if (guarantor.value) {
    router.push(makeSpouseGuarantorIdDocLink(guarantor.value, tenantId.value))
  }
}
</script>
