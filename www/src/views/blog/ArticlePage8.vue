<template>
  <BlogArticle title="Comment justifier son domicile" date="2 Juin 2021">
    <p>
      <a
        href="https://www.dossierfacile.logement.gouv.fr/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location"
        >Dans un article précédent</a
      >, nous avons vu les pièces nécessaires à la constitution d’un dossier de location, mais l’une
      d’entre elles est plus compliquée à fournir car elle varie d’un candidat locataire à l’autre :
      le justificatif de domicile. On peut distinguer <b>quatre cas</b> « classiques » mais il en
      existe en fait bien plus… Chez DossierFacile, nous vous faisons la promesse que quelle que
      soit votre situation, nous vous aiderons à aller au bout !
    </p>
    <p>
      <img alt="" class="img-center" src="../../assets/images/blog-article8.webp" />
    </p>
    <h2>1. Quel document fournir si je suis locataire ?</h2>
    <p>
      Très souvent, les candidats locataires sont eux-mêmes des locataires qui changent
      d’appartement. En ce cas, il suffit de fournir les trois dernières quittances de loyer. Une
      quittance de loyer est un reçu que votre propriétaire vous donne chaque mois, une fois que
      vous avez payé votre loyer. La quittance se distingue de l’avis d’échéance qui est le document
      par lequel le propriétaire vous notifie que vous devez payer votre loyer et qui ne prouve pas
      nécessairement que vous êtes bon payeur !
    </p>
    <p>
      Si votre propriétaire n’a pas l’habitude de vous délivrer des quittances de loyer, vous êtes
      cependant en droit de les lui demander. Vous pouvez aussi lui demander un document équivalent
      : une attestation de bon paiement des loyers, qui a l’avantage d’être plus simple et unique
      puisqu’elle peut s’étaler sur la période qu’on veut et est moins formelle. Les deux documents
      sont équivalents.
    </p>
    <p>
      Et dans le cas où je louais mon appartement en sous-location ? En ce cas, vous pouvez demander
      au locataire qui vous sous-louait l’appartement une attestation de paiement de votre loyer. En
      revanche, faites attention : toute sous-location doit faire l’objet d’un accord du
      propriétaire !
    </p>
    <h2>2. Quel document fournir si je suis propriétaire ?</h2>
    <p>
      Si vous êtes propriétaire depuis plus d’un an et que vous cherchez un appartement en location,
      vous devez être en possession d’un avis de taxes foncières. C’est ce document qui justifiera
      votre domicile. Attention, la taxe d’habitation n’est jamais un justificatif de domicile !
    </p>
    <p>
      Il peut arriver que vous n’ayez pas d’avis de taxes foncières, si vous êtes propriétaire
      depuis moins d’un an par exemple. En ce cas, vous pouvez fournir l’acte de vente ou
      l’attestation de vente de votre nouveau bien. Cependant, vous n’y êtes pas obligé et pouvez si
      vous le désirez fournir une attestation sur l’honneur que vous avez accédé à la propriété
      récemment et ne pouvez donc pas fournir d’avis de taxes foncières.
    </p>
    <h2>3. Quel document fournir si j’habite gratuitement chez mes parents ou chez un ami ?</h2>
    <p>
      Si vous êtes hébergé gratuitement, chez qui que ce soit, vous devez fournir une déclaration
      sur l’honneur d’hébergement à titre gratuit de moins de trois mois. C’est un document signé
      par la personne qui vous héberge attestant que vous vivez chez lui sans contrepartie
      financière. Elle doit être accompagnée d’une pièce d’identité et d’un justificatif de domicile
      de votre hébergeur. Vous pouvez trouver comment la remplir sur
      <a href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
        >le site des services publics</a
      >. N’oubliez pas de la faire signer par votre hébergeur !
    </p>
    <h2>4. Quel document fournir si j’arrive d’un pays étranger ?</h2>
    <p>
      Si vous arrivez d’un pays étranger, soit vous vous retrouvez dans une des situations
      précédentes et vous pouvez fournir les documents correspondants (avec une notice de traduction
      en français pour que vos propriétaires puissent comprendre), soit ce n’est pas le cas. Vous
      pouvez alors fournir un mot manuscrit et signé expliquant votre situation pour rassurer les
      propriétaires et commencer déjà à établir une relation de confiance avec eux !
    </p>
    <h2>5. Quel document fournir si je n’entre dans aucune case ?</h2>
    <p>
      Les cas sont multiples et nous ne pouvons traiter que les plus classiques ! Pour tous les
      autres cas, retenez seulement que nous sommes là pour vous aider et qu’un mot manuscrit et
      signé expliquant votre situation nous suffira souvent, à nous et aux propriétaires, pour mieux
      vous connaître !
    </p>
    <p>
      En tout cas, quelle que soit votre situation, n’hésitez pas à venir en discuter dans votre
      messagerie ou dans le chat !
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article8.webp'

const title = 'Comment justifier son domicile - DossierFacile'
const description =
  'On peut distinguer quatre cas classiques de justificatif de domicile mais il en existe en fait bien plus'
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
  max-width: 793px;
  max-height: 496px;
  width: 100%;
  height: auto;
}
</style>
