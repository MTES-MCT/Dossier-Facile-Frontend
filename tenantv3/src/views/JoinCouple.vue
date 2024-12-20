<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ t('joincouple.title') }}
    </h2>
    <InitPassword @on-init-password="onInitPassword" />
    <ConfirmModal v-if="isLoggedIn" @valid="logout()" @cancel="redirect()">
      <span>{{ t('joincouple.already-logged') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import InitPassword from 'df-shared-next/src/Authentification/InitPassword.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { ToastService } from '../services/ToastService'
import useTenantStore from '../stores/tenant-store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isAxiosError } from 'axios'

const { t } = useI18n()
const store = useTenantStore()
const isLoggedIn = computed(() => store.isLoggedIn)
const route = useRoute()
const router = useRouter()

function onInitPassword(password: string) {
  const token = route.params.token.toString()
  store.createPasswordCouple({ token, password }).then(
    () => {
      ToastService.success('joincouple.password-update')
      router.push({ name: 'TenantName' })
    },
    (error) => {
      if (
        isAxiosError(error) &&
        error.response?.data.message.includes('password recovery token or is expired')
      ) {
        ToastService.error('joincouple.token-expired')
      } else {
        ToastService.error('joincouple.error')
      }
    }
  )
}

async function logout() {
  await store.logout(false)
}

function redirect() {
  router.push({ name: 'Account' })
}
</script>
