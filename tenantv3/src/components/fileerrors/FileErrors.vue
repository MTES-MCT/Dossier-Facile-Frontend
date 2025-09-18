<template>
  <FullTenantFileErrors :user="user" keyprefix="my"></FullTenantFileErrors>

  <template v-if="user.applicationType === 'COUPLE'">
    <FullTenantFileErrors
      v-for="(tenant, k) in coTenants"
      :key="k"
      :user="tenant"
      keyprefix="tenant"
    ></FullTenantFileErrors>
  </template>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import FullTenantFileErrors from './FullTenantFileErrors.vue'

const store = useTenantStore()
const user = computed(() => store.user)

const coTenants = computed(() => {
  return user.value.apartmentSharing?.tenants.filter((t) => t.id != user.value?.id)
})
</script>
