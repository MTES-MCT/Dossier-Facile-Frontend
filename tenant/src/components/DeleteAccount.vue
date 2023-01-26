<template>
  <form name="form" @submit.prevent="validDelete">
    <Modal @close="undoSelect()">
      <template v-slot:header>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <h4 class="fr-col-10 title">
              <span class="text-danger material-icons-outlined md-38 fr-pr-1w"
                >cancel</span
              >
              {{ $t("deleteaccount.title") }}
            </h4>
          </div>
        </div>
      </template>
      <template v-slot:body>
        <div class="fr-container min-w">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-10">
              <div class="fr-mb-3w">
                <p>{{ $t("deleteaccount.confirm-delete") }}</p>
              </div>
              <div class="align--right">
                <DfButton
                  class="fr-mr-3w"
                  type="button"
                  @on-click="undoSelect()"
                  >{{ $t("deleteaccount.cancel") }}</DfButton
                >
                <DfButton
                  type="submit"
                  @on-click="validSelect()"
                  primary="true"
                  >{{
                    isMobile()
                      ? $t("deleteaccount.validate-mobile")
                      : $t("deleteaccount.validate")
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Modal from "df-shared/src/components/Modal.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import DfButton from "df-shared/src/Button/Button.vue";
import { UtilsService } from "../services/UtilsService";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: { Modal, DfButton }
})
export default class DeleteAccount extends Vue {
  validDelete() {
    this.$emit("input", false);
    this.$store.dispatch("deleteAccount").then(
      () => {
        AnalyticsService.deleteAccount();
      },
      () => {
        this.$toasted.show(this.$i18n.t("deleteaccount.try-again").toString(), {
          type: "error",
          duration: 7000
        });
      }
    );
  }

  undoSelect() {
    this.$emit("input", false);
    return false;
  }

  isMobile() {
    return UtilsService.isMobile();
  }
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

