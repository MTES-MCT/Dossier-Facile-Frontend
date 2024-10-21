<template>
  <div class="fr-container fr-grid-row fr-mt-9w fr-grid-row--center">
    <div v-if="successMessage" class="fr-col-6">
      <p v-html="successMessage"></p>
    </div>
    <div v-if="error" class="fr-col-6">
      <p v-html="error"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthService } from 'df-shared-next/src/services/AuthService'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

onMounted(() => {
  const token = route.params.token
  if (typeof token !== 'string') {
    // multiple token= in URL
    return
  }
  AuthService.confirmAccount(token)
    .then(() => {
      successMessage.value = t('confirmaccount.action-confirmed')
      setTimeout(() => {
        router.push({ name: 'TenantName' })
      }, 10000)
    })
    .catch((err) => {
      error.value = err
      if (err.response.status === 404) {
        error.value = t('confirmaccount.token-err')
      }
    })
})
</script>
