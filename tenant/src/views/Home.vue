<template>
  <div class="main-container">
    <section class="height-100 rf-grid-row">
      <div class="imageblock__content rf-col-lg-6 rf-col-md-4 rf-col-12">
        <div class="background-image-holder"></div>
      </div>
      <div class="pos-vertical-center rf-col-lg-6 rf-col-md-8 rf-col-12">
        <div class="rf-m-3w">
          <div class="rf-grid-col">
            <h1 class="rf-h1">{{ $t("h1") }}</h1>
            <p>
              {{ $t("p1") }}
            </p>
            <div class="pull-left">
              <div>
                <v-gouv-fr-modal></v-gouv-fr-modal>
                <DfButton primary="true" size="small" @on-click="signup">
                  {{ $t("signup") }}
                </DfButton>
              </div>
              <div class="rf-mt-2w text-center">
                <router-link to="/login">
                  {{ $t("login") }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-lg-center text-md-center text-sm-left rf-mt-5w">
      <div class="rf-container">
        <div class="rf-grid-row">
          <div class="rf-col-md-12 text-center">
            <h2 class="rf-h2">{{ $t("h2-1") }}</h2>
            <p>{{ $t("p2") }}</p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="rf-container">
        <div class="rf-grid-row">
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <span class="color--primary material-icons md-48"
                >auto_fix_high</span
              >
              <h5 class="rf-h5">{{ $t("h5-1") }}</h5>
              <p>
                {{ $t("p3") }}
              </p>
            </div>
          </div>
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <span class="color--primary material-icons md-48">house</span>
              <h5 class="rf-h5">{{ $t("h5-2") }}</h5>
              <p>
                {{ $t("p4") }}
              </p>
            </div>
          </div>
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <span class="color--primary material-icons md-48">mouse</span>
              <h5 class="rf-h5">{{ $t("h5-3") }}</h5>
              <p>
                {{ $t("p5") }}
              </p>
            </div>
          </div>
          <div class="rf-col-md-6 rf-col-lg-3">
            <div class="feature feature-6">
              <span class="color--primary material-icons md-48"
                >verified_user</span
              >
              <h5 class="rf-h5">{{ $t("h5-4") }}</h5>
              <p>
                {{ $t("p6") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cover cover-features space--lg bg-orange pt-2">
      <div class="rf-container">
        <div class="rf-grid-row">
          <div class="rf-col-md-9 rf-col-lg-7">
            <h2 class="rf-h2">{{ $t("h2-2") }}</h2>
            <p>
              {{ $t("p7") }}
            </p>
            <DfButton primary="true" size="small" @on-click="signup">
              {{ $t("signup") }}
            </DfButton>
          </div>
        </div>

        <div class="rf-grid-row">
          <div class="rf-col-md-4">
            <div
              class="feature feature-1 boxed boxed--border bg--white z-index-0"
            >
              <div class="rf-grid-row">
                <div class="rf-col-8">
                  <h5 class="rf-h5">{{ $t("h5-5") }}</h5>
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
                {{ $t("p8") }}
              </p>
              <a
                class="text-bleu-clair"
                href="https://www.visale.fr/#!/"
                target="_blank"
              >
                {{ $t("visale-link") }}
              </a>
            </div>
          </div>

          <div class="rf-col-md-4 position-relative">
            <div
              class="feature feature-1 boxed boxed--border bg--white position-relative"
            >
              <div class="rf-grid-row">
                <div class="rf-col-8">
                  <h5 class="rf-h5">{{ $t("h5-6") }}</h5>
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
                {{ $t("p9") }}
              </p>
              <a
                class="text-bleu-clair"
                href="https://www.anil.org/"
                target="_blank"
              >
                {{ $t("anil-link") }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-center mt-5">
      <div class="rf-container">
        <div class="rf-grid-row">
          <div class="rf-col-12">
            <h2 class="rf-h2">{{ $t("h2-3") }}</h2>
            <p>
              {{ $t("p10") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="rf-mb-5w">
      <div class="rf-container">
        <div class="process-2 rf-grid-row">
          <div class="rf-col-md-4">
            <div class="process__item">
              <h5 class="rf-h5">{{ $t("h5-7") }}</h5>
              <p>
                {{ $t("p11") }}
              </p>
            </div>
          </div>
          <div class="rf-col-md-4">
            <div class="process__item">
              <h5 class="rf-h5">{{ $t("h5-8") }}</h5>
              <p>
                {{ $t("p12") }}
              </p>
            </div>
          </div>
          <div class="rf-col-md-3">
            <div class="process__item">
              <h5 class="rf-h5">{{ $t("h5-9") }}</h5>
              <p>
                {{ $t("p13") }}
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
import VGouvFrModal from "df-shared/src/Button/v-gouv-fr-modal/VGouvFrModal.vue";

@Component({
  components: { DfButton, VGouvFrModal }
})
export default class Home extends Vue {
  signup() {
    this.$router.push("/signup");
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_main.scss";

.main-container {
  width: 100%;
}

.height-100 {
  height: calc(100vh - 200px);
  @media all and (max-width: 768px) {
    height: auto;
  }
}

.imageblock__content {
  position: relative;
  min-height: 150px;
}

.background-image-holder {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/beautiful-building-square.jpg");
  z-index: 0;
  transition: opacity 0.3s linear;
  -webkit-transition: opacity 0.3s linear;

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

.process-2 {
  position: relative;
}

.process-2:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  top: 0.92857143em;
  left: 0;
  background: #4a90e2;
  margin-left: -10px;
}

@media all and (max-width: 767px) {
  .process-2:before {
    height: 100%;
    width: 2px;
    left: 14px;
    margin-left: 2px;
  }
}

.process__item {
  padding-top: 2rem;
  padding-left: 3rem;
  position: relative;
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

@media all and (max-width: 767px) {
  .process-2 .process__item:after {
    top: 3rem;
    left: 0;
  }
}
.process-2 .process__item:after {
  display: inline-block;
  text-align: center;
}

.feature {
  padding: 1rem;
  margin: 2rem;
  border-radius: 6px;
}

.pos-vertical-center {
  align-self: center;
}
.pull-left {
  float: left;
  width: fit-content;
}
</style>

<i18n>
{
"en": {
"signup": "I CREATE MY ACCOUNT",
"h1": "DossierFacile, the smart location file",
"p1": "Drop your file on DossierFacile and increase your probability to find the flat of your dream !",
"login": "I log in",
"h2-1": "Make the difference with DossierFacile",
"p2": "Clear, completed and consistent files.",
"h5-1": "An easier file",
"h5-2": "Make the difference",
"h5-3": "100% online",
"h5-4": "Your data is protected",
"h5-5": "VISALE",
"h5-6": "ANIL",
"h5-7": "I CREATE AN ACCOUNT IN 3 MINUTES",
"h5-8": "I COMPLETE IF NECESSARY",
"h5-9": "I SEND MY LINK TO OWNERS",
"h2-2": "Boost your location file with DossierFacile !",
"p3": "Because incomplete file rhymes with refused flat, we guide you throw each step to build a perfect location file and compliant to the law.",
"p4": "Reassure the owner with the  « 3C » standard and increase by 24% your probability to visit the flat of your dream.",
"p5": "With DossierFacile everything happens online and in 3 minutes : end of the paperwork. You can send to owners in 1 click by mail or SMS !",
"p6": "We care about protecting your data. They will never be communicated without your express consent. Our watermarking system helps you protect yourself against fraud.",
"p7": "DossierFacile helps you free of charge in the constitution of your rental file to help you put the odds on your side",
"p8": "Free and online, Visale is your guarantor to rent your housing !",
"visale-link": "Get your visa",
"p9": "For any question about rent, inquire with ANIL or your ADIL.",
"anil-link": "Find out more",
"h2-3": "Boost your file in 3 steps",
"p10": "We help you free of charge to make your rent file",
"p11": "I create my DossierFacile account in a few minutes by adding only the documents allowed by the law.",
"p12": "DossierFacile check that your file is Clear, Completed and Consistent to help you put the odds on your side.",
"p13": "Once my file is validated, I can send it to any owner by internet or by sms. Thanks to DossierFacile I put the odds on my side to get the flat of my dream"
},
"fr": {
"signup": "JE CRÉE MON COMPTE",
"h1": "DossierFacile, le dossier de location intelligent",
"p1": "Déposez votre dossier sur DossierFacile et augmentez vos chances de trouver l'appartement de vos rêves !",
"login": "Je me connecte",
"h2-1": "Faites la différence avec DossierFacile",
"p2": "Des dossiers Clairs, Complets et Cohérents.",
"h5-1": "Un dossier plus simple",
"h5-2": "Faites la différence",
"h5-3": "100% en ligne",
"h5-4": "Vos données protégées",
"h5-5": "VISALE",
"h5-6": "ANIL",
"h5-7": "JE CREE MON COMPTE EN 3 MINUTES",
"h5-8": "JE COMPLETE SI NECESSAIRE",
"h5-9": "J’ENVOIE MON LIEN AUX PROPRIETAIRES",
"h2-2": "Boostez votre dossier de location avec DossierFacile !",
"p3": "Car dossier incomplet rime souvent avec appartement refusé, nous vous guidons à chaque étape pour construire un dossier de location parfait et conforme à la legislation.",
"p4": "Rassurer votre propriétaire grâce au standard « 3C » et augmentez de 24% vos chances d’obtenir une visite pour l’appartement de vos rêves.",
"p5": "Avec DossierFacile tout se passe en ligne et en 3 minutes : fini la paperasse. Vous pouvez envoyer aux propriétaires en un clic par mail ou par SMS !",
"p6": "Nous avons à coeur la protections de vos données. Elles ne seront jamais communiquées sans votre accord express. Notre système de watermarking vous aide également à vous protéger contre la fraude.",
"p7": "DossierFacile vous accompagne gratuitement dans la constitution de votre dossier de location pour vous aider à mettre toutes les chances de votre côté",
"p8": "Gratuit et entièrement dématerialisé, Visale est votre garant pour louer votre logement !",
"visale-link": "Obtenez votre visa",
"p9": "Pour toutes questions relatives au logement, renseignez-vous auprès de l'ANIL ou de votre ADIL.",
"anil-link": "En savoir plus",
"h2-3": "Boostez votre dossier en 3 étapes",
"p10": "Nous vous accompagnons gratuitement dans la constitution de votre dossier de location",
"p11": "Je crée mon compte DossierFacile en quelques minutes en ajoutant uniquement les documents demandés par la loi.",
"p12": "DossierFacile vérifie que votre dossier est Clair, Complet et Cohérent pour vous aider à mettre toutes les chances de votre coté.",
"p13": "Une fois mon dossier validé, je peux l'envoyer à n'importe quel propriétaire par internet ou par sms. Grâce à DossierFacile je mets toutes les chances de mon coté pour obtenir l'appartement de mes rêves"

}
}
</i18n>
