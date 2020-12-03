<template>
  <div class="rf-container">
    <div class="rf-grid-row">
      <div class="rf-col-lg-4">
        <NakedCard>
          <template v-slot:content>
            <ul class="menu-vertical">
              <li>
                <a href="#">Pièce d'identité</a>
                <a href="#">
                  <span class="icon icon-Eye"></span>
                </a>
                <span
                  class="icon icon-Hour text-warning text-success"
                ></span>
                <span
                  class="icon icon-Close text-danger"
                ></span>
                <span
                  class="icon icon-Yes text-success"
                ></span>
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
                  <span class="btn__text icon icon-Eye icon--xs"></span>
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
                  <span class="btn__text icon icon-Eye icon--xs"></span>
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
                  <span class="btn__text icon icon-Eye icon--xs"></span>
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
                  <span class="btn__text icon icon-Eye icon--xs"></span>
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
                    >Pièce di'identité</a
                  >
                  <a
                    class="nounderline"
                    id="link-file-6"
                    target="_blank"
                    th:href="${tenant.getGuarantor().getUpload1Route()}"
                  >
                    <span class="btn__text icon icon-Eye icon--xs"></span>
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
                    <span class="btn__text icon icon-Eye icon--xs"></span>
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
                    <span class="btn__text icon icon-Eye icon--xs"></span>
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
                    <span class="btn__text icon icon-Eye icon--xs"></span>
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
                    <span class="btn__text icon icon-Eye icon--xs"></span>
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
                    <span class="btn__text icon icon-Eye icon--xs"></span>
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
              <i class="icon icon-Yes big-icon text-success rf-col-3 rf-p-2w"></i>
              <div class="rf-col-9 rf-p-2w">
                Votre pièce est validée ! Plus besoin d’y toucher
              </div>
            </div>
          </template>
        </NakedCard>
        <NakedCard>
          <template v-slot:content>
            <div class="rf-grid-row">
              <i class="icon icon-Hour big-icon text-warning rf-col-3 rf-p-2w"></i>
              <div class="rf-col-9 rf-p-2w">
                Nous sommes en cours de traitement de cette pièce
              </div>
            </div>
          </template>
        </NakedCard>
        <NakedCard>
          <template v-slot:content>
            <div class="rf-grid-row">
              <i class="icon icon-Close big-icon text-danger rf-col-3 rf-p-2w"></i>
              <div class="rf-col-9 rf-p-2w">
                Vous devez modifier votre pièce afin que nous validions votre
                dossier
              </div>
            </div>
          </template>
        </NakedCard>
      </div>

      <div class="rf-col-lg-8">
        <div class="conversation__head boxed boxed--lg bg-orange">
          <h4 class="text-white">Conversation</h4>
          <span class="text-white">Conversation</span>
        </div>
        <div
          class="conversation__reply boxed boxed--border"
          th:if="${tenant.getTenantFileStatus().name() != 'VALIDATED'}"
        >
          <form
            id="messageForm"
            th:action="@{/message/new}"
            th:method="post"
            th:object="${message}"
          >
            <div class="row">
              <div class="col-12">
                <textarea
                  autocomplete="off"
                  autofocus="autofocus"
                  id="message"
                  placeholder="Tapez votre message ici"
                  required="required"
                  rows="4"
                  th:field="*{message}"
                  type="text"
                ></textarea>
              </div>
              <div class="col-md-4">
                <button class="btn" id="formChat" type="submit">
                  Répondre
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="comments conversation__comments">
          <ul class="comments__list" id="messageArea">
            <th:block th:each="messageIt: ${messages}">
              <li>
                <div class="comment" th:if="${messageIt.getFromUser()!=null}">
                  <div class="comment__body w-100">
                    <h5 class="type--fine-print" th:text="${name}"></h5>

                    <div class="comment__meta">
                      <span
                        th:text="${#temporals.format(messageIt.getCreationDateTime(), 'dd MMMM YYYY, hh:mm a')}"
                      ></span>
                    </div>

                    <p th:utext="${messageIt.message}"></p>
                  </div>
                </div>

                <div class="comment" th:if="${messageIt.getFromUser()==null}">
                  <div class="comment__avatar">
                    <img
                      alt="Image"
                      src="/assets/images/marie.jpg"
                      th:unless="${messageIt.customMessage}"
                    />
                  </div>
                  <div
                    class="comment__body"
                    th:classappend="${messageIt.customMessage}?'w-100':''"
                  >
                    <h5 class="type--fine-print">DossierFacile</h5>

                    <div class="comment__meta">
                      <span
                        th:text="${#temporals.format(messageIt.getCreationDateTime(), 'dd MMMM YYYY, hh:mm a')}"
                      ></span>
                    </div>

                    <p th:utext="${messageIt.message}"></p>
                  </div>
                </div>
                <!--end comment-->
              </li>
            </th:block>
          </ul>
        </div>
        <!--end comments-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import NakedCard from "../components/NakedCard.vue";

@Component({
  components: { NakedCard },
})
export default class Messages extends Vue {
  hasOwnGuarantor() {
    // TODO
    return true;
  }

  hasVisaleGuarantor() {
    // TODO
    return true;
  }
}
</script>

<style lang="scss" scoped>
.big-icon {
  font-size: 3em;
}
</style>