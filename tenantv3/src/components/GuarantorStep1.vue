<template>
  <GuarantorIdentification
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></GuarantorIdentification>
  <RepresentativeIdentification
    v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'"
    @on-back="$emit('on-back')"
    @on-next="router.push({ name: 'GuarantorList' })"
  ></RepresentativeIdentification>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import GuarantorIdentification from './documents/naturalGuarantor/GuarantorIdentification.vue'
import RepresentativeIdentification from './documents/legalPersonGuarantor/RepresentativeIdentification.vue'
import { useRouter } from 'vue-router'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const router = useRouter()
const guarantor = computed(() => store.selectedGuarantor)
</script>
