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
          <div class="main rf-mt-5w rf-p-2w">
            <div class="main-bar rf-grid-row">
              <h4 class="rf-mr-2w rf-mb-0 rf-mt-0">{{ $t("my-file") }}</h4>

              <p class="rf-tag">
                <span v-if="user.status === 'TO_PROCESS'"
                  >dossier complété.</span
                >
                <span v-if="user.status === 'VALIDATED'">dossier validé.</span>
                <span v-if="user.status === 'DECLINED'">dossier étudié.</span>
                <span v-if="!user.status || user.status === 'INCOMPLETE'">
                  dossier créé.
                </span>
              </p>

              <span class="spacer"></span>
              <DfButton @on-click="copyLink" primary="true" size="small">{{
                $t("copy-link")
              }}</DfButton>
            </div>
            <div class="main-description">
              Vous avez indiqué être en cdd etc.
            </div>
            <hr />
            <div class="main-information">
              <h4>{{ $t("my-information") }}</h4>
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
          </div>
          <div class="delete">
            <h2>{{ $t("delete") }}</h2>
          </div>
          <div class="opinion">
            <h2>{{ $t("opinion") }}</h2>
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

@Component({
  components: { ValidationProvider, DfButton },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class FileStatus extends Vue {
  user!: User;

  isOld() {
    // TODO
    return true;
  }

  getFileLink() {
    return `https://${process.env.VUE_APP_TENANT_URL}/dossier-locataire/${this.user?.apartmentSharing?.token}`;
  }

  getPublicFileLink() {
    return `https://${process.env.VUE_APP_TENANT_URL}/dossier-locataire/${this.user?.apartmentSharing?.tokenPublic}`;
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
    "my-information": "My information",
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
    "opinion": "Tell us about your experience DossierFacile.fr"
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
    "my-information": "Mes informations",
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
    "opinion": "Racontez-nous votre expérience DossierFacile.fr"
  }
}
</i18n>
