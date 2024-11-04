<template>
  <ProfileContainer :step="getStep()">
    <ValidateFile @on-back="goBack"></ValidateFile>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ValidateFile from '../components/ValidateFile.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useTenantStore()
const user = computed(() => store.user)
const coTenants = computed(() => store.coTenants)

const route = useRoute()
const router = useRouter()

function getStep() {
  return Number(route.params.step) || 4
}
function getLastCoTenantId() {
  return coTenants.value[Number(coTenants.value.length) - 1].id
}
function goBack() {
  if (getStep() == 6) {
    router.push({
      name: 'TenantGuarantors',
      params: {
        tenantId: getLastCoTenantId().toString(),
        step: (getStep() - 1).toString()
      }
    })
  } else {
    if (user.value.guarantors === undefined || user.value.guarantors.length === 0) {
      router.push({ name: 'GuarantorChoice' })
      return
    }
    router.push({
      name: 'GuarantorList'
    })
    return
  }
}
</script>
