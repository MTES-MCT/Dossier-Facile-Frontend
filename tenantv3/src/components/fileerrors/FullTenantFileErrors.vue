<template>
  <TenantErrors :user="user" :keyprefix="keyprefix" />

  <template v-for="g in user.guarantors" :key="g.id">
    <GuarantorErrors :user="user" :g="g" :keyprefix="keyprefix" />
  </template>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import TenantErrors from './TenantErrors.vue'
import GuarantorErrors from './GuarantorErrors.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

defineProps<{
  user: User | CoTenant
  keyprefix: 'my' | 'tenant'
}>()
</script>

<style>
.invalid-doc-list > li:where(:only-of-type, :last-of-type) {
  padding-block: 0;
}
</style>
