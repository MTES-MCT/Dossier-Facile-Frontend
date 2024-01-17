<template>
  <ContactForm profile="profile-tenant" :user="user" />
</template>

<script setup lang="ts">
import ContactForm from "df-shared-next/src/components/ContactForm.vue";
import useTenantStore from "@/stores/tenant-store";
import { computed, onBeforeUnmount, onMounted } from "vue";

const store = useTenantStore();
const user = computed(() => { return store.user });

  onMounted(() => {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  })

  onBeforeUnmount(() => {
    window.Beacon("destroy");
  })
</script>

<style scoped lang="scss"></style>
