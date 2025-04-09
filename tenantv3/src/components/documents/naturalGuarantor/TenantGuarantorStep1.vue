<template>
  <GuarantorIdentification
    v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'"
    is-cotenant
    :tenant-id="tenantId"
    @on-back="$emit('on-back')"
    @on-next="$emit('on-next')"
  ></GuarantorIdentification>
  <RepresentativeIdentification
    v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'"
    :tenant-id="tenantId"
    :guarantor="guarantor"
    @on-back="$emit('on-back')"
    @on-next="goToGuarantorsList"
  ></RepresentativeIdentification>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GuarantorIdentification from './GuarantorIdentification.vue'
import RepresentativeIdentification from '../legalPersonGuarantor/RepresentativeIdentification.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const guarantor = computed(() => store.selectedGuarantor)
const tenantId = computed(() => Number(route.params.tenantId) || 0)

function goToGuarantorsList() {
  router.push({
    name: 'TenantGuarantors',
    params: {
      tenantId: tenantId.value,
      step: 5
    }
  })
}
</script>
