<template>
  <section>
    <div class="rf-mt-7w rf-container">
      <div class="rf-grid-row justify-content-center">
        <div class="rf-col-md-10 rf-col-lg-8">
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article1">
                <h2 class="rf-h2">
                  Quelles pièces justificatives fournir pour mon dossier de
                  location ?
                </h2>
              </router-link>
              <span>November 14th 2019 in </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/article1">
                <img alt="Image" src="../../assets/images/blog-article.webp" />
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
              <router-link to="/blog/article1">Continue reading »</router-link>
            </div>
          </article>
          <hr />
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article2">
                <h2 class="rf-h2">Constituer votre Dossier Facile</h2>
              </router-link>
              <span>December 12nd 2019 in </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/article2">
                <img alt="Image" src="../../assets/images/blog-article2.webp" />
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
              <router-link to="/blog/article2">Continue reading »</router-link>
            </div>
          </article>
          <hr />
          <!--end item-->
          <article class="rf-mb-12w">
            <div class="text-center">
              <router-link to="/blog/article3">
                <h2 class="rf-h2">Pourquoi Dossier Facile est-il gratuit ?</h2>
              </router-link>
              <span>July 21nd 2020 in </span>
              <span>
                <a href="#" class="underline">DossierFacile</a>
              </span>
            </div>
            <!--end article title-->
            <div class="article__body">
              <router-link to="/blog/article3">
                <img alt="Image" src="../../assets/images/blog-article3.webp" />
              </router-link>
              <p>
                Dossier facile est une start-up qui propose une solution simple
                et gratuite pour remettre la confiance au cœur du processus de
                location : un dossier labélisé, propre et clair, transmis sous
                la forme efficace d’un lien numérique. Cependant, efficacité et
                gratuité vont rarement de pair. Alors pourquoi votre dossier de
                location est-il gratuit ?
              </p>
              <router-link to="/blog/article3">Continue reading »</router-link>
            </div>
          </article>
          <!--end item-->
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
