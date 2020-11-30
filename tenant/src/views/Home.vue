<template>
  <div class="main-container">
    <section class="imageblock switchable height-100 rf-grid-row">
      <div class="imageblock__content rf-col-lg-6 rf-col-md-4">
        <div class="background-image-holder">
          <img
            alt="beautiful building"
            src="@/assets/beautiful-building-square.png"
          />
        </div>
      </div>
      <div class="container pos-vertical-center rf-col-lg-6 rf-col-md-8">
        <div class="rf-grid-row">
          <div class="rf-col-lg-5 rf-col-md-7">
            <h1>DossierFacile, le dossier de location intelligent</h1>
            <p class="lead">
              Déposez votre dossier sur DossierFacile et augmentez vos chances
              de trouver l'appartement de vos rêves !
            </p>

            <div class="pull-left">
              <div>
                <DfButton
                  primary="true"
                  size="small"
                  v-on:on-click="signup"
                  :label="$t('signup')"
                />
              </div>
              <div class="mt-2 text-center">
                <router-link to="/login">
                  Je me connecte
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-lg-center text-md-center text-sm-left">
      <div class="container">
        <div class="rf-grid-row">
          <div class="rf-col-md-12">
            <h2>Faites la différence avec DossierFacile</h2>
            <p class="lead">Des dossiers Clairs, Complets et Cohérents.</p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="rf-grid-row">
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <i class="icon color--primary icon-Magic-Wand icon--sm"></i>
              <h5>Un dossier plus simple</h5>
              <p>
                Car dossier incomplet rime souvent avec appartement refusé, nous
                vous guidons à chaque étape pour construire un dossier de
                location parfait et conforme à la legislation.
              </p>
            </div>
          </div>
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <i class="icon color--primary icon-Green-House icon--sm"></i>
              <h5>Faites la différence</h5>
              <p>
                Rassurer votre propriétaire grâce au standard « 3C » et
                augmentez de 24% vos chances d’obtenir une visite pour
                l’appartement de vos rêves.
              </p>
            </div>
          </div>
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <i class="icon color--primary icon-Mouse-2 icon--sm"></i>
              <h5>100% en ligne</h5>
              <p>
                Avec DossierFacile tout se passe en ligne et en 3 minutes : fini
                la paperasse. Vous pouvez envoyer aux propriétaires en un clic
                par mail ou par SMS !
              </p>
            </div>
          </div>
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <i class="icon color--primary icon-Cloud-Lock icon--sm"></i>
              <h5>Vos données protégées</h5>
              <p>
                Nous avons à coeur la protections de vos données. Elles ne
                seront jamais communiquées sans votre accord express. Notre
                système de watermarking vous aide également à vous protéger
                contre la fraude.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cover cover-features space--lg bg-orange pt-2">
      <div class="container">
        <div class="rf-grid-row">
          <div class="rf-col-md-9 rf-col-lg-7">
            <h1 class="text-white">
              <b> Boostez votre dossier de location avec DossierFacile !</b>
            </h1>
            <p class="lead text-white">
              DossierFacile vous accompagne gratuitement dans la constitution de
              votre dossier de location pour vous aider à mettre toutes les
              chances de votre côté
            </p>
            <DfButton
              primary="true"
              size="small"
              v-on:on-click="signup"
              :label="$t('signup')"
            />
          </div>
        </div>

        <div class="rf-grid-row">
          <div class="rf-col-md-4">
            <div
              class="feature feature-1 boxed boxed--border bg--white z-index-0"
            >
              <div class="rf-grid-row">
                <div class="rf-col-8">
                  <h5>VISALE</h5>
                </div>
                <div class="rf-col-4">
                  <img
                    alt="beautiful building"
                    class="w-100 h-40"
                    src="@/assets/visale.png"
                  />
                </div>
              </div>

              <p>
                Gratuit et entièrement dématerialisé, Visale est votre garant
                pour louer votre logement !
              </p>
              <a class="text-bleu-clair" href="https://www.visale.fr/#!/">
                Obtenez votre visa
              </a>
            </div>
          </div>

          <div class="rf-col-md-4 position-relative">
            <div
              class="feature feature-1 boxed boxed--border bg--white position-relative"
            >
              <div class="rf-grid-row">
                <div class="rf-col-8">
                  <h5>ANIL</h5>
                </div>
                <div class="rf-col-4">
                  <img
                    alt="beautiful building"
                    class="w-100 h-40"
                    src="@/assets/anil.png"
                  />
                </div>
              </div>

              <p>
                Pour toutes questions relatives au logement, renseignez-vous
                auprès de l'ANIL ou de votre ADIL.
              </p>
              <a
                class="text-bleu-clair"
                href="https://www.anil.org/"
                target="_blank"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-center mt-5">
      <div class="container">
        <div class="rf-grid-row">
          <div class="rf-col-md-9 rf-col-lg-7">
            <h2>Boostez votre dossier en 3 étapes</h2>
            <p class="lead">
              Nous vous accompagnons gratuitement dans la constitution de votre
              dossier de location
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="process-2 rf-grid-row">
          <div class="rf-col-md-4">
            <div class="process__item">
              <h5>JE CREE MON COMPTE EN 3 MINUTES</h5>
              <p>
                Je crée mon compte DossierFacile en quelques minutes en ajoutant
                uniquement les documents demandés par la loi.
              </p>
            </div>
          </div>
          <div class="rf-col-md-4">
            <div class="process__item">
              <h5>JE COMPLETE SI NECESSAIRE</h5>
              <p>
                DossierFacile vérifie que votre dossier est Clair, Complet et
                Cohérent pour vous aider à mettre toutes les chances de votre
                coté.
              </p>
            </div>
          </div>
          <div class="rf-col-md-3">
            <div class="process__item">
              <h5>J’ENVOIE MON LIEN AUX PROPRIETAIRES</h5>
              <p>
                Une fois mon dossier validé, je peux l'envoyer à n'importe quel
                propriétaire par internet ou par sms. Grâce à DossierFacile je
                mets toutes les chances de mon coté pour obtenir l'appartement
                de mes rêves
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: { DfButton }
})
export default class Home extends Vue {
  signup() {
    this.$router.push("/signup");
  }
}
</script>

<style scoped lang="scss">
.height-100 {
  height: calc(100vh - 200px);
  @media all and (max-width: 768px) {
    height: auto;
  }
}

.imageblock__content {
  position: relative;
}

.background-image-holder {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  z-index: 0;
  transition: opacity 0.3s linear;
  -webkit-transition: opacity 0.3s linear;
  opacity: 0;
  background: #252525;

  img {
    display: none;
  }
}

.w-100 {
  max-width: 100%;
}

.h-40 {
  max-height: 40px;
}

.bg-orange {
  background-color: rgb(248, 191, 160) !important;
}

.bg--white {
  background-color: white !important;
}

.process__item:after {
  content: "";
  width: 1.85714286em;
  height: 1.85714286em;
  background: #fff;
  border: 2px solid rgb(74, 144, 226);
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-radius: 50%;
  position: absolute;
  top: 0;
  margin-left: 1px;
}
</style>

<i18n>
{
"en": {
"signup": "JE CRÉE MON COMPTE"
},
"fr": {
"signup": "JE CRÉE MON COMPTE"
}
}
</i18n>
