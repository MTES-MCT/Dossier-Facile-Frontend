<template>
  <div>
    <NakedCard v-if="user.lastName || hasDocument()">
      <template v-slot:content>
        <div v-if="user.lastName">
          <a href="#" class="rf-link">
            {{ $t("title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row" v-if="user.lastName">
                <div>
                  <div class="subtitle">Prénom et Nom</div>
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <ViewEditBtn :canView="false" @edit="setStep(0)"></ViewEditBtn>
              </div>
              <div class="row" v-if="user.applicationType">
                <div>
                  <div class="subtitle">Type de location</div>
                  {{ $t(user.applicationType) }}
                </div>
                <ViewEditBtn :canView="false" @edit="setStep(1)"></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasDocument()">
          <a href="#" class="rf-link">
            {{ $t("second-title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
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
                  Justificatif de situation professionelle
                </div>
                <ViewEditBtn
                  :canView="hasFile('PROFESSIONAL')"
                  @view="openDoc('PROFESSIONAL')"
                  @edit="setTenantStep(3)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="hasDoc('FINANCIAL')">
                <div class="subtitle">Justificatif de revenu</div>
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
          <a href="#" class="rf-link">
            {{ $t("representative-identification") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section
              v-if="guarantorHasDoc('TODO-REPRESENTATIVE-IDENTIFICATION')"
            >
              <div class="subtitle">{{ $t("organism") }}</div>
              <ViewEditBtn
                :canView="
                  guarantorHasFile('TODO-REPRESENTATIVE-IDENTIFICATION')
                "
                @view="openGuarantorDoc('TODO-REPRESENTATIVE-IDENTIFICATION')"
                @edit="setGuarantorSubStep(1)"
              ></ViewEditBtn>
            </section>
          </div>
        </div>
        <div v-if="hasGuarantor('ORGANISM')">
          <a href="#" class="rf-link">
            {{ $t("third-title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row">
                <div class="subtitle">{{ $t("organism") }}</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('IDENTIFICATION')"
                  @view="openGuarantorDoc('IDENTIFICATION')"
                  @edit="setGuarantorSubStep(1)"
                ></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasGuarantor('NATURAL_PERSON')">
          <a href="#" class="rf-link">
            {{ $t("third-title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row">
                <div class="subtitle">Pièce d’identité</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('IDENTIFICATION')"
                  @view="openGuarantorDoc('IDENTIFICATION')"
                  @edit="setGuarantorSubStep(1)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('RESIDENCY')">
                <div class="subtitle">Justificatif de domicile</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('RESIDENCY')"
                  @view="openGuarantorDoc('RESIDENCY')"
                  @edit="setGuarantorSubStep(2)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('PROFESSIONAL')">
                <div class="subtitle">
                  Justificatif de situation professionelle
                </div>
                <ViewEditBtn
                  :canView="guarantorHasFile('PROFESSIONAL')"
                  @view="openGuarantorDoc('PROFESSIONAL')"
                  @edit="setGuarantorSubStep(3)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('FINANCIAL')">
                <div class="subtitle">Justificatif de revenu</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('FINANCIAL')"
                  @view="openGuarantorDoc('FINANCIAL')"
                  @edit="setGuarantorSubStep(4)"
                ></ViewEditBtn>
              </div>
              <div class="row" v-if="guarantorHasDoc('TAX')">
                <div class="subtitle">Avis d’imposition</div>
                <ViewEditBtn
                  :canView="guarantorHasFile('TAX')"
                  @view="openGuarantorDoc('TAX')"
                  @edit="setGuarantorSubStep(5)"
                ></ViewEditBtn>
              </div>
            </section>
          </div>
        </div>
      </template>
    </NakedCard>
    <Modal v-show="isDocModalVisible" @close="isDocModalVisible = false">
      <template v-slot:body>
        <div class="rf-container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8">
              <div v-for="f in files" v-bind:key="f.id">
                <ShowDoc :file="f"></ShowDoc>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
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

@Component({
  components: { NakedCard, Modal, PdfViewer, ShowDoc, ViewEditBtn },
  computed: {
    ...mapState({
      user: "user",
      tenantStep: "tenantStep",
      selectedGuarantor: "selectedGuarantor",
    }),
  },
})
export default class EditSummary extends Vue {
  user!: User;
  selectedGuarantor!: Guarantor;
  isDocModalVisible = false;
  files: DfFile[] = [];

  setTenantStep(n: number) {
    this.$store.commit("setTenantSubstep", n);
    this.setStep(2);
  }

  setGuarantorSubStep(n: number) {
    this.$store.commit("setGuarantorSubstep", n);
    this.setStep(3);
  }

  setStep(n: number) {
    this.$store.commit("setStep", n);
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
  guarantorHasFile(docType: string) {
    return DocumentService.guarantorHasFile(this.selectedGuarantor, docType);
  }
  guarantorHasDoc(docType: string) {
    return DocumentService.guarantorHasDoc(this.selectedGuarantor, docType);
  }
  hasGuarantor(guarantorType: string) {
    return DocumentService.hasGuarantor(guarantorType);
  }
  openDoc(documentCategory: string) {
    this.files = DocumentService.getFiles(documentCategory);
    if (this.files.length > 0) {
      this.isDocModalVisible = true;
    }
  }
  openGuarantorDoc(documentCategory: string) {
    this.files = DocumentService.getGuarantorFiles(
      this.selectedGuarantor,
      documentCategory
    );
    if (this.files.length > 0) {
      this.isDocModalVisible = true;
    }
  }
}
</script>

<style scoped lang="scss">
.subtitle {
  font-weight: bold;
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
"GROUP": "En colocation"
},
"fr": {
"title": "Information du locataire",
"second-title": "Documents du locataire",
"third-title": "Documents du garant",
"ALONE": "Seul",
"COUPLE": "En couple",
"GROUP": "En colocation"
}
}
</i18n>
