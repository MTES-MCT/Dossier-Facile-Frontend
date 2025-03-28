<template>
  <ProfileContainer :step="getStep()">
    <div v-if="getSubStep() === 0">
      <CoTenantName />
    </div>
    <div v-if="getSubStep() === 1">
      <CoTenantIdentification></CoTenantIdentification>
    </div>
    <CoupleResidency v-if="getSubStep() === 2"></CoupleResidency>
    <div v-if="getSubStep() === 3">
      <CoTenantProfessional></CoTenantProfessional>
    </div>
    <div v-if="getSubStep() === 4">
      <CoTenantFinancialList></CoTenantFinancialList>
    </div>
    <div v-if="getSubStep() === 5">
      <CoTenantTax></CoTenantTax>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from '../components/ProfileContainer.vue'
import CoTenantIdentification from '../components/documents/cotenant/CoTenantIdentification.vue'
import CoTenantName from '../components/documents/cotenant/CoTenantName.vue'
import CoTenantProfessional from '../components/documents/cotenant/CoTenantProfessional.vue'
import CoTenantFinancialList from '../components/documents/cotenant/CoTenantFinancialList.vue'
import CoTenantTax from '../components/documents/cotenant/CoTenantTax.vue'
import { useRoute } from 'vue-router'
import CoupleResidency from '@/components/documents/cotenant/CoupleResidency.vue'

const route = useRoute()

function getStep() {
  return Number(route.params.step) || 0
}
function getSubStep() {
  return Number(route.params.substep) || 0
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
