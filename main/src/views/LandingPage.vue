<template>
  <div>
    <section class="s0-background color--white rf-pd-2w rf-pb-5w">
      <div class="rf-container">
        <div class="rf-col-md-8">
          <div class="rf-grid-col">
            <h1 class="color--white">
              {{ $t("s0.title") }}
            </h1>
            <p>
              {{ $t("s0.text") }}
            </p>
            <p>
              <router-link class="rf-btn" to="/tenant">
                {{ $t("s0.link") }}
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="rf-container rf-mt-7w">
        <div class="rf-grid-row">
          <div class="rf-col-md-4 rf-grid-col rf-p-2w">
            <div>
            <img src="../assets/icons/approval.svg" class="s1-icons" />
            </div>
            <h3 class="color--primary">{{ $t("s1.h1") }}</h3>
            <p class="rf-mt-0">
              {{ $t("s1.p1") }}
            </p>
          </div>
          <div class="rf-col-md-4 rf-grid-col rf-p-2w">
            <div>
              <img src="../assets/icons/sports.svg" class="s1-icons" />
            </div>
            <h3 class="color--primary">{{ $t("s1.h2") }}</h3>
            <p class="rf-mt-0">
              {{ $t("s1.p2") }}
            </p>
          </div>
          <div class="rf-col-md-4 rf-grid-col rf-p-2w">
            <div>
              <img src="../assets/icons/reading.svg" class="s1-icons" />
            </div>
            <h3 class="color--primary">{{ $t("s1.h3") }}</h3>
            <p class="rf-mt-0">
              {{ $t("s1.p3") }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="rf-container">
        <h2>{{ $t("s2.title") }}</h2>
        <div class="rf-grid-row">
          <div class="rf-col-md-6 rf-grid-col">
            <h4>{{ $t("s2.h1") }}</h4>
            <p>{{ $t("s2.p1") }}</p>

            <h4>{{ $t("s2.h2") }}</h4>
            <p>{{ $t("s2.p2") }}</p>

            <h4>{{ $t("s2.h3") }}</h4>
            <p>{{ $t("s2.p3") }}</p>
          </div>
          <div class="rf-col-md-6">
            <img src="../assets/icons/justif.svg" />
          </div>
        </div>
        <router-link to="/tenant">
          {{ $t("s2.button") }}
        </router-link>
      </div>
    </section>
    <section>
      <div class="bg--orange rf-pt-7w rf-pb-7w">
        <div class="rf-container">
          <h2>{{ $t("s3.title") }}</h2>
          <p>
            {{ $t("s3.text1") }}
            <br>
            {{ $t("s3.text2") }}
          </p>
<!--           <router-link to="/tenant">
            {{ $t("s3.link") }}
          </router-link> -->
        </div>
      </div>
    </section>
    <section>
      <div class="rf-container rf-mb-7w">
        <h2 class="text-center">{{ $t("s4.title") }}</h2>
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
            <router-link class="rf-btn" to="/tenant">
              {{ $t("s4.link") }}
            </router-link>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LandingPage extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_main.scss";

.s0-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/cover-features.jpg");
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

</style>

<i18n>
{
  "en": {
    "s0": {
      "title": "Montez un dossier de location en béton pour trouver le logement de vos rêves",
      "text": "DossierFacile est un service public gratuit et sécurisé qui vous aide à constituer un dossier de location numérique de qualité pour mettre toutes les chances de votre côté.",
      "link": "Monter votre dossier de location"
    },
    "s1": {
      "h1": "Démarquez-vous grâce à un dossier de qualité",
      "p1": "Transmettez aux propriétaires un dossier clair, complet et cohérent pour maximiser vos chances.",
      "h2": "Soyez le premier à répondre à une annonce",
      "p2": "Soyez le plus réactif en envoyant en un clic un dossier numérique complet avec toutes les pièces jointes nécessaires.",
      "h3": "Rassurez votre futur·e propriétaire",
      "p3": "Certifiez la qualité et la véracité de votre dossier de location grâce au label DossierFacile."
    },
    "s2": {
      "title": "Constituez votre dossier de location en quelques clics",
      "h1": "Je télécharge mes pièces",
      "p1": "Pièce d'identité, avis d'imposition, fiches de paie…",
      "h2": "DossierFacile valide mon dossier",
      "p2": "Nos agents vérifient votre dossier et vous aident à corriger le vôtre si besoin.",
      "h3": "Mon dossier est prêt à être envoyé",
      "p3": "Plus besoin de refaire un dossier à chaque candidature : votre dossier sécurisé est disponible au format PDF ou en ligne pour être renvoyé aux propriétaires.",
      "button": "Créer mon dossier de location"
    },
    "s3": {
      "title": "Protégez vos informations personnelles",
      "text1": "Avec DossierFacile, plus de papiers d'identité éparpillés dans la nature : votre dossier contient les pièces autorisées par la loi et rien de plus !",
      "text2": "Vos pièces d'identité sont protégées par des filigranes pour vous protéger contre la fraude de propriétaires peu scrupuleux.",
      "link": "En savoir plus sar la sécurité de DossierFacile"
    },
    "s4": {
      "title": "Déjà 9000 locataires heureux grâce à DossierFacile",
      "t1": "Le dossier de Karim s'est tout de suite démarqué : c'était le seul dossier reçu complet !",
      "author1": "Joseph, propriétaire à Nantes",
      "t2": "Simple, efficace et pratique : ça m'a fait gagner beaucoup de temps dans ma recherche d'appartement.",
      "author2": "Caroline, étudiante",
      "t3": "Je ne réussissais jamais à visiter un appartement avec mon dossier étranger. Avec DossierFacile, j'ai enfin eu plus de visites !",
      "author3": "Irina, étudiante en Erasmus",
      "link": "Monter mon dossier de location"
    }
  },
  "fr": {
    "s0": {
      "title": "Montez un dossier de location en béton pour trouver le logement de vos rêves",
      "text": "DossierFacile est un service public gratuit et sécurisé qui vous aide à constituer un dossier de location numérique de qualité pour mettre toutes les chances de votre côté.",
      "link": "Monter votre dossier de location"
    },
    "s1": {
      "h1": "Démarquez-vous grâce à un dossier de qualité",
      "p1": "Transmettez aux propriétaires un dossier clair, complet et cohérent pour maximiser vos chances.",
      "h2": "Soyez le premier à répondre à une annonce",
      "p2": "Soyez le plus réactif en envoyant en un clic un dossier numérique complet avec toutes les pièces jointes nécessaires.",
      "h3": "Rassurez votre futur·e propriétaire",
      "p3": "Certifiez la qualité et la véracité de votre dossier de location grâce au label DossierFacile."
    },
    "s2": {
      "title": "Constituez votre dossier de location en quelques clics",
      "h1": "Je télécharge mes pièces",
      "p1": "Pièce d'identité, avis d'imposition, fiches de paie…",
      "h2": "DossierFacile valide mon dossier",
      "p2": "Nos agents vérifient votre dossier et vous aident à corriger le vôtre si besoin.",
      "h3": "Mon dossier est prêt à être envoyé",
      "p3": "Plus besoin de refaire un dossier à chaque candidature : votre dossier sécurisé est disponible au format PDF ou en ligne pour être renvoyé aux propriétaires.",
      "button": "Créer mon dossier de location"
    },
    "s3": {
      "title": "Protégez vos informations personnelles",
      "text1": "Avec DossierFacile, plus de papiers d'identité éparpillés dans la nature : votre dossier contient les pièces autorisées par la loi et rien de plus !",
      "text2": "Vos pièces d'identité sont protégées par des filigranes pour vous protéger contre la fraude de propriétaires peu scrupuleux.",
      "link": "En savoir plus sar la sécurité de DossierFacile"
    },
    "s4": {
      "title": "Déjà 9000 locataires heureux grâce à DossierFacile",
      "t1": "Le dossier de Karim s'est tout de suite démarqué : c'était le seul dossier reçu complet !",
      "author1": "Joseph, propriétaire à Nantes",
      "t2": "Simple, efficace et pratique : ça m'a fait gagner beaucoup de temps dans ma recherche d'appartement.",
      "author2": "Caroline, étudiante",
      "t3": "Je ne réussissais jamais à visiter un appartement avec mon dossier étranger. Avec DossierFacile, j'ai enfin eu plus de visites !",
      "author3": "Irina, étudiante en Erasmus",
      "link": "Monter mon dossier de location"
    }
  }
}
</i18n>
