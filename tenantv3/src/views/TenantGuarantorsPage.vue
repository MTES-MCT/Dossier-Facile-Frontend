<template>
  <ProfileContainer :step="getStep()">
    <div v-show="!guarantors || guarantors.length == 0">
      <TenantGuarantorChoice
        :tenantId="getTenantId()"
        :isCotenant="true"
        @on-back="goBack"
        @on-select="updateGuarantorType"
      ></TenantGuarantorChoice>
    </div>

    <div v-show="guarantors && guarantors.length > 0">
      <TenantGuarantorList
        :guarantors="guarantors"
        :substep="getStep()"
        @on-edit="onEdit"
        @on-back="goBack"
        @on-next="goNext"
      ></TenantGuarantorList>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import TenantGuarantorChoice from '../components/TenantGuarantorChoice.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import TenantGuarantorList from './TenantGuarantorList.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useTenantStore()
const coTenants = computed(() => store.coTenants)

const guarantors = computed(() => {
  return (
    coTenants.value.find((t) => {
      return t.id === Number(route.params.tenantId)
    })?.guarantors || []
  )
})
const route = useRoute()
const router = useRouter()

function getStep() {
  return Number(route.params.step) || 0
}

function getTenantId(): number {
  return Number(route.params.tenantId)
}

function onEdit(g: Guarantor) {
  router.push({
    name: 'TenantGuarantorDocuments',
    params: {
      step: getStep().toString(),
      substep: '0',
      tenantId: getTenantId().toString(),
      guarantorId: g.id?.toString() as string
    }
  })
}

onMounted(() => {
  window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67')
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})

function updateGuarantorType(value: string) {
  if (value == 'NO_GUARANTOR') {
    goNext()
  } else {
    if (guarantors.value === undefined) {
      return
    }
    let guarantorId = '0'
    if (guarantors.value.length >= 0) {
      guarantorId = guarantors.value[0].id?.toString() || '0'
    }

    router.push({
      name: 'TenantGuarantorDocuments',
      params: {
        step: getStep().toString(),
        substep: '0',
        tenantId: getTenantId().toString(),
        guarantorId: guarantorId
      }
    })
  }
}

function goBack() {
  router.push({
    name: 'CoTenantDocuments',
    params: {
      step: '4',
      substep: '5',
      tenantId: getTenantId().toString()
    }
  })
}

function goNext() {
  router.push({
    name: 'ValidateFileStep',
    params: { step: Number(getStep() + 1).toString() }
  })
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
