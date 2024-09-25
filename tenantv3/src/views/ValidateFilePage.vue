<template>
  <ProfileContainer :step="getStep()">
    <ValidateFile @on-back="goBack"></ValidateFile>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ValidateFile from '../components/ValidateFile.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useTenantStore()
const user = computed(() => store.user)
const coTenants = computed(() => store.coTenants)

const route = useRoute()
const router = useRouter()

onMounted(() => {
  window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67')
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})

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
