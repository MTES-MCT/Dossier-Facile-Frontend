<template>
  <GuarantorIdentification
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></GuarantorIdentification>
  <RepresentativeIdentification
    v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></RepresentativeIdentification>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import GuarantorIdentification from './documents/naturalGuarantor/GuarantorIdentification.vue'
import RepresentativeIdentification from './documents/legalPersonGuarantor/RepresentativeIdentification.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const guarantor = computed(() => store.selectedGuarantor)
</script>
