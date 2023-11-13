<template>
  <ProfileContainer :step="3">
    <GuarantorDocuments :substep="getStep()"></GuarantorDocuments>
  </ProfileContainer>
</template>

<script setup lang="ts">
import useTenantStore from "@/stores/tenant-store";
import GuarantorDocuments from "../components/GuarantorDocuments.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { Guarantor } from "df-shared-next/src/models/Guarantor";
import { computed, onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";

const store = useTenantStore();
const guarantors = computed(() => {
  return store.guarantors;
});
const route = useRoute();

onBeforeMount(async () => {
  if (route.params.guarantorId) {
    const g = guarantors.value.find((g: Guarantor) => {
      return g.id?.toString() == route.params.guarantorId;
    });
    if (g) {
      await store.setSelectedGuarantor(g);
    }
  }
})

onMounted(() => {
  window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
})

onBeforeUnmount(() => {
  window.Beacon("destroy");
})
function getStep() {
  return Number(route.params.substep) || 0;
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
