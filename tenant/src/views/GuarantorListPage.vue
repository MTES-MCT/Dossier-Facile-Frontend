<template>
  <ProfileContainer :step="3">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h5">
        {{ $t("guarantorlistpage.my-guarantor") }}
      </h1>
      <TroubleshootingModal>
        <GuarantorChoiceHelp></GuarantorChoiceHelp>
      </TroubleshootingModal>
      <div v-for="g in user.guarantors" :key="g.id">
        <CardRow @edit="editGuarantor(g)" @remove="isRemoveGuarantor = true">
          <template v-slot:tag>
            <div class="text-bold">{{ getGuarantorName(g) }}</div>
          </template>
          <template v-slot:text>
            <ColoredTag
              :text="$t(getStatus(g))"
              :status="getStatus(g)"
            ></ColoredTag>
          </template>
        </CardRow>
        <ConfirmModal
          v-if="isRemoveGuarantor"
          @valid="removeGuarantor(g)"
          @cancel="isRemoveGuarantor = false"
        >
          <span>{{ $t("guarantorlistpage.remove-guarantor") }}</span>
        </ConfirmModal>
      </div>
      <div v-if="hasOneNaturalGuarantor()">
        <button @click="addNaturalGuarantor()" class="add-guarantor-btn">
          {{ $t("guarantorlistpage.add-new-guarantor") }}
        </button>
      </div>
    </NakedCard>

    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import GuarantorFooter from "../components/footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "../components/helps/GuarantorChoiceHelp.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import CardRow from "df-shared/src/components/CardRow.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { DfDocument } from "df-shared/src/models/DfDocument";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    GuarantorFooter,
    GuarantorChoiceHelp,
    NakedCard,
    ProfileContainer,
    CardRow,
    ColoredTag,
    VGouvFrModal,
    ConfirmModal,
    TroubleshootingModal,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class GuarantorListPage extends Vue {
  user!: User;

  isRemoveGuarantor = false;

  beforeMount() {
    this.$store.commit("setSelectedGuarantor", undefined);
  }

  getGuarantorName(g: Guarantor) {
    if (g.firstName || g.lastName) {
      return `${g.firstName || ""} ${g.lastName || ""}`;
    }
    if (g.typeGuarantor === "LEGAL_PERSON" && g.legalPersonName) {
      return g.legalPersonName;
    }
    return this.$i18n.t("guarantorlistpage.guarantor." + g.typeGuarantor);
  }

  goBack() {
    if (this.user?.guarantors && this.user?.guarantors.length > 0) {
      this.$router.push({ name: "TenantDocuments", params: { substep: "5" } });
      return;
    }
    this.$router.push({
      name: "GuarantorChoice",
    });
  }

  goNext() {
    if (this.user.applicationType == "COUPLE") {
      const cotenant = this.user.apartmentSharing?.tenants.find(
        (t) => t.id != this.user.id
      ) as User;
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          step: "4",
          substep: "0",
          tenantId: cotenant.id.toString(),
        },
      });
      return;
    }
    this.$router.push({
      name: "ValidateFile",
    });
  }

  getStatus(g: Guarantor) {
    if (!g.documents) {
      return "";
    }
    if (
      (g.typeGuarantor === "NATURAL_PERSON" && g.documents.length < 5) ||
      (g.typeGuarantor === "LEGAL_PERSON" && g.documents.length < 2) ||
      (g.typeGuarantor === "ORGANISM" && g.documents.length < 1)
    ) {
      return "INCOMPLETE";
    }

    const hasDeclined =
      g.documents?.find((d: DfDocument) => {
        return d.documentStatus === "DECLINED";
      }) !== undefined;
    if (hasDeclined) {
      return "DECLINED";
    }

    const hasToProcess =
      g.documents?.find((d: DfDocument) => {
        return d.documentStatus === "TO_PROCESS";
      }) !== undefined;
    if (hasToProcess) {
      return "TO_PROCESS";
    }

    return "VALIDATED";
  }

  async editGuarantor(g: Guarantor) {
    this.$store.commit("setSelectedGuarantor", g);
    this.$router.push({
      name: "GuarantorDocuments",
      params: { substep: "0" },
    });
  }

  removeGuarantor(g: Guarantor) {
    this.$store.dispatch("deleteGuarantor", g).then(
      () => {
        if (!this.user.guarantors?.length || 0 >= 1) {
          this.$router.push({ name: "GuarantorChoice" });
        }
        this.isRemoveGuarantor = false;
      },
      () => {
        Vue.toasted.global.error();
      }
    );
  }

  hasOneNaturalGuarantor() {
    return (
      this.user.guarantors &&
      this.user.guarantors.length === 1 &&
      this.user.guarantors[0].typeGuarantor === "NATURAL_PERSON"
    );
  }

  addNaturalGuarantor() {
    this.$store.dispatch("addNaturalGuarantor");
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: $light-blue-transparent;
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

h2 {
  line-height: 1.5rem;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: 100%;
  }
}

.small-font {
  font-size: 14px;
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}
</style>
