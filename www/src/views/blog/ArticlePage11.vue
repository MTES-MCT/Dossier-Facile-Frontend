<template>
  <BlogArticle title="La caution locative : changements en vue pour 2022" date="14 Mars 2022">
    <p>
      <img alt="" class="img-center" src="../../assets/images/blog-article11.webp" />
    </p>
    <p></p>
    <h2>La caution locative c’est quoi ?</h2>
    <p>
      La caution est une personne ou un organisme qui s'engage par écrit, à travers un acte de
      cautionnement, à payer votre loyer si vous ne le faites pas. Il s’agit le plus souvent d’un
      parent ou d’un proche.
    </p>
    <p>
      Si la caution ne rembourse pas les dettes locatives,
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/F1748"
        title="Saisie conservatoire"
        target="_blank"
        rel="noopener"
        >les biens personnels de la caution, ses revenus</a
      >
      et son
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/F16987"
        title="Saisie immobilière"
        target="_blank"
        rel="noopener"
        >logement</a
      >
      (s'il lui appartient) peuvent être saisis à la demande du propriétaire. Se porter caution est
      donc un engagement important !
    </p>
    <p>Il existe deux types d’engagement pour la caution :</p>
    <ul>
      <li>
        La <u>caution simple</u> : le propriétaire y fait appel uniquement si le locataire n'est pas
        en mesure de payer ses dettes locatives.
      </li>
      <li>
        La <u>caution solidaire</u> : elle peut être sollicitée par le propriétaire dès le 1er
        impayé, le propriétaire n’a pas à passer par le locataire pour savoir s’il peut ou non payer
        sa dette.
      </li>
    </ul>

    <p>
      Il existe des cas dans lesquels le propriétaire n’a pas le droit de demander une caution :
    </p>
    <ul>
      <li>
        s’il a déjà souscrit une assurance privée contre les risques locatifs (également appelée GLI
        pour garantie loyers impayés), sauf si le locataire est étudiant ou apprenti.
      </li>
      <li>
        si le locataire est un étudiant qui bénéficie d'une bourse de l'enseignement supérieur.
      </li>
    </ul>

    <h2>La garantie Visale</h2>
    <p>
      Il existe une caution gratuite proposée par Action Logement, la “<a
        href="https://www.visale.fr/"
        title="La garantie visale"
        target="_blank"
        rel="noopener"
        >garantie Visale</a
      >”. Elle remplace une caution physique.

      <a
        href="https://www.visale.fr/visale-pour-les-locataires/eligibilite/"
        title="Eligibilité visale"
        target="_blank"
        rel="noopener"
        >Pour y avoir droit, vous devez être âgé de moins de 30 ans, ou être salarié du secteur
        privé (hors agricole) ou être étudiant.
      </a>
      C’est un service <b>totalement gratuit</b>, pour le locataire et pour le propriétaire.
    </p>
    <p>
      <a
        href="https://www.actionlogement.fr/"
        title="Action Logement"
        target="_blank"
        rel="noopener"
        >Action logement
      </a>
      est un organisme qui finance la construction de logements et qui verse des aides financières
      aux salariés pour se loger via une cotisation des entreprises privées (le 1% logement).<br />
    </p>
    <p>
      <b>Comment marche la garantie Visale ?</b>
      En cas d'impayés de loyers et charges impayées, la garantie Visale rembourse le propriétaire
      jusqu'à l'équivalent de 36 mensualités (sur toute la durée du bail, même renouvelé, à partir
      de sa date de signature).
    </p>
    <h2>Qu’est-ce qui change en 2022 ?</h2>
    <p>
      A partir du 1er janvier, l’article 2288 du Code Civil sera rédigé autrement : « Le
      cautionnement est le contrat par lequel une caution s'oblige envers le créancier à payer la
      dette du débiteur en cas de défaillance de celui-ci ».
    </p>
    <p>Le principe de cautionnement sera donc simplifié à partir du 1er janvier 2022.</p>
    <ul>
      <li>
        <b>Plus besoin de recopier une formulation donnée</b>
        : À partir du 1er janvier 2022, il sera seulement exigé que la formulation désigne avec
        suffisamment de précision l’engagement de votre ou vos garants. La caution a juste à
        préciser qu’elle s’engage à payer s' il y a un souci. Aussi, si la caution est à durée
        indéterminée, elle peut être résiliée à tout moment par lettre recommandée.
      </li>
      <li>
        <b>Par voie dématérialisée</b>
        : le cautionnement pourra être conclu par voie électronique et non plus uniquement de façon
        manuscrite.
      </li>
      <li>
        <b>Contester la dette et la validité du contrat</b>
        : les garants pourront toujours contester la dette ou la validité, s’ils jugent qu’il y a
        vice de consentement par exemple. C’est-à-dire, s’il y a une imperfection dans l’exécution
        du contrat de location : un bail imposé au locataire par contrainte ou conclu à la suite
        d'une information cachée par le bailleur, par exemple.
      </li>
    </ul>
  </BlogArticle>
</template>

<style scoped lang="scss">
.img-center {
  max-width: 768px;
  max-height: 576px;
  width: 100%;
  height: auto;
}
</style>
<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article11.webp'

const title = 'La caution locative : changements en vue pour 2022'
const description =
  "La caution est une personne ou un organisme qui s'engage par écrit, à trun acte de cautio nnement, à payer votre loyer si vous ne le faites pas. Il s’agit le plus souvent d’un parent ou d’un proche. Si la caution ne rembourse pas les dettes locatives"
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
