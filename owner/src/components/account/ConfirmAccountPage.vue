<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import AuthService from '../auth/AuthService'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const token = route.params.token.toString()
const showError = ref(false)

AuthService.confirmAccount(token).then(
  () => {
    router.push({ name: 'Dashboard' })
  },
  () => {
    showError.value = true
  }
)
</script>

<template>
  <div class="fr-container">
    <div v-if="!showError">{{ t('confirmaccountpage.loading') }}</div>
    <div v-if="showError">{{ t('confirmaccountpage.error-occured') }}</div>
  </div>
</template>
