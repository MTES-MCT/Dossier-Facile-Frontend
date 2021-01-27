<template>
  <div>
    <div layout:fragment="content" th:remove="tag">
      <div class="main-container">
        <section class="text-center pt-5">
          <div class="container pt-4">
            <div class="row">
              <div class="col-md-10 col-lg-8">
                <h1>{{ $t("title") }}</h1>
                <h5 class="w-60 mx-auto font-weight-normal text-lead-color">
                  Votre lien sera généré dès que votre dossier sera validé. Vous
                  êtes actuellement à l'étape TODO

                  <div v-if="user.status === 'TO_PROCESS'">
                    dossier complété.
                  </div>
                  <div v-if="user.status === 'VALIDATED'">dossier validé.</div>
                  <div v-if="user.status === 'DECLINED'">dossier étudié.</div>
                  <div v-if="!user.status || user.status === 'INCOMPLETE'">
                    dossier créé.
                  </div>
                </h5>

                <div class="mt-5">
                  <span>{{
                    $t("subtitle", [
                      user.firstName,
                      user.lastName,
                      user.situation + "TODO",
                      user.salary + "TODO"
                    ])
                  }}</span>
                  <router-link to="/profile"> (Modifier)</router-link><br />
                  <span>{{ $t("last-update", [user.lastUpdate]) }}TODO</span>
                </div>
                <div
                  class="d-flex flex-column"
                  v-if="user.status === 'VALIDATED'"
                >
                  <div class="mt-5 modal-instance">
                    <div class="modal-trigger">
                      <a
                        class="btn btn--primary type--uppercase"
                        href="#"
                        v-if="user.appartmentSharing.status === 'VALIDATED'"
                      >
                        <span class="btn__text"> envoyer mon dossier </span>
                      </a>
                    </div>
                    <div>
                      <a
                        class="btn btn--primary type--uppercase"
                        data-tooltip="Pour envoyer votre lien-dossier, tous les comptes de votre colocation doivent être validés"
                        v-if="user.appartmentSharing.status !== 'VALIDATED'"
                      >
                        <span class="btn__text"> envoyer mon dossier </span>
                      </a>
                    </div>

                    <div class="modal-container" id="dossier-modal">
                      <div class="modal-content" data-width="80%">
                        <div class="boxed boxed--lg">
                          <h2>
                            Mon lien dossier :
                            <b class="text-lead-color">
                              <span>{{ getFileLink() }}</span>
                            </b>
                          </h2>
                          <hr class="short" />
                          <p class="lead pr-5">
                            Copiez votre lien dossier unique et envoyez-le à
                            votre propriétaire pour lui donner accès à
                            l'ensemble des pièces de votre dossier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 modal-instance">
                    <div class="modal-trigger">
                      <a
                        class="font-weight-normal"
                        href="#"
                        v-if="user.appartmentSharing.status === 'VALIDATED'"
                      >
                        envoyer mon lien synthèse
                      </a>
                    </div>
                    <div>
                      <a
                        class="font-weight-normal text-primary"
                        data-tooltip="Pour envoyer votre lien-dossier, tous les comptes de votre colocation doivent être validés"
                        v-if="user.appartmentSharing.status !== 'VALIDATED'"
                      >
                        envoyer mon lien synthèse
                      </a>
                    </div>

                    <div class="modal-container" id="synthese-modal">
                      <div class="modal-content" data-width="80%">
                        <div class="boxed boxed--lg">
                          <h2>
                            Mon lien-synthèse :
                            <b class="text-lead-color">
                              <span>{{ getPublicFileLink() }}</span>
                            </b>
                          </h2>
                          <hr class="short" />
                          <p class="lead pr-5">
                            Contactez votre propriétaire en ajoutant votre
                            lien-synthèse unique et augmentez de 25% vos chances
                            d'obtenir une visite pour l'appartement de vos rêves !
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 w-75 mx-auto">
                    <p>
                      En envoyant votre dossier vous donnez accès au
                      propriétaire à l'intégralité de votre dossier. En envoyant
                      une synthèse vous donnez accès à votre nom, votre prénom
                      et au montant total des revenus mensuels. Le propriétaire
                      n'aura pas accès aux pièces de votre dossier, mais la
                      mention DossierFacile lui indiquera que votre dossier est
                      complet et en ordre !
                    </p>
                  </div>
                </div>
                <div class="boxed-warning" v-if="oldUpdateDocument()">
                  <h4>Attention</h4>
                  <p>
                    Vous avez mis à jour votre dossier pour la dernière fois le
                    <span>{{ user.lastUpdate }} TODO"</span>. Afin qu'il reste!
                    <b>convaincant</b>, il est important de
                    <b>maintenir à jour vos justificatifs</b>.<br />
                    <a href="#suivi-dossier">Je mets à jour mes documents</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="container">
            <div class="process-2 row">
              <div class="col-md-3" v-if="user.status === 'INCOMPLETE'">
                <div class="process__item process__item_active">
                  <h5>Dossier créé</h5>
                  <p>
                    Votre dossier a été créé, merci de faire confiance à
                    DossierFacile ! Maintenant, il vous reste encore à ajouter
                    toutes vos pièces.
                  </p>
                </div>
              </div>
              <div class="col-md-3" v-if="user.status === 'TO_PROCESS'">
                <div class="process__item process__item_active">
                  <h5>Dossier complété</h5>
                  <p>
                    Votre dossier est complet, merci pour votre efficacité ! Il
                    va maintenant passer par la série de tests DossierFacile...
                  </p>
                </div>
              </div>
              <div class="col-md-3" v-if="user.status === 'DECLINED'">
                <div class="process__item process__item_active">
                  <h5>Dossier étudié</h5>
                  <p>
                    Votre dossier est actuellement à l'étude. Pour correspondre
                    avec les équipes DossierFacile n'oubliez pas d'aller
                    regarder votre onglet "messagerie" !
                  </p>
                </div>
              </div>
              <div class="col-md-3" v-if="user.status === 'VALIDATED'">
                <div class="process__item process__item_active">
                  <h5>Dossier validé</h5>
                  <p>
                    Super, votre dossier est à présent validé ! Maintenant vous
                    pouvez envoyer vos liens en toute sécurité : nous vous
                    souhaitons bon courage pour vos recherches !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";

@Component({
  components: { ValidationProvider },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class FileStatus extends Vue {
  user!: User;

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
}
</script>

<i18n>
{
  "en": {
      "title": "Suivi de mon dossier",
      "subtitle": "Vous avez indiqué être {0} {1}, être en {2} et gagner {3}.",
      "last-update": "Dernière mise à jour du dossier le {0}"
  },
  "fr": {
      "title": "Suivi de mon dossier",
      "subtitle": "Vous avez indiqué être {0} {1}, être en {2} et gagner {3}.",
      "last-update": "Dernière mise à jour du dossier le {0}"
  }
}
</i18n>
