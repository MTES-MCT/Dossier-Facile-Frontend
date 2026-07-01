<template>
  <ProfileContainer :step="3">
    <GuarantorDocuments></GuarantorDocuments>
  </ProfileContainer>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import GuarantorDocuments from '../components/GuarantorDocuments.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { useRoute } from 'vue-router'

const store = useTenantStore()
const guarantors = computed(() => {
  return store.guarantors
})
const route = useRoute()

watch(
  [() => route.params.guarantorId, guarantors],
  ([guarantorId]) => {
    if (!guarantorId) {
      return
    }

    const g = guarantors.value.find((guarantor: Guarantor) => {
      return guarantor.id?.toString() === guarantorId
    })

    if (g) {
      store.setSelectedGuarantor(g)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
