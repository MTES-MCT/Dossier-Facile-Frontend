<template>
  <div>
    <section class="s0-background rf-pb-5w">
      <div class="rf-container">
        <div class="rf-col-md-8">
          <div class="rf-grid-col">
            <h1 class="rf-h1 color--white">
              {{ $t("s0.title") }}
            </h1>
            <p class="text-bold color--white">
              {{ $t("s0.text") }}<br />
              {{ $t("s0.text2") }}
            </p>
            <p>
              <a class="rf-btn" :href="`${TENANT_URL}/signup`">
                {{ $t("button") }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="rf-mt-12w">
      <div class="rf-container">
        <div class="rf-grid-row">
          <div class="rf-col-md-4 rf-grid-col rf-p-2w">
            <div>
              <img src="../assets/icons/approval.svg" class="s1-icons" />
            </div>
            <h3 class="rf-h3 color--secondary">{{ $t("s1.h1") }}</h3>
            <p class="rf-mt-0">
              {{ $t("s1.p1") }}
            </p>
          </div>
          <div class="rf-col-md-4 rf-grid-col rf-p-2w">
            <div>
              <img src="../assets/icons/sports.svg" class="s1-icons" />
            </div>
            <h3 class="rf-h3 color--secondary">{{ $t("s1.h2") }}</h3>
            <p class="rf-mt-0">
              {{ $t("s1.p2") }}
            </p>
          </div>
          <div class="rf-col-md-4 rf-grid-col rf-p-2w">
            <div>
              <img src="../assets/icons/reading.svg" class="s1-icons" />
            </div>
            <h3 class="rf-h3 color--secondary">{{ $t("s1.h3") }}</h3>
            <p class="rf-mt-0">
              {{ $t("s1.p3") }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="rf-mt-12w">
      <div class="rf-container">
        <h2 class="rf-h2 s2-title">{{ $t("s2.title") }}</h2>
        <div class="rf-grid-row">
          <div class="rf-col-md-6 rf-grid-col">
            <h4 class="rf-h4 color--secondary rf-mb-0">{{ $t("s2.h1") }}</h4>
            <p>{{ $t("s2.p1") }}</p>
            <ul>
              <li>{{ $t("s2.u1a") }}</li>
              <li>{{ $t("s2.u1b") }}</li>
              <li>{{ $t("s2.u1c") }}</li>
              <li>{{ $t("s2.u1d") }}</li>
              <li>{{ $t("s2.u1e") }}</li>
            </ul>

            <h4 class="rf-h4 color--secondary rf-mb-0">{{ $t("s2.h2") }}</h4>
            <p>{{ $t("s2.p2") }}</p>

            <h4 class="rf-h4 color--secondary rf-mb-0">{{ $t("s2.h3") }}</h4>
            <p>{{ $t("s2.p3") }}</p>
          </div>
          <div class="rf-col-md-6">
            <img src="../assets/icons/justif.webp" />
          </div>
        </div>
        <a class="rf-btn rf-mt-3w" :href="`${TENANT_URL}/signup`">
          {{ $t("button") }}
        </a>
      </div>
    </section>
    <section class="rf-mt-12w">
      <div class="bg--orange rf-pt-7w rf-pb-7w">
        <div class="rf-container">
          <h2 class="rf-h2 s3-title">{{ $t("s3.title") }}</h2>
          <p>
            {{ $t("s3.text1") }}
            <br />
            {{ $t("s3.text2") }}
          </p>
          <p>
            {{ $t("s3.text3") }}
          </p>
          <!--           <router-link to="/tenant">
            {{ $t("s3.link") }}
          </router-link> -->
        </div>
      </div>
    </section>
    <section class="rf-mt-12w">
      <div class="rf-container rf-mb-7w">
        <h2 class="rf-h2 text-center">
          {{ $t("s4.title1") }}
          <span class="color--secondary">{{ $t("s4.title2") }}</span>
          {{ $t("s4.title3") }}
        </h2>
        <div class="rf-grid-row">
          <div class="col rf-p-2w">
            <blockquote class="bg--blue color--primary quote rf-p-2w">
              <p class="rf-m-0 rf-mb-3w">{{ $t("s4.t1") }}</p>
              <cite>{{ $t("s4.author1") }}</cite>
            </blockquote>
          </div>
          <div class="col rf-p-2w">
            <blockquote class="bg--blue color--primary quote rf-p-2w">
              <p class="rf-m-0 rf-mb-3w">{{ $t("s4.t2") }}</p>
              <cite>{{ $t("s4.author2") }}</cite>
            </blockquote>
          </div>
          <div class="col rf-p-2w">
            <blockquote class="bg--blue color--primary quote rf-p-2w">
              <p class="rf-m-0 rf-mb-3w">{{ $t("s4.t3") }}</p>
              <cite>{{ $t("s4.author3") }}</cite>
            </blockquote>
          </div>
        </div>
        <div class="text-center rf-mt-5w rf-mb-5w">
          <p>
            <a class="rf-btn" :href="`${TENANT_URL}/signup`">
              {{ $t("button") }}
            </a>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  mounted: function() {
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/all.js");
    document.head.appendChild(localScript);
  }
})
export default class LandingPage extends Vue {
  TENANT_URL = "//" + process.env.VUE_APP_TENANT_URL;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.s0-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/cover-features.webp");

  @media (max-width: 768px) {
    background-image: url("../assets/cover-features-mobile.webp");
  }

  z-index: 0;
}

.s1-icons {
  height: 48px;
}

cite {
  font-weight: bold;
}

.col {
  flex: 1;
  @media (max-width: 768px) {
    flex: auto;
  }
}

blockquote {
  margin: 0;
  height: 100%;
}

.quote {
  border-radius: 6px;
}

.s2-title {
  &:before {
    margin-right: 10px;
    content: url("../assets/icons/survey.svg");
  }
}

.s3-title {
  &:before {
    margin-right: 10px;
    content: url("../assets/icons/lock.svg");
  }
}

ul li {
  display: flex;
  margin-bottom: 0;
}

ul li:before {
  content: "\2713";
  display: inline-block;
  color: limegreen;
  font-size: 1rem;
}

img {
  max-width: 100%;
  display: block;
}
</style>

<i18n>
{
  "en": {
    "button": "Monter mon dossier de location",
    "s0": {
      "title": "Montez un dossier de location en béton pour trouver le logement de vos rêves",
      "text": "DossierFacile vous aide à constituer un dossier de location numérique ",
      "text2": "de qualité pour mettre toutes les chances de votre côté."
    },
    "s1": {
      "h1": "Démarquez-vous grâce à un dossier de qualité",
      "p1": "Transmettez aux propriétaires un dossier clair, complet et cohérent pour maximiser vos chances.",
      "h2": "Soyez le premier à répondre à une annonce",
      "p2": "Soyez le plus réactif en envoyant en un clic votre dossier numérique.",
      "h3": "Rassurez votre futur·e propriétaire",
      "p3": "Après une batterie de tests par nos opérateurs, votre dossier est labellisé par l'État."
    },
    "s2": {
      "title": "Constituez votre dossier de location en trois étapes",
      "h1": "Je télécharge mes pièces",
      "p1": "DossierFacile vous demande les pièces nécessaires et rien que celles-là !",
      "u1a": "Pièce d'identité",
      "u1b": "Justificatif de domicile",
      "u1c": "Justificatif de situation professionnelle",
      "u1d": "Avis d'imposition",
      "u1e": "Justificatif de ressources",
      "h2": "DossierFacile valide mon dossier",
      "p2": "Nos agents vérifient votre dossier et vous aident à le corriger si besoin.",
      "h3": "Mon dossier est prêt à être envoyé",
      "p3": "Votre dossier sécurisé sous forme de lien URL ou au format PDF est prêt à être envoyé aux propriétaires."
    },
    "s3": {
      "title": "Protégez vos informations personnelles",
      "text1": "Avec DossierFacile, plus de papiers d'identité éparpillés dans la nature !",
      "text2": "Vos documents sont recouverts de filigranes pour vous protéger contre la fraude de propriétaires peu scrupuleux.",
      "text3": "Vous pouvez paramétrer l'ouverture de votre lien dossier : vous pouvez le supprimer à tout moment !",
      "link": "En savoir plus sur la sécurité des données chez DossierFacile"
    },
    "s4": {
      "title1": "Déjà",
      "title2": "65 000",
      "title3": "Dossiers labellisés grâce à DossierFacile",
      "t1": "Le dossier de Karim s'est tout de suite démarqué : c'était le seul dossier reçu complet !",
      "author1": "Joseph, propriétaire à Nantes",
      "t2": "Simple, efficace et pratique : ça m'a fait gagner beaucoup de temps dans ma recherche d'appartement.",
      "author2": "Caroline, étudiante",
      "t3": "Je ne réussissais jamais à visiter un appartement avec mon dossier étranger. Avec DossierFacile, j'ai enfin eu plus de visites !",
      "author3": "Irina, étudiante en Erasmus"
    }
  },
  "fr": {
    "button": "Monter mon dossier de location",
    "s0": {
      "title": "Montez un dossier de location en béton pour trouver le logement de vos rêves",
      "text": "DossierFacile vous aide à constituer un dossier de location numérique ",
      "text2": "de qualité pour mettre toutes les chances de votre côté."
    },
    "s1": {
      "h1": "Démarquez-vous grâce à un dossier de qualité",
      "p1": "Transmettez aux propriétaires un dossier clair, complet et cohérent pour maximiser vos chances.",
      "h2": "Soyez le premier à répondre à une annonce",
      "p2": "Soyez le plus réactif en envoyant en un clic votre dossier numérique.",
      "h3": "Rassurez votre futur·e propriétaire",
      "p3": "Après une batterie de tests par nos opérateurs, votre dossier est labellisé par l'État."
    },
    "s2": {
      "title": "Constituez votre dossier de location en trois étapes",
      "h1": "Je télécharge mes pièces",
      "p1": "DossierFacile vous demande les pièces nécessaires et rien que celles-là !",
      "u1a": "Pièce d'identité",
      "u1b": "Justificatif de domicile",
      "u1c": "Justificatif de situation professionnelle",
      "u1d": "Avis d'imposition",
      "u1e": "Justificatif de ressources",
      "h2": "DossierFacile valide mon dossier",
      "p2": "Nos agents vérifient votre dossier et vous aident à le corriger si besoin.",
      "h3": "Mon dossier est prêt à être envoyé",
      "p3": "Votre dossier sécurisé sous forme de lien URL ou au format PDF est prêt à être envoyé aux propriétaires."
    },
    "s3": {
      "title": "Protégez vos informations personnelles",
      "text1": "Avec DossierFacile, plus de papiers d'identité éparpillés dans la nature !",
      "text2": "Vos documents sont recouverts de filigranes pour vous protéger contre la fraude de propriétaires peu scrupuleux.",
      "text3": "Vous pouvez paramétrer l'ouverture de votre lien dossier : vous pouvez le supprimer à tout moment !",
      "link": "En savoir plus sur la sécurité des données chez DossierFacile"
    },
    "s4": {
      "title1": "Déjà",
      "title2": "65 000",
      "title3": "Dossiers labellisés grâce à DossierFacile",
      "t1": "Le dossier de Karim s'est tout de suite démarqué : c'était le seul dossier reçu complet !",
      "author1": "Joseph, propriétaire à Nantes",
      "t2": "Simple, efficace et pratique : ça m'a fait gagner beaucoup de temps dans ma recherche d'appartement.",
      "author2": "Caroline, étudiante",
      "t3": "Je ne réussissais jamais à visiter un appartement avec mon dossier étranger. Avec DossierFacile, j'ai enfin eu plus de visites !",
      "author3": "Irina, étudiante en Erasmus"
    }
  }
}
</i18n>
