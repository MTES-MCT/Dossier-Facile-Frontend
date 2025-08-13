<template>
  <ProfileContainer :step="getStep()">
    <div v-show="!guarantors || guarantors.length == 0">
      <TenantGuarantorChoice
        :tenant-id="getTenantId()"
        :is-cotenant="true"
        @on-back="goBack"
        @on-select="updateGuarantorType"
      ></TenantGuarantorChoice>
    </div>

    <div v-show="guarantors && guarantors.length > 0">
      <TenantGuarantorList
        :guarantors="guarantors"
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
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
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
    name: 'TenantGuarantorName',
    params: {
      step: getStep().toString(),
      tenantId: getTenantId().toString(),
      guarantorId: g.id?.toString()
    }
  })
}

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
      name: 'TenantGuarantorName',
      params: {
        step: getStep().toString(),
        tenantId: getTenantId().toString(),
        guarantorId: guarantorId
      }
    })
  }
}

function goBack() {
  router.push({
    name: 'CoupleTax',
    params: {
      step: '4',
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
