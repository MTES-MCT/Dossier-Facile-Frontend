<template>
  <Modal @close="undoSelect()">
    <template v-slot:body>
      <div class="rf-container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8">
            <p>
              <slot></slot>
            </p>
            <div class="align--right">
              <DfButton
                type="submit"
                class="rf-mr-3w"
                @on-click="validSelect()"
                primary="true"
                >{{ $t("validate") }}</DfButton
              >
              <DfButton class="rf-mr-3w" @on-click="undoSelect()">{{
                $t("cancel")
              }}</DfButton>
            </div>
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