<template>
  <div class="rf-container-fluid">
    <section class="rf-mt-3w">
      <div class="rf-grid-row rf-grid-row--center">
        <div class="rf-col-12 rf-col-lg-10">
          <h1>{{ $t("title", [user.firstName, $t(user.status)]) }}</h1>
          <div class="rf-callout" v-if="isOld()">
            <h4>{{ $t("file-update-title") }}</h4>
            <p
              class="rf-callout__text"
              v-html="
                $t('file-update-text', [$d(getDate(user.lastUpdate), 'short')])
              "
            ></p>
            <DfButton @on-click="goToProfile" primary="true">{{
              $t("update-file-btn")
            }}</DfButton>
          </div>
          <div class="main rf-mt-5w rf-p-2w bg-white">
            <div class="main-bar rf-grid-row">
              <h4 class="rf-mr-2w rf-mb-0 rf-mt-0">{{ $t("my-file") }}</h4>

              <StatusTag :status="user.status"></StatusTag>

              <span class="spacer"></span>
              <DfButton @on-click="copyLink()" primary="true" size="small">{{
                $t("copy-link")
              }}</DfButton>
              <div class="grp">
                <input id="tokenLink" type="hidden" :value="getToken()" />
                <button
                  class="rf-btn grp-btn"
                  :class="{
                    'rf-fi-arrow-down-s-line': !radioVisible,
                    'rf-fi-arrow-up-s-line': radioVisible,
                  }"
                  title="Label bouton MD"
                  @click="radioVisible = !radioVisible"
                >
                  <span class="sr-only"> Label bouton MD </span>
                </button>
                <div class="grp-modal bg-white" v-show="radioVisible">
                  <h4>{{ $t("share-file") }}</h4>

                  <div class="rf-form-group">
                    <fieldset class="rf-fieldset">
                      <div class="rf-fieldset__content">
                        <div class="rf-radio-group">
                          <input
                            type="radio"
                            id="radio-1"
                            name="radio"
                            v-model="pub"
                            value="true"
                          />
                          <label
                            class="rf-label"
                            for="radio-1"
                            v-html="$t('file-resume')"
                          ></label>
                        </div>
                        <hr />
                        <div class="rf-radio-group">
                          <input
                            type="radio"
                            id="radio-2"
                            name="radio"
                            v-model="pub"
                            value="false"
                          />
                          <label
                            class="rf-label"
                            for="radio-2"
                            v-html="$t('file-full')"
                          >
                          </label>
                        </div>
                        <div class="flex copy-btn">
                          <input type="text" :value="getToken()" readonly />
                          <DfButton
                            class="rf-ml-1w"
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
              Vous avez indiqué être en cdd etc.
            </div>
            <hr />
            <div class="main-information">
              <h4>{{ $t("my-personnal-information") }}</h4>
              <div class="rf-grid-row rf-grid-row--gutters">
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{
                          $t("my-information")
                        }}</a>
                      </h4>
                      <StatusTag
                        :status="getStatus('IDENTIFICATION')"
                      ></StatusTag>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <h4>{{ $t("my-files") }}</h4>

              <div class="rf-grid-row rf-grid-row--gutters">
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{
                          $t("identification")
                        }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{ $t("residency") }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{
                          $t("professional")
                        }}</a>
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{ $t("financial") }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{ $t("tax") }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="main-guarantor-information">
              <h4>{{ $t("guarantors-information") }}</h4>
              <div class="rf-grid-row rf-grid-row--gutters">
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{
                          $t("my-information")
                        }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rf-grid-row rf-grid-row--gutters">
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{
                          $t("identification")
                        }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{ $t("residency") }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{
                          $t("professional")
                        }}</a>
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{ $t("financial") }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="rf-col-6 rf-col-xl-4 rf-pt-1w">
                  <div class="rf-tile rf-tile--horizontal">
                    <div class="rf-tile__img-wrap">
                      <img
                        src="https://place-hold.it/80x80"
                        titre="Texte alternatif à l‘image"
                        alt="Texte alternatif à l‘image"
                      />
                    </div>
                    <div class="rf-tile__body">
                      <h4 class="rf-tile__title">
                        <a class="rf-tile__link" href>{{ $t("tax") }}</a>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="partners">
            <h2>{{ $t("partners") }}</h2>
            <div class="rf-grid-row rf-grid-row--gutters">
              <div class="rf-col">
                <div class="bg-white">
                  <img class="visale-img" src="../assets/visale_grey.webp" />
                </div>
              </div>
              <div class="rf-col">
                <div class="bg-white">
                  <img class="anil-img" src="../assets/anil_grey.webp" />
                </div>
              </div>
            </div>
          </div>
          <div class="delete">
            <h2>{{ $t("delete") }}</h2>
            <div class="bg-white">
              <p>
                Vous pouvez supprimer votre compte DossierFacile à tout moment.
                La suppression de votre compte entrainera automatiquement
                l’effacement définitif de vos pièces justificatives.
              </p>
              <div class="align--center">
                <DfButton
                  class="delete-btn"
                  primary="true"
                  @on-click="deleteAccount()"
                  >{{ $t("delete-account") }}</DfButton
                >
              </div>
            </div>
          </div>
          <div class="opinion rf-mb-5w">
            <h2>{{ $t("opinion") }}</h2>
            <div class="bg-white">
              <p>
                Nous cherchons constamment à améliorer la qualité de notre
                service. Dans le cadre de cette démarche d’amélioration, nous
                cherchons à obtenir votre retour d’expérience. En cliquant sur
                le bouton ci-dessous, vous pourrez évaluer DossierFacile.fr. Vos
                commentaires nous sont précieux ! Merci.
              </p>
              <div class="align--center">
                <a
                  href="https://voxusagers.numerique.gouv.fr/Demarches/2871?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=f2f9b35326f6b085c219faef71d0a3f2"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import DfButton from "df-shared/src/Button/Button.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import StatusTag from "df-shared/src/components/StatusTag.vue";

@Component({
  components: { ValidationProvider, DfButton, NakedCard, StatusTag },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class FileStatus extends Vue {
  user!: User;
  radioVisible = false;
  pub = "false";

  isOld() {
    // TODO
    return true;
  }

  getToken() {
    if (this.pub === "true") {
      return this.user.apartmentSharing?.tokenPublic;
    }
    return this.user.apartmentSharing?.token;
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
    } catch (err) {
      alert("Oops, unable to copy");
    }
    tl?.setAttribute("type", "hidden");
  }

  deleteAccount() {
    // TODO
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

.rf-container-fluid {
  background-color: var(--bf100-g750);
}

.rf-callout {
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
  padding: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: var(--w);
}

.rf-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.visale-img {
  height: 72px;
  margin: auto;
  margin-top: 14px;
  margin-bottom: 14px;
}

.anil-img {
  margin: auto;
  height: 100px;
}

.partners .bg-white {
  padding: 2rem;
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--w);
  position: relative;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;

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

h4 {
  min-width: 300px;
}
</style>

<i18n>
{
  "en": {
    "title": "Hello {0}, your file is validated",
    "subtitle": "Vous avez indiqué être {0} {1}, être en {2} et gagner {3}.",
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
    "TO_PROCESS":"to process",
    "VALIDATED":"validated",
    "DECLINED":"declined",
    "INCOMPLETE":"incomplete",
    "partners": "Our partners",
    "delete": "Deletion of my account",
    "opinion": "Tell us about your experience DossierFacile.fr",
    "delete-account": "Delete my account",
    "share-file": "Share my file",
    "file-resume": "Share resumed file <br>(without supporting document)",
    "file-full": "Share full file <br>(with supporting document)",
    "copy": "Copy"
  },
  "fr": {
    "title": "Bonjour {0}, votre dossier est {1} !",
    "subtitle": "Vous avez indiqué être {0} {1}, être en {2} et gagner {3}.",
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
    "professional": "Justificatif de situation professionelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "representative-identification": "Identité de la personne morale",
    "corporation-identification": "Identité du représentant de la personne morale",
    "guarantor": "Garant",
    "guarantors-information": "Les informations de mes garants",
    "TO_PROCESS":"non vérifié",
    "VALIDATED":"vérifié",
    "DECLINED":"modification demandée",
    "INCOMPLETE":"non terminé",
    "partners": "Nos partenaires",
    "delete": "Suppression de mon compte",
    "opinion": "Racontez-nous votre expérience DossierFacile.fr",
    "delete-account": "Supprimer mon compte",
    "share-file": "Partager mon dossier",
    "file-resume": "Partager mon dossier de synthèse <br>(sans pièce justificative)",
    "file-full": "Partager mon dossier complet<br>(avec pièces justificatives)",
    "copy": "Copier"
  }
}
</i18n>
