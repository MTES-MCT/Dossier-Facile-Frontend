<template>
  <div>
    <div v-if="guarantors.length > 0" class="main-guarantor-information">
      <div v-for="g in guarantors" v-bind:key="g.id">
        <hr />
        <div class="inline-block-flex item-action">
          <h4>
            {{ guarantorTitle(g) }}
          </h4>
          <a
            href
            :title="$t('guarantorssection.delete-guarantor')"
            @click.prevent="openConfirmModal(g)"
            >{{ $t("guarantorssection.delete-guarantor") }}</a
          >
        </div>
        <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
          <ul class="without-padding">
            <FileRowListItem
              :label="$t('guarantorssection.identification')"
              :document="document(g, 'IDENTIFICATION')"
              @click-edit="setGuarantorSubStep(1, g)"
            />
            <FileRowListItem
              :label="$t('guarantorssection.residency')"
              :document="document(g, 'RESIDENCY')"
              @click-edit="setGuarantorSubStep(2, g)"
            />
            <FileRowListItem
              :label="$t('guarantorssection.professional')"
              :document="document(g, 'PROFESSIONAL')"
              @click-edit="setGuarantorSubStep(3, g)"
            />
            <span v-if="documents(g, 'FINANCIAL').length > 1">
              <FileRowListItem
                v-for="(doc, k) in documents(g, 'FINANCIAL')"
                v-bind:key="doc.id"
                :label="
                  $t('guarantorssection.financial') +
                  (' ' + (k + 1) + ' - ') +
                  $t('documents.subcategory.' + doc.subCategory)
                "
                :document="doc"
                @click-edit="setGuarantorSubStep(4, g)"
              />
            </span>
            <FileRowListItem
              v-else
              :label="$t('guarantorssection.financial')"
              :document="document(g, 'FINANCIAL')"
              @click-edit="setGuarantorSubStep(4, g)"
            />
            <FileRowListItem
              :label="$t('guarantorssection.tax')"
              :document="document(g, 'TAX')"
              @click-edit="setGuarantorSubStep(5, g)"
            />
          </ul>
        </div>
        <div v-else-if="g.typeGuarantor === 'ORGANISM'">
          <ul class="without-padding">
            <FileRowListItem
              :label="$t('guarantorssection.organism-identification')"
              :document="document(g, 'IDENTIFICATION')"
              @click-edit="setGuarantorSubStep(1, g)"
            />
          </ul>
        </div>
        <div v-else-if="g.typeGuarantor === 'LEGAL_PERSON'">
          <ul class="without-padding">
            <FileRowListItem
              :label="$t('guarantorssection.organism-identification')"
              :document="document(g, 'IDENTIFICATION_LEGAL_PERSON')"
              @click-edit="setGuarantorSubStep(1, g)"
            />
          </ul>
        </div>
      </div>
      <ConfirmModal
        v-if="showConfirmModal"
        @valid="removeSelectedGuarantor()"
        @cancel="closeConfirmModal()"
      >
        <div>{{ $t("guarantorssection.confirm-delete-guarantor") }}</div>
      </ConfirmModal>
    </div>

    <div
      v-if="
        guarantors.length === 0 ||
        (guarantors.length === 1 &&
          guarantors[0].typeGuarantor === 'NATURAL_PERSON')
      "
    >
      <hr />
      <h4 v-if="guarantors.length === 0">
        {{ $t("guarantorssection.guarantors-information") }}
      </h4>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w">
          <button
            class="bg-purple add-guarantor-btn"
            @click.prevent="setAddGuarantorStep()"
          >
            {{ $t("guarantorssection.add-guarantor") }}
          </button>
        </div>

        <div
          v-if="guarantors.length === 0"
          class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
        >
          <a
            class="cleana"
            href="https://www.visale.fr/#!/"
            rel="noreferrer"
            target="_blank"
            :title="$t('guarantorssection.go-to-visale').toString()"
          >
            <div class="fr-tile bg-purple">
              <div class="inline-block-flex space-between">
                <div>
                  <div class="fr-h5">
                    {{ $t("guarantorssection.visale-title") }}
                  </div>
                </div>
                <div>
                  <img
                    alt="logo visale"
                    class="logo-visale"
                    src="../../assets/visale.svg"
                  />
                </div>
              </div>
              <div>{{ $t("guarantorssection.visale-text") }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { AnalyticsService } from "@/services/AnalyticsService";
import { DfDocument } from "df-shared/src/models/DfDocument";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { User } from "df-shared/src/models/User";
import { mapState } from "vuex";
import { UtilsService } from "@/services/UtilsService";
import FileRowListItem from "@/components/documents/FileRowListItem.vue";

@Component({
  components: { ColoredTag, ConfirmModal, FileRowListItem },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class GuarantorsSection extends Vue {
  @Prop() tenant!: User;
  user!: User;
  guarantors!: Guarantor[];
  showConfirmModal = false;
  selectedGuarantor: Guarantor | undefined;

  beforeMount() {
    this.guarantors = this.tenant.guarantors as Guarantor[];
  }

  guarantorTitle(g: Guarantor) {
    if (g.typeGuarantor === "NATURAL_PERSON")
      return (
        this.$t("guarantorssection.my-guarantor") +
        (g.firstName || g.lastName ? " " + g.firstName + " " + g.lastName : "")
      );
    else if (g.typeGuarantor === "LEGAL_PERSON" && g.legalPersonName) {
      return (
        this.$t("guarantorssection.my-guarantor") + " " + g.legalPersonName
      );
    }
    return this.$t("guarantorssection.guarantors-information");
  }

  isFinancialValid(docs: DfDocument[]) {
    if (!docs || docs.length === 0) {
      return "INCOMPLETE";
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return "INCOMPLETE";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "DECLINED") {
        return "DECLINED";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "TO_PROCESS") {
        return "TO_PROCESS";
      }
    }

    return "VALIDATED";
  }
  document(g: Guarantor, s: string) {
    return g.documents?.find((d) => {
      return d.documentCategory === s;
    });
  }

  documents(g: Guarantor, docType: string): DfDocument[] {
    return g.documents?.filter((d: DfDocument) => {
      return d.documentCategory === docType;
    }) as DfDocument[];
  }
  getGuarantorStatus(g: Guarantor, docType: string) {
    if (docType === "FINANCIAL") {
      const docs = g.documents?.filter((d) => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = g.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus || "EMPTY";
  }

  setGuarantorSubStep(n: number, g: Guarantor) {
    AnalyticsService.editFromAccount(n);
    this.$store.dispatch("setGuarantorPage", {
      guarantor: g,
      substep: n,
      tenantId: this.tenant.id,
    });
  }

  setAddGuarantorStep() {
    AnalyticsService.editAccount("guarantor");

    if (this.user.id === this.tenant.id) {
      if (this.guarantors.length > 0) {
        this.$store.dispatch("addNaturalGuarantor");
      } else {
        this.$router.push({ name: "GuarantorChoice" });
      }
    } else {
      if (this.guarantors.length > 0) {
        this.$store
          .dispatch("setGuarantorType", {
            tenantId: this.tenant.id,
            typeGuarantor: "NATURAL_PERSON",
          })
          .then(() => {
            this.guarantors = UtilsService.getTenant(this.tenant.id).guarantors;
            const g = this.guarantors[this.guarantors.length - 1];
            this.$router.push({
              name: "TenantGuarantorDocuments",
              params: {
                step: "5",
                substep: "0",
                tenantId: this.tenant.id.toString(),
                guarantorId: g.id?.toString() as string,
              },
            });
          });
      } else {
        this.$router.push({
          name: "TenantGuarantors",
          params: {
            tenantId: this.tenant.id.toString(),
            step: "5",
          },
        });
      }
    }
  }

  openConfirmModal(g: Guarantor) {
    this.showConfirmModal = true;
    this.selectedGuarantor = g;
  }
  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedGuarantor = undefined;
  }

  removeSelectedGuarantor() {
    this.$store.dispatch("deleteGuarantor", this.selectedGuarantor).then(
      () => {
        Vue.toasted.global.delete_success();
        this.guarantors = this.guarantors.filter(
          (g) => g.id != this.selectedGuarantor?.id
        );
        this.closeConfirmModal();
      },
      () => {
        Vue.toasted.global.delete_failed();
        this.closeConfirmModal();
      }
    );
  }
}
</script>

<style lang="scss" scoped>
hr {
  border: 0;
  margin-top: 2rem;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.inline-block-flex {
  display: flex;
  flex-direction: row;

  .fr-h5 {
    font-size: 1rem;
  }
}
.item-action {
  gap: 2em;
  align-items: baseline;
  a {
    font-size: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #000091;
    text-decoration: none;
  }

  a[href] {
    text-decoration: none;
    box-shadow: none;
  }
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  border: 1px solid var(--primary);
  min-height: 7.5rem;
  padding: 1.75rem;
  color: var(--primary);
  width: 100%;
  height: 100%;
  font-size: 1rem;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}

.bg-purple {
  margin: 0px;
  background-color: var(--blue-france-925);
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.cleana {
  &:after {
    content: none;
  }
}
a.cleana:focus {
  outline-style: auto;
}
</style>
