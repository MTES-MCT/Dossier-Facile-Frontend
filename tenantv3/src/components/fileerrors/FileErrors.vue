<template>
  <div>
    <FullTenantFileErrors :user="user" :keyprefix="'my'"></FullTenantFileErrors>

    <template v-if="user.applicationType === 'COUPLE'">
      <div v-for="(tenant, k) in coTenants" :key="k">
        <FullTenantFileErrors :user="tenant" :keyprefix="'tenant'"></FullTenantFileErrors>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import useTenantStore from '@/stores/tenant-store'
import { computed } from 'vue'
import FullTenantFileErrors from './FullTenantFileErrors.vue'

const store = useTenantStore()
const user = computed(() => store.user)

const coTenants = computed(() => {
  return user.value.apartmentSharing?.tenants.filter((t: User) => t.id != user.value?.id)
})
</script>
