<template>
  <div class="mb-200">
    <NakedCard v-if="user.lastName || hasDocument()">
      <template v-slot:content>
        <div v-if="user.lastName">
          <a href="#" class="fr-link">
            {{ $t("title") }}
          </a>
          <hr />
          <div class="fr-card__desc">
            <section>
              <div class="row" v-if="user.lastName">
                <div>
                  <div class="subtitle">Prénom et Nom</div>
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <ViewEditBtn
                  :canView="false"
                  @edit="setNamePage()"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="user.applicationType">
                <div>
                  <div class="subtitle">Type de location</div>
                  {{ $t(user.applicationType) }}
                </div>
                <ViewEditBtn
                  :canView="false"
                  @edit="setTypePage()"
                ></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasDocument()">
          <a href="#" class="fr-link">
            {{ $t("second-title") }}
          </a>
          <hr />
          <div class="fr-card__desc">
            <section>
              <div class="row" v-if="hasDoc('IDENTIFICATION')">
                <div class="subtitle">Pièce d’identité</div>
                <ViewEditBtn
                  :canView="hasFile('IDENTIFICATION')"
                  @view="openDoc('IDENTIFICATION')"
                  @edit="setTenantStep(1)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="hasDoc('RESIDENCY')">
                <div class="subtitle">Justificatif de domicile</div>
                <ViewEditBtn
                  :canView="hasFile('RESIDENCY')"
                  @view="openDoc('RESIDENCY')"
                  @edit="setTenantStep(2)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="hasDoc('PROFESSIONAL')">
                <div class="subtitle">
                  Justificatif de situation professionnelle
                </div>
                <ViewEditBtn
                  :canView="hasFile('PROFESSIONAL')"
                  @view="openDoc('PROFESSIONAL')"
                  @edit="setTenantStep(3)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="hasDoc('FINANCIAL')">
                <div class="subtitle">Justificatif de ressources</div>
                <ViewEditBtn
                  :canView="hasFile('FINANCIAL')"
                  @view="openDoc('FINANCIAL')"
                  @edit="setTenantStep(4)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="hasDoc('TAX')">
                <div class="subtitle">Avis d’imposition</div>
                <ViewEditBtn
                  :canView="hasFile('TAX')"
                  @view="openDoc('TAX')"
                  @edit="setTenantStep(5)"
                ></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasGuarantor('LEGAL_PERSON')">
          <div class="fr-grid-row space-between">
            <a href="#" class="fr-link">
              {{ $t("legal-person") }}
            </a>
            <button
              @click="deleteGuarantor(selectedGuarantor)"
              class="fr-tag"
              :title="$t('delete-guarantor')"
            >
              X<span class="fr-ml-1w hide-small">{{
                $t("delete-guarantor")
              }}</span>
            </button>
          </div>
          <hr />
          <div class="fr-card__desc">
            <div
              class="row"
              v-if="
                guarantorHasDoc(
                  'IDENTIFICATION_LEGAL_PERSON',
                  selectedGuarantor
                )
              "
            >
              <div class="subtitle">
                {{ $t("identification-legal-person") }}
              </div>
              <ViewEditBtn
                :canView="
                  guarantorHasFile(
                    'IDENTIFICATION_LEGAL_PERSON',
                    selectedGuarantor
                  )
                "
                @view="
                  openGuarantorDoc(
                    'IDENTIFICATION_LEGAL_PERSON',
                    selectedGuarantor
                  )
                "
                @edit="setGuarantorSubStep(1, selectedGuarantor)"
              ></ViewEditBtn>
            </div>
            <div
              class="row"
              v-if="guarantorHasDoc('IDENTIFICATION', selectedGuarantor)"
            >
              <div class="subtitle">{{ $t("identity-represent") }}</div>
              <ViewEditBtn
                :canView="guarantorHasFile('IDENTIFICATION', selectedGuarantor)"
                @view="openGuarantorDoc('IDENTIFICATION', selectedGuarantor)"
                @edit="setGuarantorSubStep(2, selectedGuarantor)"
              ></ViewEditBtn>
            </div>
          </div>
        </div>
        <div v-if="hasGuarantor('ORGANISM')">
          <div class="fr-grid-row space-between">
            <a href="#" class="fr-link">
              {{ $t("third-title") }}
            </a>
            <button
              @click="deleteGuarantor(selectedGuarantor)"
              class="fr-tag"
              :title="$t('delete-guarantor')"
            >
              X<span class="fr-ml-1w hide-small">{{
                $t("delete-guarantor")
              }}</span>
            </button>
          </div>
          <hr />
          <div class="fr-card__desc">
            <section>
              <div class="row">
                <div class="subtitle">{{ $t("organism") }}</div>
                <ViewEditBtn
                  :canView="
                    guarantorHasFile('IDENTIFICATION', selectedGuarantor)
                  "
                  @view="openGuarantorDoc('IDENTIFICATION', selectedGuarantor)"
                  @edit="setGuarantorSubStep(1, selectedGuarantor)"
                ></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
        <div v-for="g in getNaturalGuarantors()" v-bind:key="g.id">
          <div class="fr-grid-row space-between">
            <a href="#" class="fr-link">
              {{ $t("third-title") }}
            </a>
            <button
              @click="deleteGuarantor(g)"
              class="fr-tag"
              :title="$t('delete-guarantor')"
            >
              X<span class="fr-ml-1w hide-small">{{
                $t("delete-guarantor")
              }}</span>
            </button>
          </div>
          <hr />
          <div class="fr-card__desc">
            <section>
              <div class="row">
                <div class="subtitle">Pièce d’identité</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('IDENTIFICATION', g)"
                  @view="openGuarantorDoc('IDENTIFICATION', g)"
                  @edit="setGuarantorSubStep(1, g)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('RESIDENCY', g)">
                <div class="subtitle">Justificatif de domicile</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('RESIDENCY', g)"
                  @view="openGuarantorDoc('RESIDENCY', g)"
                  @edit="setGuarantorSubStep(2, g)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('PROFESSIONAL', g)">
                <div class="subtitle">
                  Justificatif de situation professionnelle
                </div>
                <ViewEditBtn
                  :canView="guarantorHasFile('PROFESSIONAL', g)"
                  @view="openGuarantorDoc('PROFESSIONAL', g)"
                  @edit="setGuarantorSubStep(3, g)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('FINANCIAL', g)">
                <div class="subtitle">Justificatif de ressources</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('FINANCIAL', g)"
                  @view="openGuarantorDoc('FINANCIAL', g)"
                  @edit="setGuarantorSubStep(4, g)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('TAX', g)">
                <div class="subtitle">Avis d’imposition</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('TAX', g)"
                  @view="openGuarantorDoc('TAX', g)"
                  @edit="setGuarantorSubStep(5, g)"
                ></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
      </template>
    </NakedCard>
    <Modal v-if="isDocModalVisible" @close="isDocModalVisible = false">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <div v-for="f in files" v-bind:key="f.id">
                <ShowDoc :file="f"></ShowDoc>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <ConfirmModal
      v-if="confirmDeleteGuarantor"
      @valid="validDeleteGuarantor()"
      @cancel="undoDeleteGuarantor()"
    >
      <span v-if="selectedGuarantor.lastName">{{
        $t("will-delete-guarantor-name", [
          selectedGuarantor.lastName + " " + selectedGuarantor.firstName
        ])
      }}</span>
      <span v-if="!selectedGuarantor.lastName">{{
        $t("will-delete-guarantor")
      }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { DfFile } from "df-shared/src/models/DfFile";
import Modal from "df-shared/src/components/Modal.vue";
import PdfViewer from "../components/PdfViewer.vue";
import ShowDoc from "./documents/ShowDoc.vue";
import { DocumentService } from "../services/DocumentService";
import ViewEditBtn from "./ViewEditBtn.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    NakedCard,
    Modal,
    PdfViewer,
    ShowDoc,
    ViewEditBtn,
    ConfirmModal
  },
  computed: {
    ...mapState({
      user: "user",
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class EditSummary extends Vue {
  user!: User;
  selectedGuarantor!: Guarantor;
  isDocModalVisible = false;
  files: DfFile[] = [];
  confirmDeleteGuarantor = false;
  guarantorToDelete!: Guarantor;

  setTenantStep(n: number) {
    AnalyticsService.editFromMenu(n);
    this.$store.dispatch("setTenantPage", { substep: n });
  }

  async setGuarantorSubStep(n: number, g: Guarantor) {
    AnalyticsService.editFromMenu(n);
    this.$store.dispatch("setGuarantorPage", {
      guarantor: g,
      substep: n.toString()
    });
  }

  setNamePage() {
    this.$router.push("/nom-locataire");
  }
  setTypePage() {
    this.$router.push("/type-locataire");
  }

  hasDocument() {
    return DocumentService.hasDocument();
  }
  hasDoc(docType: string) {
    return DocumentService.hasDoc(docType);
  }
  hasFile(docType: string) {
    return DocumentService.hasFile(docType);
  }
  guarantorHasFile(docType: string, g: Guarantor) {
    return DocumentService.guarantorHasFile(g, docType);
  }
  guarantorHasDoc(docType: string, g: Guarantor) {
    return DocumentService.guarantorHasDoc(g, docType);
  }
  hasGuarantor(guarantorType: string) {
    return DocumentService.hasGuarantor(guarantorType);
  }
  openDoc(documentCategory: string) {
    AnalyticsService.viewFromMenu(documentCategory);
    this.files = DocumentService.getFiles(documentCategory);
    if (this.files.length > 0) {
      this.isDocModalVisible = true;
    }
  }
  openGuarantorDoc(documentCategory: string, g: Guarantor) {
    AnalyticsService.viewFromMenu(documentCategory);
    this.files = DocumentService.getGuarantorFiles(g, documentCategory);
    if (this.files.length > 0) {
      this.isDocModalVisible = true;
    }
  }
  getNaturalGuarantors(): Guarantor[] {
    return (
      this.user.guarantors?.filter((g: Guarantor) => {
        return g.typeGuarantor === "NATURAL_PERSON";
      }) || []
    );
  }
  deleteGuarantor(g: Guarantor) {
    this.guarantorToDelete = g;
    this.confirmDeleteGuarantor = true;
  }
  undoDeleteGuarantor() {
    this.confirmDeleteGuarantor = false;
  }
  validDeleteGuarantor() {
    this.$store
      .dispatch("deleteGuarantor", this.guarantorToDelete)
      .then(() => {
        this.$toasted.show(this.$i18n.t("delete-ok").toString(), {
          type: "success",
          duration: 7000
        });
        if (!this.user.guarantors?.length || 0 >= 1) {
          this.$router.push({ name: "GuarantorChoice" });
        }
      })
      .catch(() => {
        Vue.toasted.global.error();
      });
    this.confirmDeleteGuarantor = false;
  }
}
</script>

<style scoped lang="scss">
.subtitle {
  font-weight: bold;
}

.hide-small {
  @media (max-width: 1750px) {
    display: none;
  }
}

.space-between {
  justify-content: space-between;
}

.mb-200 {
  margin-bottom: 200px;
}
</style>

<i18n>
{
"en": {
"title": "Information du locataire",
"second-title": "Documents du locataire",
"third-title": "Documents du garant",
"ALONE": "Seul",
"COUPLE": "En couple",
"GROUP": "En colocation",
"legal-person": "Legal person",
"identification-legal-person": "Legal person identity",
"identity-represent": "Identity",
"organism": "Organism",
"delete-guarantor": "Delete guarantor",
"will-delete-guarantor": "Do you really want to delete this guarantor ?",
"will-delete-guarantor-name": "Do you really want this guarantor ? Name : {0}",
"delete-ok": "Delete done"
},
"fr": {
"title": "Information du locataire",
"second-title": "Documents du locataire",
"third-title": "Documents du garant",
"ALONE": "Seul",
"COUPLE": "En couple",
"GROUP": "En colocation",
"legal-person": "Personne morale",
"identification-legal-person": "Identité personne morale",
"identity-represent": "Identité représentant",
"organism": "Organisme",
"delete-guarantor": "Supprimer ce garant",
"will-delete-guarantor": "Êtes-vous sûr de vouloir supprimer ce garant ?",
"will-delete-guarantor-name": "Êtes-vous sûr de vouloir supprimer ce garant ? Nom : {0}",
"delete-ok": "Suppression effectuée"
}
}
</i18n>
