<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ t('joincouple.title') }}
    </h2>
    <InitPassword :is-disabled="isLoading" @on-init-password="onInitPassword" />
    <ConfirmModal
      v-model:is-opened="isLoggedIn"
      :title="t('joincouple.already-logged')"
      :can-close="false"
      @valid="logout"
      @cancel.stop="redirect"
    />
  </div>
</template>

<script setup lang="ts">
import InitPassword from 'df-shared-next/src/Authentification/InitPassword.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useTenantStore } from '../stores/tenant-store'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = useTenantStore()
const { isLoggedIn } = storeToRefs(store)
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
      toast.keep.success(t('joincouple.password-created'), getNextBtnInFooter)
      router.push({ name: 'TenantName' })
      loader.hide()
      isLoading.value = false
    },
    (error) => {
      loader.hide()
      isLoading.value = false
      if (isAxiosError(error) && error.code === 'ERR_BAD_REQUEST') {
        toast.error(t('joincouple.token-expired'), document.getElementById('password'))
      } else {
        toast.error(t('errors.submit-failed'), document.getElementById('password'))
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
