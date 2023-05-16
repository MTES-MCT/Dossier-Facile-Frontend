<template>
  <Modal @close="closeModal()">
    <template v-slot:header>
      <div class="fr-container">
        <h1 id="fr-modal-title-modal-1" class="fr-modal__title">
          <slot name="title"></slot>
        </h1>
      </div>
    </template>
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
                primary="true"
                >{{
                  validateBtnText ? validateBtnText : $t("validate")
                }}</DfButton
              >
              <DfButton class="fr-mr-3w" @on-click="undoSelect()">{{
                cancelBtnText ? cancelBtnText : $t("cancel")
              }}</DfButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    Modal,
    DfButton
  }
})
export default class ConfirmModal extends Vue {
  @Prop() validateBtnText?: string;
  @Prop() cancelBtnText?: string;

  validSelect() {
    this.$emit("valid");
  }

  undoSelect() {
    this.$emit("cancel");
  }

  closeModal() {
    if (this.$listeners && this.$listeners["close"]) {
      this.$emit("close");
    } else {
      this.$emit("cancel");
    }
  }
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
