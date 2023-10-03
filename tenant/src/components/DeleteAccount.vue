<template>
  <DSFRSimpleModal modalId="modal-delete-account">
    <template v-slot:header>
      <i class="fr-pr-1w ri-close-circle-line text-danger fs-24"></i>
      {{ $t("deleteaccount.title") }}
    </template>
    <template v-slot:body>
      <p>{{ $t("deleteaccount.confirm-delete") }}</p>
      <div class="btn-container">
        <DfButton
          class="fr-mr-3w"
          type="button"
          data-fr-opened="false"
          aria-controls="modal-delete-account"
          style="visibility: none"
          >{{ $t("deleteaccount.cancel") }}</DfButton
        >
        <DfButton @on-click="validSelect()" primary="true">
          <span class="mobile">{{ $t("deleteaccount.validate-mobile") }}</span>
          <span class="desktop">{{ $t("deleteaccount.validate") }}</span>
        </DfButton>
      </div>
    </template>
  </DSFRSimpleModal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DSFRSimpleModal from "df-shared/src/components/DSFRSimpleModal.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import DfButton from "df-shared/src/Button/Button.vue";
import { UtilsService } from "../services/UtilsService";

@Component({
  components: { DSFRSimpleModal, DfButton },
})
export default class DeleteAccount extends Vue {
  validSelect() {
    this.$store.dispatch("deleteAccount").then(
      () => {
        AnalyticsService.deleteAccount();
      },
      () => {
        Vue.toasted.global.error_toast({
          message: "deleteaccount.try-again",
        });
      }
    );
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

.btn-container {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
