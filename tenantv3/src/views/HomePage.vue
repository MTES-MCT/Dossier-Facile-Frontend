<template>
  <div></div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import useTenantStore from '../stores/tenant-store'

const store = useTenantStore()

const isLoggedIn = computed(() => store.isLoggedIn)

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`

onMounted(() => {
  nextTick(function () {
    window.stop()
    if (isLoggedIn.value) {
      window.location.replace(`${TENANT_URL}/account`)
    } else {
      window.location.replace(MAIN_URL)
    }
    return
  })
})
</script>
