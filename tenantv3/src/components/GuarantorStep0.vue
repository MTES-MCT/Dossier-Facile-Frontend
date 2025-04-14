<template>
  <GuarantorName
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></GuarantorName>
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
import GuarantorName from './documents/naturalGuarantor/GuarantorName.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const guarantor = computed(() => store.selectedGuarantor)
</script>
