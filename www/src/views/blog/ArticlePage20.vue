<template>
  <BlogArticle
    title="DossierFacile lance FiligraneFacile, le service permettant d’ajouter un filigrane à n’importe quel document !"
    date="10 Août 2023"
    hashtags="FiligraneFacile"
  >
    <p class="fr-text--lead">
      Logement, travail, assurance... Nous envoyons tous les jours des documents personnels dans la
      nature, sans les protéger. Tombés entre de mauvaises mains, ces documents peuvent servir à
      usurper notre identité, et on a vite fait de se retrouver avec des crédits dans tous les sens
      qu'on n’a jamais contractés.
    </p>
    <img alt="" src="../../assets/images/blog-article20.webp" />
    <br />

    <h2 class="fr-h6">Un service plébiscité depuis juillet 2023</h2>
    <p>
      Chez DossierFacile, cela fait longtemps que l'on met des filigranes « destinés à la location
      immobilière exclusivement » sur tous les documents déposés sur la plateforme. Vous avez été
      très nombreux à nous demander de bénéficier de la fonctionnalité de filigrane en-dehors du
      service, pour l’utiliser sur n’importe quelle démarche.
    </p>
    <p>
      C'est pourquoi nous avons créé
      <a href="https://filigrane.beta.gouv.fr" rel="noopener">filigrane.beta.gouv.fr</a>, un service
      qui permet de mettre un filigrane sur n'importe quel document.
    </p>
    <p>
      Le service a été lancé en septembre 2022. Le nom de domaine en beta.gouv.fr a été validé par
      la Direction interministérielle du numérique.
    </p>
    <p>
      Grâce à plusieurs posts viraux sur les réseaux sociaux, le service a connu en juillet 2023 une
      popularité sans précédent, passant d’une dizaine à 3000 documents déposés par jour.
    </p>

    <h2 class="fr-h6">Comment fonctionne FiligraneFacile ?</h2>
    <p>
      Le fonctionnement est simple : l’usager dépose un document sur la plateforme, choisit le texte
      qu’il souhaite apposer par-dessus, clique sur le bouton <em>Ajouter le filigrane</em>, puis
      <em>Télécharger le document filigrané</em> et il récupère une copie de son document recouvert
      de filigranes. Une fois le service utilisé, les documents sont immédiatement supprimés. Aucune
      autre utilisation n’en est faite.
    </p>
    <p>
      Pour générer les documents, nous utilisons Apache PDFBox, une librairie open source, que nous
      exécutons sur nos serveurs sécurisés Scalingo certifiés SecNum pour convertir les fichiers
      source et les fusionner avec le texte du filigrane. Le filigrane est donc incrusté dans
      l'image ce qui rend l'effacement plus complexe.
    </p>
    <p>
      Les administrations sont théoriquement
      <a href="https://www.service-public.fr/particuliers/vosdroits/F1412" rel="noopener"
        >censées accepter ces documents</a
      >
      à condition que le filigrane ne rende pas illisible le document ou le dispositif de sécurité
      (QR code ou 2D-Doc).
    </p>
    <p>
      <strong>Attention</strong> : FiligraneFacile ne garantit pas l'authenticité du document
      présenté.
    </p>

    <h2 class="fr-h6">
      Pourquoi faut-il absolument le faire lorsque vous transmettez des documents ?
    </h2>
    <p>
      Premièrement, cela permet de faire prendre conscience à la personne à qui vous transmettez
      votre document de sa sensibilité. Elle sera sensibilisée à le traiter avec prudence.
    </p>
    <p>
      Deuxièmement, cela permettra d’empêcher ou du moins de limiter l’usurpation de votre identité
      si ce document tombe entre de mauvaises mains. Nous en parlions dans
      <a href="/blog/usurpation-d-identite-en-france-comment-prevenir-agir" rel="noopener"
        >un précédent article</a
      >, rien n’est plus facile qu’une fausse annonce sur un site d’annonces immobilières pour
      qu’une personne mal intentionnée profite de votre dossier de location pour vous soutirer des
      documents personnels.
    </p>
    <p>
      Troisièmement, cela permettra de remonter à la source en cas d’usurpation. Si votre document
      fuite, le filigrane permettra d’identifier le fautif.
    </p>
    <p>
      L’usurpation d’identité touche plusieurs centaines de milliers de Français chaque année pour
      un total de 474 millions d’euros extorqués.
    </p>
    <p>
      <strong>Conseil</strong> : de manière plus générale, n’envoyez jamais vos justificatifs à des
      personnes dont vous n’êtes pas certain de l’identité.
    </p>

    <h2 class="fr-h6">Un service en bêta</h2>
    <p>
      FiligraneFacile est un service en « bêta », cela signifie que ce service n’est pas parfait et
      qu’il nécessite encore de nombreuses améliorations pour être à l’état de l’art.
    </p>
    <p>
      Nous sommes conscients que les filigranes ne sont pas une sécurité infaillible et qu’il est
      possible de les retirer via des logiciels de traitement d’image ou de l’intelligence
      artificielle. Néanmoins, cette première étape peut servir à écarter une partie des escrocs qui
      ne perdront pas de temps à retirer les filigranes. Un antivol de vélo peut être coupé, est-ce
      une raison pour ne pas en mettre ?
    </p>

    <h2 class="fr-h6">Une remarque, une suggestion ?</h2>
    <p>
      Vous avez été très nombreux à nous écrire pour nous faire part de vos suggestions, et nous
      vous en remercions. Nous prendrons en compte vos remarques afin de prioriser les prochaines
      évolutions du service.
    </p>
    <p>
      Actuellement, le service est géré par l’équipe DossierFacile, aussi vous pouvez utiliser le
      même
      <a href="/contact" rel="noopener">formulaire de contact</a>
      pour nous faire part de vos remarques.
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article20.webp'

const title =
  'DossierFacile lance FiligraneFacile, le service permettant d’ajouter un filigrane à n’importe quel document !'
const description =
  'Logement, travail, assurance... Nous envoyons tous les jours des documents personnels dans la nature, sans les protéger.'
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
