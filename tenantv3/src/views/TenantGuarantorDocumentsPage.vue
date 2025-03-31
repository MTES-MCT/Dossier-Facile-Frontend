<template>
  <ProfileContainer :step="step">
    <RouterView
      v-if="['NATURAL_PERSON', 'LEGAL_PERSON'].includes(selectedGuarantor?.typeGuarantor || '')"
      v-slot="{ Component }"
    >
      <component :is="Component" @on-back="goBack" @on-next="goNext"></component>
    </RouterView>
    <div v-if="selectedGuarantor?.typeGuarantor === 'ORGANISM'">
      <OrganismCert is-cotenant :guarantor="selectedGuarantor" :tenant-id="tenantId"></OrganismCert>
      <GuarantorFooter @on-back="goBack" @on-next="nextStep"></GuarantorFooter>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from '../components/ProfileContainer.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrganismCert from '@/components/documents/organismGuarantor/OrganismCert.vue'
import GuarantorFooter from '@/components/footer/GuarantorFooter.vue'
import { makeCotenantGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import { TENANT_GUARANTOR_ROUTES } from '@/components/documents/naturalGuarantor/guarantorRoutes'

const route = useRoute()
const router = useRouter()
const store = useTenantStore()

const coTenants = computed(() => store.coTenants)
const step = computed(() => Number(route.params.step) || 0)
const tenantId = computed(() => Number(route.params.tenantId) || 0)
const guarantorId = computed(() => Number(route.params.guarantorId) || 0)
const selectedGuarantor = computed(() => store.selectedGuarantor)

onBeforeMount(() => {
  const coTenant = coTenants.value.find((r) => r.id === tenantId.value)
  const guarantor = coTenant?.guarantors?.find((g) => g.id === guarantorId.value)
  store.setSelectedGuarantor(guarantor)
})

function goToRoute(offset: number) {
  const substep = TENANT_GUARANTOR_ROUTES.indexOf(route.name?.toString() || '')
  const name = TENANT_GUARANTOR_ROUTES[substep + offset]
  if (!name) {
    nextStep()
    return
  }
  if (name === 'TenantGuarantorResidency') {
    goToResidency()
    return
  }
  router.push({
    name: 'TenantGuarantorDocuments',
    params: {
      step: route.params.step,
      tenantId: route.params.tenantId,
      guarantorId: route.params.guarantorId
    }
  })
}

function goBack() {
  goToRoute(-1)
}

function goNext() {
  goToRoute(1)
}

function goToResidency() {
  const coTenants = store.user.apartmentSharing?.tenants.filter((t) => t.id != store.user.id)
  const coTenant = coTenants?.find((r) => r.id === tenantId.value)
  const guarantor = coTenant?.guarantors?.find((g) => g.id === guarantorId.value)
  const document = guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
  const link = makeCotenantGuarantorResidencyLink(tenantId.value, guarantorId.value, document)
  router.push(link)
}

function nextStep() {
  router.push({
    name: 'TenantGuarantors',
    params: {
      tenantId: route.params.tenantId,
      step: route.params.step
    }
  })
}
</script>
