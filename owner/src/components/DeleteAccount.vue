<template>
  <form name="form" @submit.prevent="validDelete">
    <Modal @close="undoSelect()" id="modal-delete-account">
      <template v-slot:header>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <h4 class="fr-col-10 title">
              <RiCloseCircleLine class="text-danger fr-mr-1w bold-icon" size="38px" />
              {{ t('deleteaccount.title') }}
            </h4>
          </div>
        </div>
      </template>
      <template v-slot:body>
        <div class="fr-container min-w">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-10">
              <div class="fr-mb-3w">
                <p>{{ t('deleteaccount.confirm-delete') }}</p>
              </div>
              <div class="align--right">
                <DfButton
                  :title="t('deleteaccount.cancel')"
                  class="fr-mr-3w"
                  type="button"
                  @on-click="undoSelect()"
                  >{{ t('deleteaccount.cancel') }}</DfButton
                >
                <DfButton type="submit" :title="t('deleteaccount.delete')" :primary="true">{{
                  isMobile() ? t('deleteaccount.validate-mobile') : t('deleteaccount.validate')
                }}</DfButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </form>
</template>

<script setup lang="ts">
import Modal from 'df-shared-next/src/components/Modal.vue'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import UtilsService from '../services/UtilsService'
import useOwnerStore from '../store/owner-store'
import { RiCloseCircleLine } from '@remixicon/vue'

const store = useOwnerStore()
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const { t } = useI18n()
const toast = useToast()

function validDelete() {
  store.setShowDeleteAccountModal(false)
  store.deleteAccount().then(
    () => {
      window.location.replace(MAIN_URL)
    },
    () => {
      toast.error(t('deleteaccount.try-again').toString(), {
        timeout: 7000
      })
    }
  )
}

function undoSelect() {
  store.setShowDeleteAccountModal(false)
  return false
}

function isMobile() {
  return UtilsService.isMobile()
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
</style>
