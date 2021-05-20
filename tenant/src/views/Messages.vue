<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-lg-4">
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <template v-slot:content>
            <div class="fr-card__desc">
              <section>
                <div class="row" v-if="hasDoc('IDENTIFICATION')">
                  <div class="subtitle">Pièce d’identité</div>
                  <div class="row align--center">
                    <ViewEditBtn
                      :canView="hasFile('IDENTIFICATION')"
                      @view="openDoc('IDENTIFICATION')"
                      @edit="setTenantStep(1)"
                    ></ViewEditBtn>
                    <FileStatusIcon
                      :status="getStatus('IDENTIFICATION')"
                    ></FileStatusIcon>
                  </div>
                </div>
                <div class="row" v-if="hasDoc('RESIDENCY')">
                  <div class="subtitle">Justificatif de domicile</div>
                  <div class="row align--center">
                    <ViewEditBtn
                      :canView="hasFile('RESIDENCY')"
                      @view="openDoc('RESIDENCY')"
                      @edit="setTenantStep(2)"
                    ></ViewEditBtn>
                    <FileStatusIcon
                      :status="getStatus('RESIDENCY')"
                    ></FileStatusIcon>
                  </div>
                </div>
                <div class="row" v-if="hasDoc('PROFESSIONAL')">
                  <div class="subtitle">
                    Justificatif de situation professionnelle
                  </div>
                  <div class="row align--center">
                    <ViewEditBtn
                      :canView="hasFile('PROFESSIONAL')"
                      @view="openDoc('PROFESSIONAL')"
                      @edit="setTenantStep(3)"
                    ></ViewEditBtn>
                    <FileStatusIcon
                      :status="getStatus('PROFESSIONAL')"
                    ></FileStatusIcon>
                  </div>
                </div>
                <div class="row" v-if="hasDoc('FINANCIAL')">
                  <div class="subtitle">Justificatif de ressources</div>
                  <div class="row align--center">
                    <ViewEditBtn
                      :canView="hasFile('FINANCIAL')"
                      @view="openDoc('FINANCIAL')"
                      @edit="setTenantStep(4)"
                    ></ViewEditBtn>
                    <FileStatusIcon
                      :status="getStatus('FINANCIAL')"
                    ></FileStatusIcon>
                  </div>
                </div>
                <div class="row" v-if="hasDoc('TAX')">
                  <div class="subtitle">Avis d’imposition</div>
                  <div class="row align--center">
                    <ViewEditBtn
                      :canView="hasFile('TAX')"
                      @view="openDoc('TAX')"
                      @edit="setTenantStep(5)"
                    ></ViewEditBtn>
                    <FileStatusIcon :status="getStatus('TAX')"></FileStatusIcon>
                  </div>
                </div>
              </section>
            </div>
          </template>
        </NakedCard>

        <div v-for="g in guarantors()" v-bind:key="g.id">
          <NakedCard
            v-if="g.typeGuarantor === 'NATURAL_PERSON'"
            class="fr-mt-3w fr-mb-2w"
          >
            <template v-slot:content>
              <div class="boxed boxed--lg boxed--border">
                <h5>Les documents de mon garant</h5>

                <div class="row" v-if="guarantorHasDoc(g, 'IDENTIFICATION')">
                  <div class="subtitle">Pièce d’identité</div>
                  <div class="row">
                    <div
                      class="edit-step-btn"
                      @click="openGuarantorDoc(g, 'IDENTIFICATION')"
                      v-if="guarantorHasFile(g, 'IDENTIFICATION')"
                    >
                      <span class="color--primary material-icons md-18"
                        >visibility</span
                      >
                    </div>
                    <div
                      class="edit-step-btn"
                      @click="setGuarantorSubStep(1, g)"
                    >
                      <span class="color--primary material-icons md-18"
                        >edit</span
                      >
                    </div>
                  </div>
                </div>
                <div class="row" v-if="guarantorHasDoc(g, 'RESIDENCY')">
                  <div class="subtitle">Justificatif de domicile</div>
                  <div class="row">
                    <div
                      class="edit-step-btn"
                      @click="openGuarantorDoc(g, 'RESIDENCY')"
                      v-if="guarantorHasFile(g, 'RESIDENCY')"
                    >
                      <span class="color--primary material-icons md-18"
                        >visibility</span
                      >
                    </div>
                    <div
                      class="edit-step-btn"
                      @click="setGuarantorSubStep(2, g)"
                    >
                      <span class="color--primary material-icons md-18"
                        >edit</span
                      >
                    </div>
                  </div>
                </div>
                <div class="row" v-if="guarantorHasDoc(g, 'PROFESSIONAL')">
                  <div class="subtitle">
                    Justificatif de situation professionnelle
                  </div>
                  <div class="row">
                    <div
                      class="edit-step-btn"
                      @click="openGuarantorDoc(g, 'PROFESSIONAL')"
                      v-if="guarantorHasFile(g, 'PROFESSIONAL')"
                    >
                      <span class="color--primary material-icons md-18"
                        >visibility</span
                      >
                    </div>
                    <div
                      class="edit-step-btn"
                      @click="setGuarantorSubStep(3, g)"
                    >
                      <span class="color--primary material-icons md-18"
                        >edit</span
                      >
                    </div>
                  </div>
                </div>
                <div class="row" v-if="guarantorHasDoc(g, 'FINANCIAL')">
                  <div class="subtitle">Justificatif de ressources</div>
                  <div class="row">
                    <div
                      class="edit-step-btn"
                      @click="openGuarantorDoc(g, 'FINANCIAL')"
                      v-if="guarantorHasFile(g, 'FINANCIAL')"
                    >
                      <span class="color--primary material-icons md-18"
                        >visibility</span
                      >
                    </div>
                    <div
                      class="edit-step-btn"
                      @click="setGuarantorSubStep(4, g)"
                    >
                      <span class="color--primary material-icons md-18"
                        >edit</span
                      >
                    </div>
                  </div>
                </div>
                <div class="row" v-if="guarantorHasDoc(g, 'TAX')">
                  <div class="subtitle">Avis d’imposition</div>
                  <div class="row">
                    <div
                      class="edit-step-btn"
                      @click="openGuarantorDoc(g, 'TAX')"
                      v-if="guarantorHasFile(g, 'TAX')"
                    >
                      <span class="color--primary material-icons md-18"
                        >visibility</span
                      >
                    </div>
                    <div
                      class="edit-step-btn"
                      @click="setGuarantorSubStep(5, g)"
                    >
                      <span class="color--primary material-icons md-18"
                        >edit</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </NakedCard>
          <NakedCard
            v-if="g.typeGuarantor === 'ORGANISM'"
            class="fr-mt-3w fr-mb-2w"
          >
            <template v-slot:content>
              <div class="boxed boxed--lg boxed--border">
                <h5>Les documents de mon garant</h5>

                <div class="row">
                  <div class="subtitle">{{ $t("organism") }}</div>
                  <ViewEditBtn
                    :canView="guarantorHasFile(g, 'IDENTIFICATION')"
                    @view="openGuarantorDoc(g, 'IDENTIFICATION')"
                    @edit="setGuarantorSubStep(1, g)"
                  ></ViewEditBtn>
                </div>
              </div>
            </template>
          </NakedCard>
          <NakedCard
            v-if="g.typeGuarantor === 'LEGAL_PERSON'"
            class="fr-mt-3w fr-mb-2w"
          >
            <template v-slot:content>
              <div class="boxed boxed--lg boxed--border">
                <h5>Les documents de mon garant</h5>
                <div class="row">
                  <div class="subtitle">
                    {{ $t("identification-legal-person") }}
                  </div>
                  <ViewEditBtn
                    :canView="
                      guarantorHasFile(g, 'IDENTIFICATION_LEGAL_PERSON')
                    "
                    @view="openGuarantorDoc(g, 'IDENTIFICATION_LEGAL_PERSON')"
                    @edit="setGuarantorSubStep(1, g)"
                  ></ViewEditBtn>
                </div>
                <div class="row">
                  <div class="subtitle">{{ $t("identity-represent") }}</div>
                  <ViewEditBtn
                    :canView="guarantorHasFile(g, 'IDENTIFICATION')"
                    @view="openGuarantorDoc(g, 'IDENTIFICATION')"
                    @edit="setGuarantorSubStep(2, g)"
                  ></ViewEditBtn>
                </div>
              </div>
            </template>
          </NakedCard>
        </div>
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <template v-slot:content>
            <div class="fr-grid-row">
              <div class="fr-col-3 fr-p-2w">
                <span class="text-success material-icons big-icon"
                  >check_circle_outline</span
                >
              </div>
              <div class="fr-col-9 fr-p-2w">
                Votre pièce est validée ! Plus besoin d’y toucher
              </div>
            </div>
          </template>
        </NakedCard>
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <template v-slot:content>
            <div class="fr-grid-row">
              <div class="fr-col-3 fr-p-2w">
                <span class="text-warning material-icons big-icon"
                  >more_time</span
                >
              </div>
              <div class="fr-col-9 fr-p-2w">
                Nous sommes en cours de traitement de cette pièce
              </div>
            </div>
          </template>
        </NakedCard>
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <template v-slot:content>
            <div class="fr-grid-row">
              <div class="fr-col-3 fr-p-2w">
                <span class="text-danger material-icons big-icon">cancel</span>
              </div>
              <div class="fr-col-9 fr-p-2w">
                Vous devez modifier votre pièce afin que nous validions votre
                dossier
              </div>
            </div>
          </template>
        </NakedCard>
      </div>

      <div class="fr-col-lg-8 fr-pl-5w fr-pr-3w">
        <div class="right-container">
          <div class="bg-orange fr-p-5w">
            <h4>Conversation</h4>
          </div>
          <div
            class="conversation__reply boxed boxed--border fr-p-3w"
            v-if="isNotValidated()"
          >
            <div class="messages fr-mb-3w">
              <div
                v-for="m in messageList"
                :key="m.id"
                class="message"
                :class="{
                  tenant: m.typeMessage === 'FROM_TENANT',
                  operator: m.typeMessage === 'TO_TENANT'
                }"
              >
                <p v-html="m.messageBody"></p>
                <div class="date">
                  {{ $d(new Date(m.creationDateTime), "long") }}
                </div>
              </div>
            </div>

            <form name="form" @submit.prevent="handleSubmit">
              <div class="fr-grid-row">
                <div class="fr-col-12 fr-mb-3w">
                  <div class="fr-input-group">
                    <textarea
                      v-model="sendMessage"
                      class="form-control fr-input"
                      autocomplete="off"
                      autofocus="autofocus"
                      id="sendMessage"
                      placeholder="Tapez votre message ici"
                      rows="4"
                      name="sendMessage"
                      type="text"
                    />
                  </div>
                </div>

                <div class="fr-col-12 fr-mb-5w">
                  <button class="fr-btn" type="submit" :disabled="!sendMessage">
                    Répondre
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import FileStatusIcon from "df-shared/src/components/FileStatusIcon.vue";
import { DocumentService } from "../services/DocumentService";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfMessage } from "df-shared/src/models/DfMessage";
import Modal from "df-shared/src/components/Modal.vue";
import PdfViewer from "../components/PdfViewer.vue";
import ShowDoc from "../components/documents/ShowDoc.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { DfDocument } from "df-shared/src/models/DfDocument";
import ViewEditBtn from "../components/ViewEditBtn.vue";

@Component({
  components: {
    NakedCard,
    Modal,
    PdfViewer,
    ShowDoc,
    FileStatusIcon,
    ViewEditBtn
  },
  computed: {
    ...mapState({
      user: "user",
      messageList: "messageList"
    })
  }
})
export default class Messages extends Vue {
  user!: User;
  messageList!: DfMessage[];
  sendMessage = "";
  files: DfFile[] = [];
  isDocModalVisible = false;

  mounted() {
    this.$store.commit("readMessage");
  }

  isNotValidated() {
    // TODO
    return true;
  }

  setTenantStep(n: number) {
    this.$store.commit("setTenantSubstep", n);
    this.setStep(2);
    this.$router.push("/profile");
  }

  setGuarantorSubStep(n: number, g: Guarantor) {
    this.$store.commit("setSelectedGuarantor", g);
    this.$store.commit("setGuarantorSubstep", n);
    this.setStep(3);
    this.$router.push("/profile");
  }

  setStep(n: number) {
    this.$store.commit("setStep", n);
  }

  guarantors() {
    return this.user.guarantors;
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
  guarantorHasFile(g: Guarantor, docType: string) {
    return DocumentService.guarantorHasFile(g, docType);
  }
  guarantorHasDoc(g: Guarantor, docType: string) {
    return DocumentService.guarantorHasDoc(g, docType);
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
  openGuarantorDoc(g: Guarantor, documentCategory: string) {
    this.files = DocumentService.getGuarantorFiles(g, documentCategory);
    if (this.files.length > 0) {
      this.isDocModalVisible = true;
    }
  }

  handleSubmit() {
    this.$store.dispatch("sendMessage", this.sendMessage).then(() => {
      this.sendMessage = "";
    });
  }

  getStatus(docType: string) {
    if (docType === "FINANCIAL") {
      const docs = this.user.documents?.filter(d => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus;
  }

  isFinancialValid(docs: any[]) {
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
}
</script>

<style lang="scss" scoped>
.big-icon {
  font-size: 3em;
}

.right-container {
  border: 1px solid #ececec;
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

.messages {
  max-height: 80vh;
  overflow-y: auto;
}

.message {
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: var(--g300);
  border-radius: 1rem;
}

.date {
  text-align: right;
  color: var(--g600);
  font-size: 0.8rem;
}

.tenant {
  max-width: 90%;
  margin-left: auto;
  background-color: var(--g200);
}

.operator {
  max-width: 90%;
}

.align--center {
  align-items: center;
}
</style>

<i18n>
{
  "en": {
    "identification-legal-person": "Legal person identity",
    "identity-represent": "Identity",
    "organism": "Organism"
  },
  "fr": {
    "identification-legal-person": "Identité personne morale",
    "identity-represent": "Identité représentant",
    "organism": "Organisme"
  }
}
</i18n>
