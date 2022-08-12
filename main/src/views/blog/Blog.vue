<template>
  <section>
    <div class="fr-mt-7w fr-container">
      <div class="fr-grid-row justify-content-center">
        <div class="fr-col-md-10 fr-col-lg-8">
          <h1>{{ $t("blog") }}</h1>
          <hr />
          <BlogExtractTile
            title="L’usurpation d’identité en France : comment la prévenir et comment agir ?"
            :image="require('../../assets/images/blog-article13.webp')"
            publicationDate="1 Juin 2022"
            path="/blog/usurpation-d-identite-en-france-comment-prevenir-agir"
          >
            <template v-slot:extract>
              <p>
                L’usurpation d’identité consiste à utiliser, sans votre accord,
                des informations permettant de vous identifier. Il peut s'agir,
                par exemple, de vos nom et prénom, de votre adresse
                électronique, ou encore de photographies. C’est un problème qui
                touche plusieurs centaines de milliers de Français chaque année
                pour un total de 474 millions d’euros extorqués...
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Au secours, mon ascenseur est en panne ! Les droits du locataire en copropriété"
            :image="require('../../assets/images/blog-article12.webp')"
            publicationDate="14 Avril 2022"
            path="/blog/au-secours-mon-ascenceur-est-en-panne"
          >
            <template v-slot:extract>
              <p>
                Vous vivez au 6e étage de l’immeuble et l’ascenseur est en panne
                depuis plusieurs mois ? Petit rappel : la vie en copropriété
                réunit plusieurs types d'intervenants : les occupants,
                propriétaires ou locataires, le conseil syndical, composé de
                copropriétaires et le syndic, chargé d'assurer la bonne gestion
                de l'ensemble.
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="La caution locative : changements en vue pour 2022"
            :image="require('../../assets/images/blog-article11.webp')"
            publicationDate="14 Mars 2022"
            path="/blog/la-caution-locative-changement-en-vue-pour-2022"
          >
            <template v-slot:extract>
              <p>
                La caution est une personne ou un organisme qui s'engage par
                écrit, à travers un acte de cautionnement, à payer votre loyer
                si vous ne le faites pas. Il s’agit le plus souvent d’un parent
                ou d’un proche. Si la caution ne rembourse pas les dettes
                locatives...
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Quand les journalistes parlent de DossierFacile"
            :image="require('../../assets/images/blog-article10.webp')"
            publicationDate="14 Février 2022"
            path="/blog/quand-les-journalistes-parlent-de-dossierfacile"
          >
            <template v-slot:extract>
              <p>
                Constituer son dossier de location est une étape indispensable
                pour trouver le logement de ses rêves et pourtant c’est un
                parcours semé d’embûches ! DossierFacile est le service public
                numérique gratuit et indispensable pour constituer et partager
                sereinement son dossier. En pleine croissance, le service a fait
                l’objet de nombreux articles. Revue de presse.
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Le loyer : tout ce qu’il faut savoir quand on est locataire ou bailleur"
            :image="require('../../assets/images/blog-article9.webp')"
            publicationDate="29 Novembre 2021"
            path="/blog/loyer-locataire-ou-bailleur"
          >
            <template v-slot:extract>
              <p>
                Le montant du loyer d'un logement, qu’il soit loué vide ou
                meublé, est en principe fixé librement par le propriétaire.
              </p>
              <p>
                Toutefois, les communes situées en zone tendue sont soumises à
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F1314"
                  >l'encadrement des loyers</a
                >. Dans ces villes, le loyer est plafonné lors de la mise en
                location du logement (cas d'un nouveau locataire) et lors du
                renouvellement du bail (cas du même locataire).
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Comment justifier son domicile"
            :image="require('../../assets/images/blog-article8.webp')"
            publicationDate="02 Juin 2021"
            path="/blog/comment-justifier-son-domicile"
          >
            <template v-slot:extract>
              <p>
                Dans un article précédent, nous avons vu les pièces nécessaires
                à la constitution d’un dossier de location, mais l’une d’entre
                elles est plus compliquée à fournir car elle varie d’un candidat
                l’autre : le justificatif de domicile. On peut distinguer
                <b>quatre cas</b> « classiques » mais il en existe en fait bien
                plus… Chez DossierFacile, nous vous faisons la promesse que
                quelle que soit votre situation, nous vous aiderons à aller au
                bout !
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Tout comprendre à la vie en colocation"
            :image="require('../../assets/images/blog-article7.webp')"
            publicationDate="03 Mai 2021"
            path="/blog/tout-comprendre-a-la-vie-en-colocation"
          >
            <template v-slot:extract>
              <p>
                Devant la hausse des loyers, de nombreux locataires choisissent
                aujourd'hui de partager un logement afin de diviser le coût de
                la location. Pour le bailleur, la colocation permet de louer
                plus facilement un grand logement et de bénéficier d’une
                solidarité entre les locataires.
                <br />
                Que ce soit entre amis, en famille ou bien avec des inconnus, la
                colocation obéit toutefois à de nombreuses règles que nous
                allons vous présenter.
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="DossierFacile fait peau neuve"
            :image="require('../../assets/images/blog-article6.webp')"
            publicationDate="06 Avril 2021"
            path="/blog/dossierfacile-fait-peau-neuve"
          >
            <template v-slot:extract>
              <p>
                Afin de mieux répondre aux besoins de nos locataires et
                propriétaires, le service <a href="/">DossierFacile</a> fait
                peau neuve avec un nouveau site ! Un parcours utilisateur plus
                simple, un design plus recherché, une visualisation plus claire…
                Le tout pour un service toujours plus efficace ! On est très
                fiers de vous présenter le nouveau DossierFacile ! Notre
                objectif ? Faciliter le téléchargement de vos pièces
                justificatives : un gain de temps pour vous, pour nous, et pour
                votre futur propriétaire !
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="5 conseils pour trouver l’appartement de ses rêves en région parisienne (ou ailleurs…)"
            :image="require('../../assets/images/blog-article5.webp')"
            publicationDate="30 Mars 2021"
            path="/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne"
          >
            <template v-slot:extract>
              <p>
                Trouver l’appartement de ses rêves à Paris ou en région
                parisienne est un vrai défi : la capitale est pleine de charme,
                et par conséquent... très attractive. De plus en plus de
                personnes souhaitent s’installer à Paris, et l’offre y est rare,
                rendant difficile la recherche d’un appartement à louer (ou même
                à acheter). Dans cet article, les équipes de DossierFacile te
                livrent leurs cinq conseils pour trouver l’appartement parisien
                de vos rêves.
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="5 astuces pour booster votre dossier de location"
            :image="require('../../assets/images/blog-article4.webp')"
            publicationDate="25 Mars 2021"
            path="/blog/5-astuces-pour-booster-votre-dossier-de-location"
          >
            <template v-slot:extract>
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
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Pourquoi Dossier Facile est-il gratuit ?"
            :image="require('../../assets/images/blog-article3.webp')"
            publicationDate="21 Juillet 2020"
            path="/blog/pourquoi-dossierfacile-est-il-gratuit"
          >
            <template v-slot:extract>
              <p>
                Dossier facile est une start-up qui propose une solution simple
                et gratuite pour remettre la confiance au cœur du processus de
                location : un dossier labélisé, propre et clair, transmis sous
                la forme efficace d’un lien numérique. Cependant, efficacité et
                gratuité vont rarement de pair. Alors pourquoi votre dossier de
                location est-il gratuit ?
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Constituer votre Dossier Facile"
            :image="require('../../assets/images/blog-article2.webp')"
            publicationDate="12 Décembre 2019"
            path="/blog/constituer-votre-dossierFacile"
          >
            <template v-slot:extract>
              <p>
                Dans un contexte de pénurie de logements,
                <router-link
                  to="/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location"
                  title="quelles pieces justificatives fournir pour mon dossier de location"
                  >le dossier est devenu un facteur démarquant.</router-link
                >
                Mais comment constituer un dossier de location qui regroupe tous
                les documents nécessaires sans tomber dans le désordre d’un pdf
                de cinquante pages ? Existe-t-il un outil facile et gratuit ?
              </p>
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Quelles pièces justificatives fournir pour mon dossier de location ?"
            :image="require('../../assets/images/blog-article.webp')"
            publicationDate="14 Novembre 2019"
            path="/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location"
          >
            <template v-slot:extract>
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
            </template>
          </BlogExtractTile>
          <hr />
          <BlogExtractTile
            title="Locatio devient DossierFacile"
            :image="require('../../assets/cover-features.webp')"
            publicationDate="21 mars 2019"
            path="/blog/locatio-devient-dossier-facile"
          >
            <template v-slot:extract>
              <p>
                Pas de panique ! Le nom change, mais le service reste le même !
              </p>
              <p>
                Grâce à DossierFacile, ex-Locatio, vous pouvez monter facilement
                et gratuitement votre dossier de location en ligne.
              </p>
            </template>
          </BlogExtractTile>
        </div>
      </div>
      <!--end of row-->
    </div>
    <!--end of container-->
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BlogExtractTile from "./BlogExtractTile.vue";

@Component({
  components: {
    BlogExtractTile
  }
})
export default class Blog extends Vue {}
</script>

<i18n>
{
  "en": {
    "blog": "Blog"
  },
  "fr": {
    "blog": "DossierFacile en articles"
  }
}
</i18n>
