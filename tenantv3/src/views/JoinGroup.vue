<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ t('joingroup.title') }}
    </h2>
    <InitPassword @on-init-password="onInitPassword" />
    <ConfirmModal v-if="isLoggedIn" @valid="logout()" @cancel="redirect()">
      <span>{{ t('joingroup.already-logged') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTenantStore } from '../stores/tenant-store'
import { ToastService } from '../services/ToastService'
import { useRoute, useRouter } from 'vue-router'
import InitPassword from 'df-shared-next/src/Authentification/InitPassword.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTenantStore()
const isLoggedIn = computed(() => store.isLoggedIn)

const route = useRoute()
const router = useRouter()

function onInitPassword(password: string) {
  const token = route.params.token.toString()
  store.createPasswordGroup({ token, password }).then(
    () => {
      ToastService.success('joingroup.password-update')
      router.push({ name: 'TenantName' })
    },
    (error) => {
      console.log('Erreur ' + error.message)
      if (error.code == 'ERR_BAD_REQUEST') {
        ToastService.error('joingroup.bad-request')
      } else {
        ToastService.error('joingroup.error' + ' ' + error.code)
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
