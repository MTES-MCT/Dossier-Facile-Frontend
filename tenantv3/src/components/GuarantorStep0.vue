<template>
  <GuarantorNameForm
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    text-key="guarantor"
    show-badge
    :guarantor="guarantor"
    @on-back="$emit('on-back')"
    @on-saved="$emit('on-next')"
  />
  <CorporationIdentification
    v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></CorporationIdentification>
</template>

<script setup lang="ts">
import CorporationIdentification from './documents/legalPersonGuarantor/CorporationIdentification.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import GuarantorNameForm from './documents/naturalGuarantor/GuarantorNameForm.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const guarantor = computed(() => store.selectedGuarantor)
</script>
