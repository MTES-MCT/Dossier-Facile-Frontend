<template>
  <DSFRSimpleModal modalId="modal-delete-account">
    <template v-slot:header>
      <i class="fr-pr-1w ri-close-circle-line text-danger fs-24"></i>
      {{ t('deleteaccount.title') }}
    </template>
    <template v-slot:body>
      <p>{{ t('deleteaccount.confirm-delete') }}</p>
      <div class="btn-container">
        <DfButton
          class="fr-mr-3w"
          type="button"
          data-fr-opened="false"
          aria-controls="modal-delete-account"
          style="visibility: none"
          >{{ t('deleteaccount.cancel') }}</DfButton
        >
        <DfButton @on-click="validSelect()" :primary="true">
          <span class="mobile">{{ t('deleteaccount.validate-mobile') }}</span>
          <span class="desktop">{{ t('deleteaccount.validate') }}</span>
        </DfButton>
      </div>
    </template>
  </DSFRSimpleModal>
</template>

<script setup lang="ts">
import DSFRSimpleModal from 'df-shared-next/src/components/DSFRSimpleModal.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import useTenantStore from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'

const store = useTenantStore()

const { t } = useI18n()

function validSelect() {
  store.deleteAccount().then(
    () => {
      AnalyticsService.deleteAccount()
    },
    () => {
      ToastService.error('deleteaccount.try-again')
    }
  )
}
</script>

<style scoped lang="scss">
.align--right {
  text-align: right;
}

.title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.min-w {
  @media (min-width: 768px) {
    min-width: 40rem;
  }
}

.btn-container {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
