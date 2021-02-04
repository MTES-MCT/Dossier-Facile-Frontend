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
                <div class="edit-step-btn" @click="setStep(0)">
                  <span class="color--primary material-icons md-18">edit</span>
                </div>
              </div>
              <div class="row" v-if="user.applicationType">
                <div>
                  <div class="subtitle">Type de location</div>
                  {{ $t(user.applicationType) }}
                </div>
                <div class="edit-step-btn" @click="setStep(1)">
                  <span class="color--primary material-icons md-18">edit</span>
                </div>
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
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openDoc('IDENTIFICATION')"
                    v-if="hasFile('IDENTIFICATION')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setTenantStep(1)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('RESIDENCY')">
                <div class="subtitle">Justificatif de domicile</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openDoc('RESIDENCY')"
                    v-if="hasFile('RESIDENCY')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setTenantStep(2)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('PROFESSIONAL')">
                <div class="subtitle">
                  Justificatif de situation professionelle
                </div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openDoc('PROFESSIONAL')"
                    v-if="hasFile('PROFESSIONAL')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setTenantStep(3)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('FINANCIAL')">
                <div class="subtitle">Justificatif de revenu</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openDoc('FINANCIAL')"
                    v-if="hasFile('FINANCIAL')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setTenantStep(4)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('TAX')">
                <div class="subtitle">Avis d’imposition</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openDoc('TAX')"
                    v-if="hasFile('TAX')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setTenantStep(5)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasGuarantor()">
          <a href="#" class="rf-link">
            {{ $t("third-title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row" v-if="guarantorHasDoc('IDENTIFICATION')">
                <div class="subtitle">Pièce d’identité</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openGuarantorDoc('IDENTIFICATION')"
                    v-if="guarantorHasFile('IDENTIFICATION')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(1)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="guarantorHasDoc('RESIDENCY')">
                <div class="subtitle">Justificatif de domicile</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openGuarantorDoc('RESIDENCY')"
                    v-if="guarantorHasFile('RESIDENCY')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="guarantorHasDoc('PROFESSIONAL')">
                <div class="subtitle">
                  Justificatif de situation professionelle
                </div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openGuarantorDoc('PROFESSIONAL')"
                    v-if="guarantorHasFile('PROFESSIONAL')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(3)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="guarantorHasDoc('FINANCIAL')">
                <div class="subtitle">Justificatif de revenu</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openGuarantorDoc('FINANCIAL')"
                    v-if="guarantorHasFile('FINANCIAL')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(4)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
              </div>
              <div class="row" v-if="guarantorHasDoc('TAX')">
                <div class="subtitle">Avis d’imposition</div>
                <div class="row">
                  <div
                    class="edit-step-btn"
                    @click="openGuarantorDoc('TAX')"
                    v-if="guarantorHasFile('TAX')"
                  >
                    <span class="color--primary material-icons md-18"
                      >visibility</span
                    >
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(5)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
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

@Component({
  components: { NakedCard, Modal, PdfViewer, ShowDoc },
  computed: {
    ...mapState({
      user: "user",
      tenantStep: "tenantStep",
      selectedGuarantor: "selectedGuarantor"
    })
  }
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

  setGuarantorStep(n: number) {
    this.$store.commit("setGuarantorSubstep", n);
    this.setStep(3);
  }

  setStep(n: number) {
    this.$store.commit("setStep", n);
  }
  hasDocument() {
    return this.user.documents !== undefined && this.user.documents?.length > 0;
  }
  hasDoc(docType: string) {
    return this.user.documents?.find(d => {
      return d.documentCategory === docType;
    });
  }
  hasFile(docType: string) {
    const document = this.hasDoc(docType);
    return (document?.files?.length || 0) > 0;
  }
  guarantorHasFile(docType: string) {
    const document = this.guarantorHasDoc(docType);
    return (document?.files?.length || 0) > 0;
  }
  guarantorHasDoc(docType: string) {
    return this.selectedGuarantor.documents?.find(d => {
      return d.documentCategory === docType;
    });
  }
  hasGuarantor() {
    return (
      this.selectedGuarantor?.documents !== undefined &&
      this.selectedGuarantor.documents.length > 0
    );
  }

  openDoc(documentCategory: string) {
    const docs = this.user.documents?.filter(d => {
      return d.documentCategory === documentCategory;
    });
    this.files = [];
    if (docs === undefined) {
      return;
    }
    for (let i = 0; i < docs.length; i++) {
      this.files = this.files.concat(docs[i].files || []);
    }
    this.isDocModalVisible = true;
  }

  openGuarantorDoc(documentCategory: string) {
    const docs = this.selectedGuarantor.documents?.filter(d => {
      return d.documentCategory === documentCategory;
    });
    this.files = [];
    if (docs === undefined) {
      return;
    }
    for (let i = 0; i < docs.length; i++) {
      this.files = this.files.concat(docs[i].files || []);
    }
    this.isDocModalVisible = true;
  }

  isImage(path: string) {
    return !path.endsWith("pdf");
  }

  getUrl(path: string) {
    return `//${process.env.VUE_APP_API_URL}/api/file/tenants_file/${path}`;
  }
}
</script>

<style scoped lang="scss">
.row {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  div {
    align-self: center;
  }
}
.edit-step-btn {
  align-self: center;
  padding: 0.2rem;
  cursor: pointer;
}
.subtitle {
  font-weight: bold;
}

.material-icons.md-18 {
  padding: 0.2rem;
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
