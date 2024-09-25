<template>
  <ProfileContainer :step="1">
    <TenantInformationForm></TenantInformationForm>
  </ProfileContainer>
</template>

<script setup lang="ts">
import TenantInformationForm from '../components/TenantInformationForm.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { onBeforeUnmount, onMounted } from 'vue'

onMounted(() => {
  window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67')
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})
</script>
