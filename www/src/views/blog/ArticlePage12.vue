<template>
  <BlogArticle
    title="Au secours, mon ascenseur est en panne! Les droits du locataire en copropriété"
    date="14 Avril 2022"
  >
    <p>
      <img alt="" class="img-center" src="../../assets/images/blog-article12.webp" />
    </p>
    <p></p>
    <h2>Au secours ! Je suis locataire et mon ascenseur est en panne, que faire ?</h2>
    <p>Vous vivez au 6e étage de l’immeuble et l’ascenseur est en panne depuis plusieurs mois ?</p>
    <p>
      Petit rappel : la vie en copropriété réunit plusieurs types d'intervenants : les occupants,
      propriétaires ou locataires, le conseil syndical, composé de copropriétaires et le syndic,
      chargé d'assurer la bonne gestion de l'ensemble.
    </p>
    <p>
      C’est le syndic qui gère l’immeuble et ses équipements, par exemple l’ascenseur s’il y en a
      un. Ce syndic est une entreprise privée en contrat avec tous les propriétaires de l’immeuble
      et qui fonctionne grâce au paiement par ces derniers de charges de copropriété.
    </p>
    <p>
      En théorie, le syndic n'est pas censé traiter avec les locataires, et c'est souvent la réponse
      qu'il donne lorsqu'il est sollicité. Et pourtant vous êtes le premier concerné lorsque
      survient un problème dans la copropriété… Pour autant, votre unique référent demeure votre
      propriétaire (ou son représentant) avec lequel vous avez signé un contrat de location (le
      bail), et c’est donc à lui qu’il revient, dans la plupart des cas, d’intervenir.
    </p>
    <p>
      Ainsi, dès que vous avez une requête : la sonnette, l'ascenseur, le portail en panne, le
      changement de nom sur les plaques platine et boîte aux lettres, une déclaration de sinistre à
      formuler, formuler, etc. il faut vous adresser à votre propriétaire (ou à l'agence qui le
      représente) qui saisira le syndic.
    </p>
    <p>
      Cette demande peut d’abord se faire de manière informelle puis, en l’absence de réponse, par
      lettre recommandée avec demande d’avis de réception avec mise en demeure de faire le
      nécessaire auprès du syndic de copropriété pour la réparation de l’ascenseur (ou toute autre
      intervention).
    </p>
    <p>
      Vous pouvez vous appuyer sur la
      <a
        href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509310/"
        target="_blank"
        title="Loi du 6 juillet 1989"
        rel="noopener"
        >loi du 6 juillet 1989</a
      >
      qui prévoit que, dans le cadre d’un bail d’habitation de résidence principale, le propriétaire
      bailleur a l’obligation :
    </p>
    <ul>
      <li>
        de délivrer un logement en bon état d'usage et de réparation ainsi que les équipements
        mentionnés au contrat de location en bon état de fonctionnement.
      </li>
      <li>d’assurer une jouissance paisible du logement</li>
      <li>
        d’entretenir les locaux et y faire toutes les réparations, autres que locatives, nécessaires
        au maintien en état et à l'entretien normal des locaux loués.
      </li>
    </ul>

    <p>
      En pratique, vous pouvez aussi vous adresser au syndic directement et il est probable que
      celui-ci agisse immédiatement sans vous demander de passer par le propriétaire.
    </p>
    <p>
      A défaut de réponse, et en cas de négligence du syndic ou de votre propriétaire, vous pouvez
      saisir le tribunal d’instance ou la commission départementale de conciliation afin d’obtenir
      des dommages et intérêts en réparation du préjudice subi.
    </p>

    <h2>Le syndic peut agir en lieu et place du propriétaire à l’égard d’un locataire</h2>
    <p>
      Attention, le règlement de copropriété s’applique aussi aux locataires ! Un propriétaire doit
      veiller à ce que ses locataires respectent ce règlement. Mais la loi prévoit cependant que le
      syndic, sous certaines conditions, notamment l'autorisation de l'assemblée générale des
      copropriétaires, puisse agir en lieu et place du propriétaire si ce dernier ne prend pas ses
      responsabilités à l'égard de son locataire.
    </p>
    <h2>Nouveau !</h2>
    <p>
      A compter du 1er janvier 2022 (
      <a
        href="https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000041553759&categorieLien=id"
        title="loi 2020-105 du février 2020"
        target="_blank"
        rel="noopener"
        >loi n° 2020-105 du 10 février 2020</a
      >
      relative à la lutte contre le gaspillage et à l'économie circulaire), le syndic aura
      l'obligation d'informer les occupants et les copropriétaires sur les règles locales
      applicables en matière de tri sélectif des ordures ménagères et des modalités d'accès aux
      déchetteries dont dépend la copropriété.
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article12.webp'

const title = 'Au secours mon ascenceur est en panne !'
const description =
  'Vous vivez au 6e étage de l’immeuble et l’ascenseur est en panne depuis plusieurs mois ?'
useHead({
  title: title,
  meta: [
    { name: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    { name: 'description', content: description },
    { name: 'og:description', content: description },
    { name: 'twitter:description', content: description },
    { name: 'og:image', content: image },
    { name: 'twitter:image', content: image }
  ]
})
</script>
<style scoped lang="scss">
.img-center {
  max-width: 768px;
  max-height: 597px;
  width: 100%;
  height: auto;
}
</style>
