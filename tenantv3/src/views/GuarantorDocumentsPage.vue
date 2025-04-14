<template>
  <ProfileContainer :step="3">
    <GuarantorDocuments></GuarantorDocuments>
  </ProfileContainer>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import GuarantorDocuments from '../components/GuarantorDocuments.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const store = useTenantStore()
const guarantors = computed(() => {
  return store.guarantors
})
const route = useRoute()

watch(route, () => {
  if (route.params.guarantorId) {
    const g = guarantors.value.find((g: Guarantor) => {
      return g.id?.toString() == route.params.guarantorId
    })
    if (g) {
      store.setSelectedGuarantor(g)
    }
  }
})
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
