<template>
  <ProfileContainer :step="getStep()">
    <TenantGuarantorDocuments
      :tenant-id="tenantId()"
      :guarantor-id="guarantorId()"
      :substep="getSubStep()"
      @on-next="goNext"
    ></TenantGuarantorDocuments>
  </ProfileContainer>
</template>

<script setup lang="ts">
import TenantGuarantorDocuments from '../components/TenantGuarantorDocuments.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { User } from 'df-shared-next/src/models/User'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useTenantStore()
const coTenants = computed(() => store.coTenants)

onBeforeMount(() => {
  const coTenant = coTenants.value.find((r: User) => {
    return r.id === tenantId()
  })
  const guarantor = coTenant?.guarantors?.find((g: Guarantor) => {
    return g.id === guarantorId()
  })
  store.setSelectedGuarantor(guarantor)
})

function getSubStep() {
  return Number(route.params.substep) || 0
}
function getStep() {
  return Number(route.params.step) || 0
}
function tenantId() {
  return Number(route.params.tenantId) || 0
}
function guarantorId() {
  return Number(route.params.guarantorId)
}
function goNext() {
  router.push({
    name: 'TenantGuarantors',
    params: {
      tenantId: tenantId().toString(),
      step: getStep().toString()
    }
  })
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
