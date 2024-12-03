<template>
  <TenantErrors :user="user" :keyprefix="keyprefix"></TenantErrors>

  <div class="fr-mt-3w" v-for="g in user.guarantors" :key="g.id">
    <GuarantorErrors :user="user" :g="g" :keyprefix="keyprefix"></GuarantorErrors>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import TenantErrors from './TenantErrors.vue'
import GuarantorErrors from './GuarantorErrors.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

defineProps<{
  user: User | CoTenant
  keyprefix: string
}>()
</script>
