<template>
  <div class="fr-mb-15w">
    <RouterView
      v-if="['NATURAL_PERSON', 'LEGAL_PERSON'].includes(guarantor?.typeGuarantor || '')"
      v-slot="{ Component }"
    >
      <component :is="Component" @on-back="goBack" @on-next="goNext"></component>
    </RouterView>
    <div v-if="guarantor?.typeGuarantor === 'ORGANISM'">
      <OrganismCert :guarantor="guarantor"></OrganismCert>
      <GuarantorFooter @on-back="goBack" @on-next="nextStep"></GuarantorFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrganismCert from './documents/organismGuarantor/OrganismCert.vue'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { makeGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import { GUARANTOR_ROUTES } from './documents/naturalGuarantor/guarantorRoutes'
import { makeGuarantorIdentityDocumentLink } from './identityDocument/lib/identityDocumentLink'

const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const guarantor = computed(() => store.selectedGuarantor)
const user = computed(() => store.user)
const substep = computed(() => Number(route.path.split('/')[2]) || 0)

onBeforeMount(() => {
  const currentGuarantor = guarantor.value?.typeGuarantor
    ? guarantor.value
    : UtilsService.getLastAddedGuarantor(user.value)
  store.setSelectedGuarantor(currentGuarantor)
})

function updateSubstep(s: number) {
  if (GUARANTOR_ROUTES[s] === 'GuarantorIdentification' && guarantor.value) {
    const path = makeGuarantorIdentityDocumentLink(guarantor.value)
    router.push(path)
  } else if (GUARANTOR_ROUTES[s] === 'GuarantorResidency' && guarantor.value) {
    const path = makeGuarantorResidencyLink(guarantor.value)
    router.push(path)
  } else {
    router.push({ name: GUARANTOR_ROUTES[s] })
  }
}

function goBack() {
  if (substep.value > 0) {
    updateSubstep(substep.value - 1)
  } else {
    router.push({ name: 'GuarantorList' })
  }
}

function goNext() {
  const isFromValidation = route.query.from === 'validation'
  if (isFromValidation) {
    router.push({ name: 'ValidateFile' })
    return
  }
  if (substep.value < 5) {
    updateSubstep(substep.value + 1)
  } else {
    nextStep()
  }
}

function nextStep() {
  const isFromValidation = route.query.from === 'validation'
  if (isFromValidation) {
    router.push({ name: 'ValidateFile' })
    return
  }
  router.push({
    name: 'GuarantorList'
  })
}
</script>
