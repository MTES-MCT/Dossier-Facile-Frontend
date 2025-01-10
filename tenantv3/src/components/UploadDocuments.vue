<template>
  <div class="fr-mb-15w">
    <div v-if="substep <= 1">
      <TenantIdentification></TenantIdentification>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 2">
      <TenantResidency @on-back="goBack" @on-next="goNext"></TenantResidency>
    </div>
    <div v-if="substep === 3">
      <TenantProfessional></TenantProfessional>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 4">
      <TenantFinancial @on-back="goBack" @on-next="goNext"></TenantFinancial>
    </div>
    <div v-if="substep === 5">
      <TenantTax @on-back="goBack" @on-next="goNext"></TenantTax>
    </div>
  </div>
</template>

<script setup lang="ts">
import TenantIdentification from './documents/tenant/TenantIdentification.vue'
import TenantResidency from './documents/tenant/TenantResidency.vue'
import TenantProfessional from './documents/tenant/TenantProfessional.vue'
import TenantFinancial from './documents/tenant/TenantFinancial.vue'
import TenantTax from './documents/tenant/TenantTax.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import ProfileFooter from './footer/ProfileFooter.vue'
import useTenantStore from '../stores/tenant-store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const store = useTenantStore()
const user = computed(() => store.user)
const router = useRouter()

const props = defineProps<{ substep: number }>()

function updateSubstep(s: number) {
  router.push({
    name: 'TenantDocuments',
    params: { substep: props.substep === s ? '0' : s.toString() }
  })
}

function goToGuarantor() {
  AnalyticsService.validateFunnel()
  if (user.value.guarantors.length > 0) {
    router.push({
      name: 'GuarantorList'
    })
    return
  }
  router.push({
    name: 'GuarantorChoice'
  })
}

function goBack() {
  if (props.substep > 1) {
    router.push({
      name: 'TenantDocuments',
      params: { substep: (props.substep - 1).toString() }
    })
  } else {
    router.push({
      name: 'TenantType'
    })
  }
}

function goNext() {
  if (props.substep < 5) {
    updateSubstep(props.substep + 1)
  } else {
    goToGuarantor()
  }
}
</script>

<style scoped lang="scss">
@import 'df-shared-next/src/scss/_variables.scss';

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.title-bar {
  display: flex;
  align-items: center;

  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

h2 {
  line-height: 1.5rem;
}
</style>
