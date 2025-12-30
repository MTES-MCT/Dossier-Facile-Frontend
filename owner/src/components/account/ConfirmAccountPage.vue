<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import AuthService from '../auth/AuthService'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const token = route.params.token.toString()
type ErrorType = 'loading' | 'link-invalid' | 'server-error' | 'generic'
const errorType = ref<ErrorType>('loading')

onMounted(async () => {
  try {
    await AuthService.confirmAccount(token)
    router.push({ name: 'Dashboard' })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status
      if (status === 404) {
        errorType.value = 'link-invalid'
      } else if (status >= 500) {
        errorType.value = 'server-error'
      } else {
        errorType.value = 'generic'
      }
    } else {
      errorType.value = 'generic'
    }
  }
})
</script>

<template>
  <div class="fr-container fr-py-4w">
    <div v-if="errorType === 'loading'">{{ t('confirmaccountpage.loading') }}</div>
    <div v-else-if="errorType === 'link-invalid'" class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">{{ t('confirmaccountpage.link-invalid-title') }}</h3>
      <p>{{ t('confirmaccountpage.link-invalid') }}</p>
      <ul class="fr-mt-1w fr-mb-2w">
        <li>{{ t('confirmaccountpage.link-invalid-reason-1') }}</li>
        <li>{{ t('confirmaccountpage.link-invalid-reason-2') }}</li>
      </ul>
      <p>{{ t('confirmaccountpage.link-invalid-hint') }}</p>
      <p class="fr-mt-2w">
        <router-link :to="{ name: 'Dashboard' }" class="fr-btn fr-btn--secondary">
          {{ t('confirmaccountpage.go-to-login') }}
        </router-link>
      </p>
    </div>
    <div v-else-if="errorType === 'server-error'" class="fr-alert fr-alert--error">
      <h3 class="fr-alert__title">{{ t('confirmaccountpage.server-error-title') }}</h3>
      <p>{{ t('confirmaccountpage.server-error') }}</p>
      <p class="fr-mt-2w">
        <a href="/contact" class="fr-link">
          {{ t('confirmaccountpage.contact-support') }}
        </a>
      </p>
    </div>
    <div v-else class="fr-alert fr-alert--error">
      <h3 class="fr-alert__title">{{ t('confirmaccountpage.error-title') }}</h3>
      <p>{{ t('confirmaccountpage.error-occured') }}</p>
    </div>
  </div>
</template>
