<template>
  <TenantGuarantorName
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    :tenant-id="tenantId"
    :guarantor="guarantor"
    @on-back="$emit('on-back')"
  ></TenantGuarantorName>
  <CorporationIdentification
    v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'"
    :tenant-id="tenantId"
    :guarantor="guarantor"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></CorporationIdentification>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import TenantGuarantorName from './TenantGuarantorName.vue'
import { useRoute } from 'vue-router'
import CorporationIdentification from '../legalPersonGuarantor/CorporationIdentification.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const route = useRoute()

const guarantor = computed(() => store.selectedGuarantor)
const tenantId = computed(() => Number(route.params.tenantId) || 0)
</script>
