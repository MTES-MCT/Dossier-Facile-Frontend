<template>
  <Modal @close="undoSelect()">
    <template v-slot:body>
      <div class="rf-container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 rf-grid-row">
            <p>
              <slot></slot>
            </p>
            <DfButton @on-click="validSelect()" primary="true">{{
              $t("validate")
            }}</DfButton>
            <DfButton @on-click="undoSelect()">{{ $t("cancel") }}</DfButton>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    Modal,
    DfButton,
  },
})
export default class ConfirmModal extends Vue {
  validSelect() {
    this.$emit("valid");
  }

  undoSelect() {
    this.$emit("cancel");
  }
}
</script>

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