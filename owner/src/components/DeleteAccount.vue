<template>
  <form name="form" @submit.prevent="validDelete">
    <Modal @close="undoSelect()">
      <template v-slot:header>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-10 title">
              <span class="text-danger material-icons-outlined md-38 fr-pr-1w"
                >cancel</span
              >
              {{ t("title") }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:body>
        <div class="fr-container min-w">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-10">
              <div class="fr-mb-3w">
                <p>{{ t("confirm-delete") }}</p>
              </div>
              <div class="align--right">
                <DfButton
                  :title="t('cancel')"
                  class="fr-mr-3w"
                  type="button"
                  @on-click="undoSelect()"
                  >{{ t("cancel") }}</DfButton
                >
                <DfButton
                  type="submit"
                  :title="t('delete')"
                  :primary="true"
                  >{{
                    isMobile() ? t("validate-mobile") : t("validate")
                  }}</DfButton
                >
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </form>
</template>

<script setup lang="ts">
import Modal from 'df-shared/src/components/Modal.vue';
import DfButton from 'df-shared/src/Button/Button.vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import UtilsService from '../services/UtilsService';
import useOwnerStore from '../store/owner-store';

const store = useOwnerStore();
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;
const { t } = useI18n();
const toast = useToast();

const emit = defineEmits(['close']);

function validDelete() {
  emit('close');
  store.deleteAccount().then(
    () => {
      window.location.replace(MAIN_URL);
    },
    () => {
      toast.error(t('try-again').toString(), {
        timeout: 7000,
      });
    },
  );
}

function undoSelect() {
  emit('close');
  return false;
}

function isMobile() {
  return UtilsService.isMobile();
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

<i18n>
{
  "en": {
    "confirm-delete": "Please confirm the complete deletion of the account :",
    "validate": "Delete my account",
    "validate-mobile": "Delete",
    "cancel": "Cancel",
    "title": "Account deletion",
    "title-mobile": "Deletion",
    "delete": "Delete"
  },
  "fr": {
    "validate": "Supprimer mon compte",
    "validate-mobile": "Supprimer",
    "cancel": "Annuler",
    "title": "Suppression de compte",
    "confirm-delete": "Veuillez confirmer la suppression complète du compte",
    "delete": "Supprimer"
  }
}
</i18n>
