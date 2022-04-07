<template>
  <Modal @close="undoSelect()">
    <template v-slot:body>
      <div class="fr-container">
        <div class="fr-grid-row justify-content-center">
          <div class="fr-col-12">
            <p>
              <slot></slot>
            </p>
            <div class="align--right">
              <DfButton
                type="submit"
                class="fr-mr-3w"
                @on-click="validSelect()"
                :primary="true"
                :title="t('validate')"
                >{{ t("validate") }}</DfButton
              >
              <DfButton
                class="fr-mr-3w"
                :title="t('cancel')"
                @on-click="undoSelect()"
                >{{ t("cancel") }}</DfButton
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["valid", "cancel"]);

function validSelect() {
  emit("valid");
}

function undoSelect() {
  emit("cancel");
}
</script>

<style scoped lang="scss">
.align--right {
  text-align: right;
}
</style>

<i18n>
{
  "en": {
    "validate": "Validate",
    "cancel": "Cancel"
  },
  "fr": {
    "validate": "Valider",
    "cancel": "Annuler"
  }
}
</i18n>
