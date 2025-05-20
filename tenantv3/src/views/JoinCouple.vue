<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ t('joincouple.title') }}
    </h2>
    <InitPassword :is-disabled="isLoading" @on-init-password="onInitPassword" />
    <ConfirmModal v-if="isLoggedIn" @valid="logout()" @cancel="redirect()">
      <span>{{ t('joincouple.already-logged') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import InitPassword from 'df-shared-next/src/Authentification/InitPassword.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { ToastService } from '../services/ToastService'
import { useTenantStore } from '../stores/tenant-store'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isAxiosError } from 'axios'
import { useLoading } from 'vue-loading-overlay'

const { t } = useI18n()
const store = useTenantStore()
const isLoggedIn = computed(() => store.isLoggedIn)
const route = useRoute()
const router = useRouter()
const $loading = useLoading({})
const isLoading = ref(false)

function onInitPassword(password: string) {
  const token = route.params.token.toString()
  isLoading.value = true
  const loader = $loading.show()
  store.createPasswordCouple({ token, password }).then(
    () => {
      ToastService.success('joincouple.password-update')
      router.push({ name: 'TenantName' })
      loader.hide()
      isLoading.value = false
    },
    (error) => {
      loader.hide()
      isLoading.value = false
      if (isAxiosError(error) && error.code === 'ERR_BAD_REQUEST') {
        ToastService.error('joincouple.token-expired')
      } else {
        ToastService.error('joincouple.error')
      }
    }
  )
}

async function logout() {
  await store.logout()
}

function redirect() {
  router.push({ name: 'Account' })
}
</script>
