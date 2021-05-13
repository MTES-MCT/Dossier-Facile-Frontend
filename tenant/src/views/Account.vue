<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-mt-3w">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <h1>{{ $t("title", [user.firstName, $t(user.status)]) }}</h1>
            <div class="fr-callout" v-if="isOld()">
              <h4>{{ $t("file-update-title") }}</h4>
              <p
                class="fr-callout__text"
                v-html="
                  $t('file-update-text', [
                    $d(getDate(user.lastUpdate), 'short')
                  ])
                "
              ></p>
              <DfButton @on-click="goToProfile" primary="true">{{
                $t("update-file-btn")
              }}</DfButton>
            </div>
            <div class="main fr-mt-5w fr-p-4w bg-white">
              <div class="main-bar fr-grid-row">
                <div class="header-title">
                  <h4 class="fr-mr-2w fr-mb-0 fr-mt-0">{{ $t("my-file") }}</h4>
                </div>

                <StatusTag :status="user.status"></StatusTag>

                <span class="spacer"></span>
                <DfButton
                  @on-click="copyLink()"
                  primary="true"
                  size="small"
                  :disabled="!canCopyLink()"
                  >{{ $t("copy-link") }}</DfButton
                >
                <div class="grp">
                  <input id="tokenLink" type="hidden" :value="getToken()" />
                  <button
                    class="fr-btn grp-btn"
                    :class="{
                      'fr-fi-arrow-down-s-line': !radioVisible,
                      'fr-fi-arrow-up-s-line': radioVisible
                    }"
                    title="Copy"
                    @click="radioVisible = !radioVisible"
                    :disabled="!canCopyLink()"
                  >
                    <span class="sr-only"> Copy </span>
                  </button>
                  <div class="grp-modal bg-white" v-show="radioVisible">
                    <h4 class="p10">{{ $t("share-file") }}</h4>

                    <div>
                      <fieldset class="fr-fieldset">
                        <div class="fr-fieldset__content">
                          <div class="fr-radio-group p10">
                            <input
                              type="radio"
                              id="radio-1"
                              name="radio"
                              v-model="pub"
                              value="true"
                            />
                            <label
                              class="fr-label"
                              for="radio-1"
                              v-html="$t('file-resume')"
                            ></label>
                          </div>
                          <hr />
                          <div class="fr-radio-group p10">
                            <input
                              type="radio"
                              id="radio-2"
                              name="radio"
                              v-model="pub"
                              value="false"
                            />
                            <label
                              class="fr-label"
                              for="radio-2"
                              v-html="$t('file-full')"
                            >
                            </label>
                          </div>
                          <div class="flex copy-btn">
                            <input type="text" :value="getToken()" readonly />
                            <DfButton
                              class="fr-ml-1w"
                              primary="true"
                              @on-click="copyLink()"
                              >{{ $t("copy") }}</DfButton
                            >
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-description">
                <p
                  class="description"
                  v-html="
                    $t('status-description', [
                      user.firstName,
                      getPersonnalStatus(),
                      getProfession(),
                      getIncome()
                    ])
                  "
                ></p>
              </div>
              <hr />
              <div class="main-information">
                <h4>{{ $t("my-personnal-information") }}</h4>
                <div
                  class="fr-grid-row fr-grid-row--gutters"
                  @click="setStep(0)"
                >
                  <div class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w">
                    <div class="fr-tile fr-tile--horizontal">
                      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                        <h4 class="fr-tile__title">
                          <a class="fr-tile__link" href>{{
                            $t("my-information")
                          }}</a>
                        </h4>
                        <div>
                          {{ user.firstName }} {{ user.lastName }}<br />
                          {{ user.email }}
                        </div>
                        <button
                          class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                          title="Edit"
                        >
                          <span class="sr-only"> Edit </span>
                        </button>
                      </div>
                      <div class="fr-tile__img-wrap fr-ml-2w">
                        <span class="color--primary material-icons md-adapt"
                          >person</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <h4>{{ $t("my-files") }}</h4>

                <div class="fr-grid-row fr-grid-row--gutters">
                  <div
                    class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                    @click="setTenantStep(1)"
                  >
                    <div class="fr-tile fr-tile--horizontal">
                      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                        <h4 class="fr-tile__title">
                          <a class="fr-tile__link" href>{{
                            $t("identification")
                          }}</a>
                        </h4>
                        <StatusTag
                          :status="getStatus('IDENTIFICATION')"
                        ></StatusTag>
                        <button
                          class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                          title="Edit"
                        >
                          <span class="sr-only"> Edit </span>
                        </button>
                      </div>
                      <div class="fr-tile__img-wrap fr-ml-2w">
                        <span class="color--primary material-icons md-adapt"
                          >person</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                    @click="setTenantStep(2)"
                  >
                    <div class="fr-tile fr-tile--horizontal">
                      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                        <h4 class="fr-tile__title">
                          <a class="fr-tile__link" href>{{
                            $t("residency")
                          }}</a>
                        </h4>
                        <StatusTag :status="getStatus('RESIDENCY')"></StatusTag>
                        <button
                          class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                          title="Edit"
                        >
                          <span class="sr-only"> Edit </span>
                        </button>
                      </div>
                      <div class="fr-tile__img-wrap fr-ml-2w">
                        <span class="color--primary material-icons md-adapt"
                          >home</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                    @click="setTenantStep(3)"
                  >
                    <div class="fr-tile fr-tile--horizontal">
                      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                        <h4 class="fr-tile__title">
                          <a class="fr-tile__link" href>{{
                            $t("professional")
                          }}</a>
                        </h4>
                        <StatusTag
                          :status="getStatus('PROFESSIONAL')"
                        ></StatusTag>
                        <button
                          class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                          title="Edit"
                        >
                          <span class="sr-only"> Edit </span>
                        </button>
                      </div>
                      <div class="fr-tile__img-wrap fr-ml-2w">
                        <span class="color--primary material-icons md-adapt"
                          >work</span
                        >
                      </div>
                    </div>
                  </div>

                  <div
                    class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                    @click="setTenantStep(4)"
                  >
                    <div class="fr-tile fr-tile--horizontal">
                      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                        <h4 class="fr-tile__title">
                          <a class="fr-tile__link" href>{{
                            $t("financial")
                          }}</a>
                        </h4>
                        <StatusTag :status="getStatus('FINANCIAL')"></StatusTag>
                        <button
                          class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                          title="Edit"
                        >
                          <span class="sr-only"> Edit </span>
                        </button>
                      </div>
                      <div class="fr-tile__img-wrap fr-ml-2w">
                        <span class="color--primary material-icons md-adapt"
                          >euro</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                    @click="setTenantStep(5)"
                  >
                    <div class="fr-tile fr-tile--horizontal">
                      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                        <h4 class="fr-tile__title">
                          <a class="fr-tile__link" href>{{ $t("tax") }}</a>
                        </h4>
                        <StatusTag :status="getStatus('TAX')"></StatusTag>
                        <button
                          class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                          title="Edit"
                        >
                          <span class="sr-only"> Edit </span>
                        </button>
                      </div>
                      <div class="fr-tile__img-wrap fr-ml-2w">
                        <span class="color--primary material-icons md-adapt"
                          >content_copy</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr v-if="user.guarantors.length > 0" />
              <div
                class="main-guarantor-information"
                v-if="user.guarantors.length > 0"
              >
                <h4>{{ $t("guarantors-information") }}</h4>

                <div v-for="g in user.guarantors" v-bind:key="g.id">
                  <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
                    <div class="fr-grid-row fr-grid-row--gutters">
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(1)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("identification")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >person</span
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(2)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("residency")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'RESIDENCY')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >home</span
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(3)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("professional")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'PROFESSIONAL')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >work</span
                            >
                          </div>
                        </div>
                      </div>

                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(4)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("financial")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'FINANCIAL')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >euro</span
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(5)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{ $t("tax") }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'TAX')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >content_copy</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="g.typeGuarantor === 'ORGANISM'">
                    <div class="fr-grid-row fr-grid-row--gutters">
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(1)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("organism-identification")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >person</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
                    <div class="fr-grid-row fr-grid-row--gutters">
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(1)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("identification-legal-person")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="
                                getGuarantorStatus(
                                  g,
                                  'IDENTIFICATION_LEGAL_PERSON'
                                )
                              "
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >person</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="fr-grid-row fr-grid-row--gutters">
                      <div
                        class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
                        @click="setGuarantorSubStep(2)"
                      >
                        <div class="fr-tile fr-tile--horizontal">
                          <div class="fr-tile__body fr-ml-2w fr-mr-2w">
                            <h4 class="fr-tile__title">
                              <a class="fr-tile__link" href>{{
                                $t("identification")
                              }}</a>
                            </h4>
                            <StatusTag
                              :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                            ></StatusTag>
                            <button
                              class="fr-btn fr-btn--secondary fr-fi-edit-line edit-btn"
                              title="Edit"
                            >
                              <span class="sr-only"> Edit </span>
                            </button>
                          </div>
                          <div class="fr-tile__img-wrap fr-ml-2w">
                            <span class="color--primary material-icons md-adapt"
                              >person</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="partners">
              <h2 class="fr-pt-4w fr-pb-2w">{{ $t("partners") }}</h2>
              <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-md-6 fr-col-12">
                  <a
                    class="cleana"
                    href="https://www.visale.fr/#!/"
                    target="_blank"
                  >
                    <div class="bg-white partner-box logo-visale"></div>
                  </a>
                </div>
                <div class="fr-col-md-6 fr-col-12">
                  <a
                    class="cleana"
                    href="https://www.anil.org/"
                    target="_blank"
                  >
                    <div class="bg-white partner-box logo-anil"></div>
                  </a>
                </div>
              </div>
            </div>
            <div class="delete">
              <h2 class="fr-pt-4w fr-pb-2w">{{ $t("delete") }}</h2>
              <div class="bg-white fr-p-4w">
                <p>
                  Vous pouvez supprimer votre compte DossierFacile à tout
                  moment. La suppression de votre compte entrainera
                  automatiquement l’effacement définitif de vos pièces
                  justificatives.
                </p>
                <div class="align--center">
                  <DfButton
                    class="delete-btn"
                    primary="true"
                    @on-click="openDeleteModal()"
                    >{{ $t("delete-account") }}</DfButton
                  >
                </div>
              </div>
            </div>
            <div class="opinion fr-mb-5w">
              <h2 class="fr-pt-4w fr-pb-2w">{{ $t("opinion") }}</h2>
              <div class="bg-white fr-p-4w">
                <p>
                  Nous cherchons constamment à améliorer la qualité de notre
                  service. Dans le cadre de cette démarche d’amélioration, nous
                  cherchons à obtenir votre retour d’expérience. En cliquant sur
                  le bouton ci-dessous, vous pourrez évaluer DossierFacile.fr.
                  Vos commentaires nous sont précieux ! Merci.
                </p>
                <div class="align--center">
                  <a
                    href="https://voxusagers.numerique.gouv.fr/Demarches/2871?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=f2f9b35326f6b085c219faef71d0a3f2"
                    target="_blank"
                  >
                    <img
                      src="https://voxusagers.numerique.gouv.fr/static/bouton-bleu.svg"
                      alt="Je donne mon avis"
                      title="Je donne mon avis sur cette démarche"
                      class="align--center"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ValidationObserver v-slot="{ validate }">
        <form name="form" @submit.prevent="validate().then(validDelete)">
          <ConfirmModal v-show="isDeleteModalVisible" @cancel="undoSelect()">
            <div class="fr-container">
              <div class="fr-grid-row justify-content-center">
                <div class="fr-col-12">
                  <div class="fr-col-12 fr-mb-3w">
                    <validation-provider rules="required" v-slot="{ errors }">
                      <div
                        class="fr-input-group"
                        :class="errors[0] ? 'fr-input-group--error' : ''"
                      >
                        <label for="password" class="fr-label">{{
                          $t("password")
                        }}</label>
                        <input
                          id="password"
                          type="password"
                          v-model="password"
                          name="password"
                          class="validate-required form-control fr-input"
                          required
                        />
                        <span class="fr-error-text" v-if="errors[0]">{{
                          $t(errors[0])
                        }}</span>
                      </div>
                    </validation-provider>
                  </div>
                </div>
              </div>
            </div>
          </ConfirmModal>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import DfButton from "df-shared/src/Button/Button.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import StatusTag from "df-shared/src/components/StatusTag.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    DfButton,
    NakedCard,
    StatusTag,
    ConfirmModal
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class Account extends Vue {
  TENANT_URL = `https://${process.env.VUE_APP_TENANT_URL}`;

  user!: User;
  radioVisible = false;
  pub = "false";
  isDeleteModalVisible = false;
  password = "";

  isOld() {
    // TODO
    return false;
  }

  getToken() {
    if (this.pub === "true") {
      return `${this.TENANT_URL}/public-file/${this.user.apartmentSharing?.tokenPublic}`;
    }
    return `${this.TENANT_URL}/file/${this.user.apartmentSharing?.token}`;
  }

  oldUpdateDocument() {
    // TODO
    const now = new Date();
    const lastMonth = new Date(now.getDate() - 30);
    const lastUpdate = new Date(this.user.lastUpdate || new Date());
    return lastUpdate < lastMonth;
  }

  isStudent() {
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    });
    return doc?.documentSubCategory === "STUDENT";
  }

  getStatus(docType: string) {
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus;
  }

  getGuarantorStatus(g: Guarantor, docType: string) {
    const doc = g.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus;
  }

  goToProfile() {
    this.$router.push("/profile");
  }

  getDate(d: Date) {
    // FIXME we should remove getDate and only use user.lastUpdate
    if (!d) {
      d = new Date();
    }
    return d;
  }

  shareMail() {
    // TODO
  }

  copyLink() {
    const tl = document.querySelector("#tokenLink") as HTMLInputElement;

    tl?.setAttribute("type", "text");
    tl?.select();

    try {
      document.execCommand("copy");
      this.$toasted.show(this.$i18n.t("copied").toString(), {
        type: "success",
        duration: 3000
      });
    } catch (err) {
      alert("Oops, unable to copy");
    }
    tl?.setAttribute("type", "hidden");
  }

  openDeleteModal() {
    this.isDeleteModalVisible = true;
  }

  validDelete() {
    this.isDeleteModalVisible = false;
    this.$store.dispatch("deleteAccount", this.password).then(null, () => {
      this.$toasted.show(this.$i18n.t("try-again").toString(), {
        type: "error",
        duration: 7000
      });
    });
  }

  undoSelect() {
    this.isDeleteModalVisible = false;
    return false;
  }

  setStep(n: number) {
    this.$store.commit("setStep", n);
    this.$router.push("/profile");
    return false;
  }

  setTenantStep(n: number) {
    this.$store.commit("setTenantSubstep", n);
    this.setStep(2);
  }

  setGuarantorSubStep(n: number) {
    this.$store.commit("setGuarantorSubstep", n);
    this.setStep(3);
  }

  getPersonnalStatus() {
    if (
      this.user?.apartmentSharing?.tenants !== undefined &&
      this.user.applicationType !== "ALONE"
    ) {
      if (this.user.applicationType === "COUPLE") {
        const spouse = this.user?.apartmentSharing?.tenants?.find((t: User) => {
          return t.id !== this.user?.id;
        });
        if (spouse?.lastName !== undefined && spouse?.lastName !== "") {
          return this.$i18n
            .t("couple-with", [`${spouse?.firstName} ${spouse?.lastName}`])
            .toString();
        }
        return this.$i18n
          .t("couple-with", [this.$i18n.t("someone")])
          .toString();
      }
      if (this.user?.apartmentSharing?.tenants.length === 2) {
        return this.$i18n.t("group-with-one").toString();
      }
      return this.$i18n
        .t("group-with", [this.user?.apartmentSharing?.tenants.length - 1])
        .toString();
    }
    return this.$i18n.t("ALONE");
  }

  getProfession() {
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    });
    return this.$i18n.t(doc?.documentSubCategory || "none");
  }

  getIncome() {
    const sum = this.user.documents
      ?.filter((d: DfDocument) => {
        return d.documentCategory === "FINANCIAL";
      })
      .reduce((sum, current) => sum + (current.monthlySum || 0), 0);
    if (sum === 0) {
      return this.$i18n.t("no-income");
    }
    return this.$i18n.t("income", [sum]);
  }

  canCopyLink() {
    return (
      this.user.status === "VALIDATED" &&
      this.user.apartmentSharing?.tokenPublic !== undefined &&
      this.user.apartmentSharing?.tokenPublic !== ""
    );
  }
}
</script>

<style scoped lang="scss">
.main-bar {
  display: flex;
}

.main {
  background-color: var(--w);
}

.bg-blue {
  width: 100%;
  background-color: var(--bf100-g750);
}

.fr-callout {
  background-color: var(--w);
}

h1 {
  color: var(--bf500);
  font-size: 2rem;
}

h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: var(--w);
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.visale-img {
  max-height: 72px;
  margin: auto;
  margin-top: 14px;
  margin-bottom: 14px;
}

.logo-anil {
  background-image: url("../assets/anil_grey.webp");
  &:hover {
    background-image: url("../assets/anil.webp");
  }
  background-repeat: no-repeat;
  background-position: center;
}

.logo-visale {
  background-image: url("../assets/visale_grey.webp");
  &:hover {
    background-image: url("../assets/visale.webp");
  }
  background-repeat: no-repeat;
  background-position: center;
}

.partners .bg-white {
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--w);
  position: relative;
}

.p10 {
  padding-left: 10px;
  padding-right: 10px;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;
  width: max-content;
  padding: 0;

  &:before {
    top: -16px;
    right: 9px;
    left: auto;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
    position: absolute;
    display: inline-block;
    content: "";
  }
}

.copy-btn {
  margin: 0;
  padding: 1rem;
  background-color: #f2f2f9;
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

.material-icons.md-adapt {
  font-size: 48px;
}

.fr-tag {
  padding: 0.375rem 1rem;
}

.header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.partner-box {
  height: 196px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Hello {0}, your file {1}",
    "status-description":"{0}, you are {1}, {2} and {3}.<br>if your situation has changed, please update your documents !",
    "last-update": "Dernière mise à jour du dossier le {0}",
    "file-update-title": "File update",
    "file-update-text": "Vous avez mis à jour votre dossier, pour la dernière fois le {0}.<br> Afin qu'il reste convaincant, il est important de maintenir à jour vos justificatifs.",
    "update-file-btn": "Update my documents",
    "copy-link":"Copy my file link",
    "share-by-mail": "Share by mail",
    "my-file": "My rent file",
    "my-personnal-information": "My personnal information",
    "my-information": "My information",
    "my-files": "My documents",
    "identification": "Identification",
    "residency": "Residency",
    "professional": "Professional",
    "financial": "Financial",
    "tax": "Tax",
    "representative-identification": "Representative identification",
    "corporation-identification": "Corporation identification",
    "guarantor": "Guarantor",
    "guarantors-information": "My guarantors information",
    "TO_PROCESS":"s to process",
    "VALIDATED":"is validated",
    "DECLINED":"is declined",
    "INCOMPLETE":"is incomplete",
    "partners": "Our partners",
    "delete": "Deletion of my account",
    "opinion": "Tell us about your experience DossierFacile.fr",
    "delete-account": "Delete my account",
    "share-file": "Share my file",
    "file-resume": "Share resumed file <br>(without supporting document)",
    "file-full": "Share full file <br>(with supporting document)",
    "copy": "Copy",
    "password": "Please enter your password to confirm the complete deletion of the account",
    "try-again": "An error occured, please try again later.",
    "field-required": "This field is required",
    "CDI": "CDI",
    "CDI_TRIAL": "CDI (période d’essai)",
    "CDD": "CDD",
    "ALTERNATION": "Alternance",
    "INTERNSHIP": "Stage",
    "STUDENT": "Études",
    "PUBLIC": "Fonction publique",
    "CTT": "CTT (intérimaire)",
    "RETIRED": "Retraité",
    "UNEMPLOYED": "Chômage",
    "INDEPENDENT": "Indépendant",
    "OTHER": "Autre",
    "no-income": "have no income",
    "income": "have a monthly income of {0}€",
    "identification-legal-person": "Legal person identification",
    "copied": "Copied !",
    "ALONE": "alone",
    "couple-with": "in relationship with {0}",
    "organism-identification": "Organism",
    "someone": " someone",
    "group-with-one": "in flatsharing with 1 person",
    "group-with": "in flatsharing with {0} persons"
  },
  "fr": {
    "title": "Bonjour {0}, votre dossier {1} !",
    "status-description":"{0}, vous avez indiqué être {1}, {2} et {3}.<br>Si votre situation a changé, mettez à jour vos documents !",
    "last-update": "Dernière mise à jour du dossier le {0}",
    "file-update-title": "Mise à jour de votre dossier",
    "file-update-text": "Vous avez mis à jour votre dossier, pour la dernière fois le {0}.<br> Afin qu'il reste convaincant, il est important de maintenir à jour vos justificatifs.",
    "update-file-btn": "Mettre à jour mes documents",
    "copy-link":"Copier mon lien dossier",
    "share-by-mail": "Partager par mail",
    "my-file": "Mon dossier de location",
    "my-personnal-information": "Mes informations personnelles",
    "my-information": "Mes informations",
    "my-files": "Mes pièces justificatives",
    "identification": "Pièce d'identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionnelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "representative-identification": "Identité de la personne morale",
    "corporation-identification": "Identité du représentant de la personne morale",
    "guarantor": "Garant",
    "guarantors-information": "Les informations de mes garants",
    "TO_PROCESS":"est en cours de traitement",
    "VALIDATED":"est vérifié",
    "DECLINED":"nécessite une modification",
    "INCOMPLETE":"est non terminé",
    "partners": "Nos partenaires",
    "delete": "Suppression de mon compte",
    "opinion": "Racontez-nous votre expérience DossierFacile.fr",
    "delete-account": "Supprimer mon compte",
    "share-file": "Partager mon dossier",
    "file-resume": "Partager mon dossier de synthèse <br>(sans pièce justificative)",
    "file-full": "Partager mon dossier complet<br>(avec pièces justificatives)",
    "copy": "Copier",
    "password": "Veuillez saisir votre mot de passe pour confirmer la suppression complète du compte",
    "try-again": "Une erreur est survenue, veuillez réessayer plus tard.",
    "field-required": "Ce champ est requis",
    "CDI": "en CDI",
    "CDI_TRIAL": "en CDI (période d’essai)",
    "CDD": "en CDD",
    "ALTERNATION": "en alternance",
    "INTERNSHIP": "en stage",
    "STUDENT": "étudiant",
    "PUBLIC": "dans la fonction publique",
    "CTT": "en CTT (intérimaire)",
    "RETIRED": "retraité",
    "UNEMPLOYED": "au chômage",
    "INDEPENDENT": "indépendant",
    "OTHER": "Autre",
    "no-income": "ne pas avoir de revenu",
    "income": "avoir un revenu net mensuel de {0}€",
    "identification-legal-person": "Identification de la personne morale",
    "copied": "Copié !",
    "ALONE": "seul·e",
    "couple-with": "en couple avec {0}",
    "group-with-one": "en colocation avec 1 personne",
    "group-with": "en colocation avec {0} personnes",
    "organism-identification": "Certificat de l'organisme",
    "someone": " quelqu'un"
  }
}
</i18n>
