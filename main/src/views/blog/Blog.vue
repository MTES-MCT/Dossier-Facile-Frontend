<template>
  <section>
    <div class="rf-mt-7w rf-container">
      <div class="rf-grid-row justify-content-center">
        <div class="rf-col-md-10 rf-col-lg-8">
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article3">
                <h2 class="rf-h2">
                  5 astuces pour booster votre dossier de location
                </h2>
              </router-link>
              <span>25 Mars 2021 dans </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link
                to="/blog/5-astuces-pour-booster-votre-dossier-de-location"
              >
                <img
                  class="img-center"
                  alt=""
                  src="../../assets/images/blog-article4.webp"
                />
              </router-link>
              <p>
                En pleine crise sanitaire, il est encore plus difficile que
                d’habitude de trouver un logement de location. Pour se
                distinguer des autres, un seul moyen : constituer un dossier de
                location clair, cohérent et complet. En effet, c’est par le
                dossier de location que le propriétaire prend connaissance des
                informations qui vous sont relatives. C’est le seul moyen pour
                lui de comparer les différents candidats. Alors voici 5 astuces
                pour booster votre dossier de location.
              </p>
              <router-link
                to="/blog/5-astuces-pour-booster-votre-dossier-de-location"
                >Continuer la lecture »</router-link
              >
            </div>
          </article>
          <hr />
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article3">
                <h2 class="rf-h2">Pourquoi Dossier Facile est-il gratuit ?</h2>
              </router-link>
              <span>21 Juillet 2020 dans </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/article3">
                <img alt="" src="../../assets/images/blog-article3.webp" />
              </router-link>
              <p>
                Dossier facile est une start-up qui propose une solution simple
                et gratuite pour remettre la confiance au cœur du processus de
                location : un dossier labélisé, propre et clair, transmis sous
                la forme efficace d’un lien numérique. Cependant, efficacité et
                gratuité vont rarement de pair. Alors pourquoi votre dossier de
                location est-il gratuit ?
              </p>
              <router-link to="/blog/article3"
                >Continuer la lecture »</router-link
              >
            </div>
          </article>
          <hr />
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article2">
                <h2 class="rf-h2">Constituer votre Dossier Facile</h2>
              </router-link>
              <span>12 Décembre 2019 dans </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/article2">
                <img alt="" src="../../assets/images/blog-article2.webp" />
              </router-link>
              <p>
                Dans un contexte de pénurie de logements,
                <router-link to="/blog/article1" class="underline"
                  >le dossier est devenu un facteur démarquant.</router-link
                >
                Mais comment constituer un dossier de location qui regroupe tous
                les documents nécessaires sans tomber dans le désordre d’un pdf
                de cinquante pages ? Existe-t-il un outil facile et gratuit ?
              </p>
              <router-link to="/blog/article2"
                >Continuer la lecture »</router-link
              >
            </div>
          </article>
          <hr />
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article1">
                <h2 class="rf-h2">
                  Quelles pièces justificatives fournir pour mon dossier de
                  location ?
                </h2>
              </router-link>
              <span>14 Novembre 2019 dans </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/article1">
                <img alt="" src="../../assets/images/blog-article.webp" />
              </router-link>
              <p>
                A cause de l’augmentation de la demande immobilière, il devient
                de plus en plus difficile de trouver un bon appartement à louer.
                Dans cette recherche, le dossier est un facteur démarquant.
                Comment constituer mon dossier de location ? Que peut demander
                le propriétaire ? Bien que la loi encadre ces pratiques, un
                grand flou règne encore souvent autour des éléments qu’il faut
                fournir pour avoir un dossier de location complet, clair et
                cohérent.
              </p>
              <router-link to="/blog/article1"
                >Continuer la lecture »</router-link
              >
            </div>
          </article>
          <hr />
          <!--end item-->
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/locatio-devient-dossier-facile">
                <h2 class="rf-h2">Locatio devient DossierFacile</h2>
              </router-link>
              <span>21 mars 2019 dans </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/locatio-devient-dossier-facile">
                <img alt="" src="../../assets/cover-features.webp" />
              </router-link>
              <p>
                Pas de panique ! Le nom change, mais le service reste le même !
              </p>
              <p>
                Grâce à DossierFacile, ex-Locatio, vous pouvez monter facilement
                et gratuitement votre dossier de location en ligne.
              </p>
              <router-link to="/blog/locatio-devient-dossier-facile"
                >Continuer la lecture »</router-link
              >
            </div>
          </article>
        </div>
      </div>
      <!--end of row-->
    </div>
    <!--end of container-->
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Blog extends Vue {}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

a {
  color: $light-blue;
}

.article__body {
  margin-top: 1rem;
}
</style>
