<template>
  <section class="background fr-pb-5w fr-mb-5w">
    <div class="fr-container">
      <div class="fr-col-md-8">
        <div class="fr-grid-col">
          <p class="fr-badge fr-badge--sm fr-mt-3w">
            {{ $t("last-update", [getLastUpdateDate()]) }}
          </p>
          <h1 class="fr-h1 color--white fr-mt-3w" v-if="user">
            {{ $t("file.title", [getName()]) }}
          </h1>
          <p class="text-bold color--white">
            {{ $t("file.description", [getStatus(), getIncomeSum()]) }}
          </p>
          <slot></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { FileUser } from "df-shared/src/models/FileUser";
import { Component, Prop, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import FileReinsurance from "../components/FileReinsurance.vue";
import ProgressIndicator from "@/components/ProgressIndicator.vue";
import FileRowListItem from "../components/documents/FileRowListItem.vue";
import OwnerBanner from "../components/OwnerBanner.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import moment from "moment";

@Component({
  components: {
    ProgressIndicator,
    DfButton,
    FileReinsurance,
    FileRowListItem,
    OwnerBanner,
    NakedCard,
  },
})
export default class File extends Vue {
  @Prop() user!: FileUser | null;

  getName() {
    if (this.user?.tenants === undefined) {
      return "";
    }
    if (this.user?.tenants.length === 2) {
      const userNames = this.user.tenants
        .map((o) => this.$options.filters?.fullName(o))
        .join(this.$i18n.t("file.and").toString());
      return userNames;
    }
    const userNames = this.user.tenants
      .map((o) => this.$options.filters?.fullName(o))
      .join(", ");
    return userNames;
  }

  getStatus() {
    if (this.user?.applicationType) {
      return this.$i18n.t(this.user.applicationType);
    }
    return "";
  }

  getIncomeSum() {
    if (this.user?.tenants) {
      let sum = 0;
      for (const t of this.user.tenants) {
        const localsum = t.documents
          ?.filter((d: DfDocument) => {
            return d.documentCategory === "FINANCIAL";
          })
          .reduce((sum, current) => sum + (current.monthlySum || 0), 0);
        sum += localsum || 0;
      }
      if (sum === 0) {
        return this.$i18n.t("file.no-income");
      }
      return this.$i18n.t("file.income", [sum]);
    }
  }

  getLastUpdateDate() {
    return moment(this.user?.lastUpdateDate).format("D MMMM YYYY");
  }
}
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/cover-features.webp");

  @media (max-width: 768px) {
    background-image: url("../assets/cover-features-mobile.webp");
  }

  z-index: 0;
}
.root {
  width: 100%;
  background-color: var(--bf100-g750);
}
.without-padding {
  padding: 0;
}

.fr-tabs {
  background-color: var(--background-default-grey);
}

.fr-fi-icon-fc-right {
  flex-direction: row-reverse;

  &:before {
    content: "";
    background-color: transparent;
    background-image: url("../assets/images/icons/franceconnect-icon.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 21px;
    width: 24px;
    margin-left: 0.5rem;
  }
}

.icon-dgfip {
  height: 46px;
  margin-left: 2rem;
}
.not-found-container {
  width: 100vw;
  display: flex;
  justify-content: center;
}

.fr-badge {
  --text-default-grey: #fff;
  --background-contrast-grey: #1d2437;
}
</style>
