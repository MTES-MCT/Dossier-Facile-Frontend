<template>
  <ProfileContainer :step="getStep()">
    <div v-if="getSubStep() === 0">
      <CoTenantName :co-tenant-id="getTenantId()" @on-next="goNext()" @on-back="goBack()" />
    </div>

    <div v-if="getSubStep() === 1">
      <CoTenantIdentification :co-tenant-id="getTenantId()"></CoTenantIdentification>
      <FooterContainer>
        <BackNext :show-back="true" @on-next="goToResidency()" @on-back="goBack()"> </BackNext>
      </FooterContainer>
    </div>
    <CoupleResidency v-if="getSubStep() === 2"></CoupleResidency>
    <div v-if="getSubStep() === 3">
      <CoTenantProfessional :co-tenant-id="getTenantId()"></CoTenantProfessional>
      <FooterContainer>
        <BackNext :show-back="true" @on-next="goNext()" @on-back="goToResidency()"> </BackNext>
      </FooterContainer>
    </div>
    <div v-if="getSubStep() === 4">
      <CoTenantFinancialList
        :co-tenant-id="getTenantId()"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantFinancialList>
    </div>
    <div v-if="getSubStep() === 5">
      <CoTenantTax :co-tenant-id="getTenantId()" @on-next="goNext" @on-back="goBack"></CoTenantTax>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from '../components/ProfileContainer.vue'
import FooterContainer from '../components/footer/FooterContainer.vue'
import BackNext from '../components/footer/BackNext.vue'
import CoTenantIdentification from '../components/documents/cotenant/CoTenantIdentification.vue'
import CoTenantName from '../components/documents/cotenant/CoTenantName.vue'
import CoTenantProfessional from '../components/documents/cotenant/CoTenantProfessional.vue'
import CoTenantFinancialList from '../components/documents/cotenant/CoTenantFinancialList.vue'
import CoTenantTax from '../components/documents/cotenant/CoTenantTax.vue'
import { useRoute, useRouter } from 'vue-router'
import CoupleResidency from '@/components/documents/cotenant/CoupleResidency.vue'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'
import useTenantStore from '@/stores/tenant-store'

const router = useRouter()
const route = useRoute()
const store = useTenantStore()

function goBack() {
  if (getSubStep() > 0) {
    router.push({
      name: 'CoTenantDocuments',
      params: {
        substep: Number(getSubStep() - 1).toString(),
        tenantId: getTenantId().toString()
      }
    })
    return
  }
  router.push({
    name: 'GuarantorChoice'
  })
}

function goNext() {
  if (getSubStep() < 5) {
    router.push({
      name: 'CoTenantDocuments',
      params: {
        substep: Number(getSubStep() + 1).toString(),
        tenantId: getTenantId().toString()
      }
    })
    return
  } else {
    router.push({
      name: 'TenantGuarantors',
      params: {
        tenantId: getTenantId().toString(),
        step: '5'
      }
    })
  }
}

function goToResidency() {
  const cotenant = store.getTenant(getTenantId())
  const link = makeResidencyLink(cotenant, `/documents-colocataire/${getTenantId()}/${getStep()}/2`)
  router.push(link)
}

function getTenantId() {
  return Number(route.params.tenantId)
}

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
