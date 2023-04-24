<template>
  <div class="allowtax-container">
    <NakedCard class="fr-p-md-5w bg-transparent">
      <h6 class="header fr-icon-attachment-line fr-pb-1w fr-h6">
        {{ $t("allowchecktax.automatic-tax-title") }}
      </h6>
      <div class="auth-tax-container">
        <div>{{ $t("allowchecktax.automatic-tax-p1") }}</div>
        <ul>
          <li>{{ $t("allowchecktax.automatic-tax-l1") }}</li>
          <li>{{ $t("allowchecktax.automatic-tax-l2") }}</li>
          <li>{{ $t("allowchecktax.automatic-tax-l3") }}</li>
          <li>{{ $t("allowchecktax.automatic-tax-l4") }}</li>
        </ul>
        <i18n path="allowchecktax.automatic-tax-p2" tag="div">
          <template v-slot:label>
            <span class="bold-italic">{{
              $t("allowchecktax.dgfip-approved-label")
            }}</span>
          </template>
        </i18n>
        <div class="tax-btn-container">
          <BigRadio
            :val="'disallow'"
            :value="allowTax"
            @input="onChoice"
            class="fr-col-md-3 fr-col-12 disallow-btn no-max-width"
            :class="{ selected: allowTax === 'disallow' }"
          >
            <span>{{ $t("allowchecktax.forbid-tax") }}</span>
          </BigRadio>
          <BigRadio
            :val="'allow'"
            :value="allowTax"
            @input="onChoice"
            class="fr-col-md-9 fr-col-12 blue-text no-max-width"
            :class="{ selected: allowTax === 'allow' }"
          >
            <span>{{ $t("allowchecktax.allow-tax") }}</span>
          </BigRadio>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="showConfirmDeclineModal"
      :validateBtnText="$t('allowchecktax.modal.disable-button').toString()"
      @valid="confirmDecline()"
      @cancel="showConfirmDeclineModal = false"
    >
      <i18n path="allowchecktax.modal.warning-text" tag="p">
        <template v-slot:check>
          <span class="fr-text--bold">{{
            $t("allowchecktax.modal.automatic-check")
          }}</span>
        </template>
        <template v-slot:label>
          <span class="bold-italic">{{
            $t("allowchecktax.dgfip-approved-label")
          }}</span>
        </template>
      </i18n>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import axios from "axios";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    BigRadio,
    NakedCard,
    ConfirmModal,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class AllowCheckTax extends Vue {
  user!: User;
  allowTax = "";
  showConfirmDeclineModal = false;

  mounted() {
    if (this.user.allowCheckTax !== undefined) {
      this.allowTax = this.user.allowCheckTax ? "allow" : "disallow";
    }
  }

  onChoice(choice: string) {
    if (choice === this.allowTax) {
      return;
    }
    if (choice === "disallow") {
      this.showConfirmDeclineModal = true;
    }
    if (choice === "allow") {
      this.allowAutomaticCheck();
    }
  }

  async allowAutomaticCheck() {
    await this.saveChoice("allow");
    if (
      this.user.franceConnect &&
      process.env.VUE_APP_FEATURE_FLIPPING_DGFIP_API === "true"
    ) {
      this.refreshFranceConnectToken();
    }
  }

  private confirmDecline() {
    this.saveChoice("disallow");
    this.showConfirmDeclineModal = false;
  }

  async saveChoice(allowTax: string) {
    await this.$store.dispatch("saveTaxAuth", { allowTax });
    this.allowTax = allowTax;
  }

  private async refreshFranceConnectToken() {
    if (!this.$route.query.refresh) {
      const currentUrl =
        process.env.VUE_APP_FULL_TENANT_URL + this.$route.fullPath;
      const link = await axios.post(
        `https://${process.env.VUE_APP_API_URL}/api/tenant/linkFranceConnect`,
        { url: currentUrl + "?refresh=true" }
      );
      window.location.href = link.data;
      return;
    }
  }
}
</script>

<style scoped lang="scss">
.allowtax-container {
  border-radius: 0.5rem;
  background-color: var(--blue-france-925);
  color: var(--primary);

  .fr-h6 {
    color: var(--primary);
  }
}

.bg-transparent {
  background-color: transparent;
}

.blue-text:hover {
  background-color: var(--blue-france-hover);
}

.selected {
  color: #ffffff !important;
  background-color: var(--primary) !important;
}

.no-max-width {
  max-width: none;
}

.disallow-btn:hover {
  color: var(--primary);
  background-color: var(--blue-france-hover);
}

.auth-tax-container {
  margin-left: 1.8rem;
}

.tax-btn-container {
  margin-top: 2rem;
  display: flex;
  @media all and (max-width: 767px) {
    flex-direction: column;
  }
}

.bold-italic {
  font-weight: bold;
  font-style: italic;
}
</style>
