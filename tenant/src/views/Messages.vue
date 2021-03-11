<template>
  <div class="rf-container">
    <div class="rf-grid-row">
      <div class="rf-col-lg-4">
        <NakedCard>
          <template v-slot:content>
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
                    <FileStatusIcon></FileStatusIcon>
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
                    <FileStatusIcon></FileStatusIcon>
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
                    <FileStatusIcon></FileStatusIcon>
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
                    <FileStatusIcon></FileStatusIcon>
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
                    <FileStatusIcon></FileStatusIcon>
                  </div>
                </div>
              </section>
            </div>
          </template>
        </NakedCard>

        <div v-for="g in guarantors()" v-bind:key="g.id">
          <NakedCard v-if="g.typeGuarantor === 'NATURAL_PERSON'">
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
                    Justificatif de situation professionelle
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
                  <div class="subtitle">Justificatif de revenu</div>
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
          <NakedCard v-if="g.typeGuarantor === 'ORGANISM'">
            <template v-slot:content>
              <div class="boxed boxed--lg boxed--border">
                <h5>Les documents de mon garant</h5>
                <ul class="menu-vertical">
                  <li>
                    <a class="modal-file-button" data-id="6" href="#">Visa</a>
                    <a
                      id="link-file-6"
                      target="_blank"
                      th:href="${tenant.getGuarantor().getUpload1Route()}"
                    >
                      <span class="material-icons">visibility</span>
                    </a>
                    <span
                      class="btn__text"
                      th:remove="tag"
                      th:replace="include/file-status-profile:: status-span(6)"
                    ></span>
                  </li>
                </ul>
              </div>
            </template>
          </NakedCard>
          <NakedCard v-if="g.typeGuarantor === 'LEGAL_PERSON'">
            <template v-slot:content>
              <div class="boxed boxed--lg boxed--border">
                <h5>Les documents de mon garant</h5>
                <ul class="menu-vertical">
                  <li>
                    <a class="modal-file-button" data-id="6" href="#">Visa</a>
                    <a
                      id="link-file-6"
                      target="_blank"
                      th:href="${tenant.getGuarantor().getUpload1Route()}"
                    >
                      <span class="material-icons">visibility</span>
                    </a>
                    <span
                      class="btn__text"
                      th:remove="tag"
                      th:replace="include/file-status-profile:: status-span(6)"
                    ></span>
                  </li>
                </ul>
              </div>
            </template>
          </NakedCard>
        </div>
        <NakedCard>
          <template v-slot:content>
            <div class="rf-grid-row">
              <div class="rf-col-3 rf-p-2w">
                <span class="text-success material-icons big-icon"
                  >check_circle_outline</span
                >
              </div>
              <div class="rf-col-9 rf-p-2w">
                Votre pièce est validée ! Plus besoin d’y toucher
              </div>
            </div>
          </template>
        </NakedCard>
        <NakedCard>
          <template v-slot:content>
            <div class="rf-grid-row">
              <div class="rf-col-3 rf-p-2w">
                <span class="text-warning material-icons big-icon"
                  >more_time</span
                >
              </div>
              <div class="rf-col-9 rf-p-2w">
                Nous sommes en cours de traitement de cette pièce
              </div>
            </div>
          </template>
        </NakedCard>
        <NakedCard>
          <template v-slot:content>
            <div class="rf-grid-row">
              <div class="rf-col-3 rf-p-2w">
                <span class="text-danger material-icons big-icon">cancel</span>
              </div>
              <div class="rf-col-9 rf-p-2w">
                Vous devez modifier votre pièce afin que nous validions votre
                dossier
              </div>
            </div>
          </template>
        </NakedCard>
      </div>

      <div class="rf-col-lg-8 rf-pl-5w rf-pr-3w">
        <div class="right-container">
          <div class="bg-orange rf-p-5w">
            <h4>Conversation</h4>
          </div>
          <div
            class="conversation__reply boxed boxed--border rf-p-3w"
            v-if="isNotValidated()"
          >
            <div class="messages rf-mb-3w">
              <div
                v-for="m in messageList"
                :key="m.id"
                class="message"
                :class="{
                  tenant: m.typeMessage === 'FROM_TENANT',
                  operator: m.typeMessage === 'TO_TENANT',
                }"
              >
                <p v-html="m.messageBody"></p>
                <div class="date">
                  {{ $d(new Date(m.creationDateTime), "long") }}
                </div>
              </div>
            </div>

            <form name="form" @submit.prevent="handleSubmit">
              <div class="rf-grid-row">
                <div class="rf-col-12 rf-mb-3w">
                  <div class="rf-input-group">
                    <textarea
                      v-model="sendMessage"
                      class="form-control rf-input"
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

                <div class="rf-col-12 rf-mb-5w">
                  <button class="rf-btn" type="submit" :disabled="!sendMessage">
                    Répondre
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Modal v-show="isDocModalVisible" @close="isDocModalVisible = false">
      <template v-slot:body>
        <div class="rf-container">
          <div class="rf-grid-row justify-content-center">
            <div class="rf-col-12">
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

@Component({
  components: { NakedCard, Modal, PdfViewer, ShowDoc, FileStatusIcon },
  computed: {
    ...mapState({
      user: "user",
      messageList: "messageList",
    }),
  },
})
export default class Messages extends Vue {
  user!: User;
  messageList!: DfMessage[];
  sendMessage = "";
  files: DfFile[] = [];
  isDocModalVisible = false;

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
</style>
