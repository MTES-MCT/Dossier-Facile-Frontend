<template>
  <div class="rf-container">
    <div class="rf-grid-row">
      <div class="rf-col-lg-4">
        <NakedCard>
          <template v-slot:content>
            <ul class="menu-vertical">
              <li>
                <a href="#">Pièce d'identité</a>
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
                  <div class="edit-step-btn" @click="setGuarantorSubStep(1)">
                    <span class="color--primary material-icons md-18"
                      >edit</span
                    >
                  </div>
                </div>
                <FileStatusIcon></FileStatusIcon>
              </li>
              <li>
                <a class="modal-file-button" data-id="2" href="#"
                  >Justificatif de domicile</a
                >
                <a
                  class="nounderline"
                  id="link-file-2"
                  target="_blank"
                  th:href="${tenant.getUpload2Route()}"
                >
                  <span class="material-icons">visibility</span>
                </a>
                <span
                  class="btn__text"
                  th:remove="tag"
                  th:replace="include/file-status-profile:: status-span(2)"
                ></span>
              </li>
              <li>
                <a class="modal-file-button" data-id="3" href="#"
                  >Contrat de travail</a
                >
                <a
                  class="nounderline"
                  id="link-file-3"
                  target="_blank"
                  th:href="${tenant.getUpload3Route()}"
                >
                  <span class="material-icons">visibility</span>
                </a>
                <span
                  class="btn__text"
                  th:remove="tag"
                  th:replace="include/file-status-profile:: status-span(3)"
                ></span>
              </li>
              <li>
                <a class="modal-file-button" data-id="4" href="#"
                  >Avis d'imposition</a
                >
                <a
                  class="nounderline"
                  id="link-file-4"
                  target="_blank"
                  th:href="${tenant.getUpload4Route()}"
                >
                  <span class="material-icons">visibility</span>
                </a>
                <span
                  class="btn__text"
                  th:remove="tag"
                  th:replace="include/file-status-profile:: status-span(4)"
                ></span>
              </li>
              <li>
                <a class="modal-file-button" data-id="5" href="#"
                  >Justificatif de ressources</a
                >
                <a
                  class="nounderline"
                  id="link-file-5"
                  target="_blank"
                  th:href="${tenant.getUpload5Route()}"
                >
                  <span class="material-icons">visibility</span>
                </a>
                <span
                  class="btn__text"
                  th:remove="tag"
                  th:replace="include/file-status-profile:: status-span(5)"
                ></span>
              </li>
            </ul>
          </template>
        </NakedCard>
        <NakedCard>
          <template v-slot:content>
            <div class="boxed boxed--lg boxed--border" v-if="hasOwnGuarantor()">
              <h5>Les documents de mon garant</h5>
              <ul class="menu-vertical">
                <li>
                  <a class="modal-file-button" data-id="6" href="#"
                    >Pièce d'identité</a
                  >
                  <a
                    class="nounderline"
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
                <li>
                  <a class="modal-file-button" data-id="7" href="#"
                    >Justificatif de domicile</a
                  >
                  <a
                    class="nounderline"
                    id="link-file-7"
                    target="_blank"
                    th:href="${tenant.getGuarantor().getUpload2Route()}"
                  >
                    <span class="material-icons">visibility</span>
                  </a>
                  <span
                    class="btn__text"
                    th:remove="tag"
                    th:replace="include/file-status-profile:: status-span(7)"
                  ></span>
                </li>
                <li>
                  <a class="modal-file-button" data-id="8" href="#"
                    >Contrat de travail</a
                  >
                  <a
                    class="nounderline"
                    id="link-file-8"
                    target="_blank"
                    th:href="${tenant.getGuarantor().getUpload3Route()}"
                  >
                    <span class="material-icons">visibility</span>
                  </a>
                  <span
                    class="btn__text"
                    th:remove="tag"
                    th:replace="include/file-status-profile:: status-span(8)"
                  ></span>
                </li>
                <li>
                  <a class="modal-file-button" data-id="9" href="#"
                    >Avis d'imposition</a
                  >
                  <a
                    class="nounderline"
                    id="link-file-9"
                    target="_blank"
                    th:href="${tenant.getGuarantor().getUpload4Route()}"
                  >
                    <span class="material-icons">visibility</span>
                  </a>
                  <span
                    class="btn__text"
                    th:remove="tag"
                    th:replace="include/file-status-profile:: status-span(9)"
                  ></span>
                </li>
                <li>
                  <a class="modal-file-button" data-id="10" href="#"
                    >Justificatif de ressources</a
                  >
                  <a
                    class="nounderline"
                    id="link-file-10"
                    target="_blank"
                    th:href="${tenant.getGuarantor().getUpload5Route()}"
                  >
                    <span class="material-icons">visibility</span>
                  </a>
                  <span
                    class="btn__text"
                    th:remove="tag"
                    th:replace="include/file-status-profile:: status-span(10)"
                  ></span>
                </li>
              </ul>
            </div>
          </template>
        </NakedCard>
        <NakedCard>
          <template v-slot:content>
            <div
              class="boxed boxed--lg boxed--border"
              v-if="hasVisaleGuarantor()"
            >
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

        <div>
          <ul>
            <li v-for="message in messages" v-bind:key="message.id">
              <div v-if="message.getFromUser">
                <div>
                  <h5>{{ message.name }}</h5>

                  <div>
                    <span>{{ message.creationDateTime }}</span>
                  </div>

                  <p>{{ message.message }}</p>
                </div>
              </div>

              <div v-if="!message.fromUser">
                <div>
                  <img
                    alt="Image"
                    src="@/assets/images/marie.jpg"
                    v-if="!message.customMessage"
                  />
                </div>
                <div>
                  <h5 class="type--fine-print">DossierFacile</h5>

                  <div class="comment__meta">
                    <span>{{ message.creationDateTime }}</span>
                  </div>

                  <p>{{ message.message }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import FileStatusIcon from "df-shared/src/components/FileStatusIcon.vue";

@Component({
  components: { NakedCard, FileStatusIcon }
})
export default class Messages extends Vue {
  // TODO update messages (and put in store)
  messages = [];
  sendMessage = "";

  hasOwnGuarantor() {
    // TODO
    return true;
  }

  hasVisaleGuarantor() {
    // TODO
    return true;
  }

  isNotValidated() {
    // TODO
    return true;
  }

  handleSubmit() {
    // TODO
    /*             th:action="@{/message/new}"
            th:method="post"
            th:object="${message}" */
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
</style>
